import { createHash } from 'node:crypto';
import type { CoraInvoice } from '../cora/client.ts';
import { CheckoutError, normalizeEnvironmentValue } from '../cora/config.ts';
import type { DonationRecord, DonationReportPage, DonationSummary } from '../../shared/donationReports.ts';
import { donationRecord, donationSnapshot } from './report.ts';
import { findDonationDestination } from '../../shared/donationDestinations.ts';
import type { FundMovement, FundReport, ReallocationInput } from '../../shared/fundMovements.ts';

interface LedgerConfig {url: string; secret: string; environment: 'production' | 'stage'}
type LedgerRow = ReturnType<typeof ledgerRow>;
type DatabaseFetch = typeof fetch;

export function ledgerRow(record: DonationRecord, environment: string, status = 'PAID', invoiceCode: string | null = null) {
  return {
    environment, id: record.id, source: record.source, payment_status: status, invoice_code: invoiceCode,
    created_at: record.createdAt, paid_on: record.paidOn?.slice(0, 10) ?? null,
    donor_name: record.donorName, donor_email: record.donorEmail, masked_document: record.maskedDocument,
    amount_cents: record.amountCents, paid_cents: record.paidCents, method: record.method,
    destination_id: record.destinationId, destination_title: record.destinationTitle,
    original_description: record.originalDescription, reconciliation_note: record.reconciliationNote,
    included: record.included, bank_observed_at: new Date().toISOString(),
  };
}

function fromRow(row: LedgerRow): DonationRecord {
  return {id: row.id, source: row.source, createdAt: row.created_at, paidOn: row.paid_on,
    donorName: row.donor_name, donorEmail: row.donor_email, maskedDocument: row.masked_document,
    amountCents: row.amount_cents, paidCents: row.paid_cents, method: row.method,
    destinationId: row.destination_id, destinationTitle: row.destination_title,
    originalDescription: row.original_description, reconciliationNote: row.reconciliation_note, included: row.included};
}

export class DonationLedger {
  constructor(private config: LedgerConfig, private request: DatabaseFetch = fetch) {}

  private async call(path: string, init: RequestInit = {}) {
    try {
      const response = await this.request(`${this.config.url}/rest/v1/${path}`, {
        ...init, signal: AbortSignal.timeout(8000), headers: {apikey: this.config.secret, 'Content-Type': 'application/json', ...init.headers},
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const known: Record<string, [number, string, string]> = {
          INSUFFICIENT_ALLOCATION: [409, 'insufficient_allocation', 'O saldo destinado ao projeto de origem é insuficiente. Atualize a consulta antes de registrar.'],
          REALLOCATION_CONFLICT: [409, 'reallocation_conflict', 'Esta referência já foi usada para outra realocação. Atualize os dados e tente novamente.'],
          ALREADY_REVERSED: [409, 'already_reversed', 'Esta realocação já foi estornada.'],
          INVALID_REVERSAL: [400, 'invalid_reversal', 'Confira a referência e os dados do estorno.'],
          SUPPORTER_RATE_LIMIT: [429, 'supporter_rate_limit', 'Muitas tentativas. Aguarde 15 minutos antes de tentar novamente.'],
          INVALID_SUPPORTER_CHALLENGE: [401, 'invalid_supporter_challenge', 'O acesso expirou ou o código é inválido. Solicite um novo código.'],
          INVALID_SUPPORTER_SESSION: [401, 'invalid_supporter_session', 'Sua sessão expirou. Entre novamente.'],
        };
        const error = known[body?.message];
        if (error) throw new CheckoutError(...error);
        throw new Error();
      }
      return response;
    } catch (error) {if (error instanceof CheckoutError) throw error; throw new CheckoutError(503, 'donation_storage_unavailable', 'Não foi possível acessar os registros de doações. Tente novamente.');}
  }

  async rpc<T>(name: string, body: unknown): Promise<T> {
    return (await this.call(`rpc/${name}`, {method: 'POST', body: JSON.stringify(body)})).json();
  }

  get environment() {return this.config.environment;}

  async fundReport(start: string, end: string, page: number): Promise<FundReport> {
    return this.rpc('donation_fund_report', {p_environment: this.config.environment, p_start: start, p_end: end, p_page: page});
  }

  async reallocate(input: ReallocationInput): Promise<FundMovement> {
    return this.rpc('record_donation_reallocation', {
      p_environment: this.config.environment, p_id: input.id, p_source_id: input.sourceId, p_source_title: findDonationDestination(input.sourceId)!.title,
      p_destination_id: input.destinationId, p_destination_title: findDonationDestination(input.destinationId)!.title,
      p_amount_cents: input.amountCents, p_responsible: input.responsible, p_reason: input.reason, p_reversal_of: input.reversalOf ?? null,
    });
  }

  private async save(rows: LedgerRow[]) {
    if (!rows.length) return;
    await this.call('donation_ledger?on_conflict=environment,id', {
      method: 'POST', headers: {Prefer: 'resolution=merge-duplicates,return=minimal'}, body: JSON.stringify(rows),
    });
  }

  async savePaidRecords(records: DonationRecord[]) {
    const unique = [...new Map(records.map(record => [record.id, record])).values()];
    // Real external receipts belong only to the production ledger.
    await this.save(unique.filter(record => this.config.environment === 'production' || record.source !== 'externo')
      .map(record => ledgerRow(record, this.config.environment)));
  }

  async observeCheckout(invoice: CoraInvoice, destinationId: string) {
    const record = invoice.status === 'PAID' ? donationRecord(invoice) : donationSnapshot(invoice, undefined, destinationId);
    if (!record) return;
    await this.save([ledgerRow(record, this.config.environment, invoice.status, invoice.code)]);
  }

  async summary(): Promise<DonationSummary> {
    const response = await this.call('rpc/donation_public_totals', {method: 'POST', body: JSON.stringify({p_environment: this.config.environment})});
    const summary = await response.json();
    if (!summary?.updatedAt || !Number.isSafeInteger(summary.totalCents)) throw new CheckoutError(503, 'donation_ledger_empty', 'A conciliação inicial das doações ainda não foi concluída.');
    return summary;
  }

  async report(start: string, end: string, page: number): Promise<DonationReportPage> {
    const query = new URLSearchParams({environment: `eq.${this.config.environment}`, source: 'eq.cora', payment_status: 'eq.PAID',
      and: `(paid_on.gte.${start},paid_on.lte.${end})`, order: 'paid_on.desc,id.asc', limit: '20', offset: String((page - 1) * 20)});
    const response = await this.call(`donation_ledger?${query}`, {headers: {Prefer: 'count=exact'}});
    const total = Number(response.headers.get('content-range')?.split('/')[1]);
    const rows: LedgerRow[] = await response.json();
    if (!Number.isSafeInteger(total) || !Array.isArray(rows)) throw new CheckoutError(502, 'invalid_ledger_response', 'Não foi possível validar o relatório salvo.');
    const manualQuery = new URLSearchParams({environment: `eq.${this.config.environment}`, source: 'eq.externo', order: 'id.asc'});
    const manual: LedgerRow[] = await (await this.call(`donation_ledger?${manualQuery}`)).json();
    const summary = await this.summary();
    return {records: rows.map(fromRow), manualRecords: manual.map(fromRow), nextPage: page * 20 < total ? page + 1 : null,
      ignoredBankInvoices: 0, generatedAt: summary.updatedAt, isStale: true};
  }
}

let cached: {fingerprint: string; ledger: DonationLedger} | undefined;
export function getDonationLedger(env: NodeJS.ProcessEnv = process.env): DonationLedger | undefined {
  const url = normalizeEnvironmentValue(env.SUPABASE_URL).replace(/\/$/, '');
  const secret = normalizeEnvironmentValue(env.SUPABASE_SECRET_KEY);
  if (!url && !secret) return undefined;
  const environment = normalizeEnvironmentValue(env.CORA_ENVIRONMENT);
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || !secret.startsWith('sb_secret_') || !['production', 'stage'].includes(environment)) {
    throw new CheckoutError(503, 'donation_storage_configuration', 'A configuração dos registros de doações precisa ser conferida.');
  }
  const fingerprint = createHash('sha256').update([url, secret, environment].join('\0')).digest('hex');
  if (!cached || cached.fingerprint !== fingerprint) cached = {fingerprint, ledger: new DonationLedger({url, secret, environment: environment as LedgerConfig['environment']})};
  return cached.ledger;
}

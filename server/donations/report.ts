import type { CoraInvoice, CoraInvoicePage } from '../cora/client.ts';
import { CheckoutError } from '../cora/config.ts';
import { destinationFromDescription, findDonationDestination } from '../../shared/donationDestinations.ts';
import type { DonationRecord, DonationReportPage } from '../../shared/donationReports.ts';
import { summarizeDonations } from '../../shared/donationReports.ts';
import { DONATION_RECONCILIATION, MANUAL_DONATIONS } from './reconciliation.ts';

export interface ReportBank {
  listPaidInvoices(start: string, end: string, page: number, perPage?: number): Promise<CoraInvoicePage>;
  getInvoice(id: string): Promise<CoraInvoice>;
}
const siteCode = /^icf-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const invalidBank = () => new CheckoutError(502, 'invalid_report', 'Não foi possível validar todos os pagamentos. O relatório não foi atualizado.');

export function validateReportRange(start: unknown, end: unknown) {
  const valid = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().slice(0, 10) === value;
  try {
    if (valid(start) && valid(end) && start <= end && Date.parse(end) - Date.parse(start) <= 366 * 86400000) return {start, end};
  } catch { /* Invalid calendar date. */ }
  throw new CheckoutError(400, 'invalid_period', 'Escolha um período válido de até um ano.');
}

export function donationRecord(invoice: CoraInvoice, paidAt?: string): DonationRecord | null {
  if (!siteCode.test(invoice.code ?? '')) return null;
  if (invoice.status !== 'PAID' || !Number.isSafeInteger(invoice.total_amount) || invoice.total_amount < 500 || !Number.isSafeInteger(invoice.total_paid) || invoice.total_paid < invoice.total_amount) throw invalidBank();
  const descriptions = invoice.services?.map(service => service.description ?? '') ?? [];
  const candidates = descriptions.map(destinationFromDescription).filter(Boolean);
  const originalDestination = new Set(candidates.map(destination => destination!.id)).size === 1 ? candidates[0] : undefined;
  const correction = DONATION_RECONCILIATION[invoice.id];
  const destination = correction?.destinationId ? findDonationDestination(correction.destinationId) : originalDestination;
  const document = invoice.customer?.document?.identity ?? '';
  return {
    id: invoice.id, source: 'cora', createdAt: invoice.created_at ?? null, paidOn: paidAt ?? invoice.occurrence_date ?? null,
    donorName: invoice.customer?.name ?? 'Não informado', donorEmail: invoice.customer?.email ?? '',
    maskedDocument: document ? '*'.repeat(Math.max(0, document.length - 4)) + document.slice(-4) : '',
    amountCents: invoice.total_amount, paidCents: invoice.total_paid,
    method: [...new Set(invoice.payments?.map(payment => payment.method).filter(Boolean))].join(' / ') || 'Não informada',
    destinationId: destination?.id ?? null, destinationTitle: destination?.title ?? 'Destino não identificado — conferir com o Instituto',
    originalDescription: descriptions.join(' | '), included: !correction?.excluded,
    reconciliationNote: correction?.note ?? (destination ? 'Destino registrado na cobrança Cora.' : 'Sem destino identificável; valor separado para conciliação. Não atribuir automaticamente ao fundo geral.'),
  };
}

export async function readDonationReportPage(bank: ReportBank, start: string, end: string, page: number): Promise<DonationReportPage> {
  const list = await bank.listPaidInvoices(start, end, page, 20);
  const results: (DonationRecord | null)[] = [];
  for (let offset = 0; offset < list.items.length; offset += 5) {
    results.push(...await Promise.all(list.items.slice(offset, offset + 5).map(async summary => {
      const invoice = await bank.getInvoice(summary.id);
      if (invoice.id !== summary.id) throw invalidBank();
      return donationRecord(invoice, summary.paid_at);
    })));
  }
  if (list.items.length === 0 && (page - 1) * 20 < list.totalItems) throw invalidBank();
  return {records: results.filter((record): record is DonationRecord => record !== null), manualRecords: MANUAL_DONATIONS,
    nextPage: page * 20 < list.totalItems ? page + 1 : null, ignoredBankInvoices: results.filter(record => record === null).length, generatedAt: new Date().toISOString()};
}

export async function readDonationSummary(bank: ReportBank, end: string) {
  const records = [...MANUAL_DONATIONS];
  let page = 1;
  do {
    const result = await readDonationReportPage(bank, '2026-01-01', end, page);
    records.push(...result.records);
    if (result.nextPage === null) return summarizeDonations(records);
    page = result.nextPage;
  } while (page <= 100);
  throw new CheckoutError(503, 'report_limit', 'O volume de registros exige uma consulta por período menor.');
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { DONATION_DESTINATIONS, destinationFromDescription, donationDescription, filterDonationDestinations } from '../shared/donationDestinations.ts';
import { donationRecordsCsv, summarizeDonations } from '../shared/donationReports.ts';
import { donationRecord, readDonationReportPage, readDonationSummary, validateReportRange, type ReportBank } from '../server/donations/report.ts';
import { MANUAL_DONATIONS } from '../server/donations/reconciliation.ts';
import { authorizeDonationReport, createDonationsHandler } from '../api/donations.ts';
import { CoraClient, type CoraInvoice, type TransportRequest } from '../server/cora/client.ts';
import type { CoraConfig } from '../server/cora/config.ts';
import { invoicePayload, validateCheckout } from '../server/checkout.ts';
import { DonationLedger, getDonationLedger, ledgerRow } from '../server/donations/ledger.ts';

const code = 'icf-81076d02-ad03-4d3b-b504-bfe9f4011de7';
const paidInvoice = (changes: Partial<CoraInvoice> = {}): CoraInvoice => ({
  id: 'inv_testDonation', code, status: 'PAID', total_amount: 10000, total_paid: 10000,
  created_at: '2026-10-27T12:00:00Z', occurrence_date: '2026-10-27',
  customer: {name: '=Pessoa teste', email: 'private@example.com', document: {identity: '52998224725'}},
  services: [{description: 'Apoio: Fundo Geral de Acolhimento Comunitário'}], payments: [{method: 'PIX'}], ...changes,
});
const fixtureBank = (invoices: CoraInvoice[]): ReportBank => ({
  async listPaidInvoices(_start, _end, page, perPage = 20) {return {totalItems: invoices.length, items: invoices.slice((page - 1) * perPage, page * perPage).map(invoice => ({id: invoice.id, status: invoice.status}))};},
  async getInvoice(id) {return invoices.find(invoice => invoice.id === id)!;},
});

test('every destination, including EAD, survives the bank description length limit', () => {
  for (const destination of DONATION_DESTINATIONS) {
    const description = donationDescription(destination.id);
    assert.ok(description.length <= 100);
    assert.equal(destinationFromDescription(description)?.id, destination.id);
  }
  assert.equal(destinationFromDescription('Apoio: Muay Thai')?.id, 'muay-thai');
  assert.equal(destinationFromDescription('Apoio: Projeto inexistente'), undefined);
});

test('destination search is alphabetical in Portuguese, accent-insensitive and supports multiple words', () => {
  const sorted = [...DONATION_DESTINATIONS].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', {sensitivity: 'base'}));
  assert.deepEqual(DONATION_DESTINATIONS, sorted);
  assert.equal(filterDonationDestinations('ead')[0].id, 'cursos-ead');
  assert.ok(filterDonationDestinations('psi').length >= 2);
  assert.equal(filterDonationDestinations('mulheres defesa')[0].id, 'defesa-pessoal-mulheres');
  assert.deepEqual(filterDonationDestinations('açoes'), filterDonationDestinations('ações'));
  assert.deepEqual(filterDonationDestinations('destino inexistente'), []);
});

test('only the identified R$30 test is excluded; a real R$30 donation is included', () => {
  const testPayment = donationRecord(paidInvoice({id: 'inv_Z7ulab2OQ4ClFR7OTcCBkA', total_amount: 3000, total_paid: 3000}))!;
  const realPayment = donationRecord(paidInvoice({id: 'inv_realThirtyReais', total_amount: 3000, total_paid: 3000}))!;
  assert.equal(testPayment.included, false);
  assert.equal(realPayment.included, true);
  assert.equal(summarizeDonations([testPayment, realPayment]).totalCents, 3000);
});

test('Supabase receives server-only idempotent records with test exclusion and no full donor document', async () => {
  const calls: {url: string; options: RequestInit}[] = [];
  const ledger = new DonationLedger({url: 'https://test.supabase.co', secret: 'sb_secret_test', environment: 'production'}, async (url, options) => {
    calls.push({url: String(url), options: options!}); return new Response(null, {status: 204});
  });
  await ledger.savePaidRecords([donationRecord(paidInvoice({id: 'inv_Z7ulab2OQ4ClFR7OTcCBkA', total_amount: 3000, total_paid: 3000}))!, ...MANUAL_DONATIONS]);
  assert.match(calls[0].url, /on_conflict=environment,id/);
  const rows = JSON.parse(calls[0].options.body as string);
  assert.equal(rows[0].included, false);
  assert.equal(rows[1].source, 'externo');
  assert.equal(JSON.stringify(rows).includes('52998224725'), false);
  await ledger.observeCheckout(paidInvoice({status: 'OPEN', total_paid: 0}), 'geral');
  assert.equal(JSON.parse(calls[1].options.body as string)[0].payment_status, 'OPEN');
  assert.equal(JSON.parse(calls[1].options.body as string)[0].paid_cents, 0);
});

test('database errors do not expose secrets; production external receipts are not copied to Stage', async () => {
  const bodies: string[] = [];
  const ledger = new DonationLedger({url: 'https://test.supabase.co', secret: 'sb_secret_private', environment: 'stage'}, async (_url, options) => {
    bodies.push(String(options?.body)); return new Response('sb_secret_private 52998224725', {status: 500});
  });
  await ledger.savePaidRecords(MANUAL_DONATIONS);
  assert.equal(bodies.length, 0);
  await assert.rejects(() => ledger.savePaidRecords([donationRecord(paidInvoice())!]), error => {
    assert.equal(String(error).includes('sb_secret_private'), false); assert.equal(String(error).includes('52998224725'), false); return true;
  });
  assert.equal(getDonationLedger({}), undefined);
  assert.throws(() => getDonationLedger({SUPABASE_URL: 'https://test.supabase.co', SUPABASE_SECRET_KEY: 'sb_publishable_public', CORA_ENVIRONMENT: 'production'}), {status: 503});
});

test('EAD is accepted by checkout and recorded distinctly from general fund', () => {
  const input = validateCheckout({amountCents: 55000, method: 'pix', frequency: 'single', projectId: 'cursos-ead', customer: {name: 'Pessoa Teste', email: 'teste@example.com', document: '52998224725'}, idempotencyKey: code.slice(4), issuedAt: new Date().toISOString()});
  assert.equal(invoicePayload(input).services[0].description, 'Destino [cursos-ead]: Cursos EAD');
});

test('reconciliation recovers R$550 EAD, excludes R$30 test, preserves originals and counts external R$166 once', async () => {
  const invoices = [
    paidInvoice(),
    paidInvoice({id: 'inv_J3SYxHB4TRKIm1exonuApw', total_amount: 55000, total_paid: 55000}),
    paidInvoice({id: 'inv_Z7ulab2OQ4ClFR7OTcCBkA', total_amount: 3000, total_paid: 3000}),
    paidInvoice({id: 'inv_unrelatedInvoice', code: null as any, total_amount: 20000, total_paid: 20413}),
  ];
  const report = await readDonationReportPage(fixtureBank(invoices), '2026-01-01', '2026-10-29', 1);
  assert.equal(report.ignoredBankInvoices, 1);
  assert.equal(report.records.length, 3);
  assert.equal(report.records[1].destinationId, 'cursos-ead');
  assert.equal(report.records[1].originalDescription, 'Apoio: Fundo Geral de Acolhimento Comunitário');
  assert.equal(report.records[2].included, false);
  assert.equal(report.records[0].maskedDocument.includes('52998224725'), false);
  const summary = summarizeDonations([...report.records, ...report.manualRecords, ...report.records, ...report.manualRecords]);
  assert.equal(summary.generalFundCents, 26600);
  assert.equal(summary.eadCoursesCents, 55000);
  assert.equal(summary.totalCents, 81600);
  assert.equal(summary.unassignedCents, 0);
});

test('unknown or conflicting destinations are not silently assigned to general fund', () => {
  for (const services of [[{description: 'Doação sem referência'}], [{description: donationDescription('muay-thai')}, {description: donationDescription('geral')}]]) {
    const record = donationRecord(paidInvoice({services}))!;
    assert.equal(record.destinationId, null);
    const summary = summarizeDonations([record]);
    assert.equal(summary.generalFundCents, 0);
    assert.equal(summary.unassignedCents, 10000);
  }
});

test('pending, partially paid and malformed receipts cannot enter donation totals', () => {
  for (const changes of [{status: 'OPEN'}, {total_paid: 9999}, {total_paid: NaN}, {total_paid: 10000.5}, {total_amount: -1}]) {
    assert.throws(() => donationRecord(paidInvoice(changes)), {status: 502});
  }
});

test('all pages are reconciled; empty intermediate page fails rather than publishing incomplete totals', async () => {
  const invoices = Array.from({length: 23}, (_, index) => paidInvoice({id: `inv_donation_${index}`, services: [{description: donationDescription('muay-thai')}]}));
  const summary = await readDonationSummary(fixtureBank(invoices), '2026-10-29');
  assert.equal(summary.byDestination['muay-thai'], 230000);
  assert.equal(summary.totalCents, 246600);
  await assert.rejects(() => readDonationReportPage({async listPaidInvoices() {return {totalItems: 30, items: []};}, async getInvoice() {throw Error();}}, '2026-01-01', '2026-10-29', 1), {status: 502});
});

test('report periods require actual calendar dates and at most one year', () => {
  assert.deepEqual(validateReportRange('2026-10-29', '2026-10-29'), {start: '2026-10-29', end: '2026-10-29'});
  for (const [start, end] of [['2026-02-30','2026-03-01'], ['2026-10-30','2026-10-29'], ['2020-01-01','2026-10-29'], ['', '2026-10-29']]) assert.throws(() => validateReportRange(start, end), {status: 400});
});

test('CSV is Excel-compatible, protects against formulas and preserves financial references', () => {
  const csv = donationRecordsCsv([donationRecord(paidInvoice())!, ...MANUAL_DONATIONS]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"100,00"'));
  assert.ok(csv.includes('"\'=Pessoa teste"'));
  assert.ok(csv.includes('"inv_testDonation"'));
  assert.ok(csv.includes('"manual-fundo-geral-166"'));
  assert.equal(csv.includes('52998224725'), false);
});

test('private report requires its own long key; missing configuration fails closed', () => {
  const key = 'test-only-report-secret-32-characters-long';
  const hash = createHash('sha256').update(key).digest('hex');
  assert.doesNotThrow(() => authorizeDonationReport(`Bearer ${key}`, hash));
  for (const header of [undefined, 'Bearer fake', `Bearer ${'a'.repeat(43)}`]) assert.throws(() => authorizeDonationReport(header, hash), {status: 401});
  assert.throws(() => authorizeDonationReport(`Bearer ${key}`, undefined), {status: 503});
});

test('bank outage uses the saved ledger with an explicit stale flag and preserves authentication', async () => {
  const key = 'test-only-report-secret-32-characters-long';
  const records = [donationRecord(paidInvoice())!, donationRecord(paidInvoice({id: 'inv_Z7ulab2OQ4ClFR7OTcCBkA', total_amount: 3000, total_paid: 3000}))!];
  let ledgerReads = 0;
  const ledger = {
    async summary() {ledgerReads++; return summarizeDonations([...records, ...MANUAL_DONATIONS]);},
    async report() {ledgerReads++; return {records, manualRecords: MANUAL_DONATIONS, nextPage: null, ignoredBankInvoices: 0, generatedAt: '2026-10-29T00:00:00Z', isStale: true};},
  } as unknown as DonationLedger;
  const server = createServer(createDonationsHandler(() => {throw Error('simulated bank outage');}, {DONATIONS_REPORT_ACCESS_HASH: createHash('sha256').update(key).digest('hex')}, () => ledger));
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const body = JSON.stringify({start: '2026-01-01', end: '2026-10-29'});
  try {
    assert.equal((await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body})).status, 401);
    assert.equal(ledgerReads, 0);
    const response = await fetch(url);
    const data = await response.json();
    assert.equal(data.summary.isStale, true); assert.equal(data.summary.totalCents, 26600);
    assert.equal(JSON.stringify(data).includes('private@example.com'), false);
    const reportResponse = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${key}`}, body});
    const {report} = await reportResponse.json();
    assert.equal(report.isStale, true); assert.equal(report.records[1].included, false);
  } finally {await new Promise<void>(resolve => server.close(() => resolve()));}
});

test('Cora list sends PAID, payment-date range and page; rejects malformed upstream pagination', async () => {
  const requests: TransportRequest[] = [];
  const client = new CoraClient({clientId: 'test'} as CoraConfig, async request => {
    requests.push(request);
    return request.path === '/token' ? {status: 200, body: {access_token: 'test', expires_in: 3600}} : {status: 200, body: {totalItems: 1, items: [{id: 'inv_testDonation'}]}};
  });
  await client.listPaidInvoices('2026-10-01', '2026-10-29', 2);
  assert.equal(requests[1].method, 'GET');
  assert.match(requests[1].path, /state=PAID&start=2026-10-01&end=2026-10-29&page=2&perPage=20/);
  const bad = new CoraClient({clientId: 'test'} as CoraConfig, async request => request.path === '/token' ? {status: 200, body: {access_token: 'test', expires_in: 3600}} : {status: 200, body: {items: []}});
  await assert.rejects(() => bad.listPaidInvoices('2026-10-01', '2026-10-29', 1), {status: 502});
});

test('HTTP private data stays authenticated and uncached; public aggregate contains no PII or invoice references', async () => {
  const key = 'test-only-report-secret-32-characters-long';
  let bankReads = 0;
  const fixture = fixtureBank([paidInvoice()]);
  const getBank = () => {bankReads++; return fixture;};
  const server = createServer(createDonationsHandler(getBank, {DONATIONS_REPORT_ACCESS_HASH: createHash('sha256').update(key).digest('hex')}));
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const query = {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({start: '2026-01-01', end: '2026-10-29'})};
  try {
    assert.equal((await fetch(base, query)).status, 401);
    assert.equal(bankReads, 0);
    assert.equal((await fetch(base, {...query, headers: {...query.headers, Authorization: `Bearer ${key}`, Origin: 'https://other.example'}})).status, 403);
    assert.equal(bankReads, 0);
    const report = await fetch(base, {...query, headers: {...query.headers, Authorization: `Bearer ${key}`}});
    assert.equal(report.status, 200);
    assert.equal(report.headers.get('cache-control'), 'no-store, private');
    assert.equal((await report.json()).report.records.length, 1);
    const publicResponse = await fetch(base);
    const data = await publicResponse.text();
    assert.equal(publicResponse.status, 200);
    for (const secret of ['inv_testDonation', 'private@example.com', '52998224725', '=Pessoa teste', key]) assert.equal(data.includes(secret), false);
    assert.equal(JSON.parse(data).summary.totalCents, 26600);
  } finally {await new Promise<void>(resolve => server.close(() => resolve()));}
});

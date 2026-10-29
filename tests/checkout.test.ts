import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { parseAmount, validDocument } from '../shared/checkout.ts';
import { createCheckoutService, invoicePayload, validateCheckout, verifyCheckout } from '../server/checkout.ts';
import { createHandler } from '../api/checkout.ts';
import type { CoraInvoice } from '../server/cora/client.ts';

const now = Date.parse('2026-10-27T02:30:00Z');
const secret = 'local-test-only-checkout-secret-32-characters';
const input = () => ({amountCents: 5000, method: 'pix', frequency: 'single', projectId: 'muay-thai', customer: {name: 'Pessoa de Teste', email: 'teste@example.com', document: '529.982.247-25'}, idempotencyKey: randomUUID(), issuedAt: new Date(now).toISOString()});
function setup(observer?: (invoice: CoraInvoice, projectId: string) => Promise<void>) {
  const invoices = new Map<string, CoraInvoice>();
  const keys: string[] = [];
  let reads = 0;
  const bank = {
    async checkConnection() {return {authenticated: true};},
    async createInvoice(payload: any, key: string) {
      keys.push(key);
      if (!invoices.has(key)) invoices.set(key, {id: 'inv_' + key.replaceAll('-', ''), code: payload.code, status: 'OPEN', total_amount: payload.services[0].amount, total_paid: 0, payment_terms: payload.payment_terms, pix: {emv: '000201-test-only-pix-payload'}, payment_options: {bank_slip: {url: 'https://example.com/test-boleto.pdf', digitable: '00190000090000000000100000000000000000000005000'}}});
      return invoices.get(key)!;
    },
    async getInvoice(id: string) { reads++; return [...invoices.values()].find(i => i.id === id)!; },
  };
  return {service: createCheckoutService(bank, secret, 'stage', () => now, observer), invoices, keys, reads: () => reads};
}

test('checkout observes invoice creation and payment status without interrupting a bank-issued charge on storage failure', async () => {
  const observations: string[] = [];
  const state = setup(async (invoice, projectId) => {observations.push(`${invoice.status}:${projectId}`); if (invoice.status === 'OPEN') throw new Error('simulated storage outage');});
  const request = input();
  const payment = await state.service.create(request);
  assert.equal(payment.paid, false);
  const invoice = state.invoices.get(request.idempotencyKey)!;
  invoice.status = 'PAID'; invoice.total_paid = request.amountCents;
  assert.equal((await state.service.status(payment.checkoutToken)).paid, true);
  assert.deepEqual(observations, ['OPEN:muay-thai', 'PAID:muay-thai']);
  assert.equal(state.keys.length, 1);
});

test('amount parsing preserves centavos and rejects ambiguous or unsafe values', () => {
  assert.equal(parseAmount('5,01'), 501);
  assert.equal(parseAmount('50.5'), 5050);
  assert.equal(parseAmount('50000'), 5000000);
  for (const value of ['1e3', '-50', '1.000,00', '10.123', 'Infinity', '', '0x10']) assert.ok(Number.isNaN(parseAmount(value)), value);
});

test('CPF and CNPJ use check digits, including formatted documents', () => {
  assert.equal(validDocument('529.982.247-25'), true);
  assert.equal(validDocument('11.222.333/0001-81'), true);
  for (const value of ['11111111111', '52998224724', '11222333000180', '52998224725x', '123']) assert.equal(validDocument(value), false);
});

test('invalid requests cannot reach the bank', async () => {
  const invalidCases = [
    {amountCents: 499}, {amountCents: 500.5}, {amountCents: '5000'}, {amountCents: 5000001},
    {method: 'card'}, {frequency: 'monthly'}, {projectId: 'inventado'}, {idempotencyKey: 'not-a-uuid'},
    {issuedAt: 'not-a-date'}, {issuedAt: new Date(now - 25 * 3600000).toISOString()},
    {issuedAt: new Date(now + 10 * 60000).toISOString()},
    {customer: {name: 'Pessoa Teste', email: 'bad', document: '52998224725'}},
    {customer: {name: 'Pessoa Teste', email: 'teste@example.com', document: '11111111111'}},
  ];
  const {service, keys} = setup();
  for (const change of invalidCases) await assert.rejects(() => service.create({...input(), ...change}), {status: 400});
  assert.equal(keys.length, 0);
});

test('payload uses documented Pix forms, integer amounts and optional address omission', () => {
  const normalized = validateCheckout(input(), now);
  assert.equal(normalized.customer.document, '52998224725');
  const payload = invoicePayload(normalized);
  assert.deepEqual(payload.payment_forms, ['PIX']);
  assert.equal(payload.customer.document.type, 'CPF');
  assert.equal(payload.services[0].amount, 5000);
  assert.equal(payload.services[0].description, 'Destino [muay-thai]: Muay Thai');
  assert.equal(payload.payment_terms.due_date, '2026-10-29');
  assert.equal('address' in payload.customer, false);
  assert.deepEqual(payload.notification.channels[0].rules, ['NOTIFY_WHEN_PAID']);
});

test('boleto offers BANK_SLIP plus PIX and preserves the first-attempt due date on retries', () => {
  const value = {...input(), method: 'boleto', customer: {...input().customer, document: '11222333000181'}};
  const first = invoicePayload(validateCheckout(value, now));
  const retried = invoicePayload(validateCheckout(value, now + 12 * 3600000));
  assert.deepEqual(first, retried);
  assert.deepEqual(first.payment_forms, ['BANK_SLIP', 'PIX']);
  assert.equal(first.customer.document.type, 'CNPJ');
});

test('retry uses the same idempotency key and returns the same invoice', async () => {
  const {service, keys} = setup();
  const request = input();
  const first = await service.create(request);
  const retry = await service.create(request);
  assert.equal(first.id, retry.id);
  assert.deepEqual(keys, [request.idempotencyKey, request.idempotencyKey]);
  assert.equal(first.paid, false);
  assert.ok(first.qrCodeDataUrl?.startsWith('data:image/png;base64,'));
  assert.equal(first.boletoUrl, null);
  assert.equal(JSON.stringify(first).includes(request.customer.email), false);
  assert.equal(JSON.stringify(first).includes('52998224725'), false);
});

test('payment confirmation requires PAID and the full amount from the bank', async () => {
  const {service, invoices} = setup();
  const request = input();
  const payment = await service.create(request);
  const invoice = invoices.get(request.idempotencyKey)!;
  invoice.status = 'IN_PAYMENT'; invoice.total_paid = 5000;
  assert.equal((await service.status(payment.checkoutToken)).paid, false);
  invoice.status = 'PAID'; invoice.total_paid = 4999;
  assert.equal((await service.status(payment.checkoutToken)).paid, false);
  invoice.total_paid = 5000;
  assert.equal((await service.status(payment.checkoutToken)).paid, true);
});

test('tampered, expired and other-environment tokens are rejected before any bank lookup', async () => {
  const {service, reads} = setup();
  const payment = await service.create(input());
  await assert.rejects(() => service.status(payment.checkoutToken + 'x'), {status: 403});
  await assert.rejects(() => service.status('fake'), {status: 403});
  assert.throws(() => verifyCheckout(payment.checkoutToken, secret, 'production', now), {status: 403});
  assert.throws(() => verifyCheckout(payment.checkoutToken, secret, 'stage', now + 8 * 86400000), {status: 403});
  assert.equal(reads(), 0);
});

test('unexpected amount, invoice identity or code returned by bank cannot be trusted', async () => {
  for (const change of [{total_amount: 50}, {id: 'inv_anotherinvoice'}, {code: 'other-code'}, {status: 'UNKNOWN'}]) {
    const {service, invoices} = setup();
    const request = input(); const payment = await service.create(request);
    Object.assign(invoices.get(request.idempotencyKey)!, change);
    await assert.rejects(() => service.status(payment.checkoutToken));
  }
});

test('unsafe boleto URLs are omitted; missing Pix stays pending rather than inventing a code', async () => {
  const {service, invoices} = setup();
  const request = {...input(), method: 'boleto'}; const payment = await service.create(request);
  const invoice = invoices.get(request.idempotencyKey)!;
  invoice.payment_options!.bank_slip!.url = 'javascript:alert(1)'; delete invoice.pix;
  const status = await service.status(payment.checkoutToken);
  assert.equal(status.boletoUrl, null); assert.equal(status.pixCode, null); assert.equal(status.qrCodeDataUrl, null); assert.equal(status.paid, false);
});

test('HTTP function enforces method, JSON, size and same-origin; status needs a signed token', async () => {
  const state = setup();
  const server = createServer(createHandler(() => state.service));
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  try {
    assert.equal((await fetch(base)).status, 405);
    assert.equal((await fetch(base, {method: 'POST', body: '{}'})).status, 415);
    assert.equal((await fetch(base, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{bad'})).status, 400);
    assert.equal((await fetch(base, {method: 'POST', headers: {'Content-Type': 'application/json', Origin: 'https://evil.example'}, body: '{}'})).status, 403);
    assert.equal((await fetch(base, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({filler: 'x'.repeat(9000)})})).status, 413);
    const health = await fetch(base, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({action: 'health'})});
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), {available: true});
    assert.equal(state.keys.length, 0);
    const created = await fetch(base, {method: 'POST', headers: {'Content-Type': 'application/json', Origin: base}, body: JSON.stringify({action: 'create', checkout: input()})});
    assert.equal(created.status, 201); assert.match(created.headers.get('cache-control')!, /no-store/);
    const {payment} = await created.json() as any;
    assert.equal(payment.paid, false);
    const status = await fetch(base, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({action: 'status', checkoutToken: payment.checkoutToken})});
    assert.equal(status.status, 200);
    const denied = await fetch(base, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({action: 'status', checkoutToken: 'invented'})});
    assert.equal(denied.status, 403);
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});

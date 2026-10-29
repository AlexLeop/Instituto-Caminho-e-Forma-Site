import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { validateReallocation } from '../server/donations/reallocations.ts';
import { DonationLedger } from '../server/donations/ledger.ts';
import { fundMovementsCsv, type FundMovement } from '../shared/fundMovements.ts';
import { createDonationsHandler } from '../api/donations.ts';

const input = () => ({id: randomUUID(), sourceId: 'boxe-formativo', destinationId: 'ballet-infantil', amountCents: 80000, responsible: 'Responsável de Teste', reason: 'Aquisição de materiais para as aulas de ballet.'});

test('reallocation requires integer cents, distinct existing projects, responsible and justification', () => {
  assert.equal(validateReallocation(input()).amountCents, 80000);
  for (const change of [{amountCents: 0}, {amountCents: -1}, {amountCents: 1.5}, {amountCents: '80000'}, {sourceId: 'inventado'}, {destinationId: 'boxe-formativo'}, {responsible: ''}, {reason: 'curto'}, {reversalOf: 'fake-id'}]) assert.throws(() => validateReallocation({...input(), ...change}), {status: 400});
});

test('RPC uses canonical project titles and recognizes insufficient allocation without exposing upstream information', async () => {
  let payload: any;
  const ledger = new DonationLedger({url: 'https://test.supabase.co', secret: 'sb_secret_test', environment: 'production'}, async (_url, options) => {
    payload = JSON.parse(options!.body as string);
    return new Response(JSON.stringify({message: 'INSUFFICIENT_ALLOCATION'}), {status: 400});
  });
  await assert.rejects(() => ledger.reallocate(validateReallocation({...input(), sourceTitle: 'Nome falso'})), {status: 409, code: 'insufficient_allocation'});
  assert.equal(payload.p_source_title, 'Boxe'); assert.equal(payload.p_environment, 'production'); assert.equal(payload.p_reversal_of, null);
});

test('movement CSV preserves reversals and protects against spreadsheet formulas', () => {
  const value = {...input(), sourceTitle: 'Boxe', destinationTitle: 'Ballet', responsible: '=TESTE', createdAt: '2026-10-29T12:00:00Z', reversalOf: randomUUID()} as FundMovement;
  const csv = fundMovementsCsv([value]);
  assert.ok(csv.includes('"800,00"')); assert.ok(csv.includes('"\'=TESTE"')); assert.ok(csv.includes('"Estorno"')); assert.ok(csv.includes(value.reversalOf!));
});

test('financial writes require the private report key and same-origin; invalid input never reaches the ledger', async () => {
  const key = 'test-only-report-secret-32-characters-long'; let ledgerCalls = 0;
  const ledger = {async reallocate(value: any) {ledgerCalls++; return value;}, async fundReport() {ledgerCalls++; return {balances: [], movements: [], nextPage: null, generatedAt: new Date().toISOString()};}} as unknown as DonationLedger;
  const server = createServer(createDonationsHandler(() => {throw Error('bank must not be called');}, {DONATIONS_REPORT_ACCESS_HASH: createHash('sha256').update(key).digest('hex')}, () => ledger));
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve)); const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const request = (body: unknown, headers: Record<string, string> = {}) => fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json', ...headers}, body: JSON.stringify(body)});
  try {
    assert.equal((await request({action: 'reallocate', movement: input()})).status, 401);
    assert.equal((await request({action: 'reallocate', movement: input()}, {Authorization: `Bearer ${key}`, Origin: 'https://evil.example'})).status, 403);
    assert.equal((await request({action: 'reallocate', movement: {...input(), amountCents: 0}}, {Authorization: `Bearer ${key}`})).status, 400);
    assert.equal(ledgerCalls, 0);
    assert.equal((await request({action: 'reallocate', movement: input()}, {Authorization: `Bearer ${key}`})).status, 201);
    const report = await request({action: 'funds', start: '2026-01-01', end: '2026-10-29'}, {Authorization: `Bearer ${key}`});
    assert.equal(report.status, 200); assert.match(report.headers.get('cache-control')!, /no-store/); assert.equal(ledgerCalls, 2);
  } finally {await new Promise<void>(resolve => server.close(() => resolve()));}
});

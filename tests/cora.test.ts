import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { rootCertificates } from 'node:tls';
import { CoraClient } from '../server/cora/client.ts';
import { normalizePem, normalizeEnvironmentValue, readCoraConfig } from '../server/cora/config.ts';
import type { CoraConfig } from '../server/cora/config.ts';
import type { CoraTransport, TransportRequest } from '../server/cora/client.ts';

const config = {clientId: 'test-client', environment: 'stage'} as CoraConfig;
const invoice = {id: 'inv_testinvoice', code: 'test', status: 'OPEN', total_amount: 5000, total_paid: 0};
test('server accepts PEM, escaped PEM, base64 PEM and base64 DER keys', () => {
  const {privateKey} = generateKeyPairSync('rsa', {modulusLength: 2048});
  const pem = privateKey.export({type: 'pkcs8', format: 'pem'}).toString();
  const der = privateKey.export({type: 'pkcs8', format: 'der'});
  assert.equal(normalizePem(pem, 'key'), pem);
  assert.equal(normalizePem(pem.replace(/\n/g, '\\n'), 'key'), pem);
  assert.equal(normalizePem(Buffer.from(pem).toString('base64'), 'key'), pem);
  assert.equal(normalizePem(der.toString('base64'), 'key'), pem);
});
test('missing or invalid config produces a safe error without credential contents', () => {
  assert.throws(() => readCoraConfig({}), {status: 503, code: 'configuration_error'});
  try {readCoraConfig({CORA_ENVIRONMENT: 'production', CORA_CLIENT_ID: 'private-client-id', CHECKOUT_SIGNING_SECRET: 'very-private-test-secret'.repeat(3), PRIVATE_KEY: 'very-private-key', CERTIFICATE_PEM: 'very-private-cert'});}
  catch (err) {assert.equal(String(err).includes('very-private'), false); assert.equal(String(err).includes('private-client-id'), false);}
});
test('dashboard quoting is removed without changing the credential', () => {
  assert.equal(normalizeEnvironmentValue('  "production"  '), 'production');
  assert.equal(normalizeEnvironmentValue("'stage'"), 'stage');
  const {privateKey} = generateKeyPairSync('rsa', {modulusLength: 2048});
  const pem = privateKey.export({type: 'pkcs8', format: 'pem'}).toString();
  for (const value of [JSON.stringify(pem), "'" + pem + "'", JSON.stringify(Buffer.from(pem).toString('base64')), pem.replace(/\n/g, '\\r\\n')]) {
    assert.equal(normalizePem(value, 'key'), pem);
  }
  const certificate = rootCertificates[0];
  assert.equal(normalizePem(JSON.stringify(certificate), 'certificate'), certificate + (certificate.endsWith('\n') ? '' : '\n'));
});
test('configuration diagnoses missing variables using names only', () => {
  assert.throws(() => readCoraConfig({}), {reference: 'cora_environment_missing', field: 'CORA_ENVIRONMENT'});
  assert.throws(() => readCoraConfig({CORA_ENVIRONMENT: ' Production '}), {reference: 'cora_client_id_missing', field: 'CORA_CLIENT_ID'});
  assert.throws(() => readCoraConfig({CORA_ENVIRONMENT: '"production"', CORA_CLIENT_ID: 'test-client'}), {reference: 'checkout_signing_secret_missing', field: 'CHECKOUT_SIGNING_SECRET'});
  assert.throws(() => readCoraConfig({CORA_ENVIRONMENT: 'production', CORA_CLIENT_ID: 'test-client', CHECKOUT_SIGNING_SECRET: 'short'}), {reference: 'checkout_signing_secret_too_short'});
  assert.throws(() => readCoraConfig({CORA_ENVIRONMENT: 'production', CORA_CLIENT_ID: 'test-client', CHECKOUT_SIGNING_SECRET: 'local-test-only-secret-value-long-enough'}), {reference: 'cora_certificate_missing', field: 'CERTIFICATE_PEM'});
  assert.throws(() => readCoraConfig({CORA_ENVIRONMENT: 'production', CORA_CLIENT_ID: 'test-client', CHECKOUT_SIGNING_SECRET: 'local-test-only-secret-value-long-enough', PRIVATE_KEY: 'not-a-real-key', CERTIFICATE_PEM: 'not-a-real-certificate'}), {reference: 'cora_certificate_invalid'});
});
test('token requests use client credentials; concurrent calls share one token request', async () => {
  const requests: TransportRequest[] = [];
  const transport: CoraTransport = async request => {
    requests.push(request);
    if (request.path === '/token') {await new Promise(resolve => setTimeout(resolve, 5)); return {status: 200, body: {access_token: 'test-token', expires_in: 3600}};}
    return {status: 200, body: invoice};
  };
  const client = new CoraClient(config, transport);
  await Promise.all([client.getInvoice(invoice.id), client.getInvoice(invoice.id)]);
  assert.equal(requests.filter(r => r.path === '/token').length, 1);
  assert.equal(requests[0].body, 'grant_type=client_credentials&client_id=test-client');
  assert.ok(requests.filter(r => r.path !== '/token').every(r => r.headers.Authorization === 'Bearer test-token'));
});
test('401 refreshes token and safely repeats POST with the exact original body and idempotency key', async () => {
  const requests: TransportRequest[] = []; let tokens = 0; let attempts = 0;
  const client = new CoraClient(config, async request => {
    requests.push(request);
    if (request.path === '/token') return {status: 200, body: {access_token: `token-${++tokens}`, expires_in: 3600}};
    return ++attempts === 1 ? {status: 401, body: {}} : {status: 201, body: invoice};
  });
  await client.createInvoice({amount: 5000}, 'same-idempotency-key');
  const posts = requests.filter(r => r.path === '/v2/invoices/');
  assert.equal(tokens, 2); assert.equal(posts.length, 2);
  assert.equal(posts[0].body, posts[1].body);
  assert.equal(posts[0].headers['Idempotency-Key'], posts[1].headers['Idempotency-Key']);
  assert.notEqual(posts[0].headers.Authorization, posts[1].headers.Authorization);
});
test('bank error messages never expose upstream tokens or donor information', async () => {
  const client = new CoraClient(config, async request => request.path === '/token' ? {status: 200, body: {access_token: 'secret-token', expires_in: 3600}} : {status: 400, body: {message: 'secret-token sensitive-donor-document'}});
  await assert.rejects(() => client.createInvoice({}, 'id'), err => {
    assert.equal(String(err).includes('secret-token'), false); assert.equal(String(err).includes('sensitive-donor'), false); return true;
  });
});

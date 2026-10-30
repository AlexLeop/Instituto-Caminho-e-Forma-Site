import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createSupporterService, hashSupporterSession, type SupporterAuth } from '../server/supporter/service.ts';
import { createSupporterHandler } from '../api/supporter.ts';
import { CheckoutError } from '../server/cora/config.ts';

const challengeId = randomUUID(), userId = randomUUID();
function setup(eligible = true, wrongEmail = false, requireEmailCode = true) {
  const calls: {name: string; body: any}[] = [], emails: string[] = [];
  const ledger = {environment: 'production' as const, async rpc<T>(name: string, body: any): Promise<T> {
    calls.push({name, body});
    if (name === 'begin_supporter_login' || name === 'attempt_supporter_challenge') return {id: challengeId, email: 'donor@example.com', eligible} as T;
    if (name === 'complete_supporter_login' || name === 'complete_supporter_identity_login') return {expiresAt: new Date(Date.now() + 1800000).toISOString()} as T;
    if (name === 'supporter_portal') return {authenticationMethod: requireEmailCode ? 'email_code' : 'email_document', name: 'Pessoa de Teste', donations: [], totalCents: 5000} as T;
    return null as T;
  }};
  const auth: SupporterAuth = {async sendCode(email) {emails.push(email);}, async verifyCode(email, code) {if (code !== '123456') throw new CheckoutError(401, 'invalid_code', 'Código inválido'); return {id: userId, email: wrongEmail ? 'other@example.com' : email};}};
  return {service: createSupporterService(ledger, auth, 'test-only-signing-secret-32-characters-long', requireEmailCode), calls, emails};
}

test('temporary identity access validates email and CPF suffix without sending email or creating an Auth user', async () => {
  const state = setup(true, false, false);
  const result = await state.service.login({email: ' DONOR@EXAMPLE.COM ', documentSuffix: '1234'}, '192.0.2.1');
  assert.match(result.token, /^[A-Za-z0-9_-]{43}$/); assert.equal(state.emails.length, 0);
  assert.deepEqual(state.calls.map(call => call.name), ['begin_supporter_login', 'complete_supporter_identity_login']);
  assert.equal(state.calls[0].body.p_email, 'donor@example.com');
  assert.equal(state.calls[0].body.p_suffix, '1234');
  assert.equal(JSON.stringify(state.calls).includes('192.0.2.1'), false);
  assert.equal(state.calls[1].body.p_session_hash, hashSupporterSession(result.token));
  assert.equal(JSON.stringify(state.calls).includes(result.token), false);
  await state.service.profile(result.token, 1); await state.service.logout(result.token);
  assert.equal(state.calls.at(-1)!.body.p_session_hash, hashSupporterSession(result.token));
  await assert.rejects(() => state.service.requestCode({email: 'donor@example.com', documentSuffix: '1234'}, 'ip'), {code: 'supporter_email_code_disabled'});
  await assert.rejects(() => state.service.verifyCode(challengeId, '123456'), {code: 'supporter_email_code_disabled'});
  assert.equal(state.emails.length, 0);
});

test('identity-only access rejects unknown identities and malformed input; enabling email codes closes direct login', async () => {
  const unknown = setup(false, false, false);
  await assert.rejects(() => unknown.service.login({email: 'donor@example.com', documentSuffix: '9999'}, 'ip'), {status: 401, code: 'invalid_supporter_identity'});
  assert.deepEqual(unknown.calls.map(call => call.name), ['begin_supporter_login']);
  const invalid = setup(true, false, false);
  for (const value of [{email: 'bad', documentSuffix: '1234'}, {email: 'donor@example.com', documentSuffix: '123'}, {email: 'donor@example.com', documentSuffix: '12345678900'}]) {
    await assert.rejects(() => invalid.service.login(value, 'ip'), {status: 400});
  }
  assert.equal(invalid.calls.length, 0);
  const secured = setup();
  await assert.rejects(() => secured.service.login({email: 'donor@example.com', documentSuffix: '1234'}, 'ip'), {code: 'supporter_email_code_required'});
  assert.equal(secured.calls.length, 0);
});

test('reenabling email codes rejects sessions established with email and document only', async () => {
  const state = setup(true, false, false);
  const token = (await state.service.login({email: 'donor@example.com', documentSuffix: '1234'}, 'ip')).token;
  const ledger = {environment: 'production' as const, async rpc<T>(): Promise<T> {return {authenticationMethod: 'email_document'} as T;}};
  const auth: SupporterAuth = {async sendCode() {throw Error('must not send');}, async verifyCode() {throw Error('must not verify');}};
  const secured = createSupporterService(ledger, auth, 'test-only-signing-secret-32-characters-long', true);
  await assert.rejects(() => secured.profile(token, 1), {status: 401});
});

test('HTTP direct login keeps the session restricted to cookies and blocks cross-origin access', async () => {
  const state = setup(true, false, false);
  const server = createServer(createSupporterHandler(() => state.service, {VERCEL: '1'}));
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve)); const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const post = (body: unknown, headers: Record<string, string> = {}) => fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json', ...headers}, body: JSON.stringify(body)});
  try {
    const input = {action: 'login', email: 'donor@example.com', documentSuffix: '1234'};
    assert.equal((await fetch(url)).status, 401);
    assert.equal((await post(input, {Origin: 'https://evil.example'})).status, 403);
    assert.equal(state.calls.length, 0);
    const loggedIn = await post(input); assert.equal(loggedIn.status, 200);
    const sessionCookie = loggedIn.headers.getSetCookie().find(cookie => cookie.startsWith('icf_supporter_session='))!;
    assert.match(sessionCookie, /Path=\/api\/supporter; Max-Age=1800; HttpOnly; SameSite=Strict; Secure/);
    assert.equal((await loggedIn.json()).token, undefined); assert.match(loggedIn.headers.get('cache-control')!, /no-store/);
    assert.equal((await fetch(url, {headers: {Cookie: sessionCookie.split(';')[0]}})).status, 200);
    const signedOut = await post({action: 'logout'}, {Cookie: sessionCookie.split(';')[0]});
    assert.equal(signedOut.status, 200); assert.ok(signedOut.headers.getSetCookie().every(cookie => cookie.includes('Max-Age=0')));
    assert.equal(state.emails.length, 0);
  } finally {await new Promise<void>(resolve => server.close(() => resolve()));}
});

test('email + document suffix starts a challenge but never grants access without email verification', async () => {
  const state = setup();
  const result = await state.service.requestCode({email: ' DONOR@EXAMPLE.COM ', documentSuffix: '1234'}, '192.0.2.1');
  assert.equal(result.challengeId, challengeId); assert.deepEqual(state.emails, ['donor@example.com']);
  assert.equal(state.calls[0].body.p_email, 'donor@example.com');
  assert.equal(state.calls[0].body.p_ip_hash.includes('192.0.2.1'), false);
  assert.equal(state.calls.some(call => call.name === 'complete_supporter_login'), false);
  await assert.rejects(() => state.service.profile(undefined, 1), {status: 401});
});

test('unknown donors receive the same public message and cannot create a session', async () => {
  const known = setup(), unknown = setup(false);
  const value = {email: 'donor@example.com', documentSuffix: '1234'};
  assert.equal((await known.service.requestCode(value, 'ip')).message, (await unknown.service.requestCode(value, 'ip')).message);
  assert.equal(unknown.emails.length, 0);
  await assert.rejects(() => unknown.service.verifyCode(challengeId, '123456'), {status: 401});
  assert.equal(unknown.calls.some(call => call.name === 'complete_supporter_login'), false);
});

test('invalid input, wrong code or another verified email cannot establish a supporter session', async () => {
  const state = setup();
  for (const value of [{email: 'bad', documentSuffix: '1234'}, {email: 'donor@example.com', documentSuffix: '123'}, {email: 'donor@example.com', documentSuffix: 'abcd'}]) await assert.rejects(() => state.service.requestCode(value, 'ip'), {status: 400});
  assert.equal(state.calls.length, 0);
  await assert.rejects(() => state.service.verifyCode(undefined, '123456'), {status: 401});
  await assert.rejects(() => state.service.verifyCode(challengeId, '654321'), {status: 401});
  await assert.rejects(() => setup(true, true).service.verifyCode(challengeId, '123456'), {status: 401});
  assert.equal(state.calls.some(call => call.name === 'complete_supporter_login'), false);
});

test('verified sessions use random opaque tokens; the database receives only their hash', async () => {
  const state = setup(); const result = await state.service.verifyCode(challengeId, '123456');
  assert.match(result.token, /^[A-Za-z0-9_-]{43}$/);
  const complete = state.calls.find(call => call.name === 'complete_supporter_login')!;
  assert.equal(complete.body.p_session_hash, hashSupporterSession(result.token)); assert.equal(JSON.stringify(state.calls).includes(result.token), false);
  await state.service.profile(result.token, 1); await state.service.logout(result.token);
  assert.equal(state.calls.at(-1)!.body.p_session_hash, hashSupporterSession(result.token));
});

test('HTTP keeps sessions HttpOnly/Secure, rejects cross-origin, and never returns raw tokens in JSON', async () => {
  const state = setup();
  const server = createServer(createSupporterHandler(() => state.service, {VERCEL: '1'}));
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve)); const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const post = (body: unknown, headers: Record<string, string> = {}) => fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json', ...headers}, body: JSON.stringify(body)});
  try {
    assert.equal((await fetch(url)).status, 401);
    assert.equal((await post({action: 'request-code', email: 'donor@example.com', documentSuffix: '1234'}, {Origin: 'https://evil.example'})).status, 403);
    const started = await post({action: 'request-code', email: 'donor@example.com', documentSuffix: '1234'});
    assert.equal(started.status, 200); assert.match(started.headers.get('set-cookie')!, /HttpOnly; SameSite=Strict; Secure/);
    const verified = await post({action: 'verify-code', code: '123456'}, {Cookie: `icf_supporter_challenge=${challengeId}`});
    assert.equal(verified.status, 200); const sessionCookie = verified.headers.getSetCookie().find(cookie => cookie.startsWith('icf_supporter_session='))!;
    assert.match(sessionCookie, /HttpOnly; SameSite=Strict; Secure/);
    const response = await verified.json(); assert.equal(response.authenticated, true); assert.equal(response.token, undefined);
    const signedOut = await post({action: 'logout'}, {Cookie: sessionCookie.split(';')[0]});
    assert.equal(signedOut.status, 200); assert.ok(signedOut.headers.getSetCookie().every(cookie => cookie.includes('Max-Age=0')));
  } finally {await new Promise<void>(resolve => server.close(() => resolve()));}
});

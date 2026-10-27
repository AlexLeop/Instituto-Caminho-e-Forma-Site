import type { IncomingMessage, ServerResponse } from 'node:http';
import { createCheckoutService } from '../server/checkout.ts';
import { CoraClient } from '../server/cora/client.ts';
import { CheckoutError, readCoraConfig } from '../server/cora/config.ts';

interface ApiRequest extends IncomingMessage {body?: unknown}
type Service = ReturnType<typeof createCheckoutService>;
let cached: {fingerprint: string; service: Service} | undefined;
function service() {
  const config = readCoraConfig();
  if (!cached || cached.fingerprint !== config.fingerprint) cached = {fingerprint: config.fingerprint, service: createCheckoutService(new CoraClient(config), config.signingSecret, config.environment)};
  return cached.service;
}

async function readJson(request: ApiRequest): Promise<any> {
  if (Number(request.headers['content-length'] || 0) > 8192) throw new CheckoutError(413, 'body_too_large', 'Os dados enviados excedem o limite permitido.');
  if (!(request.headers['content-type'] || '').toLowerCase().startsWith('application/json')) throw new CheckoutError(415, 'invalid_content_type', 'Envie os dados em formato JSON.');
  if (request.body !== undefined) {
    const json = typeof request.body === 'string' || Buffer.isBuffer(request.body) ? JSON.parse(request.body.toString()) : request.body;
    if (Buffer.byteLength(JSON.stringify(json)) > 8192) throw new CheckoutError(413, 'body_too_large', 'Os dados enviados excedem o limite permitido.');
    return json;
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 8192) throw new CheckoutError(413, 'body_too_large', 'Os dados enviados excedem o limite permitido.');
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function checkOrigin(request: ApiRequest) {
  if (request.headers['sec-fetch-site'] === 'cross-site') throw new CheckoutError(403, 'invalid_origin', 'Acesse o checkout pelo site do Instituto.');
  const origin = request.headers.origin;
  if (!origin) return;
  const host = request.headers.host;
  try {
    if (new URL(origin).host !== host) throw new Error();
  } catch { throw new CheckoutError(403, 'invalid_origin', 'Acesse o checkout pelo site do Instituto.'); }
}

export function createHandler(getService: () => Service = service) {
  return async function handler(request: ApiRequest, response: ServerResponse) {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store, private');
    response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    try {
      if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        throw new CheckoutError(405, 'method_not_allowed', 'Método não permitido.');
      }
      checkOrigin(request);
      const body = await readJson(request);
      if (!body || typeof body !== 'object' || Array.isArray(body) || !['create', 'status', 'health'].includes(body.action)) throw new CheckoutError(400, 'invalid_action', 'Operação inválida.');
      const checkout = getService();
      if (body.action === 'health') {
        response.statusCode = 200;
        response.end(JSON.stringify(await checkout.health()));
        return;
      }
      const payment = body.action === 'create' ? await checkout.create(body.checkout) : await checkout.status(body.checkoutToken);
      response.statusCode = body.action === 'create' ? 201 : 200;
      response.end(JSON.stringify({payment}));
    } catch (error) {
      const safe = error instanceof CheckoutError ? error : error instanceof SyntaxError ? new CheckoutError(400, 'invalid_json', 'Confira os dados enviados.') : new CheckoutError(500, 'checkout_error', 'Não foi possível concluir a operação. Tente novamente.');
      // Never log upstream response bodies, tokens, certificate material or donor details.
      if (safe.status >= 500) console.error('checkout_failure', {code: safe.code, reference: safe.reference, field: safe.field});
      response.statusCode = safe.status;
      response.end(JSON.stringify({error: {code: safe.code, message: safe.message, ...(safe.reference ? {reference: safe.reference} : {}), ...(safe.field ? {field: safe.field} : {})}}));
    }
  };
}
export default createHandler();

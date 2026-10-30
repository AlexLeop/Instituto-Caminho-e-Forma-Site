import type { IncomingMessage, ServerResponse } from 'node:http';
import { CheckoutError } from '../server/cora/config.ts';
import { checkOrigin, readJson } from './checkout.ts';
import { getSupporterService } from '../server/supporter/service.ts';

const sessionName = 'icf_supporter_session';
const challengeName = 'icf_supporter_challenge';
const cookie = (request: IncomingMessage, name: string) => {
  const value = request.headers.cookie?.split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`))?.slice(name.length + 1);
  return value && /^[A-Za-z0-9_-]+$/.test(value) ? value : undefined;
};
export function createSupporterHandler(getService = getSupporterService, env: NodeJS.ProcessEnv = process.env) {
  return async (request: IncomingMessage & {body?: unknown}, response: ServerResponse) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store, private');
    response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Robots-Tag', 'noindex, nofollow');
    const secure = env.VERCEL === '1' || env.NODE_ENV === 'production';
    const makeCookie = (name: string, value: string, age: number) => `${name}=${value}; Path=/api/supporter; Max-Age=${age}; HttpOnly; SameSite=Strict${secure ? '; Secure' : ''}`;
    try {
      checkOrigin(request);
      if (request.method === 'GET') {
        const page = Number(new URL(request.url ?? '/', 'https://local.invalid').searchParams.get('page') || '1');
        const profile = await getService().profile(cookie(request, sessionName), page);
        response.statusCode = 200; response.end(JSON.stringify({profile})); return;
      }
      if (request.method !== 'POST') {response.setHeader('Allow', 'GET, POST'); throw new CheckoutError(405, 'method_not_allowed', 'Método não permitido.');}
      const body = await readJson(request);
      if (body?.action === 'login') {
        const ip = String(request.headers['x-vercel-forwarded-for'] ?? request.socket.remoteAddress ?? 'unknown').split(',')[0].trim();
        const result = await getService().login(body, ip);
        response.setHeader('Set-Cookie', [makeCookie(sessionName, result.token, 1800), makeCookie(challengeName, '', 0)]);
        response.statusCode = 200; response.end(JSON.stringify({authenticated: true, expiresAt: result.expiresAt})); return;
      }
      if (body?.action === 'request-code') {
        const ip = String(request.headers['x-vercel-forwarded-for'] ?? request.socket.remoteAddress ?? 'unknown').split(',')[0].trim();
        const result = await getService().requestCode(body, ip);
        response.setHeader('Set-Cookie', makeCookie(challengeName, result.challengeId, 600));
        response.statusCode = 200; response.end(JSON.stringify({message: result.message})); return;
      }
      if (body?.action === 'verify-code') {
        const result = await getService().verifyCode(cookie(request, challengeName), body.code);
        response.setHeader('Set-Cookie', [makeCookie(sessionName, result.token, 1800), makeCookie(challengeName, '', 0)]);
        response.statusCode = 200; response.end(JSON.stringify({authenticated: true, expiresAt: result.expiresAt})); return;
      }
      if (body?.action === 'logout') {
        response.setHeader('Set-Cookie', [makeCookie(sessionName, '', 0), makeCookie(challengeName, '', 0)]);
        await getService().logout(cookie(request, sessionName));
        response.statusCode = 200; response.end(JSON.stringify({signedOut: true})); return;
      }
      throw new CheckoutError(400, 'invalid_action', 'Operação inválida.');
    } catch (error) {
      const safe = error instanceof CheckoutError ? error : new CheckoutError(503, 'supporter_unavailable', 'Não foi possível acessar a área do apoiador. Tente novamente.');
      if (safe.status >= 500) console.error('supporter_access_failed', {code: safe.code});
      if (safe.status === 401) response.setHeader('Set-Cookie', makeCookie(sessionName, '', 0));
      response.statusCode = safe.status; response.end(JSON.stringify({error: {code: safe.code, message: safe.message}}));
    }
  };
}
export default createSupporterHandler();

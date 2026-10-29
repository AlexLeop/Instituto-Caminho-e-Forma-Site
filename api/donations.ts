import { createHash, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { CoraClient } from '../server/cora/client.ts';
import { CheckoutError, readCoraConfig } from '../server/cora/config.ts';
import { readDonationReportPage, readDonationSummary, validateReportRange, type ReportBank } from '../server/donations/report.ts';
import { checkOrigin, readJson } from './checkout.ts';
import { getDonationLedger } from '../server/donations/ledger.ts';
import { validateReallocation } from '../server/donations/reallocations.ts';

let cachedBank: {fingerprint: string; bank: CoraClient} | undefined;
function bank() {
  const config = readCoraConfig();
  if (!cachedBank || cachedBank.fingerprint !== config.fingerprint) cachedBank = {fingerprint: config.fingerprint, bank: new CoraClient(config)};
  return cachedBank.bank;
}

export function authorizeDonationReport(authorization: string | undefined, expectedHash: string | undefined) {
  if (!expectedHash || !/^[0-9a-f]{64}$/i.test(expectedHash)) throw new CheckoutError(503, 'report_not_configured', 'O acesso à prestação de contas ainda não foi configurado.');
  const password = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  const supplied = createHash('sha256').update(password.slice(0, 512)).digest();
  if (password.length < 32 || password.length > 512 || !timingSafeEqual(supplied, Buffer.from(expectedHash, 'hex'))) throw new CheckoutError(401, 'report_unauthorized', 'Chave de acesso inválida.');
}

export function createDonationsHandler(getBank: () => ReportBank = bank, env: NodeJS.ProcessEnv = process.env, getLedger = () => getDonationLedger(env)) {
  let summaryCache: {bank: ReportBank; expires: number; data: Awaited<ReturnType<typeof readDonationSummary>>} | undefined;
  let pendingSummary: {bank: ReportBank; promise: ReturnType<typeof readDonationSummary>} | undefined;
  return async (request: IncomingMessage & {body?: unknown}, response: ServerResponse) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store, private');
    response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Robots-Tag', 'noindex, nofollow');
    try {
      if (request.method === 'GET') {
        const currentBank = getBank();
        if (!summaryCache || summaryCache.bank !== currentBank || summaryCache.expires < Date.now()) {
          if (!pendingSummary || pendingSummary.bank !== currentBank) {
            const end = new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
            const ledger = getLedger();
            pendingSummary = {bank: currentBank, promise: (async () => {
              const summary = await readDonationSummary(currentBank, end, ledger);
              return ledger ? await ledger.summary() : summary;
            })()};
          }
          try {summaryCache = {bank: currentBank, expires: Date.now() + 60000, data: await pendingSummary.promise};}
          finally {pendingSummary = undefined;}
        }
        // Only aggregate amounts leave this public endpoint. Never donor or invoice data.
        response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=60');
        response.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=60');
        response.statusCode = 200;
        response.end(JSON.stringify({summary: summaryCache.data}));
        return;
      }
      if (request.method !== 'POST') {
        response.setHeader('Allow', 'GET, POST');
        throw new CheckoutError(405, 'method_not_allowed', 'Método não permitido.');
      }
      checkOrigin(request);
      // Authenticate before parsing the body or accessing any banking data.
      authorizeDonationReport(request.headers.authorization, env.DONATIONS_REPORT_ACCESS_HASH);
      const body = await readJson(request);
      if (body?.action === 'reallocate') {
        const input = validateReallocation(body.movement);
        const ledger = getLedger();
        if (!ledger) throw new CheckoutError(503, 'database_required', 'O banco de dados precisa estar configurado para registrar realocações.');
        const movement = await ledger.reallocate(input);
        response.statusCode = 201;
        response.end(JSON.stringify({movement}));
        return;
      }
      const {start, end} = validateReportRange(body?.start, body?.end);
      const page = body?.page ?? 1;
      if (!Number.isSafeInteger(page) || page < 1 || page > 100) throw new CheckoutError(400, 'invalid_page', 'Página inválida. Reduza o período da consulta.');
      const ledger = getLedger();
      if (body?.action === 'funds') {
        if (!ledger) throw new CheckoutError(503, 'database_required', 'O banco de dados precisa estar configurado para consultar realocações.');
        response.statusCode = 200;
        response.end(JSON.stringify({funds: await ledger.fundReport(start, end, page)}));
        return;
      }
      let report;
      try {report = await readDonationReportPage(getBank(), start, end, page, ledger);}
      catch (error) {if (!ledger) throw error; report = await ledger.report(start, end, page);}
      response.statusCode = 200;
      response.end(JSON.stringify({report}));
    } catch (error) {
      if (request.method === 'GET') {
        try {
          const saved = await getLedger()?.summary();
          if (saved) {response.statusCode = 200; response.end(JSON.stringify({summary: {...saved, isStale: true}})); return;}
        } catch { /* No trusted database snapshot: return an error, never a fabricated zero. */ }
      }
      const safe = error instanceof CheckoutError ? error : new CheckoutError(500, 'report_error', 'Não foi possível consultar os recebimentos. Tente novamente.');
      response.statusCode = safe.status;
      // Logs contain no donor data, submitted password or upstream body.
      if (safe.status >= 500) console.error('donation_report_error', {code: safe.code});
      response.end(JSON.stringify({error: {code: safe.code, message: safe.message}}));
    }
  };
}

export default createDonationsHandler();

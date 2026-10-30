import { createHash, createHmac, randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { CheckoutError, normalizeEnvironmentValue } from '../cora/config.ts';
import { getDonationLedger, type DonationLedger } from '../donations/ledger.ts';
import type { SupporterProfile } from '../../shared/supporter.ts';
import { SUPPORTER_EMAIL_CODE_REQUIRED } from '../../shared/supporterAccess.ts';

interface Challenge {id: string; email: string; eligible: boolean}
export interface SupporterAuth {
  sendCode(email: string): Promise<void>;
  verifyCode(email: string, code: string): Promise<{id: string; email: string}>;
}
const denied = () => new CheckoutError(401, 'invalid_supporter_access', 'Não foi possível confirmar o acesso. Confira o código ou solicite outro.');
const identityDenied = () => new CheckoutError(401, 'invalid_supporter_identity', 'Não foi possível confirmar o acesso. Confira o e-mail e os últimos quatro dígitos do CPF usados na doação.');
export const hashSupporterSession = (value: string) => createHash('sha256').update(value).digest('hex');
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function authProvider(env: NodeJS.ProcessEnv): SupporterAuth {
  // Use a separate client per request. Never share one user's auth session with another.
  const client = createClient(normalizeEnvironmentValue(env.SUPABASE_URL), normalizeEnvironmentValue(env.SUPABASE_SECRET_KEY), {
    auth: {persistSession: false, autoRefreshToken: false, detectSessionInUrl: false},
    global: {fetch: (url, init) => fetch(url, {...init, signal: AbortSignal.timeout(15000)})},
  });
  return {
    async sendCode(email) {
      const {error} = await client.auth.signInWithOtp({email, options: {shouldCreateUser: true}});
      if (error) throw new CheckoutError(503, 'supporter_email_unavailable', 'Não foi possível enviar o código de acesso.');
    },
    async verifyCode(email, token) {
      const {data, error} = await client.auth.verifyOtp({email, token, type: 'email'});
      if (error || !data.user?.email || !data.user.email_confirmed_at || data.user.email.toLowerCase() !== email.toLowerCase()) throw denied();
      return {id: data.user.id, email: data.user.email};
    },
  };
}

export function createSupporterService(ledger: Pick<DonationLedger, 'rpc' | 'environment'>, auth: SupporterAuth, secret: string, requireEmailCode: boolean = SUPPORTER_EMAIL_CODE_REQUIRED) {
  const environment = ledger.environment;
  async function beginLogin(value: any, ip: string) {
    const email = typeof value?.email === 'string' ? value.email.trim().toLowerCase() : '';
    const suffix = value?.documentSuffix;
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof suffix !== 'string' || !/^\d{4}$/.test(suffix)) {
      throw new CheckoutError(400, 'invalid_supporter_input', 'Informe o e-mail usado na doação e os últimos quatro dígitos do CPF.');
    }
    const hash = (purpose: string, data: string) => createHmac('sha256', secret).update(`supporter-v1:${purpose}:${data}`).digest('hex');
    return ledger.rpc<Challenge>('begin_supporter_login', {p_environment: environment, p_email: email, p_suffix: suffix,
      p_email_hash: hash('email', email), p_ip_hash: hash('ip', ip)});
  }
  return {
    async login(value: any, ip: string) {
      if (requireEmailCode) throw new CheckoutError(400, 'supporter_email_code_required', 'Confirme seu acesso com o código enviado por e-mail.');
      const challenge = await beginLogin(value, ip);
      if (!challenge.eligible) throw identityDenied();
      const token = randomBytes(32).toString('base64url');
      try {
        const {expiresAt} = await ledger.rpc<{expiresAt: string}>('complete_supporter_identity_login', {
          p_environment: environment, p_challenge_id: challenge.id, p_session_hash: hashSupporterSession(token),
        });
        return {token, expiresAt};
      } catch (error) {
        if (error instanceof CheckoutError && error.status === 401) throw identityDenied();
        throw error;
      }
    },
    async requestCode(value: any, ip: string) {
      if (!requireEmailCode) throw new CheckoutError(400, 'supporter_email_code_disabled', 'A confirmação por código está desativada. Atualize a página para entrar com e-mail e CPF.');
      const challenge = await beginLogin(value, ip);
      if (challenge.eligible) {
        try {await auth.sendCode(challenge.email);}
        catch {console.error('supporter_email_failed', {code: 'otp_delivery_unavailable'});}
      }
      // Same response for unknown email/CPF, without disclosing who donated.
      return {challengeId: challenge.id, message: 'Se os dados corresponderem a uma doação confirmada, você receberá um código de acesso por e-mail.'};
    },
    async verifyCode(challengeId: string | undefined, code: unknown) {
      if (!requireEmailCode) throw new CheckoutError(400, 'supporter_email_code_disabled', 'A confirmação por código está desativada. Atualize a página para entrar com e-mail e CPF.');
      if (!challengeId || !uuid.test(challengeId) || typeof code !== 'string' || !/^\d{6,10}$/.test(code)) throw denied();
      const challenge = await ledger.rpc<Challenge>('attempt_supporter_challenge', {p_environment: environment, p_id: challengeId});
      if (!challenge.eligible) throw denied();
      const user = await auth.verifyCode(challenge.email, code);
      if (!uuid.test(user.id) || user.email.toLowerCase() !== challenge.email.toLowerCase()) throw denied();
      const token = randomBytes(32).toString('base64url');
      const {expiresAt} = await ledger.rpc<{expiresAt: string}>('complete_supporter_login', {p_environment: environment, p_challenge_id: challengeId,
        p_user_id: user.id, p_verified_email: user.email, p_session_hash: hashSupporterSession(token)});
      return {token, expiresAt};
    },
    async profile(token: string | undefined, page: number) {
      if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) throw new CheckoutError(401, 'invalid_supporter_session', 'Entre para consultar suas doações.');
      if (!Number.isSafeInteger(page) || page < 1 || page > 100) throw new CheckoutError(400, 'invalid_page', 'Página inválida.');
      const profile = await ledger.rpc<SupporterProfile>('supporter_portal', {p_environment: environment, p_session_hash: hashSupporterSession(token), p_page: page});
      if (requireEmailCode && profile.authenticationMethod !== 'email_code') throw denied();
      return profile;
    },
    async logout(token?: string) {
      if (token && /^[A-Za-z0-9_-]{43}$/.test(token)) await ledger.rpc('end_supporter_session', {p_environment: environment, p_session_hash: hashSupporterSession(token)});
    },
  };
}

export function getSupporterService(env: NodeJS.ProcessEnv = process.env) {
  const ledger = getDonationLedger(env);
  const secret = normalizeEnvironmentValue(env.CHECKOUT_SIGNING_SECRET);
  if (!ledger || secret.length < 32) throw new CheckoutError(503, 'supporter_configuration', 'O acesso do apoiador está temporariamente indisponível.');
  return createSupporterService(ledger, authProvider(env), secret);
}

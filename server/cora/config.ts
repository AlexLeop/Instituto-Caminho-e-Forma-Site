import { createHash, createPrivateKey, X509Certificate } from 'node:crypto';

export class CheckoutError extends Error {
  constructor(public status: number, public code: string, message: string, public reference?: string, public field?: string) { super(message); }
}
const unavailable = 'O pagamento está temporariamente indisponível. Entre em contato com o Instituto.';
function configurationError(reference: string, field?: string): never {
  throw new CheckoutError(503, 'configuration_error', unavailable, reference, field);
}

export interface CoraConfig {
  baseUrl: string;
  environment: 'production' | 'stage';
  clientId: string;
  certificate: string;
  privateKey: string;
  signingSecret: string;
  fingerprint: string;
}

// Quotes copied from .env are formatting, not part of a credential.
export function normalizeEnvironmentValue(value: string | undefined): string {
  let text = (value || '').trim();
  for (let i = 0; i < 3; i++) {
    if (text.length < 2) break;
    if (text.startsWith('"') && text.endsWith('"')) {
      try {
        const parsed: unknown = JSON.parse(text);
        if (typeof parsed === 'string') { text = parsed.trim(); continue; }
      } catch { /* A quoted multiline PEM is not necessarily JSON. */ }
      text = text.slice(1, -1).trim();
    } else if (text.startsWith("'") && text.endsWith("'")) text = text.slice(1, -1).trim();
    else break;
  }
  return text;
}

export function normalizePem(value: string | undefined, kind: 'certificate' | 'key'): string {
  let text = normalizeEnvironmentValue(value);
  if (!text) throw new Error('Missing PEM value');
  text = text.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n').replace(/\r/g, '');
  if (!text.includes('-----BEGIN ')) {
    const decoded = Buffer.from(text.replace(/\s/g, ''), 'base64');
    if (decoded.toString('utf8').includes('-----BEGIN ')) return normalizePem(decoded.toString('utf8'), kind);
    if (kind === 'certificate') return new X509Certificate(decoded).toString();
    for (const type of ['pkcs8', 'pkcs1', 'sec1'] as const) {
      try { return createPrivateKey({key: decoded, format: 'der', type}).export({type: 'pkcs8', format: 'pem'}).toString(); } catch { /* Try the next supported format. */ }
    }
    throw new Error('Invalid key encoding');
  }
  return text + (text.endsWith('\n') ? '' : '\n');
}

export function readCoraConfig(env: NodeJS.ProcessEnv = process.env): CoraConfig {
  const environment = normalizeEnvironmentValue(env.CORA_ENVIRONMENT).toLowerCase();
  if (!environment) configurationError('cora_environment_missing', 'CORA_ENVIRONMENT');
  if (environment !== 'production' && environment !== 'stage') configurationError('cora_environment_invalid', 'CORA_ENVIRONMENT');
  const clientId = normalizeEnvironmentValue(env.CORA_CLIENT_ID);
  if (!clientId) configurationError('cora_client_id_missing', 'CORA_CLIENT_ID');
  const signingSecret = normalizeEnvironmentValue(env.CHECKOUT_SIGNING_SECRET);
  if (!signingSecret) configurationError('checkout_signing_secret_missing', 'CHECKOUT_SIGNING_SECRET');
  if (signingSecret.length < 32) configurationError('checkout_signing_secret_too_short', 'CHECKOUT_SIGNING_SECRET');

  // Keep alias precedence: never silently select credentials for a different account.
  const certificateField = normalizeEnvironmentValue(env.CORA_CERTIFICATE_PEM) ? 'CORA_CERTIFICATE_PEM' : 'CERTIFICATE_PEM';
  const keyField = normalizeEnvironmentValue(env.CORA_PRIVATE_KEY) ? 'CORA_PRIVATE_KEY' : 'PRIVATE_KEY';
  if (!normalizeEnvironmentValue(env[certificateField])) configurationError('cora_certificate_missing', certificateField);
  if (!normalizeEnvironmentValue(env[keyField])) configurationError('cora_private_key_missing', keyField);
  let certificate: string;
  let privateKey: string;
  let cert: X509Certificate;
  let parsedKey: ReturnType<typeof createPrivateKey>;
  try {
    certificate = normalizePem(env[certificateField], 'certificate');
    cert = new X509Certificate(certificate);
  } catch { configurationError('cora_certificate_invalid', certificateField); }
  try {
    privateKey = normalizePem(env[keyField], 'key');
    parsedKey = createPrivateKey(privateKey);
  } catch { configurationError('cora_private_key_invalid', keyField); }
  if (!cert.checkPrivateKey(parsedKey)) configurationError('cora_certificate_key_mismatch');
  if (Date.parse(cert.validTo) <= Date.now()) configurationError('cora_certificate_expired', certificateField);
  if (Date.parse(cert.validFrom) > Date.now()) configurationError('cora_certificate_not_yet_valid', certificateField);
  return {
    environment, clientId, certificate, privateKey, signingSecret,
    baseUrl: environment === 'production' ? 'https://matls-clients.api.cora.com.br' : 'https://matls-clients.api.stage.cora.com.br',
    fingerprint: createHash('sha256').update([environment, clientId, certificate, privateKey, signingSecret].join('\0')).digest('hex'),
  };
}

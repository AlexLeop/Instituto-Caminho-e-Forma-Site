import { createHash, createPrivateKey, X509Certificate } from 'node:crypto';

export class CheckoutError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
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

export function normalizePem(value: string | undefined, kind: 'certificate' | 'key'): string {
  if (!value) throw new CheckoutError(503, 'configuration_error', 'O pagamento está temporariamente indisponível. Entre em contato com o Instituto.');
  let text = value.trim().replace(/\\n/g, '\n').replace(/\r/g, '');
  if (!text.includes('-----BEGIN ')) {
    const decoded = Buffer.from(text.replace(/\s/g, ''), 'base64');
    if (decoded.toString('utf8').includes('-----BEGIN ')) text = decoded.toString('utf8');
    else {
      if (kind === 'certificate') return new X509Certificate(decoded).toString();
      for (const type of ['pkcs8', 'pkcs1', 'sec1'] as const) {
        try { return createPrivateKey({key: decoded, format: 'der', type}).export({type: 'pkcs8', format: 'pem'}).toString(); } catch { /* Try the next supported key format. */ }
      }
      throw new Error('Invalid key encoding');
    }
  }
  return text + (text.endsWith('\n') ? '' : '\n');
}

export function readCoraConfig(env: NodeJS.ProcessEnv = process.env): CoraConfig {
  try {
    const environment = env.CORA_ENVIRONMENT;
    if (environment !== 'production' && environment !== 'stage') throw new Error('Set CORA_ENVIRONMENT explicitly');
    const clientId = env.CORA_CLIENT_ID?.trim();
    const signingSecret = env.CHECKOUT_SIGNING_SECRET;
    if (!clientId || !signingSecret || signingSecret.length < 32) throw new Error('Missing client ID or checkout signing secret');
    const certificate = normalizePem(env.CORA_CERTIFICATE_PEM || env.CERTIFICATE_PEM, 'certificate');
    const privateKey = normalizePem(env.CORA_PRIVATE_KEY || env.PRIVATE_KEY, 'key');
    const cert = new X509Certificate(certificate);
    if (!cert.checkPrivateKey(createPrivateKey(privateKey)) || Date.parse(cert.validTo) <= Date.now() || Date.parse(cert.validFrom) > Date.now()) throw new Error('Invalid or expired certificate pair');
    return {
      environment, clientId, certificate, privateKey, signingSecret,
      baseUrl: environment === 'production' ? 'https://matls-clients.api.cora.com.br' : 'https://matls-clients.api.stage.cora.com.br',
      fingerprint: createHash('sha256').update([environment, clientId, certificate, privateKey, signingSecret].join('\0')).digest('hex'),
    };
  } catch {
    throw new CheckoutError(503, 'configuration_error', 'O pagamento está temporariamente indisponível. Entre em contato com o Instituto.');
  }
}

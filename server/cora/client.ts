import https from 'node:https';
import type { CoraConfig } from './config.ts';
import { CheckoutError } from './config.ts';

export interface CoraInvoice {
  id: string;
  code: string;
  status: string;
  total_amount: number;
  total_paid: number;
  created_at?: string;
  occurrence_date?: string;
  customer?: {name?: string; email?: string; document?: {identity?: string}};
  services?: {name?: string; description?: string; amount?: number}[];
  payments?: {id?: string; status?: string; created_at?: string; finalized_at?: string; total_paid?: number; method?: string}[];
  payment_terms?: {due_date?: string};
  pix?: {emv?: string};
  payment_options?: {bank_slip?: {url?: string; digitable?: string; barcode?: string}};
}
export interface CoraInvoicePage {
  totalItems: number;
  items: {id: string; status: string; paid_at?: string; payment_form?: string}[];
}
export interface TransportRequest { method: 'GET' | 'POST'; path: string; headers: Record<string, string>; body?: string }
export interface TransportResponse { status: number; body: any }
export type CoraTransport = (request: TransportRequest) => Promise<TransportResponse>;

export function createTransport(config: CoraConfig): CoraTransport {
  const agent = new https.Agent({cert: config.certificate, key: config.privateKey, minVersion: 'TLSv1.2', keepAlive: true, maxSockets: 10});
  return ({method, path, headers, body}) => new Promise((resolve, reject) => {
    const request = https.request(new URL(path, config.baseUrl), {method, agent, headers: {...headers, Accept: 'application/json', ...(body ? {'Content-Length': String(Buffer.byteLength(body))} : {})}}, response => {
      const chunks: Buffer[] = [];
      let bytes = 0;
      response.on('data', (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > 2 * 1024 * 1024) { response.destroy(); reject(new CheckoutError(502, 'bank_error', 'Não foi possível ler a resposta do banco. Tente novamente.')); }
        else chunks.push(chunk);
      });
      response.on('error', () => reject(new CheckoutError(502, 'bank_error', 'Não foi possível consultar o banco. Tente novamente.')));
      response.on('end', () => {
        try { resolve({status: response.statusCode || 502, body: JSON.parse(Buffer.concat(chunks).toString('utf8'))}); }
        catch { reject(new CheckoutError(502, 'bank_error', 'O banco retornou uma resposta indisponível. Tente novamente.')); }
      });
    });
    // This deadline includes DNS, connection, TLS handshake and response time.
    const deadline = setTimeout(() => request.destroy(new Error('deadline')), 18000);
    request.on('close', () => clearTimeout(deadline));
    request.on('error', () => reject(new CheckoutError(503, 'bank_unavailable', 'Não foi possível concluir a consulta ao banco. Tente novamente com os mesmos dados para evitar uma nova cobrança.')));
    request.end(body);
  });
}

export class CoraClient {
  private token?: {value: string; expiresAt: number};
  private tokenPromise?: Promise<string>;
  constructor(private config: CoraConfig, private transport: CoraTransport = createTransport(config)) {}

  private async accessToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now() + 60000) return this.token.value;
    if (this.tokenPromise) return this.tokenPromise;
    this.tokenPromise = (async () => {
      const result = await this.transport({method: 'POST', path: '/token', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams({grant_type: 'client_credentials', client_id: this.config.clientId}).toString()});
      if (result.status !== 200 || typeof result.body?.access_token !== 'string' || !Number.isFinite(result.body.expires_in) || result.body.expires_in <= 0) {
        throw new CheckoutError(503, 'bank_authentication_error', 'O pagamento está temporariamente indisponível. Entre em contato com o Instituto.');
      }
      this.token = {value: result.body.access_token, expiresAt: Date.now() + result.body.expires_in * 1000};
      return this.token.value;
    })();
    try { return await this.tokenPromise; } finally { this.tokenPromise = undefined; }
  }

  private async authorized<T = CoraInvoice>(request: TransportRequest, validate: (body: any) => boolean = body => typeof body?.id === 'string'): Promise<T> {
    for (let attempt = 0; attempt < 2; attempt++) {
      const token = await this.accessToken();
      const result = await this.transport({...request, headers: {...request.headers, Authorization: `Bearer ${token}`}});
      if (result.status === 401 && attempt === 0) { this.token = undefined; continue; }
      if (result.status >= 200 && result.status < 300) {
        if (validate(result.body)) return result.body;
        throw new CheckoutError(502, 'invalid_bank_response', 'O banco retornou dados incompletos. Tente consultar novamente.');
      }
      if (result.status === 404) throw new CheckoutError(404, 'payment_not_found', 'A cobrança não foi encontrada.');
      if (result.status === 400 || result.status === 422) throw new CheckoutError(422, 'payment_rejected', 'O banco não aceitou os dados da cobrança. Confira nome, e-mail e CPF/CNPJ.');
      if (result.status === 409) throw new CheckoutError(409, 'payment_conflict', 'A cobrança já está sendo processada. Aguarde e tente novamente com os mesmos dados.');
      throw new CheckoutError(503, 'bank_unavailable', 'O banco está indisponível no momento. Tente novamente com os mesmos dados.');
    }
    throw new CheckoutError(503, 'bank_authentication_error', 'O pagamento está temporariamente indisponível.');
  }

  createInvoice(payload: unknown, idempotencyKey: string): Promise<CoraInvoice> {
    return this.authorized({method: 'POST', path: '/v2/invoices/', headers: {'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey}, body: JSON.stringify(payload)});
  }
  async checkConnection() {
    await this.accessToken();
    return {authenticated: true, environment: this.config.environment};
  }
  getInvoice(id: string): Promise<CoraInvoice> {
    return this.authorized({method: 'GET', path: `/v2/invoices/${encodeURIComponent(id)}`, headers: {}});
  }
  listPaidInvoices(start: string, end: string, page: number, perPage = 20): Promise<CoraInvoicePage> {
    const query = new URLSearchParams({state: 'PAID', start, end, page: String(page), perPage: String(perPage)});
    return this.authorized<CoraInvoicePage>({method: 'GET', path: `/v2/invoices/?${query}`, headers: {}}, body =>
      Number.isSafeInteger(body?.totalItems) && body.totalItems >= 0 && Array.isArray(body.items) && body.items.length <= perPage && body.items.every((item: any) => typeof item?.id === 'string' && /^[A-Za-z0-9_-]{8,100}$/.test(item.id)));
  }
}

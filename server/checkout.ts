import { createHmac, timingSafeEqual } from 'node:crypto';
import QRCode from 'qrcode';
import { PROJECTS } from '../src/data/mockData.ts';
import { validDocument } from '../shared/checkout.ts';
import type { CheckoutInput, CheckoutPayment, PaymentStatus, PaymentMethod } from '../shared/checkout.ts';
import { CheckoutError } from './cora/config.ts';
import type { CoraInvoice } from './cora/client.ts';

const projects = new Map([['geral', 'Fundo Geral de Acolhimento Comunitário'], ...PROJECTS.map(p => [p.id, p.title] as [string, string])]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const invoiceId = /^[A-Za-z0-9_-]{8,100}$/;
const statuses = new Set(['DRAFT', 'OPEN', 'IN_PAYMENT', 'PAID', 'LATE', 'CANCELLED']);
interface Claims {id: string; code: string; amount: number; method: PaymentMethod; projectId: string; dueDate: string; exp: number; environment: string}
interface Bank {createInvoice(payload: unknown, key: string): Promise<CoraInvoice>; getInvoice(id: string): Promise<CoraInvoice>}

function invalid(message: string): never { throw new CheckoutError(400, 'invalid_input', message); }

export function validateCheckout(value: any, now = Date.now()): CheckoutInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid('Confira os dados da doação.');
  if (!Number.isSafeInteger(value.amountCents) || value.amountCents < 500 || value.amountCents > 5000000) invalid('Informe um valor entre R$ 5,00 e R$ 50.000,00.');
  if (value.method !== 'pix' && value.method !== 'boleto') invalid('Escolha Pix ou boleto para pagar.');
  if (value.frequency !== 'single') invalid('Este checkout recebe doações únicas.');
  if (typeof value.projectId !== 'string' || !projects.has(value.projectId)) invalid('Selecione um projeto válido.');
  if (typeof value.idempotencyKey !== 'string' || !uuid.test(value.idempotencyKey)) invalid('Atualize a página e tente novamente.');
  const issued = typeof value.issuedAt === 'string' ? Date.parse(value.issuedAt) : NaN;
  if (!Number.isFinite(issued) || issued > now + 5 * 60000 || issued < now - 24 * 3600000) invalid('A tentativa expirou. Confira se já existe uma cobrança antes de iniciar outra doação.');
  const customer = value.customer;
  if (!customer || typeof customer !== 'object' || typeof customer.name !== 'string' || typeof customer.email !== 'string' || typeof customer.document !== 'string') invalid('Informe nome, e-mail e CPF/CNPJ.');
  const name = customer.name.trim().replace(/\s+/g, ' ');
  const email = customer.email.trim();
  const document = customer.document.replace(/[.\-/\s]/g, '');
  if (name.length < 3 || name.length > 60 || /[\x00-\x1f\x7f]/.test(name)) invalid('Informe um nome com 3 a 60 caracteres.');
  if (email.length > 60 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid('Informe um e-mail válido com até 60 caracteres.');
  if (!validDocument(document)) invalid('Informe um CPF ou CNPJ válido.');
  return {amountCents: value.amountCents, method: value.method, frequency: 'single', projectId: value.projectId, customer: {name, email, document}, idempotencyKey: value.idempotencyKey, issuedAt: new Date(issued).toISOString()};
}

export function invoicePayload(input: CheckoutInput) {
  const dueDate = new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date(Date.parse(input.issuedAt) + 3 * 86400000));
  return {
    code: `icf-${input.idempotencyKey}`,
    customer: {name: input.customer.name, email: input.customer.email, document: {identity: input.customer.document, type: input.customer.document.length === 11 ? 'CPF' : 'CNPJ'}},
    services: [{name: 'Doação ao Instituto Caminho e Forma', description: `Apoio: ${projects.get(input.projectId)}`.slice(0, 100), amount: input.amountCents}],
    payment_terms: {due_date: dueDate},
    payment_forms: input.method === 'pix' ? ['PIX'] : ['BANK_SLIP', 'PIX'],
    notification: {name: input.customer.name, channels: [{channel: 'EMAIL', contact: input.customer.email, rules: ['NOTIFY_WHEN_PAID']}]},
  };
}

export function signCheckout(claims: Claims, secret: string): string {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signature = createHmac('sha256', secret).update(`icf-checkout-v1.${payload}`).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyCheckout(token: unknown, secret: string, environment: string, now = Date.now()): Claims {
  const denied = () => new CheckoutError(403, 'invalid_checkout', 'A sessão desta cobrança expirou ou é inválida. Entre em contato com o Instituto se já tiver pago.');
  try {
    if (typeof token !== 'string' || token.length > 2048) throw denied();
    const parts = token.split('.');
    if (parts.length !== 2 || !parts.every(p => /^[A-Za-z0-9_-]+$/.test(p))) throw denied();
    const expected = createHmac('sha256', secret).update(`icf-checkout-v1.${parts[0]}`).digest();
    const supplied = Buffer.from(parts[1], 'base64url');
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) throw denied();
    const claims = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')) as Claims;
    if (!invoiceId.test(claims.id) || claims.environment !== environment || !Number.isFinite(claims.exp) || claims.exp <= now || !Number.isSafeInteger(claims.amount) || claims.amount < 500 || !projects.has(claims.projectId) || !['pix', 'boleto'].includes(claims.method) || !/^icf-[0-9a-f-]{36}$/i.test(claims.code)) throw denied();
    return claims;
  } catch { throw denied(); }
}

function httpsUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}

export function createCheckoutService(bank: Bank, secret: string, environment: string, now = () => Date.now()) {
  async function present(invoice: CoraInvoice, claims: Claims, token: string): Promise<CheckoutPayment> {
    if (invoice.id !== claims.id || invoice.code !== claims.code || invoice.total_amount !== claims.amount || !statuses.has(invoice.status) || !Number.isSafeInteger(invoice.total_paid) || invoice.total_paid < 0) throw new CheckoutError(502, 'invalid_bank_response', 'Não foi possível validar a cobrança com o banco. Tente consultar novamente.');
    const paid = invoice.status === 'PAID' && invoice.total_paid >= claims.amount;
    const pixCode = typeof invoice.pix?.emv === 'string' && invoice.pix.emv.length <= 4096 ? invoice.pix.emv : null;
    return {
      id: invoice.id, status: (invoice.status === 'PAID' && !paid ? 'IN_PAYMENT' : invoice.status) as PaymentStatus,
      paid, amountCents: claims.amount, paidCents: invoice.total_paid, method: claims.method,
      projectId: claims.projectId, projectTitle: projects.get(claims.projectId)!, dueDate: claims.dueDate,
      pixCode, qrCodeDataUrl: pixCode ? await QRCode.toDataURL(pixCode, {width: 320, margin: 4, errorCorrectionLevel: 'M'}) : null,
      boletoUrl: claims.method === 'boleto' ? httpsUrl(invoice.payment_options?.bank_slip?.url) : null,
      boletoLine: claims.method === 'boleto' && typeof invoice.payment_options?.bank_slip?.digitable === 'string' ? invoice.payment_options.bank_slip.digitable : null,
      checkoutToken: token, expiresAt: claims.exp,
    };
  }
  return {
    async create(value: unknown) {
      const input = validateCheckout(value, now());
      const payload = invoicePayload(input);
      const invoice = await bank.createInvoice(payload, input.idempotencyKey);
      if (!invoiceId.test(invoice.id)) throw new CheckoutError(502, 'invalid_bank_response', 'O banco não retornou o identificador da cobrança. Tente novamente com os mesmos dados.');
      const claims: Claims = {id: invoice.id, code: payload.code, amount: input.amountCents, method: input.method, projectId: input.projectId, dueDate: payload.payment_terms.due_date, exp: Date.parse(input.issuedAt) + 7 * 86400000, environment};
      return present(invoice, claims, signCheckout(claims, secret));
    },
    async status(token: unknown) {
      const claims = verifyCheckout(token, secret, environment, now());
      return present(await bank.getInvoice(claims.id), claims, token as string);
    },
  };
}

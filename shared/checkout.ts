export type PaymentMethod = 'pix' | 'boleto';
export type PaymentStatus = 'DRAFT' | 'OPEN' | 'IN_PAYMENT' | 'PAID' | 'LATE' | 'CANCELLED';

export interface CheckoutInput {
  amountCents: number;
  method: PaymentMethod;
  frequency: 'single';
  projectId: string;
  customer: { name: string; email: string; document: string };
  idempotencyKey: string;
  issuedAt: string;
}

export interface CheckoutPayment {
  id: string;
  status: PaymentStatus;
  paid: boolean;
  amountCents: number;
  paidCents: number;
  method: PaymentMethod;
  projectId: string;
  projectTitle: string;
  dueDate: string;
  pixCode: string | null;
  qrCodeDataUrl: string | null;
  boletoUrl: string | null;
  boletoLine: string | null;
  checkoutToken: string;
  expiresAt: number;
}

export function parseAmount(value: string): number {
  const match = value.trim().match(/^(\d{1,6})(?:[.,](\d{1,2}))?$/);
  return match ? Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0')) : NaN;
}

export function validDocument(value: string): boolean {
  const digits = value.replace(/[.\-/\s]/g, '');
  if (!/^\d{11}$|^\d{14}$/.test(digits) || /^(\d)\1+$/.test(digits)) return false;
  const check = (base: string, weights: number[]) => {
    const rest = [...base].reduce((sum, n, i) => sum + Number(n) * weights[i], 0) % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  if (digits.length === 11) {
    return check(digits.slice(0, 9), [10,9,8,7,6,5,4,3,2]) === Number(digits[9]) &&
      check(digits.slice(0, 10), [11,10,9,8,7,6,5,4,3,2]) === Number(digits[10]);
  }
  return check(digits.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2]) === Number(digits[12]) &&
    check(digits.slice(0, 13), [6,5,4,3,2,9,8,7,6,5,4,3,2]) === Number(digits[13]);
}

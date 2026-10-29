import { csvCell } from './donationReports.ts';

export interface SupporterDonation {
  id: string;
  createdAt: string | null;
  paidOn: string | null;
  status: string;
  amountCents: number;
  paidCents: number;
  destinationTitle: string;
  method: string;
}
export interface SupporterProfile {
  name: string;
  email: string;
  documentSuffix: string;
  expiresAt: string;
  totalCents: number;
  donationCount: number;
  donations: SupporterDonation[];
  nextPage: number | null;
}
export function supporterStatementCsv(records: SupporterDonation[]) {
  const money = (cents: number) => (cents / 100).toFixed(2).replace('.', ',');
  return '\uFEFF' + [
    ['Referência', 'Emissão', 'Pagamento', 'Situação na Cora', 'Destino da doação', 'Valor cobrado (R$)', 'Valor recebido (R$)', 'Forma de pagamento'],
    ...records.map(record => [record.id, record.createdAt, record.paidOn, record.status, record.destinationTitle, money(record.amountCents), money(record.paidCents), record.method]),
  ].map(row => row.map(csvCell).join(';')).join('\r\n');
}

import { csvCell } from './donationReports.ts';

export interface FundMovement {
  id: string;
  sourceId: string;
  sourceTitle: string;
  destinationId: string;
  destinationTitle: string;
  amountCents: number;
  responsible: string;
  reason: string;
  createdAt: string;
  reversalOf: string | null;
  periodStart?: string;
  periodEnd?: string;
}
export interface FundBalance {
  destinationId: string;
  receivedCents: number;
  incomingCents: number;
  outgoingCents: number;
  allocatedCents: number;
  availableCents: number;
}
export interface FundReport {
  balances: FundBalance[];
  movements: FundMovement[];
  nextPage: number | null;
  generatedAt: string;
}
export interface ReallocationInput {
  start: string;
  end: string;
  id: string;
  sourceId: string;
  destinationId: string;
  amountCents: number;
  responsible: string;
  reason: string;
  reversalOf?: string;
}
export function fundMovementsCsv(records: FundMovement[]) {
  const rows = [
    ['Referência', 'Data de registro', 'Tipo', 'Origem', 'Destino', 'Valor (R$)', 'Responsável informado', 'Motivo', 'Estorno de', 'Período inicial dos recursos', 'Período final dos recursos'],
    ...records.map(record => [record.id, record.createdAt, record.reversalOf ? 'Estorno' : 'Realocação', record.sourceTitle, record.destinationTitle,
      (record.amountCents / 100).toFixed(2).replace('.', ','), record.responsible, record.reason, record.reversalOf, record.periodStart ?? null, record.periodEnd ?? null]),
  ];
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n');
}

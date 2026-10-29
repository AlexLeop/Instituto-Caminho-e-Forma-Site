export interface DonationRecord {
  id: string;
  source: 'cora' | 'externo';
  createdAt: string | null;
  paidOn: string | null;
  donorName: string;
  donorEmail: string;
  maskedDocument: string;
  amountCents: number;
  paidCents: number;
  method: string;
  destinationId: string | null;
  destinationTitle: string;
  originalDescription: string;
  reconciliationNote: string;
  included: boolean;
}

export interface DonationSummary {
  isStale?: boolean;
  generalFundCents: number;
  eadCoursesCents: number;
  projectsCents: number;
  unassignedCents: number;
  totalCents: number;
  byDestination: Record<string, number>;
  updatedAt: string;
}

export interface DonationReportPage {
  isStale?: boolean;
  records: DonationRecord[];
  manualRecords: DonationRecord[];
  nextPage: number | null;
  ignoredBankInvoices: number;
  generatedAt: string;
}

export function summarizeDonations(records: DonationRecord[]): DonationSummary {
  const byDestination: Record<string, number> = {};
  let totalCents = 0;
  for (const record of new Map(records.map(record => [record.id, record])).values()) {
    if (!record.included) continue;
    totalCents += record.paidCents;
    const key = record.destinationId ?? 'nao-identificado';
    byDestination[key] = (byDestination[key] ?? 0) + record.paidCents;
  }
  const generalFundCents = byDestination.geral ?? 0;
  const eadCoursesCents = byDestination['cursos-ead'] ?? 0;
  const unassignedCents = byDestination['nao-identificado'] ?? 0;
  return {generalFundCents, eadCoursesCents, unassignedCents,
    projectsCents: totalCents - generalFundCents - eadCoursesCents - unassignedCents,
    totalCents, byDestination, updatedAt: new Date().toISOString()};
}

const csvCell = (value: string | number | null) => {
  let text = String(value ?? '');
  if (/^[\s\uFEFF]*[=+\-@]/u.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};

export function donationRecordsCsv(records: DonationRecord[]) {
  const money = (cents: number) => (cents / 100).toFixed(2).replace('.', ',');
  const rows: (string | number | null)[][] = [
    ['Referência', 'Origem', 'Emissão', 'Pagamento', 'Doador', 'E-mail', 'Documento mascarado', 'Valor cobrado (R$)', 'Valor recebido (R$)', 'Forma', 'ID destino conciliado', 'Destino conciliado', 'Descrição original Cora', 'Conciliação / observação', 'Computar como doação'],
    ...records.map(record => [record.id, record.source, record.createdAt, record.paidOn, record.donorName, record.donorEmail, record.maskedDocument,
      money(record.amountCents), money(record.paidCents), record.method, record.destinationId, record.destinationTitle,
      record.originalDescription, record.reconciliationNote, record.included ? 'Sim' : 'Não']),
  ];
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n');
}

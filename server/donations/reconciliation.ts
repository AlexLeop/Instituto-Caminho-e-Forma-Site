import type { DonationRecord } from '../../shared/donationReports.ts';

// Corrections confirmed by the Institute on 29/10/2026. Preserve bank originals.
export const DONATION_RECONCILIATION: Record<string, {destinationId?: string; excluded?: boolean; note: string}> = {
  inv_J3SYxHB4TRKIm1exonuApw: {
    destinationId: 'cursos-ead',
    note: 'Instituto confirmou em 29/10/2026: R$ 550 destinados aos cursos EAD. Cobrança original registrada como fundo geral.',
  },
  inv_Z7ulab2OQ4ClFR7OTcCBkA: {
    excluded: true,
    note: 'Instituto confirmou em 29/10/2026: pagamento de R$ 30 realizado como teste. Excluído da arrecadação; recebimento bancário preservado.',
  },
};

export const MANUAL_DONATIONS: DonationRecord[] = [{
  id: 'manual-fundo-geral-166', source: 'externo', createdAt: null, paidOn: null,
  donorName: 'Não informado', donorEmail: '', maskedDocument: '', amountCents: 16600, paidCents: 16600,
  method: 'Não informada', destinationId: 'geral', destinationTitle: 'Fundo Geral de Acolhimento Comunitário',
  originalDescription: '', included: true,
  reconciliationNote: 'R$ 166 recebidos fora do checkout, conforme confirmação do Instituto em 29/10/2026. Data, doador e comprovante ainda não informados. Não somar novamente como cobrança Cora.',
}];

import { findDonationDestination } from '../../shared/donationDestinations.ts';
import type { ReallocationInput } from '../../shared/fundMovements.ts';
import { CheckoutError } from '../cora/config.ts';
import { validateReportRange } from './report.ts';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validateReallocation(value: any): ReallocationInput {
  const invalid = (message: string): never => {throw new CheckoutError(400, 'invalid_reallocation', message);};
  if (!value || typeof value !== 'object' || Array.isArray(value) || !uuid.test(value.id)) invalid('Atualize os dados da realocação e tente novamente.');
  if (!findDonationDestination(value.sourceId) || !findDonationDestination(value.destinationId) || value.sourceId === value.destinationId) invalid('Escolha projetos de origem e destino diferentes.');
  if (!Number.isSafeInteger(value.amountCents) || value.amountCents < 1 || value.amountCents > 2147483647) invalid('Informe um valor válido para a realocação.');
  const responsible = typeof value.responsible === 'string' ? value.responsible.trim().replace(/\s+/g, ' ') : '';
  const reason = typeof value.reason === 'string' ? value.reason.trim() : '';
  if (responsible.length < 3 || responsible.length > 120 || /[\x00-\x1f\x7f]/.test(responsible)) invalid('Informe o nome do responsável, com 3 a 120 caracteres.');
  if (reason.length < 10 || reason.length > 1000 || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(reason)) invalid('Explique o motivo da realocação, com 10 a 1.000 caracteres.');
  if (value.reversalOf !== undefined && !uuid.test(value.reversalOf)) invalid('A referência do estorno é inválida.');
  const {start, end} = validateReportRange(value.start, value.end);
  return {start, end, id: value.id, sourceId: value.sourceId, destinationId: value.destinationId, amountCents: value.amountCents, responsible, reason, ...(value.reversalOf ? {reversalOf: value.reversalOf} : {})};
}

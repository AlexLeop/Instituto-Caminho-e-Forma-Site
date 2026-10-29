import { PROJECTS } from './mockData';

// Last verified reconciliation, 29/10/2026. Fallback only; the site refreshes from Cora.
// General fund: R$ 166 outside checkout + R$ 100 Cora. R$ 30 test excluded.
const generalFundCents = 26600;
const eadCoursesCents = 55000;
const projectsCents = PROJECTS.reduce((total, project) => total + Math.round(project.raisedAmount * 100), 0);

export const DONATION_TOTALS = {
  generalFundCents,
  eadCoursesCents,
  projectsCents,
  totalCents: generalFundCents + eadCoursesCents + projectsCents,
  unassignedCents: 0,
  byDestination: {geral: generalFundCents, 'cursos-ead': eadCoursesCents} as Record<string, number>,
  updatedAt: '2026-10-29T00:00:00-03:00',
};

export const formatDonationAmount = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

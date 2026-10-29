import { PROJECTS } from './mockData';

// Recebimentos informados pelo Instituto, separados pela destinação da doação.
const generalFundCents = 16600;
const eadCoursesCents = 55000;
const projectsCents = PROJECTS.reduce((total, project) => total + Math.round(project.raisedAmount * 100), 0);

export const DONATION_TOTALS = {
  generalFundCents,
  eadCoursesCents,
  projectsCents,
  totalCents: generalFundCents + eadCoursesCents + projectsCents,
};

export const formatDonationAmount = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

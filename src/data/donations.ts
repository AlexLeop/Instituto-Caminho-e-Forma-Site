import { PROJECTS } from './mockData';

// Recebimento no fundo geral informado pelo Instituto, sem vínculo com um projeto.
const generalFundCents = 16600;
const projectsCents = PROJECTS.reduce((total, project) => total + Math.round(project.raisedAmount * 100), 0);

export const DONATION_TOTALS = {
  generalFundCents,
  projectsCents,
  totalCents: generalFundCents + projectsCents,
};

export const formatDonationAmount = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

import { PROJECTS } from '../src/data/mockData.ts';

export const DONATION_DESTINATIONS = [
  {id: 'geral', title: 'Fundo Geral de Acolhimento Comunitário'},
  {id: 'cursos-ead', title: 'Cursos EAD'},
  ...PROJECTS.map(({id, title}) => ({id, title})),
].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', {sensitivity: 'base'}));

const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();

export function filterDonationDestinations(query: string) {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return DONATION_DESTINATIONS.filter(destination => words.every(word => normalizeSearch(destination.title).includes(word)));
}

export function findDonationDestination(value?: string) {
  return DONATION_DESTINATIONS.find(destination => destination.id === value || destination.title === value);
}

// Keep the stable identifier first: the bank limits descriptions to 100 characters.
export function donationDescription(id: string) {
  const destination = findDonationDestination(id);
  if (!destination) throw new Error('Destino inválido.');
  return `Destino [${id}]: ${destination.title}`.slice(0, 100);
}

export function destinationFromDescription(description: string) {
  const id = description.match(/^Destino \[([a-z0-9-]+)\]: /)?.[1];
  if (id) return findDonationDestination(id);
  // Recover invoices emitted before destination identifiers were introduced.
  if (description.startsWith('Apoio: ')) return findDonationDestination(description.slice(7));
  return undefined;
}

export interface TransparencyDocument {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  publishedDate: string;
  fileSize: string;
  year: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  downloadUrl?: string;
}

export const TRANSPARENCY_DOCUMENTS: TransparencyDocument[] = [
  {
    id: 'estatuto-2026',
    title: 'Estatuto Social Atualizado e Ata de Eleição do Conselho (2026-2029)',
    category: 'institucional',
    categoryLabel: 'Estatuto e Atas',
    description: 'Estatuto social e ata de eleição do conselho do Instituto Caminho e Forma.',
    publishedDate: '2026-2029',
    fileSize: 'Arquivo em preparação',
    year: '2026',
    icon: 'gavel',
    iconBg: 'bg-stone-100',
    iconColor: 'text-[#191c1e]',
  },
];

export type NavPage = 
  | 'inicio' 
  | 'projetos' 
  | 'cursos-e-capacitacao' 
  | 'feira-virtual' 
  | 'seja-parceiro' 
  | 'contato' 
  | 'transparencia'
  | 'portal-do-apoiador';

export interface Course {
  id: string;
  title: string;
  category: 'tech' | 'gastro' | 'crafts' | 'business';
  categoryLabel: string;
  mode: 'presencial' | 'semipresencial';
  modeLabel: string;
  image: string;
  badge?: string;
  badgeType?: 'hot' | 'open' | 'forming';
  description: string;
  hours: string;
  shift: string;
  requirementOrDetail: {
    label: string;
    value: string;
  };
  startDate: string;
  investment: string;
}

export interface MarketProduct {
  id: string;
  title: string;
  category: 'decoracao' | 'moda' | 'alimentos' | 'hortifruti' | 'cestas';
  categoryTag: string;
  categoryTagType: 'primary' | 'secondary';
  badge: string;
  image: string;
  producer: string;
  producerRole: string;
  producerIcon: string;
  price: number;
  priceFormatted: string;
  description: string;
  repassePercent: number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  categoryTagType: 'primary' | 'secondary' | 'tertiary';
  image: string;
  progressPercent: number;
  description: string;
  raisedAmount: number;
  goalAmount: number;
  impactBeneficiaries: string;
  status: 'Ativo' | 'Fase Final' | 'Planejamento';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  badge?: string;
}

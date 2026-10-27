export type NavPage = 
  | 'inicio' 
  | 'projetos' 
  | 'detalhes-projeto'
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

export interface ProjectEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  badge?: string;
}

export interface ProjectTeacher {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  badge?: string;
}

export interface ProjectPhoto {
  url: string;
  caption: string;
  objectPosition?: string;
}

export interface ProjectMilestone {
  number: string;
  label: string;
  sublabel: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  categoryTagType: 'primary' | 'secondary' | 'tertiary';
  image: string;
  progressPercent: number;
  showAuditBadge?: boolean;
  imagePosition?: string;
  description: string;
  raisedAmount: number;
  goalAmount: number;
  impactBeneficiaries: string;
  status: 'Ativo' | 'Fase Final' | 'Planejamento';
  // Rich page details
  location?: string;
  startDate?: string;
  fullStory?: {
    problem: string;
    solution: string;
    methodology: string;
  };
  gallery?: ProjectPhoto[];
  galleryIsIllustrative?: boolean;
  events?: ProjectEvent[];
  teachers?: ProjectTeacher[];
  beneficiaryStory?: {
    name: string;
    role?: string;
    avatar: string;
    quote: string;
    story: string;
  };
  milestones?: ProjectMilestone[];
  budgetAllocation?: { label: string; percent: number; color: string }[];
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

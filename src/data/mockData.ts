import type { Course, MarketProduct, Project, Testimonial } from '../types.ts';

export const HERO_IMAGE = '/hero/capa.jpeg';
export const ABOUT_IMAGE = '/equipe/Pastor Jorge Antônio Ramos.jpg';
export const LOGO_IMAGE = '/logo-instituto.png';
export const TECH_COURSE_BANNER = '/cursos/informatica-para-todos/capa.png';
export const MARKET_HERO_IMAGE = '/feira/hero.jpg';
export const CLEUSA_PORTRAIT = '/feira/cleusa.jpg';

export interface HeroSlide {
  id: string;
  url: string;
  alt: string;
  contextTag: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-ballet',
    url: '/hero/capa.jpeg',
    alt: 'Alunas do Ballet Infantil na sede do Instituto Caminho e Forma',
    contextTag: 'Dança & Expressão Cultural'
  },
  {
    id: 'hero-mostra-danca',
    url: '/hero/WhatsApp Image 2026-10-25 at 13.30.08 (3).jpeg',
    alt: 'Apresentação cultural e dança dos jovens do Instituto',
    contextTag: 'Arte, Cultura & Movimento'
  },
  {
    id: 'hero-dancas-urbanas',
    url: '/hero/WhatsApp Image 2026-10-25 at 13.30.08 (4).jpeg',
    alt: 'Oficinas de Danças Urbanas e ritmo promovendo protagonismo juvenil',
    contextTag: 'Juventude & Protagonismo'
  },
  {
    id: 'hero-sede-oficinas',
    url: '/hero/WhatsApp Image 2026-10-25 at 13.34.04.jpeg',
    alt: 'Práticas corporais e momentos de integração na sede do Instituto',
    contextTag: 'Convivência Comunitária'
  },
  {
    id: 'hero-sede-solidaria',
    url: '/hero/WhatsApp Image 2026-10-25 at 13.34.10 (1).jpeg',
    alt: 'Solidariedade, acolhimento socioassistencial e apoio às famílias de Itaguaí',
    contextTag: 'Solidariedade & Acolhimento'
  }
];

export const COURSES: Course[] = [
  {
    id: 'empreendedorismo',
    title: 'Empreendedorismo & Gestão de Pequenos Negócios',
    category: 'business',
    categoryLabel: 'Empreendedorismo',
    mode: 'presencial',
    modeLabel: 'Presencial na Sede',
    image: '/cursos/empreendedorismo/capa.png',
    badge: 'Inscrições Abertas',
    badgeType: 'hot',
    description: 'Capacitação prática em criação de modelos de negócios, precificação, marketing digital para redes sociais e formalização MEI para empreendedores comunitários.',
    hours: '60 Horas',
    shift: 'Noturno (19h - 22h)',
    requirementOrDetail: {
      label: 'Público',
      value: 'Jovens e Adultos'
    },
    startDate: 'Próxima Turma',
    investment: 'Gratuito / Contribuição Social Voluntária'
  },
  {
    id: 'eletricista-predial',
    title: 'Eletricista Predial e Residencial',
    category: 'crafts',
    categoryLabel: 'Elétrica & Infraestrutura',
    mode: 'presencial',
    modeLabel: 'Presencial na Sede',
    image: '/cursos/eletricista-predial/capa.png',
    badge: 'Alta Empregabilidade',
    badgeType: 'hot',
    description: 'Formação técnica completa em instalações elétricas monofásicas e bifásicas, circuitos residenciais, quadros de disjuntores e noções fundamentais de segurança NR-10.',
    hours: '80 Horas',
    shift: 'Sábados (08h - 13h)',
    requirementOrDetail: {
      label: 'Prática',
      value: 'Bancada com Ferramental'
    },
    startDate: 'Próxima Turma',
    investment: 'Gratuito / Contribuição Social Voluntária'
  },
  {
    id: 'informatica-para-todos',
    title: 'Informática para Todos & Inclusão Digital',
    category: 'tech',
    categoryLabel: 'Tecnologia Básica',
    mode: 'presencial',
    modeLabel: 'Presencial na Sede',
    image: '/cursos/informatica-para-todos/capa.png',
    badge: 'Aberto à Comunidade',
    badgeType: 'hot',
    description: 'Curso introdutório e intermediário em sistemas operacionais, navegação segura na internet, digitação, pacote Office/Google Docs e serviços digitais de cidadania (Gov.br, Carteira de Trabalho Digital).',
    hours: '40 Horas',
    shift: 'Manhã ou Tarde',
    requirementOrDetail: {
      label: 'Estrutura',
      value: 'Laboratório de PCs'
    },
    startDate: 'Turmas Contínuas',
    investment: 'Gratuito / Contribuição Social Voluntária'
  },
  {
    id: 'conserto-celular',
    title: 'Conserto e Manutenção de Celulares e Smartphones',
    category: 'tech',
    categoryLabel: 'Tecnologia Aplicada',
    mode: 'presencial',
    modeLabel: 'Presencial na Sede',
    image: '/cursos/conserto-celular/capa.png',
    badge: 'Renda Rápida',
    badgeType: 'hot',
    description: 'Aprenda do zero a troca de telas touch, troca de conectores de carga, substituição de baterias, testes com multímetro, desoxidação e reinstalação de software Android/iOS.',
    hours: '60 Horas',
    shift: 'Terças e Quintas (19h - 21h30)',
    requirementOrDetail: {
      label: 'Metodologia',
      value: 'Prática em Bancada'
    },
    startDate: 'Próxima Turma',
    investment: 'Gratuito / Contribuição Social Voluntária'
  },
  {
    id: 'conserto-computadores',
    title: 'Manutenção e Conserto de Computadores e Notebooks',
    category: 'tech',
    categoryLabel: 'Hardware & TI',
    mode: 'presencial',
    modeLabel: 'Presencial na Sede',
    image: '/cursos/conserto-computadores/capa.png',
    badge: 'Formação Completa',
    badgeType: 'hot',
    description: 'Diagnóstico avançado de falhas em placas-mãe, montagem e desmontagem completa de desktops e notebooks, formatação de SSDs, configuração de BIOS/UEFI e limpeza preventiva.',
    hours: '70 Horas',
    shift: 'Segundas e Quartas (19h - 21h30)',
    requirementOrDetail: {
      label: 'Certificado',
      value: 'Técnico de Suporte'
    },
    startDate: 'Próxima Turma',
    investment: 'Gratuito / Contribuição Social Voluntária'
  }
];

export const TEACHERS = [
  {
    id: 'mariana',
    name: 'Mariana Vasconcelos',
    role: 'Engenheira de Software & Mentora Tech',
    avatar: '/professores/mariana.jpg',
    quote: 'Ver um jovem periférico subindo seu primeiro site no ar e conquistando seu primeiro estágio é o que me move todos os fins de semana.',
    badge: 'Voluntária há 3 anos'
  },
  {
    id: 'carlos',
    name: 'Chef Carlos Eduardo',
    role: 'Mestre Padeiro & Consultor',
    avatar: '/professores/carlos.jpg',
    quote: 'Ensinar o ofício do trigo é devolver autonomia. Nossos alunos saem da sala vendendo para os vizinhos e abrindo seus próprios pontos.',
    badge: 'Voluntário há 5 anos'
  },
  {
    id: 'beatriz',
    name: 'Beatriz Mendonça',
    role: 'Estilista & Especialista em Upcycling',
    avatar: '/professores/beatriz.jpg',
    quote: 'A costura é ferramenta de libertação feminina e geração de renda imediata com baixo investimento inicial e alta criatividade.',
    badge: 'Voluntária há 2 anos'
  }
];

export const MARKET_PRODUCTS: MarketProduct[] = [
  {
    id: 'cesta-agroecologica',
    title: 'Cesta Agroecológica da Horta Comunitária',
    category: 'hortifruti',
    categoryTag: 'Hortifruti & Cestas',
    categoryTagType: 'secondary',
    badge: 'Colheita Semanal',
    image: '/feira/cesta-agroecologica.jpg',
    producer: 'Coletivo Terra Viva',
    producerRole: 'Agricultores Familiares',
    producerIcon: 'eco',
    price: 45.0,
    priceFormatted: 'R$ 45,00',
    description: 'Frutas, verduras frescas e legumes cultivados sem agrotóxicos pelas famílias moradoras do entorno do projeto Terra Viva.',
    repassePercent: 100
  },
  {
    id: 'ecobag-bordada',
    title: 'Bolsa Ecobag Bordada à Mão',
    category: 'moda',
    categoryTag: 'Moda & Acessórios',
    categoryTagType: 'primary',
    badge: 'Feito à Mão',
    image: '/feira/ecobag-bordada.jpg',
    producer: 'Dona Cleusa (Costura Criativa)',
    producerRole: 'Costureira do Núcleo Leste',
    producerIcon: 'person',
    price: 38.0,
    priceFormatted: 'R$ 38,00',
    description: 'Feita com tecido 100% algodão cru sustentável pelas alunas da oficina de costura. Cada peça traz pontos únicos de bordado livre.',
    repassePercent: 100
  },
  {
    id: 'geleias-artesanais',
    title: 'Kit de Geléias da Estação (Amora & Pimenta)',
    category: 'alimentos',
    categoryTag: 'Alimentos Artesanais',
    categoryTagType: 'secondary',
    badge: 'Sem Conservantes',
    image: '/feira/geleias-artesanais.jpg',
    producer: 'Cozinha Comunitária Sabor da Terra',
    producerRole: 'Alunas de Confeitaria',
    producerIcon: 'soup_kitchen',
    price: 32.0,
    priceFormatted: 'R$ 32,00',
    description: 'Receita artesanal sem aditivos químicos. Frutas de época preparadas com carinho na cozinha escola do instituto.',
    repassePercent: 100
  }
];

export const PROJECTS: Project[] = [
  // ==========================================
  // 1. DANÇA & CULTURA (FOTOS REAIS LOCAIS)
  // ==========================================
  {
    id: 'ballet-infantil',
    title: 'Ballet Clássico Infantil & Juvenil',
    category: 'Dança & Cultura',
    categoryTagType: 'primary',
    image: '/projetos/Ballet/WhatsApp Image 2026-10-25 at 13.30.27.jpeg',
    progressPercent: 0,
    description: 'Formação em ballet clássico inteiramente gratuita para crianças e jovens de Itaguaí, promovendo disciplina corporal, postura, musicalidade e auto-estima.',
    raisedAmount: 0,
    goalAmount: 28000,
    impactBeneficiaries: '120 alunas atendidas',
    status: 'Ativo',
    location: 'Sede do Instituto Caminho e Forma - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'O acesso a aulas de ballet clássico tradicionalmente exige mensalidades e custos com uniformes inacessíveis para famílias das comunidades periféricas de Itaguaí, privando crianças de vivenciarem a arte da dança e o desenvolvimento motor.',
      solution: 'O Instituto Caminho e Forma disponibiliza formação completa e gratuita em ballet clássico, oferecendo sapatilhas, collants, sala adaptada com barras e espelhos, além de transporte para apresentações e mostras culturais abertas.',
      methodology: 'Ensino baseado na metodologia clássica com foco pedagógico inclusivo, estimulando a sensibilidade artística, a disciplina corporal, a cooperação coletiva e a permanência escolar das alunas.'
    },
    milestones: [
      { number: '120', label: 'Bailarinas Atendidas', sublabel: 'Crianças e adolescentes' },
      { number: '100%', label: 'Gratuito', sublabel: 'Sapatilhas e figurinos fornecidos' },
      { number: '8', label: 'Mostras Culturais', sublabel: 'Apresentações para a comunidade' }
    ],
    gallery: [
      { url: '/projetos/Ballet/WhatsApp Image 2026-10-25 at 13.30.26.jpeg', caption: 'Ensaio e exercícios de barra na sala de dança do Instituto.' },
      { url: '/projetos/Ballet/WhatsApp Image 2026-10-25 at 13.30.27.jpeg', caption: 'Alunas praticando postura e técnica clássica na sede.' },
      { url: '/projetos/Ballet/WhatsApp Image 2026-10-25 at 13.30.28.jpeg', caption: 'Concentração, equilíbrio e harmonia em cada movimento.' },
      { url: '/projetos/Ballet/WhatsApp Image 2026-10-25 at 13.30.27 (1).jpeg', caption: 'Dedicação e alegria das turmas infantis nos ensaios.' }
    ],
    teachers: [
      {
        id: 'prof-ballet',
        name: 'Profª Juliana Costa',
        role: 'Professora de Ballet Clássico',
        bio: 'Bailarina formada pelo Theatro Municipal com ampla experiência em projetos sociais de dança na Baixada Fluminense.',
        avatar: '/projetos/Ballet/WhatsApp Image 2026-10-25 at 13.30.27.jpeg',
        badge: 'Dança Clássica'
      }
    ],
    events: [
      {
        id: 'ballet-turma-1',
        title: 'Aulas de Ballet Baby & Infantil (4 a 8 anos)',
        date: 'Terças e Quintas',
        time: '09h00 - 10h15',
        location: 'Sala de Dança da Sede',
        description: 'Desenvolvimento motor, musicalidade e introdução lúdica às posições clássicas.',
        badge: 'Infantil'
      },
      {
        id: 'ballet-turma-2',
        title: 'Ballet Juvenil & Aperfeiçoamento (9 a 16 anos)',
        date: 'Terças e Quintas',
        time: '14h30 - 16h00',
        location: 'Sala de Dança da Sede',
        description: 'Técnica de barra, centro, adágio e preparação para montagens coreográficas.',
        badge: 'Juvenil'
      }
    ],
    beneficiaryStory: {
      name: 'Marta Helena dos Santos',
      role: 'Mãe da aluna Yasmin (7 anos)',
      avatar: '/projetos/Ballet/WhatsApp Image 2026-10-25 at 13.30.28.jpeg',
      quote: '"Minha filha sempre sonhou em fazer ballet. Quando soube que o Instituto oferecia aulas gratuitas com uniforme e todo o carinho, foi a realização de um sonho para nossa família."',
      story: 'Yasmin ingressou no projeto em 2024 e desenvolveu coordenação motora, concentração e paixão pela dança clássica.'
    },
    budgetAllocation: [
      { label: 'Uniformes, Sapatilhas e Figurinos', percent: 40, color: 'bg-[#b45309]' },
      { label: 'Honorários de Professores Especializados', percent: 35, color: 'bg-[#166534]' },
      { label: 'Manutenção de Espelhos, Barras e Piso', percent: 15, color: 'bg-slate-700' },
      { label: 'Transporte para Apresentações', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'dancas-urbanas',
    title: 'Danças Urbanas & Expressão Corporal',
    category: 'Dança & Cultura',
    categoryTagType: 'primary',
    image: '/projetos/Danças Urbanas/WhatsApp Image 2026-10-25 at 13.30.08.jpeg',
    progressPercent: 0,
    description: 'Oficinas de Hip-Hop, Breaking e Danças Urbanas como ferramenta de protagonismo juvenil, ritmo e fortalecimento de vínculos para jovens de Itaguaí.',
    raisedAmount: 0,
    goalAmount: 22500,
    impactBeneficiaries: '95 jovens atendidos',
    status: 'Ativo',
    location: 'Sede do Instituto Caminho e Forma - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'Jovens das periferias urbanas enfrentam carência de espaços públicos de lazer construtivo e expressão artística, gerando isolamento e falta de perspectivas culturais comunitárias.',
      solution: 'Criamos um espaço de formação em danças urbanas que une linguagem corporal contemporânea, batalhas de rima conscientes, coreografia em grupo e oficinas de cidadania.',
      methodology: 'Dinâmicas colaborativas com ênfase no respeito à diversidade, trabalho em equipe, autoconfiança e valorização da cultura periférica fluminense.'
    },
    milestones: [
      { number: '95', label: 'Jovens Participantes', sublabel: 'Oficinas semanais' },
      { number: '100%', label: 'Gratuidade Total', sublabel: 'Acesso democrático à cultura' },
      { number: '12', label: 'Eventos Culturais', sublabel: 'Batalhas e apresentações' }
    ],
    gallery: [
      { url: '/projetos/Danças Urbanas/WhatsApp Image 2026-10-25 at 13.30.07.jpeg', caption: 'Turma de danças urbanas em ensaio coreográfico.' },
      { url: '/projetos/Danças Urbanas/WhatsApp Image 2026-10-25 at 13.30.08.jpeg', caption: 'Expressão, sincronia e energia no salão principal.' },
      { url: '/projetos/Danças Urbanas/WhatsApp Image 2026-10-25 at 13.30.09 (1).jpeg', caption: 'Vivência coletiva e protagonismo jovem na sede.' }
    ],
    teachers: [
      {
        id: 'prof-dancas-urbanas',
        name: 'Professor Lucas Silva',
        role: 'Instrutor de Danças Urbanas & Hip-Hop',
        bio: 'Coreógrafo e pesquisador das danças da cultura hip-hop, atuando há 9 anos com juventudes periféricas.',
        avatar: '/projetos/Danças Urbanas/WhatsApp Image 2026-10-25 at 13.30.08.jpeg',
        badge: 'Cultura Urbana'
      }
    ],
    events: [
      {
        id: 'urban-1',
        title: 'Oficina de Ritmo & Hip-Hop Iniciante',
        date: 'Quartas e Sextas',
        time: '16h00 - 17h30',
        location: 'Salão Cultural da Sede',
        description: 'Passos básicos, musicalidade e consciência corporal para iniciantes.',
        badge: 'Iniciante'
      }
    ],
    beneficiaryStory: {
      name: 'Matheus Oliveira (15 anos)',
      role: 'Aluno de Danças Urbanas',
      avatar: '/projetos/Danças Urbanas/WhatsApp Image 2026-10-25 at 13.30.07.jpeg',
      quote: '"A dança me deu foco e me tirou da rua. Aqui encontrei amigos que me incentivam a estudar e a sonhar alto."',
      story: 'Matheus superou a timidez e hoje participa das apresentações coreográficas representando o Instituto.'
    },
    budgetAllocation: [
      { label: 'Instrutores e Workshops Convidados', percent: 45, color: 'bg-[#166534]' },
      { label: 'Sonorização e Iluminação', percent: 25, color: 'bg-[#b45309]' },
      { label: 'Figurinos e Inscrições em Festivais', percent: 20, color: 'bg-slate-700' },
      { label: 'Lanches e Hidratação dos Alunos', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'jazz-danca',
    title: 'Jazz & Dança Contemporânea',
    category: 'Dança & Cultura',
    categoryTagType: 'primary',
    image: '/projetos/Jazz/WhatsApp Image 2026-10-25 at 13.34.02.jpeg',
    progressPercent: 0,
    description: 'Aulas de Jazz Dance que desenvolvem versatilidade técnica, expressividade teatral, força e dinamismo para crianças e adolescentes.',
    raisedAmount: 0,
    goalAmount: 21500,
    impactBeneficiaries: '80 alunas matriculadas',
    status: 'Ativo',
    location: 'Sede do Instituto Caminho e Forma - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'A falta de alternativas esportivas e artísticas que unam preparação física e criatividade teatral reduz o repertório cultural de meninas e meninos na região.',
      solution: 'O projeto de Jazz do Instituto une o rigor da técnica clássica com a liberdade da dança contemporânea, permitindo que cada aluna desenvolva sua individualidade artística.',
      methodology: 'Aquecimento técnico, exercícios de isolamento corporal, diagonais com saltos e giros, além de criação de coreografias coletivas.'
    },
    milestones: [
      { number: '80', label: 'Alunas Formando-se', sublabel: 'Aulas 2x por semana' },
      { number: '100%', label: 'Gratuidade Plena', sublabel: 'Sem taxa de matrícula ou materiais' },
      { number: '6', label: 'Coreografias Montadas', sublabel: 'Repertório apresentado' }
    ],
    gallery: [
      { url: '/projetos/Jazz/WhatsApp Image 2026-10-25 at 13.34.02.jpeg', caption: 'Alongamento e aquecimento técnico na sala de dança.' },
      { url: '/projetos/Jazz/WhatsApp Image 2026-10-25 at 13.34.03 (2).jpeg', caption: 'Sincronia e energia nos ensaios de Jazz.' },
      { url: '/projetos/Jazz/WhatsApp Image 2026-10-25 at 13.34.04.jpeg', caption: 'Alegria e companheirismo entre as alunas do projeto.' }
    ],
    teachers: [
      {
        id: 'prof-jazz',
        name: 'Profª Beatriz Mendes',
        role: 'Professora de Jazz e Expressão',
        bio: 'Coreógrafa com especialização em dança contemporânea e projetos de intervenção cultural comunitária.',
        avatar: '/projetos/Jazz/WhatsApp Image 2026-10-25 at 13.34.02.jpeg',
        badge: 'Jazz Dance'
      }
    ],
    events: [
      {
        id: 'jazz-turma-geral',
        title: 'Jazz Dance Juvenil',
        date: 'Segundas e Quartas',
        time: '15h00 - 16h30',
        location: 'Sala de Dança da Sede',
        description: 'Técnica de giros, flexibilidade e montagem de espetáculo semestral.',
        badge: 'Regular'
      }
    ],
    budgetAllocation: [
      { label: 'Remuneração da Equipe de Ensino', percent: 45, color: 'bg-[#166534]' },
      { label: 'Materiais de Apoio e Figurinos', percent: 30, color: 'bg-[#b45309]' },
      { label: 'Eventos e Festivais Comunitários', percent: 15, color: 'bg-slate-700' },
      { label: 'Manutenção do Espaço', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'sede-comunitario',
    title: 'Ações Comunitárias',
    category: 'Sede & Comunidade',
    categoryTagType: 'secondary',
    image: '/projetos/Sede/WhatsApp Image 2026-10-25 at 13.34.10 (1).jpeg',
    progressPercent: 0,
    description: 'Polo vivo de convivência comunitária, acolhimento de famílias, reuniões de orientação social e eventos integradores no município de Itaguaí.',
    raisedAmount: 0,
    goalAmount: 35000,
    impactBeneficiaries: 'Mais de 600 famílias atendidas',
    status: 'Ativo',
    location: 'Sede Central do Instituto - Itaguaí, RJ',
    startDate: 'Desde 2012',
    fullStory: {
      problem: 'Comunidades em vulnerabilidade precisam de um espaço físico seguro, aberto e acolhedor onde possam buscar auxílio, informações, solidariedade e convivência digna.',
      solution: 'A sede do Instituto funciona como ponto focal comunitário em Itaguaí, realizando acolhimentos contínuos, reuniões socioassistenciais, entregas solidárias e eventos comemorativos para as famílias.',
      methodology: 'Atendimento humanizado, escuta ativa, articulação em rede e gestão comunitária participativa liderada pela equipe técnica e voluntários.'
    },
    milestones: [
      { number: '600+', label: 'Famílias Acompanhadas', sublabel: 'Cadastradas na base da sede' },
      { number: '14', label: 'Anos de Presença', sublabel: 'Atuando desde 2012 em Itaguaí' },
      { number: '24', label: 'Eventos Anuais', sublabel: 'Ações de integração e cidadania' }
    ],
    gallery: [
      { url: '/projetos/Sede/WhatsApp Image 2026-10-25 at 13.34.06 (1).jpeg', caption: 'Encontro comunitário com famílias e crianças na sede.' },
      { url: '/projetos/Sede/WhatsApp Image 2026-10-25 at 13.34.10 (1).jpeg', caption: 'Momento de integração, acolhimento e celebração solidária.' },
      { url: '/projetos/Sede/WhatsApp Image 2026-10-25 at 13.34.12 (1).jpeg', caption: 'Equipe do Instituto em atendimento direto aos moradores.' },
      { url: '/projetos/Sede/WhatsApp Image 2026-10-25 at 13.34.16.jpeg', caption: 'Espaço de convivência aberto diariamente para a comunidade.' }
    ],
    events: [
      {
        id: 'sede-encontro',
        title: 'Encontro Mensal de Famílias & Convivência',
        date: 'Primeiro Sábado do Mês',
        time: '14h00 - 17h00',
        location: 'Pátio Central da Sede',
        description: 'Distribuição de donativos, orientação socioassistencial e atividades para crianças.',
        badge: 'Comunitário'
      }
    ],
    budgetAllocation: [
      { label: 'Manutenção Predial e Contas da Sede', percent: 45, color: 'bg-[#166534]' },
      { label: 'Cestas e Apoio Emergencial a Famílias', percent: 30, color: 'bg-[#b45309]' },
      { label: 'Estrutura para Encontros e Oficinas', percent: 15, color: 'bg-slate-700' },
      { label: 'Material de Limpeza e Conservação', percent: 10, color: 'bg-amber-600' }
    ]
  },

  // ==========================================
  // 2. ESPORTES & LUTAS (FOTOS BAIXADAS LOCALMENTE)
  // ==========================================
  {
    id: 'muay-thai',
    title: 'Muay Thai',
    category: 'Esportes & Lutas',
    categoryTagType: 'secondary',
    image: '/projetos/muay-thai/capa-infantil-juvenil-higgsfield.webp',
    imagePosition: 'left top',
    galleryIsIllustrative: true,
    progressPercent: 0,
    description: 'Aulas gratuitas de Muay Thai para crianças e adolescentes de Itaguaí, com orientação de instrutores, condicionamento físico adequado à idade, autocontrole, respeito mútuo e disciplina marcial.',
    raisedAmount: 0,
    goalAmount: 22000,
    impactBeneficiaries: '75 jovens praticantes',
    status: 'Ativo',
    location: 'Dojô da Sede do Instituto - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'A ociosidade no contraturno escolar e a escassez de centros esportivos públicos em Itaguaí deixam centenas de adolescentes expostos à vulnerabilidade social e ao sedentarismo. Sem canais saudáveis de expressão, muitos jovens acumulam tensões diárias sem orientação sobre disciplina e projeto de vida.',
      solution: 'O Instituto estruturou um centro de artes marciais com ringue, tatames de alta densidade, sacos de pancada e kits individuais de proteção (luvas, caneleiras, bandagens e protetores bucais). Sob orientação de mestres experientes, os alunos treinam sem qualquer custo financeiro para suas famílias.',
      methodology: 'Prática da tradicional "arte das oito armas" (punhos, cotovelos, joelhos e canelas) combinada com preparação física funcional, corrida e alongamento. Cada treino inicia e encerra com saudações de respeito (Wai Khru), ensinamentos sobre hierarquia, humildade e exigência rigorosa de frequência e bom rendimento na escola regular.'
    },
    milestones: [
      { number: '75', label: 'Jovens Matriculados', sublabel: 'Treinando semanalmente' },
      { number: '100%', label: 'Kits Fornecidos', sublabel: 'Luvas e proteções gratuitas' },
      { number: '3x', label: 'Treinos Semanais', sublabel: 'Acompanhamento contínuo' }
    ],
    gallery: [
      { url: '/projetos/muay-thai/capa-infantil-juvenil-higgsfield.webp', caption: 'Adolescente pratica chute baixo no aparador sob orientação do instrutor.', objectPosition: 'center top' },
      { url: '/projetos/muay-thai/galeria-1-infantil-juvenil-higgsfield.webp', caption: 'Criança aprende postura de guarda e golpes no aparador em aula supervisionada.', objectPosition: 'center top' },
      { url: '/projetos/muay-thai/galeria-2-infantil-juvenil-higgsfield.webp', caption: 'Crianças e adolescentes praticam guarda e deslocamento no tatame com acompanhamento.', objectPosition: 'center top' }
    ],
    teachers: [
      {
        id: 'instrutor-muay',
        name: 'Professor Anderson Costa',
        role: 'Instrutor Chefe de Muay Thai',
        bio: 'Educador marcial com mais de 12 anos de experiência, dedicado à formação cidadã de jovens pela disciplina das artes marciais.',
        avatar: '/projetos/muay-thai/capa-infantil-juvenil-higgsfield.webp',
        badge: 'Treinador'
      }
    ],
    events: [
      {
        id: 'muay-regular',
        title: 'Treino de Muay Thai Juvenil',
        date: 'Terças e Quintas',
        time: '18h30 - 20h00',
        location: 'Dojô da Sede',
        description: 'Fundamentos técnicos, esquivas, chutes no aparador e condicionamento físico.',
        badge: 'Regular'
      },
      {
        id: 'muay-sabado',
        title: 'Treino Geral de Sparring Técnico e Graduação',
        date: 'Sábados',
        time: '09h00 - 11h00',
        location: 'Dojô da Sede',
        description: 'Avaliação técnica de graduação de prajied e simulação controlada de combate.',
        badge: 'Técnico'
      }
    ],
    beneficiaryStory: {
      name: 'Gabriel Santos (16 anos)',
      role: 'Atleta do Projeto Muay Thai',
      avatar: '/projetos/muay-thai/capa-infantil-juvenil-higgsfield.webp',
      quote: '"Antes do Muay Thai eu vivia sem rumo na rua e brigando na escola. No dojô aprendi a ter calma, a respeitar meus colegas e hoje meu sonho é ser atleta profissional e ajudar minha mãe."',
      story: 'Gabriel treina há 1 ano e meio e é destaque em dedicação e notas escolares.'
    },
    budgetAllocation: [
      { label: 'Kits de Proteção (Luvas, Caneleiras, Bandagens)', percent: 35, color: 'bg-[#b45309]' },
      { label: 'Remuneração de Instrutores Certificados', percent: 35, color: 'bg-[#166534]' },
      { label: 'Manutenção de Tatames e Sacos de Pancada', percent: 20, color: 'bg-slate-700' },
      { label: 'Hidratação e Frutas após os Treinos', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'karate-tradicional',
    title: 'Karatê',
    category: 'Esportes & Lutas',
    categoryTagType: 'secondary',
    image: '/projetos/karate/capa.png',
    progressPercent: 0,
    description: 'Ensino do Karatê Shotokan tradicional com foco em autodisciplina, concentração mental, respeito e equilíbrio postural para crianças e jovens.',
    raisedAmount: 0,
    goalAmount: 22000,
    impactBeneficiaries: '90 crianças e jovens',
    status: 'Ativo',
    location: 'Dojô da Sede - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'Muitas crianças das escolas locais enfrentam dificuldades de foco escolar, hiperatividade e falta de espaços educativos que desenvolvam paciência e autocontrole emocional.',
      solution: 'O dojô comunitário do Instituto oferece kimonos completos e instrução regular de Karatê Shotokan, trabalhando o código moral (Dojo Kun) e a evolução por faixas sem cobrança de exames.',
      methodology: 'Metodologia tradicional focada nos três pilares: Kihon (fundamentos e golpes básicos), Kata (formas coreografadas de combate imaginário) e Kumite (luta supervisionada com ênfase na defesa e no respeito à integridade física do parceiro).'
    },
    milestones: [
      { number: '90', label: 'Alunos no Tatame', sublabel: 'Crianças de 6 a 17 anos' },
      { number: '100%', label: 'Kimonos Gratuitos', sublabel: 'Equipamentos entregues' },
      { number: '4', label: 'Trocas de Faixa', sublabel: 'Cerimônias anuais gratuitas' }
    ],
    gallery: [
      { url: '/projetos/karate/capa.png', caption: 'Alunos executando kata com postura e foco impecáveis.' },
      { url: '/projetos/karate/galeria-1.jpg', caption: 'Prática de fundamentos e autodisciplina no tatame.' },
      { url: '/projetos/karate/galeria-2.jpg', caption: 'Formação moral e respeito aos mestres e companheiros.' }
    ],
    teachers: [
      {
        id: 'sensei-karate',
        name: 'Sensei Roberto Takahashi',
        role: 'Mestre 4º Dan de Karatê Shotokan',
        bio: 'Faixa preta com 25 anos de dedicação ao Karatê educacional, árbitro estadual e pedagogo social.',
        avatar: '/projetos/karate/sensei.jpg',
        badge: 'Sensei'
      }
    ],
    events: [
      {
        id: 'karate-infantil',
        title: 'Karatê Kids (6 a 11 anos)',
        date: 'Segundas e Quartas',
        time: '09h30 - 10h45',
        location: 'Dojô da Sede',
        description: 'Coordenação motora, respeito aos colegas e fundamentos de Kihon.',
        badge: 'Infantil'
      },
      {
        id: 'karate-juvenil',
        title: 'Karatê Juvenil & Kata Avançado',
        date: 'Segundas e Quartas',
        time: '17h00 - 18h30',
        location: 'Dojô da Sede',
        description: 'Aperfeiçoamento técnico de katas superiores e preparação para campeonatos.',
        badge: 'Juvenil'
      }
    ],
    beneficiaryStory: {
      name: 'Enzo de Souza (9 anos)',
      role: 'Aluno do Karatê Tradicional',
      avatar: '/projetos/karate/aluno-enzo.jpg',
      quote: '"O Karatê transformou o comportamento do meu filho. Ele era muito agitado e tirava notas baixas. Hoje é um dos melhores alunos da sala e cuida do kimono com o maior orgulho."',
      story: 'Enzo conquistou a faixa amarela e se tornou referência de dedicação na sua turma da escola.'
    },
    budgetAllocation: [
      { label: 'Kimonos e Faixas Oficiais para os Alunos', percent: 35, color: 'bg-[#b45309]' },
      { label: 'Remuneração dos Senseis e Instrutores', percent: 35, color: 'bg-[#166534]' },
      { label: 'Taxas de Federação e Exames de Graduação', percent: 20, color: 'bg-slate-700' },
      { label: 'Material Higiênico e Desinfecção de Tatames', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'boxe-formativo',
    title: 'Boxe',
    category: 'Esportes & Lutas',
    categoryTagType: 'secondary',
    image: '/projetos/boxe/capa-infantil-juvenil-higgsfield.webp',
    imagePosition: 'left top',
    galleryIsIllustrative: true,
    progressPercent: 0,
    description: 'Aulas de boxe para crianças e adolescentes de Itaguaí, com acompanhamento de treinadores, desenvolvimento físico adequado à idade, disciplina e respeito.',
    raisedAmount: 0,
    goalAmount: 20000,
    impactBeneficiaries: '65 adolescentes atendidos',
    status: 'Ativo',
    location: 'Centro de Lutas da Sede - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'Jovens da Baixada Fluminense lidam frequentemente com estresse social e a falta de oportunidades para canalizar sua força vital em atividades construtivas e saudáveis.',
      solution: 'A escola de boxe do Instituto proporciona infraestrutura completa com sacos pesados, pêras, cordas de velocidade, protetores de cabeça e ringue para treinamentos técnicos seguros.',
      methodology: 'Ensino rigoroso da postura, jogo de pernas (footwork), jab, direto, cruzado e esquivas. O boxe não é ensinado como violência, mas como a "nobre arte" da inteligência tática, reflexos rápidos e respeito irrestrito às regras.'
    },
    milestones: [
      { number: '65', label: 'Jovens Boxeadores', sublabel: 'Turmas regulares' },
      { number: '100%', label: 'Material Cedido', sublabel: 'Luvas, cordas e capacetes' },
      { number: '0', label: 'Evasão Escolar', sublabel: 'Exigência de boletim em dia' }
    ],
    gallery: [
      { url: '/projetos/boxe/capa-infantil-juvenil-higgsfield.webp', caption: 'Criança aprende o jab nas manoplas com acompanhamento do treinador de boxe.', objectPosition: 'center top' },
      { url: '/projetos/boxe/galeria-1-infantil-juvenil-higgsfield.webp', caption: 'Adolescente pratica golpes no saco de boxe com supervisão e luvas adequadas.', objectPosition: 'center top' },
      { url: '/projetos/boxe/galeria-2-infantil-juvenil-higgsfield.webp', caption: 'Turma de crianças e adolescentes aprende guarda e movimentação com o instrutor.', objectPosition: 'center top' }
    ],
    teachers: [
      {
        id: 'prof-boxe',
        name: 'Mestre Claudinei "Paredão" Ramos',
        role: 'Treinador de Boxe Olímpico',
        bio: 'Ex-pugilista profissional com histórico em competições nacionais, dedicado há uma década a formar jovens atletas com valores éticos.',
        avatar: '/projetos/boxe/capa-infantil-juvenil-higgsfield.webp',
        badge: 'Treinador'
      }
    ],
    events: [
      {
        id: 'boxe-noturno',
        title: 'Turma de Boxe Olímpico Juvenil',
        date: 'Segundas, Quartas e Sextas',
        time: '19h00 - 20h30',
        location: 'Centro de Lutas da Sede',
        description: 'Condicionamento físico, manoplas, saco de pancada e técnica de guarda.',
        badge: 'Regular'
      }
    ],
    beneficiaryStory: {
      name: 'Lucas Ferreira (17 anos)',
      role: 'Atleta do Boxe Comunitário',
      avatar: '/projetos/boxe/capa-infantil-juvenil-higgsfield.webp',
      quote: '"O boxe me ensinou a ter calma dentro e fora do ringue. Hoje tenho mais disposição, não me envolvo em confusões e meu sonho é disputar torneios estaduais."',
      story: 'Lucas encontrou no boxe o equilíbrio que precisava para focar nos estudos e no projeto profissional.'
    },
    budgetAllocation: [
      { label: 'Luvas Profissionais, Bandagens e Capacetes', percent: 40, color: 'bg-[#b45309]' },
      { label: 'Remuneração de Treinadores e Preparadores', percent: 35, color: 'bg-[#166534]' },
      { label: 'Manutenção de Sacos de Pancada e Cordas', percent: 15, color: 'bg-slate-700' },
      { label: 'Atendimento de Primeiros Socorros e Gel', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'treino-funcional',
    title: 'Funcional',
    category: 'Esportes & Lutas',
    categoryTagType: 'secondary',
    image: '/projetos/funcional/capa-higgsfield.webp',
    imagePosition: 'center top',
    galleryIsIllustrative: true,
    progressPercent: 0,
    description: 'Treinamento funcional ao ar livre e na sede para jovens, adultos e idosos, promovendo saúde cardiovascular, resistência física e combate à obesidade.',
    raisedAmount: 0,
    goalAmount: 16000,
    impactBeneficiaries: '110 moradores participantes',
    status: 'Ativo',
    location: 'Pátio Esportivo da Sede - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'O sedentarismo e doenças crônicas como hipertensão e diabetes atingem fortemente as famílias de baixa renda que não podem pagar por academias comerciais.',
      solution: 'Oferecemos circuitos funcionais adaptados com kettlebells, cones, elásticos extensores, cordas navais e escadas de agilidade, orientados por professores de Educação Física.',
      methodology: 'Circuitos por estações de alta e média intensidade, respeitando os limites biológicos de cada faixa etária, fortalecendo a musculatura estabilizadora e a saúde mental através da convivência comunitária.'
    },
    milestones: [
      { number: '110', label: 'Praticantes Regulares', sublabel: 'Mulheres, jovens e idosos' },
      { number: '100%', label: 'Acesso Livre', sublabel: 'Totalmente gratuito' },
      { number: '4x', label: 'Aulas Semanais', sublabel: 'Manhã e noite' }
    ],
    gallery: [
      { url: '/projetos/funcional/capa-higgsfield.webp', caption: 'Agachamento com acompanhamento e orientação de postura.' },
      { url: '/projetos/funcional/galeria-1-higgsfield.webp', caption: 'Exercício de resistência com faixa elástica e supervisão.', objectPosition: 'center top' },
      { url: '/projetos/funcional/galeria-2-higgsfield.webp', caption: 'Aquecimento e mobilidade dos ombros em atividade coletiva.' }
    ],
    teachers: [
      {
        id: 'prof-funcional',
        name: 'Profª Mariana Alencar',
        role: 'Professora de Educação Física (CREF Ativo)',
        bio: 'Especialista em fisiologia do exercício e saúde preventiva da família em projetos sociais comunitários.',
        avatar: '/projetos/funcional/capa-higgsfield.webp',
        badge: 'Ed. Física'
      }
    ],
    events: [
      {
        id: 'funcional-manha',
        title: 'Circuito Funcional & Saúde Ativa (Manhã)',
        date: 'Segundas e Quartas',
        time: '07h30 - 08h45',
        location: 'Pátio da Sede',
        description: 'Alongamento, agilidade, fortalecimento lombar e caminhada orientada.',
        badge: 'Manhã'
      },
      {
        id: 'funcional-noite',
        title: 'Funcional Noturno & Queima Calórica',
        date: 'Terças e Quintas',
        time: '19h00 - 20h15',
        location: 'Pátio da Sede',
        description: 'Treino em circuito com cordas navais, halteres e exercícios calistênicos.',
        badge: 'Noite'
      }
    ],
    beneficiaryStory: {
      name: 'Regina Célia Pires (52 anos)',
      role: 'Aluna do Treinamento Funcional',
      avatar: '/projetos/funcional/capa-higgsfield.webp',
      quote: '"Eu sofria com dores nas costas e pressão alta. Desde que comecei o funcional do Instituto perdi 8 quilos, fiz novas amizades e recuperei a vontade de viver com saúde."',
      story: 'Dona Regina melhorou todos os seus exames de rotina e hoje é a maior incentivadora das vizinhas.'
    },
    budgetAllocation: [
      { label: 'Aparelhos Funcionais (Kettlebells, Elásticos, Cones)', percent: 35, color: 'bg-[#b45309]' },
      { label: 'Honorários de Profissionais de Educação Física', percent: 40, color: 'bg-[#166534]' },
      { label: 'Aparelhos de Medição (Pressão, Glicemia e Balança)', percent: 15, color: 'bg-slate-700' },
      { label: 'Água e Suporte aos Treinos', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'jump-fitness',
    title: 'Jumper',
    category: 'Esportes & Lutas',
    categoryTagType: 'secondary',
    image: '/projetos/jump/capa-higgsfield.webp',
    imagePosition: 'center top',
    galleryIsIllustrative: true,
    progressPercent: 0,
    description: 'Aulas coreografadas sobre minitrampolins (Jump), combinando alto gasto calórico, fortalecimento muscular dos membros inferiores e muita animação para a comunidade.',
    raisedAmount: 0,
    goalAmount: 15000,
    impactBeneficiaries: '85 alunas assíduas',
    status: 'Ativo',
    location: 'Salão Multiuso da Sede - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'Mães e jovens da comunidade sentem carência de atividades físicas estimulantes que proporcionem alívio da sobrecarga de cuidados domésticos e melhora rápida do condicionamento.',
      solution: 'O Instituto adquiriu minitrampolins profissionais reforçados com molas de alta segurança e oferece aulas contagiantes com músicas energéticas guiadas por instrutoras certificadas.',
      methodology: 'Aulas rítmicas de 50 minutos com intensidade intervalada. O impacto reduzido sobre as articulações protege os joelhos e o tornozelo enquanto queima calorias e eleva o humor e a autoestima coletiva.'
    },
    milestones: [
      { number: '85', label: 'Mulheres no Jump', sublabel: 'Frequência regular' },
      { number: '30+', label: 'Minitrampolins', sublabel: 'Equipamentos seguros na sede' },
      { number: '100%', label: 'Gratuito', sublabel: 'Comunidade acolhida' }
    ],
    gallery: [
      { url: '/projetos/jump/capa-higgsfield.webp', caption: 'Passos de baixo impacto sobre minitrampolins individuais.' },
      { url: '/projetos/jump/galeria-1-higgsfield.webp', caption: 'Exercícios de equilíbrio e ritmo com orientação da instrutora.', objectPosition: 'center top' },
      { url: '/projetos/jump/galeria-2-higgsfield.webp', caption: 'Hidratação e convivência após a atividade no minitrampolim.' }
    ],
    teachers: [
      {
        id: 'prof-jump',
        name: 'Profª Tatiana Ribeiro',
        role: 'Instrutora de Jump & Fitness Coletivo',
        bio: 'Especialista em atividades aeróbicas de baixo impacto e motivadora comunitária de saúde da mulher.',
        avatar: '/projetos/jump/capa-higgsfield.webp',
        badge: 'Jump Master'
      }
    ],
    events: [
      {
        id: 'jump-turma-a',
        title: 'Jump Ritmo Total (Turma Matutina)',
        date: 'Terças e Quintas',
        time: '08h30 - 09h30',
        location: 'Salão de Ginástica da Sede',
        description: 'Coreografias aeróbicas no trampolim com queima calórica e tonificação.',
        badge: 'Manhã'
      },
      {
        id: 'jump-turma-b',
        title: 'Jump Noturno & Energia Feminina',
        date: 'Segundas e Quartas',
        time: '18h30 - 19h30',
        location: 'Salão de Ginástica da Sede',
        description: 'Treino após o expediente para desestressar e fortalecer pernas e glúteos.',
        badge: 'Noite'
      }
    ],
    beneficiaryStory: {
      name: 'Juliana Aparecida de Souza (28 anos)',
      role: 'Aluna assídua de Jump',
      avatar: '/projetos/jump/capa-higgsfield.webp',
      quote: '"O Jump me salvou da depressão pós-parto. A aula é pura alegria, saio leve e pronta para cuidar dos meus filhos com um sorriso no rosto."',
      story: 'Juliana frequenta as aulas há 8 meses e relata transformação na disposição diária e na autoestima.'
    },
    budgetAllocation: [
      { label: 'Aquisição e Troca de Lonas e Molas dos Trampolins', percent: 40, color: 'bg-[#b45309]' },
      { label: 'Honorários da Instrutora de Ginástica', percent: 35, color: 'bg-[#166534]' },
      { label: 'Caixa de Som Profissional e Microfones', percent: 15, color: 'bg-slate-700' },
      { label: 'Água e Toalhas Descartáveis', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'defesa-pessoal-mulheres',
    title: 'Defesa Pessoal para Mulheres',
    category: 'Esportes & Lutas',
    categoryTagType: 'secondary',
    image: '/projetos/defesa-pessoal-feminina/capa.png',
    progressPercent: 0,
    description: 'Oficinas práticas de prevenção, postura assertiva, quebra de pegadas e técnicas de autodefesa física e psicológica para mulheres de todas as idades.',
    raisedAmount: 0,
    goalAmount: 18000,
    impactBeneficiaries: '130 mulheres capacitadas',
    status: 'Ativo',
    location: 'Salão de Lutas da Sede - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'Infelizmente, índices de assédio, agressões verbais e violência doméstica afetam diariamente mulheres nos trajetos para o trabalho e no convívio comunitário.',
      solution: 'O Instituto criou um ambiente seguro e exclusivo onde mulheres aprendem a reconhecer situações de risco antes que elas aconteçam e adquirem respostas corporais eficientes para proteger suas vidas.',
      methodology: 'Técnicas de Jiu-Jitsu, Krav Maga e Boxe adaptadas: liberação de agarrotes de punho, saída de estrangulamentos, quedas seguras, uso de objetos do cotidiano para autodefesa e apoio psicológico integrado com a assistente social do Instituto.'
    },
    milestones: [
      { number: '130', label: 'Mulheres Treinadas', sublabel: 'Oficinas e ciclos práticos' },
      { number: '100%', label: 'Gratuito e Seguro', sublabel: 'Ambiente acolhedor e confidencial' },
      { number: '12', label: 'Ciclos de Oficinas', sublabel: 'Com acompanhamento psicológico' }
    ],
    gallery: [
      { url: '/projetos/defesa-pessoal-feminina/capa.png', caption: 'Instrutora demonstrando técnica de desvencilhamento de pegada.' },
      { url: '/projetos/defesa-pessoal-feminina/galeria-1.jpg', caption: 'Treino prático de esquiva e equilíbrio em situações de risco.' },
      { url: '/projetos/defesa-pessoal-feminina/galeria-2.jpg', caption: 'Rede solidária entre mulheres fortalecendo a autonomia comunitária.' }
    ],
    teachers: [
      {
        id: 'prof-defesa-feminina',
        name: 'Profª Érika Vasconcellos',
        role: 'Faixa Preta de Jiu-Jitsu & Instrutora de Defesa Pessoal',
        bio: 'Especialista em segurança feminina, atuando há mais de 8 anos em cursos práticos para mulheres e combate à violência doméstica.',
        avatar: '/projetos/defesa-pessoal-feminina/capa.png',
        badge: 'Defesa Feminina'
      }
    ],
    events: [
      {
        id: 'defesa-sabado',
        title: 'Oficina de Defesa Pessoal & Postura de Segurança',
        date: 'Sábados (Quinzenal)',
        time: '14h00 - 16h30',
        location: 'Tatame da Sede',
        description: 'Técnicas de escape de agarrão, postura verbal assertiva e roda de acolhimento.',
        badge: 'Oficina'
      }
    ],
    beneficiaryStory: {
      name: 'Carolina Ramos (22 anos)',
      role: 'Participante da Oficina de Defesa Pessoal',
      avatar: '/projetos/defesa-pessoal-feminina/capa.png',
      quote: '"Depois da oficina de defesa pessoal perdi o medo de andar na rua à noite voltando da faculdade. Aprendi que meu corpo tem força e que eu sei como me defender."',
      story: 'Carolina aprendeu comandos assertivos e posturas preventivas de autodefesa para o dia a dia.'
    },
    budgetAllocation: [
      { label: 'Equipamentos de Simulação e Tatames de Impacto', percent: 35, color: 'bg-[#b45309]' },
      { label: 'Remuneração da Instrutora e Palestrantes em Direitos', percent: 40, color: 'bg-[#166534]' },
      { label: 'Cartilhas Educativas da Lei Maria da Penha', percent: 15, color: 'bg-slate-700' },
      { label: 'Coffee Break e Acolhimento das Alunas', percent: 10, color: 'bg-amber-600' }
    ]
  },

  // ==========================================
  // 3. ATENDIMENTO & CIDADANIA (FOTOS BAIXADAS LOCALMENTE)
  // ==========================================
  {
    id: 'psicanalise-social',
    title: 'Psicanálise',
    category: 'Atendimento & Cidadania',
    categoryTagType: 'primary',
    image: '/projetos/psicanalise/capa-atendimento-higgsfield.webp',
    imagePosition: 'right top',
    galleryIsIllustrative: true,
    progressPercent: 0,
    description: 'Atendimento clínico psicanalítico individual e gratuito para crianças, jovens e adultos, proporcionando escuta ética e elaboração do sofrimento psíquico.',
    raisedAmount: 0,
    goalAmount: 24000,
    impactBeneficiaries: '80 pacientes em acompanhamento',
    status: 'Ativo',
    location: 'Consultório de Atendimento da Sede - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'O sofrimento emocional decorrente de lutos, traumas de violência, angústia crônica e crises de pânico é agravado pela falta de acesso a terapias particulares, cujas sessões ultrapassam o orçamento familiar.',
      solution: 'O Instituto disponibiliza salas individuais confortáveis e com isolamento acústico, onde psicanalistas graduados oferecem sessões regulares sem qualquer cobrança.',
      methodology: 'Clínica psicanalítica baseada na associação livre, transferência e escuta singular de cada sujeito. O paciente encontra um tempo e um espaço de confiança para dar sentido à sua dor e construir novos caminhos de vida.'
    },
    milestones: [
      { number: '80', label: 'Pacientes Semanais', sublabel: 'Acompanhamento continuado' },
      { number: '100%', label: 'Sigilo e Ética', sublabel: 'Atendimento 100% gratuito' },
      { number: '4', label: 'Consultórios', sublabel: 'Espaços acolhedores na sede' }
    ],
    gallery: [
      { url: '/projetos/psicanalise/capa-atendimento-higgsfield.webp', caption: 'Cena ilustrativa de atendimento psicanalítico com escuta individual e acolhedora.', objectPosition: 'center top' },
      { url: '/projetos/psicanalise/galeria-1-higgsfield.webp', caption: 'Cena ilustrativa de conversa e escuta em uma sessão de psicanálise.' },
      { url: '/projetos/psicanalise/galeria-2-higgsfield.webp', caption: 'Cena ilustrativa de fala em um ambiente de acolhimento.' }
    ],
    teachers: [
      {
        id: 'psicanalista-responsavel',
        name: 'Dr. Fabiano Guimarães',
        role: 'Psicanalista Clínico & Supervisor',
        bio: 'Membro de escola psicanalítica, com 14 anos de prática clínica e compromisso social com a saúde mental comunitária.',
        avatar: '/projetos/psicanalise/capa-atendimento-higgsfield.webp',
        badge: 'Psicanálise'
      }
    ],
    events: [
      {
        id: 'psicanalise-sessoes',
        title: 'Sessões Clínicas Individuais Agendadas',
        date: 'Segunda a Sexta-feira',
        time: '08h00 - 18h00',
        location: 'Consultório 1 da Sede',
        description: 'Sessões de 50 minutos com agendamento prévio via acolhimento socioassistencial.',
        badge: 'Clínica'
      }
    ],
    beneficiaryStory: {
      name: 'Luciana Martins (39 anos)',
      role: 'Paciente do Projeto de Psicanálise',
      avatar: '/projetos/psicanalise/capa-atendimento-higgsfield.webp',
      quote: '"Cheguei ao Instituto sem conseguir sair de casa com crise de pânico. A psicanálise me devolveu a voz e a dignidade para voltar a trabalhar e cuidar da minha família."',
      story: 'Luciana faz acompanhamento semanal há 9 meses e retomou suas atividades profissionais e sociais.'
    },
    budgetAllocation: [
      { label: 'Honorários Sociais de Especialistas em Saúde Mental', percent: 50, color: 'bg-[#166534]' },
      { label: 'Estrutura, Isolamento Acústico e Climatização das Salas', percent: 25, color: 'bg-[#b45309]' },
      { label: 'Supervisão Clínica e Educação Continuada', percent: 15, color: 'bg-slate-700' },
      { label: 'Prontuários e Material de Apoio', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'psicologia-clinica',
    title: 'Psicólogo',
    category: 'Atendimento & Cidadania',
    categoryTagType: 'primary',
    image: '/projetos/psicologia/capa-higgsfield.webp',
    imagePosition: 'center top',
    galleryIsIllustrative: true,
    progressPercent: 0,
    description: 'Consultas psicológicas individuais e familiares, suporte emocional em crises, grupos de apoio e psicoterapia breve para moradores de Itaguaí.',
    raisedAmount: 0,
    goalAmount: 25000,
    impactBeneficiaries: '95 pessoas atendidas/mês',
    status: 'Ativo',
    location: 'Consultório de Psicologia da Sede - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'As longas filas do SUS para atendimento psicológico na região podem durar até dois anos, deixando crianças com ansiedade, jovens deprimidos e mães esgotadas sem qualquer apoio.',
      solution: 'O Instituto mantém equipe permanente de psicólogos clínicos com CRP ativo para atendimento individualizado e grupos reflexivos, com fila de espera gerenciada com agilidade.',
      methodology: 'Abordagens baseadas na Terapia Cognitivo-Comportamental (TCC) e Fenomenologia, trabalhando o desenvolvimento de repertórios de enfrentamento, regulação emocional e fortalecimento dos laços familiares.'
    },
    milestones: [
      { number: '95', label: 'Pessoas por Mês', sublabel: 'Atendimento continuado' },
      { number: '3', label: 'Psicólogos Clínicos', sublabel: 'Com registro CRP ativo' },
      { number: '100%', label: 'Gratuito', sublabel: 'Acolhimento imediato' }
    ],
    gallery: [
      { url: '/projetos/psicologia/capa-higgsfield.webp', caption: 'Cena ilustrativa de acolhimento em uma consulta psicológica.' },
      { url: '/projetos/psicologia/galeria-1-higgsfield.webp', caption: 'Cena ilustrativa de escuta e acompanhamento psicológico individual.' },
      { url: '/projetos/psicologia/galeria-2-atendimento-higgsfield.webp', caption: 'Cena ilustrativa de orientação psicológica a um casal adulto.', objectPosition: 'center top' }
    ],
    teachers: [
      {
        id: 'psicologa-lider',
        name: 'Dra. Camila Nogueira',
        role: 'Psicóloga Clínica (CRP 05/...)',
        bio: 'Especialista em saúde mental da infância e adolescência e intervenção em crises psicossociais.',
        avatar: '/projetos/psicologia/capa-higgsfield.webp',
        badge: 'Psicologia'
      }
    ],
    events: [
      {
        id: 'psico-atendimentos',
        title: 'Plantão Psicológico & Sessões Agendadas',
        date: 'Terças e Quintas',
        time: '08h30 - 17h00',
        location: 'Consultório 2 da Sede',
        description: 'Atendimento psicológico de apoio, psicodiagnóstico e aconselhamento familiar.',
        badge: 'Clínica'
      }
    ],
    beneficiaryStory: {
      name: 'Márcia Ferreira',
      role: 'Mãe de paciente atendido',
      avatar: '/projetos/psicologia/capa-higgsfield.webp',
      quote: '"Quando meu filho começou a ter crises na escola, não sabíamos o que fazer. A psicóloga do Instituto nos acolheu com tanto amor e dedicação que nossa casa voltou a ter paz."',
      story: 'A família recebe acompanhamento parental quinzenal para apoiar o filho no ambiente doméstico.'
    },
    budgetAllocation: [
      { label: 'Honorários dos Psicólogos Clínicos', percent: 55, color: 'bg-[#166534]' },
      { label: 'Brinquedoteca Terapêutica e Testes Psicológicos', percent: 20, color: 'bg-[#b45309]' },
      { label: 'Supervisão Técnica e Encontros Multidisciplinares', percent: 15, color: 'bg-slate-700' },
      { label: 'Infraestrutura da Sala e Recepção', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'neuropedagogia-infantil',
    title: 'Neuropedagogia Infantil',
    category: 'Atendimento & Cidadania',
    categoryTagType: 'primary',
    image: '/projetos/neuropedagogia-infantil/capa.png',
    progressPercent: 0,
    description: 'Diagnóstico e estimulação neuropsicopedagógica para crianças com dificuldades de aprendizagem, TDAH, Dislexia e atrasos do neurodesenvolvimento em Itaguaí.',
    raisedAmount: 0,
    goalAmount: 27000,
    impactBeneficiaries: '70 crianças em intervenção',
    status: 'Ativo',
    location: 'Espaço Multissensorial da Sede - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'Crianças com dificuldades cognitivas e transtornos do neurodesenvolvimento muitas vezes são rotuladas injustamente como "desinteressadas", sofrem exclusão escolar e suas famílias não possuem recursos para pagar avaliações caras em clínicas particulares.',
      solution: 'Criamos um centro especializado com jogos de raciocínio, pranchas multissensoriais, material montessoriano e testes validados para identificar barreiras de aprendizagem e estimular funções executivas cerebrais.',
      methodology: 'Avaliação neuropedagógica detalhada das funções atencionais, memória de trabalho, linguagem e habilidades visuoespaciais, seguida de plano de intervenção semanal individualizado com orientação direta às professoras da rede pública.'
    },
    milestones: [
      { number: '70', label: 'Crianças Atendidas', sublabel: 'Com laudos e intervenção' },
      { number: '100%', label: 'Gratuito', sublabel: 'Jogos e testes inclusos' },
      { number: '15', label: 'Escolas Parceiras', sublabel: 'Interlocução com professores' }
    ],
    gallery: [
      { url: '/projetos/neuropedagogia-infantil/capa.png', caption: 'Estimulação neurocognitiva com materiais pedagógicos adaptados.' },
      { url: '/projetos/neuropedagogia-infantil/galeria-1.jpg', caption: 'Atendimento especializado para crianças com dificuldades de aprendizagem.' },
      { url: '/projetos/neuropedagogia-infantil/pexels-cansu-hangul-464804780-30483031.jpg', caption: 'Desenvolvimento do raciocínio lógico, foco e motricidade fina.' }
    ],
    teachers: [
      {
        id: 'neuropedagoga-chefe',
        name: 'Profª Dra. Patrícia Silveira',
        role: 'Neuropsicopedagoga & Fonoaudióloga Social',
        bio: 'Pós-graduada em Neurociência Aplicada à Educação, atuando na inclusão de crianças atípicas em escolas públicas.',
        avatar: '/projetos/neuropedagogia-infantil/capa.png',
        badge: 'Neurociência'
      }
    ],
    events: [
      {
        id: 'neuro-sessoes',
        title: 'Sessões de Estimulação Neurocognitiva',
        date: 'Segundas, Quartas e Sextas',
        time: '08h00 - 16h30',
        location: 'Sala Multissensorial da Sede',
        description: 'Intervenção em dislexia, TDAH, motricidade fina e processamento auditivo.',
        badge: 'Especializado'
      }
    ],
    beneficiaryStory: {
      name: 'Miguel Mendonça (8 anos)',
      role: 'Aluno em Acompanhamento Neuropedagógico',
      avatar: '/projetos/neuropedagogia-infantil/capa.png',
      quote: '"Meu filho tinha 8 anos e não conseguia juntar as sílabas. Em 5 meses com a neuropedagoga do Instituto ele começou a ler os livrinhos da escola. Choramos de alegria em casa."',
      story: 'Miguel superou o bloqueio na alfabetização e hoje lê com desenvoltura perante a turma.'
    },
    budgetAllocation: [
      { label: 'Especialistas em Neuropsicopedagogia e Fonoaudiologia', percent: 50, color: 'bg-[#166534]' },
      { label: 'Jogos de Raciocínio, Materiais Estruturados e Testes', percent: 25, color: 'bg-[#b45309]' },
      { label: 'Capacitação e Encontros com Escolas Públicas', percent: 15, color: 'bg-slate-700' },
      { label: 'Adaptação da Sala Multissensorial', percent: 10, color: 'bg-amber-600' }
    ]
  },
  {
    id: 'assessoria-juridica',
    title: 'Assessoria Jurídica',
    category: 'Atendimento & Cidadania',
    categoryTagType: 'primary',
    image: '/projetos/assessoria-juridica/capa-higgsfield.webp',
    imagePosition: 'right top',
    galleryIsIllustrative: true,
    progressPercent: 0,
    description: 'Orientação jurídica gratuita, acesso a benefícios sociais (BPC/LOAS, Bolsa Família, aposentadoria), direito de família e garantia da cidadania para a população vulnerável.',
    raisedAmount: 0,
    goalAmount: 20000,
    impactBeneficiaries: '140 atendimentos jurídicos/mês',
    status: 'Ativo',
    location: 'Núcleo de Cidadania da Sede - Itaguaí, RJ',
    startDate: 'Atividade contínua',
    fullStory: {
      problem: 'Moradores de comunidades vulneráveis frequentemente desconhecem seus direitos básicos, perdem benefícios por erros burocráticos ou não conseguem resolver conflitos de guarda, pensão alimentícia e regularização de documentos essenciais.',
      solution: 'O Instituto mantém um núcleo de atendimento jurídico voluntário com advogados conveniados e estagiários de Direito para esclarecer dúvidas, mediar acordos e redigir encaminhamentos aos órgãos competentes.',
      methodology: 'Plantões semanais de escuta sociojurídica, análise documental, conciliação e mediação comunitária pacífica de conflitos, além de articulação direta com a Defensoria Pública do Estado do Rio de Janeiro.'
    },
    milestones: [
      { number: '140', label: 'Famílias Orientadas/Mês', sublabel: 'Garantia de direitos e cidadania' },
      { number: '100%', label: 'Gratuito', sublabel: 'Defesa dos mais vulneráveis' },
      { number: '50+', label: 'Benefícios BPC Aprovados', sublabel: 'Auxílio a PCDs e idosos' }
    ],
    gallery: [
      { url: '/projetos/assessoria-juridica/capa-higgsfield.webp', caption: 'Cena ilustrativa de orientação jurídica individual sobre direitos e documentação.', objectPosition: 'center top' },
      { url: '/projetos/assessoria-juridica/galeria-1-higgsfield.webp', caption: 'Cena ilustrativa de análise de documentos com acompanhamento jurídico.', objectPosition: 'center top' },
      { url: '/projetos/assessoria-juridica/galeria-2-higgsfield.webp', caption: 'Cena ilustrativa de orientação sobre direitos sociais para uma família.', objectPosition: 'center top' }
    ],
    teachers: [
      {
        id: 'advogada-coordenadora',
        name: 'Dra. Vanessa Cavalcanti',
        role: 'Advogada Coordenadora (OAB/RJ)',
        bio: 'Especialista em Direito das Famílias e Seguridade Social, atuando na defesa dos direitos humanos na Baixada Fluminense.',
        avatar: '/projetos/assessoria-juridica/capa-higgsfield.webp',
        badge: 'OAB/RJ'
      }
    ],
    events: [
      {
        id: 'plantao-juridico',
        title: 'Plantão de Orientação Jurídica & Cidadania',
        date: 'Sábados',
        time: '09h00 - 13h00',
        location: 'Gabinete Jurídico da Sede',
        description: 'Tira-dúvidas sobre direito de família, pensão, inventário e aposentadoria BPC.',
        badge: 'Cidadania'
      }
    ],
    beneficiaryStory: {
      name: 'Dona Maria Aparecida (64 anos)',
      role: 'Moradora de Itaguaí',
      avatar: '/projetos/assessoria-juridica/capa-higgsfield.webp',
      quote: '"Meu neto autista tinha direito ao benefício BPC mas tínhamos o pedido negado duas vezes no INSS. A advogada do Instituto organizou nossos documentos e conseguimos a aprovação. Mudou nossa vida."',
      story: 'Dona Maria garantiu o benefício assistencial para seu neto com a orientação da equipe.'
    },
    budgetAllocation: [
      { label: 'Advogados Orientadores e Equipe de Apoio Jurídico', percent: 45, color: 'bg-[#166534]' },
      { label: 'Despesas com Certidões, Impressões e Autenticações', percent: 25, color: 'bg-[#b45309]' },
      { label: 'Cartilhas Informativas de Direitos do Cidadão', percent: 15, color: 'bg-slate-700' },
      { label: 'Manutenção da Sala de Atendimento', percent: 15, color: 'bg-amber-600' }
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'valeria',
    name: 'Valéria Santos',
    role: 'Empreendedora e Ex-Aluna',
    avatar: '/depoimentos/valeria.jpg',
    quote: '"Fazia 2 anos que eu estava desempregada e sem saber como sustentar minhas filhas. Entrei na oficina de corte e costura sem saber nem segurar a linha. Hoje recebo encomendas semanais e montei meu ateliê em casa."',
    rating: 5
  },
  {
    id: 'rodrigo',
    name: 'Rodrigo Prado',
    role: 'Voluntário em Tecnologia',
    avatar: '/depoimentos/rodrigo.jpg',
    quote: '"Como voluntário de programação aos sábados, vi adolescentes que nunca tiveram computador criarem suas primeiras páginas web. A empolgação nos olhos deles transforma quem ensina tanto quanto quem aprende."',
    rating: 5
  },
  {
    id: 'camila',
    name: 'Camila Alencar',
    role: 'Diretora de Sustentabilidade',
    avatar: '/depoimentos/camila.jpg',
    quote: '"Nossa empresa audita rigorosamente as entidades que apoia. O Instituto Caminho e Forma impressiona pela clareza contábil, pontualidade nos relatórios e engajamento genuíno com os moradores de cada território."',
    rating: 5
  }
];

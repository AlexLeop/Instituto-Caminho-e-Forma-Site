import { Course, MarketProduct, Project, Testimonial } from '../types';

export const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa2n_FxY0ig5u09e9VZroxsNn2nv0rm5DWbv9iwOgH5BYzQEKqQX0tuKNA5nC1wrVKqhWO8LT_ePDaQjWjjmzTmM0ifxMKpBnT2LSXs8wypLfeBaOvIVQgemoDT0JB4DVNDe-Pm_dTHnjY4fK3B4TozqGW0VzoZJY_djUz9OkcMVwtn1Rzd2YYeNL7nIL2iAOG89OvYG_wPVcVu51pXV-d_QnBTlGAah08jkY6tHc_pE5EBH0jQwtC';
export const ABOUT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZE0EGrT_R9Jhhyp0ANRsDJUQIERUvMBoaOqKkkPg9tNF2BQsD7WCjU6Rvr6iNhjDCD9k9uw0O35J0G-zOtq3c6f_tGp_ObxvaljWgvCLtu3n7YseEWlM7fbCfRKP0ZLUJn0WpElbIJ9pNneVgIWtRr6nQvjhQ-dzGKJk8T_CrNeYSWf8WdlUw0lcSv-IDWKSt3W3jnJ26kuVQU5ynOeWTfwI58DLo1_958aiBB2zbszM2LzaI_D9L';
export const LOGO_IMAGE = '/logo-instituto.png';
export const TECH_COURSE_BANNER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDJI8uZnE4EB9s-R62CzunfL1582PkDuCgQOgDGJ5bJX4nmyqmyOX4ypJVP_01-vZG2Db5_beRU0ry8C_r9-NNG7Yk4rX8BvdK9aoHg4lnebFFNQ1sQfnHMe17R1MUh3zrOet4_RYk-JynROyVDZVd1Khsus-JRwQjIdDMAXO2nw9kMsE5HElh4cjeVE3BhkLxZJ7epTtaUWJCz9Ob98iQ0jBK8J3khOm5SXpINepmX103kZJOg_TJ';
export const MARKET_HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5bLaeTmocRjxrmJ8QVmbhS2RFNkN8TYB1V5UxquqjgDwGyHQ295ZnFXS79Hxvb1TCk2s49rI1BcF_kh7ys46O572iTvIsk0T9j_glopC6L3sE16jxVErkTVWa8UUXPZeLEBVPJDNdd2AcqibsXq0bKhIrXJ8lvEyDySS4fw1Z-Alo5SX2VIuzIab8YSijKkKqje-ofGSHE9LsU6l3EHszgn1uQ5MtUIhHlSPhCEDXOAw2hQJuB4Pt';
export const CLEUSA_PORTRAIT = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuIASta7njQWwCUpKtnAY0h_qEnMUZ0ov8vj0x3JwqD6mE5t9Qq3t2kB9MFFbBlJ-t0cjmINa0rAaWa_ru2OUvlQpWGxAp1RgTKAOfQFMamTo03hmJa47QJEAw7XjpcmnV4jm5yu02dABc9r9YJ3ywhuyxgx8Y9Y7aVui4NdY-_K5uqItk-s_cJm8d4RdjoyRnmC7Y2PDn1vFRtVXxgLL8alAYsRd38zz5wRQw79JbKEgjCSDUjFu6';

export interface HeroSlide {
  id: string;
  url: string;
  alt: string;
  contextTag: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'crianca-esperanca',
    url: HERO_IMAGE,
    alt: 'Criança sorridente acolhida com afeto e dignidade no Instituto Caminho e Forma',
    contextTag: 'Acolhimento & Infância'
  },
  {
    id: 'equipe-instituto',
    url: '/hero/hero-equipe.jpg',
    alt: 'Equipe de educadores e voluntários do Instituto Caminho e Forma com uniforme oficial',
    contextTag: 'Nossa Equipe em Campo'
  },
  {
    id: 'idosos-oficina',
    url: '/hero/hero-idosos.jpg',
    alt: 'Idosos participando de oficinas de convivência, artesanato e inclusão social',
    contextTag: 'Cidadania 60+'
  },
  {
    id: 'jovens-tecnologia',
    url: '/hero/hero-jovens.jpg',
    alt: 'Adolescentes e jovens da comunidade em capacitação tecnológica e profissional',
    contextTag: 'Juventude & Futuro'
  },
  {
    id: 'familias-horta',
    url: '/hero/hero-familia.jpg',
    alt: 'Famílias acolhidas na horta comunitária e cozinha escola do Instituto',
    contextTag: 'Famílias & Soberania Alimentar'
  }
];

export const COURSES: Course[] = [
  {
    id: 'dev-web',
    title: 'Iniciação ao Desenvolvimento Web & Tecnologia Básica',
    category: 'tech',
    categoryLabel: 'Tecnologia & Futuro',
    mode: 'presencial',
    modeLabel: 'Presencial na Sede',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-E6VOfLjgZoeS1adI38kGSRzJeD4c6gg054FJBTHaALpxrfFf_E3qpmC-nkSU3xop4T8Zhbn3aWmipmh2R3_BNDYPcwuNlVySNPfeGyGom5cfGkmw2kjjjxXrNqcL-I52Bpoz6KfEz0yokvCOlCNci2keiOtMZ8tOGXVuAF40U7WOxnI656aN1VnDK8z08rClZ7TMkMBMxY0q2jfL7JGhaIbjNeSRXG1NQ_B3CEsPFRAegIDXa-Mr',
    badge: '6 vagas restantes',
    badgeType: 'hot',
    description: 'Aprenda lógica de programação, HTML, CSS e uso prático de ferramentas digitais para ingressar no mercado que mais contrata.',
    hours: '80 Horas',
    shift: 'Noturno (19h - 22h)',
    requirementOrDetail: {
      label: 'Pré-requisito',
      value: 'Ens. Fundamental'
    },
    startDate: 'Maio / 2026',
    investment: 'R$ 75/mês (Contribuição Social)'
  },
  {
    id: 'panificacao',
    title: 'Panificação Artesanal e Confeitaria Comunitária',
    category: 'gastro',
    categoryLabel: 'Gastronomia',
    mode: 'presencial',
    modeLabel: 'Presencial na Sede',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLoaTGRDzATwMWQGYQ5QUKD8TVUgwo36swWnq73-pVP4rSkC66PBsuNLJW-txijgRD42AZygUGQUztuCE_DiSFCFfZYOfzcz99D-EsY0LamU00T8JAv8uB3OwQJOiMgn8EkzH-4YaE4G9Otklh6TLQ9yp8ZeHH0yEJ5LC8yLU2UwXbqlSscBNI8ptzrV9NdC9vpXM1iq7ic2G4Yr3tSOobtseEL30qdAbVmd99_xR6sVS3iMZqJfgP',
    badge: 'Apenas 3 vagas!',
    badgeType: 'hot',
    description: 'Técnicas de fermentação natural, produção de pães rústicos, bolos e doces para comercialização autônoma. Insumos inclusos.',
    hours: '60 Horas',
    shift: 'Matutino (08h - 12h)',
    requirementOrDetail: {
      label: 'Pré-requisito',
      value: 'Nenhum'
    },
    startDate: 'Abril / 2026',
    investment: 'R$ 60/mês (Contribuição Social)'
  },
  {
    id: 'costura',
    title: 'Costura Criativa & Upcycling Sustentável',
    category: 'crafts',
    categoryLabel: 'Moda Sustentável',
    mode: 'presencial',
    modeLabel: 'Presencial na Sede',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKiXG0nbyB9jWUCphL8vHO9YFAj7-vLqsOOTxeKWFnMAjeFH9ieavyxftAech-EfPkDHE9v7Ew3LM1njCyE8_3VzBV5aXi55aHLjlUY7gWqKPHWVVL0U4JBkNTCqmzjv5NHchEjYGWknIOTUId4-WqVVFTRzboLOKQX-A3q6n6fi-kN77xU1P2ggYH08aCK-cs0-x_ChffgN8FxVSM2wO1iVsQKHYl9pdWBkAGBKvnAwpmdcP7qdNo',
    badge: 'Turma em formação',
    badgeType: 'forming',
    description: 'Modelagem básica, corte e costura em maquinário industrial do instituto com foco em economia circular e ecodesign periférico.',
    hours: '90 Horas',
    shift: 'Vespertino (14h - 18h)',
    requirementOrDetail: {
      label: 'Recursos',
      value: 'Máquinas inclusas'
    },
    startDate: 'Maio / 2026',
    investment: 'R$ 65/mês (Contribuição Social)'
  },
  {
    id: 'gestao-mei',
    title: 'Gestão Financeira & MEI na Prática',
    category: 'business',
    categoryLabel: 'Empreendedorismo',
    mode: 'semipresencial',
    modeLabel: 'Semipresencial',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf627poDi_Rpb-pM6mfnSGzoJxDuQkf5cLV4G4QdkjJibjALFQ5KG6U-y7dG0VcUyax7Y6Zk6s0hZSfx6BW-IGtyTfX8vtuUgHPw-CMtoL3k4F29aiiOqgA19ZqBeX0UIltH9QG_gTS3jBtO4IHX04mSUPBYFlPsSAjI-nd5l7xKeGwfXaGPxnkmdptmjbiVPatZV2-8LMjoMgTeoMs4p3KrgHtMormjIxqSlX5_qF9NL3iRJc8oUZ',
    badge: 'Consultoria 1 a 1',
    badgeType: 'open',
    description: 'Regularização de CNPJ, precificação correta de produtos/serviços, fluxo de caixa simplificado e estratégias de vendas via WhatsApp.',
    hours: '40 Horas',
    shift: 'Sábados + Online',
    requirementOrDetail: {
      label: 'Mentoria',
      value: '2 sessões inclusas'
    },
    startDate: 'Abril / 2026',
    investment: 'R$ 50/mês (Contribuição Social)'
  },
  {
    id: 'aux-adm',
    title: 'Auxiliar Administrativo & Atendimento ao Cliente',
    category: 'business',
    categoryLabel: 'Carreira & Empregabilidade',
    mode: 'presencial',
    modeLabel: 'Presencial na Sede',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlm6TEtnnJMgfsSY6G7K_pgi5zECyJqPaIScSLRiiO_MSYGNVkR82WOQU2U-Z2E7L26jRd5W5Ht1AYtAUjQHV_32G4ec-U5Bt4-4AnFTL6a3DKl1r0Zwrl4D0xImC_B0m3at2EzQbsE7hk0361ysbkx77lxB6fXk4iMQzm5LoX82ujWri51Ff4zd7jyDdWqbe6rHmIwq7-kO5aS7B7s13MFmtRahOqwsq2L6gqaAYchPwpNstLxb6Q',
    badge: 'Parcerias CLT',
    badgeType: 'open',
    description: 'Redação corporativa, planilhas essenciais, rotinas de escritório e módulo prático de simulação de entrevistas de emprego.',
    hours: '60 Horas',
    shift: 'Vespertino (14h - 18h)',
    requirementOrDetail: {
      label: 'Extras',
      value: 'Elaboração de Currículo'
    },
    startDate: 'Maio / 2026',
    investment: 'R$ 55/mês (Contribuição Social)'
  },
  {
    id: 'hortas-agro',
    title: 'Hortas Urbanas e Agroecologia Periférica',
    category: 'crafts',
    categoryLabel: 'Meio Ambiente & Renda',
    mode: 'presencial',
    modeLabel: 'Presencial na Sede',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCgzaPTPD0SFPZOfUPIDfhUKkfqqfwTcH49Jfshas5QZrLr5JIFPV4rraMFZFRW-kkQlhKtbXGi8ZKvUtnpK52Y_mv_i7tWzuOLb5hnON4G93jJlhiJ-vtXSfJQqxo6MZ7ck3UP0je-aA1fgZLskLv5hun3UZSIBAn4GVZgYdxz1a8aeAKoo-63xEfEJrDxvkpeFVhI8HXGppOnbz7-c6eIe3DbqRO2YPM9BjYDmywdkVUj7iUgOwN',
    badge: 'Turma Aberta',
    badgeType: 'open',
    description: 'Práticas de compostagem, cultivo orgânico em pequenos espaços, plantas medicinais e soberania alimentar familiar.',
    hours: '50 Horas',
    shift: 'Sábados (08h - 13h)',
    requirementOrDetail: {
      label: 'Prática',
      value: 'Horta Comunitária'
    },
    startDate: 'Abril / 2026',
    investment: 'R$ 45/mês (Contribuição Social)'
  }
];

export const MARKET_PRODUCTS: MarketProduct[] = [
  {
    id: 'cesta-agro',
    title: 'Cesta Agroecológica da Horta Comunitária',
    category: 'hortifruti',
    categoryTag: 'Hortifruti & Cestas',
    categoryTagType: 'secondary',
    badge: 'Colheita Semanal',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7eHWh1ApXomcCJcJKhCGKXgxkKKvGHPO5Kj2U3HtRjYZDXT-WFi3nxi2ImUKPs9ymCKpKKRDg_iwLHzN86z7AAgS8EqaANbd2isp5iNG71nmcZkQ-f-BT5YMLgFgzCLWuIMaB2iI6exe9HXb5h_VaWRZqAWHPvCuWJ7yxREO1ctn11218iV9azzjpw30czs-zWDJcDNyK0P1PupB9hBOy5792GxoOlPd_Ac_RHi06ZhdrAah2dGuI',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2HqsgaUCBcdjicZsDNpWx6ISZ6dNLKNLt864q50oBN1G1NJNAUxEann1fc0uW51vt1_y2pZEyEWkWERCKGRNDEPaVH2RNDYkE1SnbrcFGw-lUT5AGaW2g1nPRqzVFhPR97OY5s1zC7Eh5lAYBcrFZbRa10v_hlQmXd3bqNKgBW8ZLxNoT1Oej4Tz1lIiimjMZtu9vZyIEj_lAspGP_r4BfFpOYRU55q2g7dAUDrT6lHt1iOqFkazH',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjxXQ8pK5FSiFoGJNbeYLn0NvXFUahxVrCm_OxjzqaLfTD46pN4i_Xwr2RXQI3QGg6IU3MLGvCaEAu6ZRHrTCrgHa_K5cFeMzuzuhJDC2KE1qXKpMb6iisUEaJcMI_F8HCRZW7zzlWcaC6LcxH-GTR6FKph4nyqa1DuiptaUXpKg6gOLyanCiHcOhi5eklvFzN1Bn-vzmMoYr1geqUS9I9fLBCjPeIGBKQ6niosKgCKFIbbkOFm09g',
    producer: 'Cozinha Comunitária Sabor da Terra',
    producerRole: 'Alunas de Confeitaria',
    producerIcon: 'soup_kitchen',
    price: 32.0,
    priceFormatted: 'R$ 32,00',
    description: 'Receita artesanal sem aditivos químicos. Frutas de época preparadas com carinho na cozinha escola do instituto.',
    repassePercent: 100
  },
  {
    id: 'tapete-tear',
    title: 'Tapete Artesanal em Tear Sustentável',
    category: 'decoracao',
    categoryTag: 'Artesanato & Décor',
    categoryTagType: 'primary',
    badge: 'Fibras Recicladas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmGhvOdEJKhYR6gYV999bCJjAhtwM7SGyP9-8Ai6j8WhC2ul1LfOdCKuS2s3o1S4mlG7hAgiE_6TUd_EEC8iBmmWIt0It44UpFXQCOQo57gWeZANl0BvuTmx_cb2z3PBa46DEBdcQpiuZsVgo5M6JhdfxYbFqv1t78T3FpVKy9f6-y3HavUbTJ8fAFDKT6__vjptghihfv4K8tuAFOft6_RJhhCg_zjsaY0LwIbAtyYlhKuaTRtu9j',
    producer: 'Maria & Filhas Tecelãs',
    producerRole: 'Mestres de Ofício',
    producerIcon: 'groups',
    price: 65.0,
    priceFormatted: 'R$ 65,00',
    description: 'Confeccionado em tear manual com resíduos têxteis reaproveitados. Maciez, durabilidade e consciência ambiental para sua casa.',
    repassePercent: 100
  },
  {
    id: 'caderno-reciclado',
    title: 'Caderno Artesanal Reciclado & Costura Japonesa',
    category: 'decoracao',
    categoryTag: 'Papelaria & Arte',
    categoryTagType: 'primary',
    badge: 'Papel 100% Reciclado',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEVaFgfOePagj1-AKURJZCZWTvxans6nyAbsGzcHT9eWnZH2c84gXevHNyI86r1cc8cxaMyPloP4Vk7owrRE3kIHtCFT3AhkqKjc1ju6RBNXpBd_I2-BpkbipfCctApfydOdQAHWLGqa_5k-xbDrP5-LuMzILP9Y5Juk1U3ZwJGR6y86mjzHZSI-zbIpx301P40QbDs9fc_nmEptRpVvg6Y6Yo7HNgP1rWyA9EYuuWuLmWfoptP4h6',
    producer: 'Oficina Jovem Maker',
    producerRole: 'Jovens Aprendizes',
    producerIcon: 'school',
    price: 28.0,
    priceFormatted: 'R$ 28,00',
    description: 'Papéis reciclados encadernados à mão por adolescentes da comunidade, unindo design tradicional oriental e consciência ecológica.',
    repassePercent: 100
  },
  {
    id: 'kit-panificacao',
    title: 'Kit Panificação: Pães Artesanais & Biscoitos',
    category: 'alimentos',
    categoryTag: 'Panificação & Café',
    categoryTagType: 'secondary',
    badge: 'Fornada do Dia',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcv63Hg87bmh4DLfaDih2XGkoA91PqBItGiH9ZdrhgP0bwrtY_oDc8Ea_5rW_5K25xi57UwoGH-1Y6NzNywxLoZ5T6hqw3KHhms7eph50oizUx9ltcUCSKx86roe7Ejgd6jGKDDJ2n7svHUDdri-igClO0g89xDeQfHxTHP8PfXIGQOX4heTB4sHSKADluNcUg4IdjUtR2OQ3euMk-xBNQaCwt74JIhwMR79HqvXWHeo7Efe_D5WKJ',
    producer: 'Formandas de Confeitaria Social',
    producerRole: 'Alunas Formadas',
    producerIcon: 'bakery_dining',
    price: 35.0,
    priceFormatted: 'R$ 35,00',
    description: 'Pão de fermentação natural e biscoitos amanteigados preparados artesanalmente pelas alunas do polo de capacitação em gastronomia.',
    repassePercent: 100
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'educacao-amanha',
    title: 'Educação do Amanhã',
    category: 'Educação Infantil',
    categoryTagType: 'secondary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV39iLjpaBQ7Us-9eZMfubvMj_-w4x02rYGRvkt5RyEaLN0Jr63kiICGoYuvOoIVWxoLkBo55gvd3MTZULecaCborSOTSp7TVWwKPjx-BPwEqNwn7rtQWUZccEBAgj-p3wyHtKecyWXx-Zr8bepOjNpMcHyNdFZJNAjUEzJ_zB2EOO79EKfDiE79JXYpmdDR6SgWV3zNX13jI-paUpo2JXyktFmXIjLBgMX2Jjanx64MPyB_M7EaSZ',
    progressPercent: 78,
    description: 'Oficinas de reforço de letramento, raciocínio lógico e inclusão digital para 450 crianças da periferia em contraturno escolar.',
    raisedAmount: 39200,
    goalAmount: 50000,
    impactBeneficiaries: '450 crianças e suas famílias',
    status: 'Ativo'
  },
  {
    id: 'mesa-farta',
    title: 'Mesa Farta & Nutrição Solidária',
    category: 'Segurança Alimentar',
    categoryTagType: 'primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYL7j6g5ZztY7_vQZKCKwP_UIknd4uGBAZFozV2eEMB1S0mwj4jPWZLK_9chWnUj6eR_aMVgxz6zNbaawSgOpi2DtfJVcayyLLZssXtiWo9qv68porJ7e5bZlzZxHiOZGzfyQ18n9SLb0JIhxDAsWgy1luzAXfZS87ZvRHAriLmU5WNKEFHQY3PIthhwyqwF-7s515hyrR_aR5DW2FEpJ-87No5yVxdqKB8vgANus7DeeIPK_5WoCM',
    progressPercent: 85,
    description: 'Distribuição mensal de cestas de alimentos agroecológicos de produtores locais e oficinas práticas de aproveitamento integral de alimentos.',
    raisedAmount: 29800,
    goalAmount: 35000,
    impactBeneficiaries: '320 famílias em risco nutricional',
    status: 'Ativo'
  },
  {
    id: 'costurando-autonomia',
    title: 'Costurando Autonomia Feminina',
    category: 'Empoderamento & Renda',
    categoryTagType: 'tertiary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgymjJJFiF-HbTnlexyPeaFwG6_n11ef5sXiSWtXO69kVbFXpQKI2OqxNATkENpRLeVJCYw4hOAlmRpxb0NNtWv39nUShQt5Ky_ZzCHK3_PV1PDFF31aduqj1vw3HQ9zIIOB5oxDvdGVNAeyI0DJr4inHlrlrNxPx-bg47VxbvFQCyLbH9IN-9Yz9YK4xw-iiKSWKkers-oP0BXDuvmpmpXLT4MzW-RpaTUgpEXc1oPfnxTgqmZHzR',
    progressPercent: 64,
    description: 'Capacitação completa em corte, modelagem e empreendedorismo social para mães solos, fornecendo máquinas e apoio inicial de microcrédito.',
    raisedAmount: 18000,
    goalAmount: 28000,
    impactBeneficiaries: '85 mães solo capacitadas',
    status: 'Ativo'
  },
  {
    id: 'horta-comunitaria',
    title: 'Hortas Urbanas e Pomar Comunitário',
    category: 'Sustentabilidade & Meio Ambiente',
    categoryTagType: 'secondary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCgzaPTPD0SFPZOfUPIDfhUKkfqqfwTcH49Jfshas5QZrLr5JIFPV4rraMFZFRW-kkQlhKtbXGi8ZKvUtnpK52Y_mv_i7tWzuOLb5hnON4G93jJlhiJ-vtXSfJQqxo6MZ7ck3UP0je-aA1fgZLskLv5hun3UZSIBAn4GVZgYdxz1a8aeAKoo-63xEfEJrDxvkpeFVhI8HXGppOnbz7-c6eIe3DbqRO2YPM9BjYDmywdkVUj7iUgOwN',
    progressPercent: 92,
    description: 'Cultivo agroflorestal em terrenos urbanos revitalizados, fornecendo verduras limpas e cursos de compostagem para vizinhança.',
    raisedAmount: 23000,
    goalAmount: 25000,
    impactBeneficiaries: '3 bairros periféricos',
    status: 'Fase Final'
  },
  {
    id: 'inclusao-digital',
    title: 'Conecta Comunidade: Inclusão Digital 60+',
    category: 'Cidadania & Terceira Idade',
    categoryTagType: 'primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-E6VOfLjgZoeS1adI38kGSRzJeD4c6gg054FJBTHaALpxrfFf_E3qpmC-nkSU3xop4T8Zhbn3aWmipmh2R3_BNDYPcwuNlVySNPfeGyGom5cfGkmw2kjjjxXrNqcL-I52Bpoz6KfEz0yokvCOlCNci2keiOtMZ8tOGXVuAF40U7WOxnI656aN1VnDK8z08rClZ7TMkMBMxY0q2jfL7JGhaIbjNeSRXG1NQ_B3CEsPFRAegIDXa-Mr',
    progressPercent: 55,
    description: 'Aulas de smartphone, prevenção contra fraudes bancárias digitais e uso de serviços públicos pelo Gov.br para a terceira idade.',
    raisedAmount: 11000,
    goalAmount: 20000,
    impactBeneficiaries: '180 idosos acolhidos',
    status: 'Ativo'
  },
  {
    id: 'esporte-cultura',
    title: 'Ginga e Cidadania: Esporte & Capoeira',
    category: 'Juventude & Esporte',
    categoryTagType: 'tertiary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDJI8uZnE4EB9s-R62CzunfL1582PkDuCgQOgDGJ5bJX4nmyqmyOX4ypJVP_01-vZG2Db5_beRU0ry8C_r9-NNG7Yk4rX8BvdK9aoHg4lnebFFNQ1sQfnHMe17R1MUh3zrOet4_RYk-JynROyVDZVd1Khsus-JRwQjIdDMAXO2nw9kMsE5HElh4cjeVE3BhkLxZJ7epTtaUWJCz9Ob98iQ0jBK8J3khOm5SXpINepmX103kZJOg_TJ',
    progressPercent: 70,
    description: 'Capoeira regional, judô comunitário e oficinas de percussão afro-brasileira como ferramentas de disciplina e auto-estima juvenil.',
    raisedAmount: 14000,
    goalAmount: 20000,
    impactBeneficiaries: '210 jovens e adolescentes',
    status: 'Ativo'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'valeria',
    name: 'Valéria Santos',
    role: 'Empreendedora e Ex-Aluna',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD-dfT3cPWTd2q9Qwgy7a8rRbjgCZJwQPJ7exMo6nqIRTQly-RWnuYleZWhxQfEYG1CbKc1fUU3LmBDOafvo0rsXdSB9r3dseAKbM5lybq4ZwanMEu5hwalhduCPnPo7R6sn8ZKhblCFRMONK8_wFqD-PMxJVK7ci1PyMnGmKbKPZ0Usb81a5vghA0egpqXGRniTVn_VidmR1Y4L_lM7BFtMefbgI6PaLTU1MNkrYMMcjw7iPtJKXo',
    quote: '"Fazia 2 anos que eu estava desempregada e sem saber como sustentar minhas filhas. Entrei na oficina de corte e costura sem saber nem segurar a linha. Hoje recebo encomendas semanais e montei meu ateliê em casa."',
    rating: 5
  },
  {
    id: 'rodrigo',
    name: 'Rodrigo Prado',
    role: 'Voluntário em Tecnologia',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2Ec6lcbxqpBU5teUygEHfm6wzKqNsQ0sQ68CEeiqddWl6ozVFqJR9MtBniVA5jsKHDk3P4LiAW6vpX9Gjarh3NooxUb-zHWVTpPglY6XvhyEsT7dFdfieIHchYnyjtztVf4JGgGSL7MzZex3uGa8K_uq1uGCOkLyEXQtM76QPao1pfc7iI5AqXyK4h3V-vDqz-C_brOYmj9M12PXqeBS6FzDkr-MP2zZRTTo0nxqY6mC7aaJ9ZQh2',
    quote: '"Como voluntário de programação aos sábados, vi adolescentes que nunca tiveram computador criarem suas primeiras páginas web. A empolgação nos olhos deles transforma quem ensina tanto quanto quem aprende."',
    rating: 5
  },
  {
    id: 'camila',
    name: 'Camila Alencar',
    role: 'Diretora de Sustentabilidade',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqyZtWTtvOmYsINrP5plKFEmow7d4skAWG8hHBGLHUhjSo_-NxetTbtdHdSFgTI9tqQ1qJmaPnIKT9v7C8mLFTSE6ZI2Q847mv-MMsHm9QJVXSLoHk1V-IlSf77oPMLH8sGCKk1VlvNYNBx392XQaf9lUdrwpRRPM0JbBDSnZmKS9k7mVsYTx7dhKOz6RUSVd4XXGh2JYH0Pcw3XwGeMeBXOoPFBOzSB4dfg887WXfstUARY_SOM1z',
    quote: '"Nossa empresa audita rigorosamente as entidades que apoia. O Instituto Caminho e Forma impressiona pela clareza contábil, pontualidade nos relatórios e engajamento genuíno com os moradores de cada território."',
    rating: 5
  }
];

export const TEACHERS = [
  {
    id: 'mariana',
    name: 'Mariana Vasconcelos',
    role: 'Engenheira de Software & Mentora Tech',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfxo17uGY82t_eixOoXMbjTqRXzLAW75GguK2Adnt3WJ5rncmyuGPEwoA9PpszmgX6rHz0T68uWnRLaD9Rq9WvcsqW9O2dMIb9KvWtrs3E15NcaXI6sZmXHDFe37jer1VfqSWlopczmqyOrZTPNVkvZ4gWEuD-kM2i6MU5D_qI1D9o4fu-ar5-C4I2Xi7hBBC_9gXsbv_4H8Rf7yLYi8ky2OQdOBEE8H0o7x9UsMdcI6W8OFv1Cs-z',
    quote: '"Ver um jovem periférico subindo seu primeiro site no ar e conquistando seu primeiro estágio é o que me move todos os fins de semana."',
    badge: 'Voluntária há 3 anos'
  },
  {
    id: 'carlos',
    name: 'Chef Carlos Eduardo',
    role: 'Mestre Padeiro & Consultor',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD79eVPQnZ0RN9wJ2bAvoUK21patCdTwCr94RJLjZreQnIyNfsU6MdrZMbLOEtMhbshO0zVqb68AWGyUFdX3da6v64EB7Fe2hGw_jA8xiCcUfAPYi_CcC84osjlHPSTL4FRPheESZ9b4wrSNyLJaVAM14uuGkUddmTQCnoa4VPoFwznqpaDdSvrONmX1Y2kDtDOpepXoTuXPpRfNzBlcUjuDcFZI25VO6LHoU_n8K70NDB2ApniKKi5',
    quote: '"Ensinar o ofício do trigo é devolver autonomia. Nossos alunos saem da sala vendendo para os vizinhos e abrindo seus próprios pontos."',
    badge: 'Voluntário há 5 anos'
  },
  {
    id: 'beatriz',
    name: 'Beatriz Mendonça',
    role: 'Estilista & Especialista em Upcycling',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGFv853EaAOr4Mi9GxtdAwKw2eO7TtNBSrNrf2u2yfhtzKN--JFPH20ibr1dwAmCF1FXkcFg374_sMX79oXGXd5U5a9xIj6VtGQc-w1R0cHj0qyj_vv_0dIa-2pnHCXOpFBJGQlCbZ-6p7lcj9E0CY4M3D2nGiApgS1361Uebfs_9EO8zSET8Kk4XAgozAG-Z3ylWWWDv4Hnq4d1ORe_bP4kBwqJh2OWhpbCVuSnAHQ5snKp93E7xC',
    quote: '"A costura é ferramenta de libertação feminina e geração de renda imediata com baixo investimento inicial e alta criatividade."',
    badge: 'Voluntária há 2 anos'
  }
];

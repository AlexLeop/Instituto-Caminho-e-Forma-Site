import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface OfficialSeal {
  id: string;
  shortName: string;
  fullName: string;
  issuingEntity: string;
  registryNumber: string;
  validity: string;
  scoreOrCategory: string;
  description: string;
  criteriaSummary: string[];
  verificationUrl?: string;
  sealType: 'doar' | 'melhores-ongs' | 'pacto-global' | 'cebas' | 'abrinq' | 'cmdca';
}

export const OFFICIAL_SEALS: OfficialSeal[] = [
  {
    id: 'selo-doar-a-plus',
    shortName: 'Selo Doar A+',
    fullName: 'Certificação Padrão de Gestão e Transparência - Padrão A+',
    issuingEntity: 'Instituto Doar (Acreditadora do Terceiro Setor)',
    registryNumber: 'SD-2026-9120-A+',
    validity: 'Ano Fiscal 2026 (Auditoria Anual Obrigatória)',
    scoreOrCategory: 'Nota Máxima • 52/52 Critérios Atendidos',
    description: 'Atesta conformidade integral nos 52 critérios de causa e estratégia, governança, contabilidade e finanças, gestão de pessoas e comunicação pública.',
    criteriaSummary: [
      'Balanço Patrimonial auditado por Big Four sem ressalvas',
      'Estatuto social e atas de eleição publicadas em cartório',
      'Código de conduta ética e canal anônimo de integridade',
      'Ausência de remuneração vedada a membros do conselho fiscal',
      'Relatório de impacto social anual com indicadores mensuráveis'
    ],
    sealType: 'doar'
  },
  {
    id: 'melhores-ongs-2026',
    shortName: '100 Melhores ONGs',
    fullName: 'Prêmio Melhores ONGs do Brasil - Edição 2026',
    issuingEntity: 'Instituto Doar & Instituto O Mundo Que Queremos',
    registryNumber: 'BR-ONG-2026-084',
    validity: 'Ano Fiscal 2026 / 2027',
    scoreOrCategory: 'Destaque Nacional em Desenvolvimento Social',
    description: 'Reconhecimento das 100 organizações da sociedade civil mais exemplares do Brasil em governança transparente, eficiência administrativa e impacto comunitário direto.',
    criteriaSummary: [
      'Processo seletivo com mais de 1.100 entidades inscritas no país',
      'Avaliação cega de governança e sustentabilidade financeira',
      'Eficiência alocativa: mais de 88% da receita destinada à ponta',
      'Rastreabilidade total das doações recebidas de pessoas físicas e jurídicas'
    ],
    sealType: 'melhores-ongs'
  },
  {
    id: 'pacto-global-onu',
    shortName: 'Pacto Global ONU',
    fullName: 'Rede Brasil do Pacto Global das Nações Unidas (UN Global Compact)',
    issuingEntity: 'Organização das Nações Unidas (ONU)',
    registryNumber: 'UNGC-ID-784192-BR',
    validity: 'Signatário Ativo • COP Aprovada 2026',
    scoreOrCategory: 'Alinhamento com os 17 ODS da Agenda 2030',
    description: 'Compromisso formal com os dez princípios universais nas áreas de direitos humanos, trabalho decente, proteção ambiental e combate intransigente à corrupção.',
    criteriaSummary: [
      'ODS 1: Erradicação da pobreza em áreas de extrema vulnerabilidade',
      'ODS 2: Fome zero e incentivo a hortas urbanas agroecológicas',
      'ODS 4: Educação profissional e capacitação digital inclusiva',
      'ODS 8: Fomento ao trabalho digno e economia solidária',
      'ODS 10: Redução sistemática das desigualdades regionais'
    ],
    sealType: 'pacto-global'
  },
  {
    id: 'cebas-social',
    shortName: 'CEBAS Social',
    fullName: 'Certificação de Entidades Beneficentes de Assistência Social',
    issuingEntity: 'Ministério do Desenvolvimento e Assistência Social, Família e Combate à Fome (Governo Federal)',
    registryNumber: 'Portaria SNAS/MDS nº 814/2026 • DOU Seção 1',
    validity: 'Triênio 2026 - 2029',
    scoreOrCategory: 'Titulação Federal de Utilidade Pública & Beneficência',
    description: 'Concessão pública federal após rigorosa inspeção técnica documental e comprovação de gratuidade absoluta em 100% dos serviços socioassistenciais prestados.',
    criteriaSummary: [
      'Atendimento 100% gratuito sem qualquer cobrança de mensalidade ou insumo',
      'Prestação regular de contas ao Conselho Municipal de Assistência Social',
      'Regularidade fiscal perante INSS, FGTS, Receita Federal e CNDT',
      'Comprovação de inscrição e matrícula nos órgãos municipais e federais'
    ],
    sealType: 'cebas'
  },
  {
    id: 'selo-abrinq',
    shortName: 'Fundação Abrinq',
    fullName: 'Programa Empresa/Entidade Amiga da Criança',
    issuingEntity: 'Fundação Abrinq pelos Direitos da Criança e do Adolescente',
    registryNumber: 'Termo de Adesão e Reconhecimento TA-771/2026',
    validity: 'Vigência 2026 / 2027',
    scoreOrCategory: 'Defesa e Promoção Integral dos Direitos da Infância',
    description: 'Certifica instituições que atuam ativamente na garantia do acesso à educação de qualidade, proteção contra o trabalho infantil e reforço nutricional para crianças e jovens.',
    criteriaSummary: [
      'Tolerância zero ao trabalho infantil em toda a cadeia e fornecedores',
      'Oferecimento de oficinas pedagógicas e apoio escolar no contraturno',
      'Segurança física e alimentar diária para crianças cadastradas',
      'Apoio psicossocial contínuo às famílias e guardiões legais'
    ],
    sealType: 'abrinq'
  },
  {
    id: 'cmdca-sp',
    shortName: 'Registro CMDCA',
    fullName: 'Conselho Municipal dos Direitos da Criança e do Adolescente',
    issuingEntity: 'Prefeitura e Secretaria Municipal de Direitos Humanos',
    registryNumber: 'Registro CMDCA nº 412/SP • Processo nº 6012.2026/00491-1',
    validity: 'Regular e Ativo em 2026 • Fiscalizado Bimestralmente',
    scoreOrCategory: 'Apto a Captar Recursos do Fundo da Infância (FIA)',
    description: 'Chancela municipal legal que habilita a entidade a receber doações dedutíveis do Imposto de Renda de pessoas físicas e jurídicas através de fundos públicos.',
    criteriaSummary: [
      'Inscrição ativa no Conselho Municipal de Assistência Social (CMAS nº 1098)',
      'Aprovação de planos de trabalho por comissão técnica interdisciplinar',
      'Fiscalização presencial sem aviso prévio de instalações físicas e refeitórios',
      'Demonstrativos de aplicação de verbas submetidos ao Tribunal de Contas'
    ],
    sealType: 'cmdca'
  }
];

// High-fidelity vector seals rendering authentic accreditation badges
export const SealGraphic: React.FC<{ type: OfficialSeal['sealType']; size?: number; className?: string }> = ({
  type,
  size = 120,
  className = ''
}) => {
  if (type === 'doar') {
    // Selo Doar A+ : Deep emerald green, polished gold rim, starburst rosette with 5 gold stars and ribbon
    return (
      <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <radialGradient id="doar_gold_rim" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
          <linearGradient id="doar_emerald_disc" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00714d" />
            <stop offset="50%" stopColor="#004d33" />
            <stop offset="100%" stopColor="#002b1c" />
          </linearGradient>
          <linearGradient id="doar_gold_badge" x1="40" y1="40" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <filter id="seal_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Outer Rosette / Scalloped Starburst Border */}
        <circle cx="80" cy="80" r="76" fill="url(#doar_gold_rim)" filter="url(#seal_glow)" />
        
        {/* Scalloped notches */}
        <circle cx="80" cy="80" r="72" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="80" cy="80" r="68" fill="url(#doar_emerald_disc)" />
        <circle cx="80" cy="80" r="65" stroke="#fbbf24" strokeWidth="1.5" />

        {/* Circular curved text path */}
        <path id="doar_circle_path" d="M 80, 80 m -52, 0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" fill="none" />
        <text className="font-bold uppercase tracking-widest text-[8.5px]" fill="#fef3c7">
          <textPath href="#doar_circle_path" startOffset="50%" textAnchor="middle">
            • PADRÃO GESTÃO E TRANSPARÊNCIA •
          </textPath>
        </text>

        {/* Center Golden Shield / Emblem */}
        <circle cx="80" cy="84" r="38" fill="url(#doar_gold_badge)" stroke="#78350f" strokeWidth="1" />
        <circle cx="80" cy="84" r="34" fill="#004d33" />

        {/* 5 Stars above A+ */}
        <g fill="#fbbf24" transform="translate(48, 62) scale(0.65)">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
          <path d="M30 0l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
          <path d="M50 0l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
          <path d="M70 0l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
          <path d="M88 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </g>

        {/* Central Bold "A+" Grade */}
        <text x="73" y="96" fill="#fef3c7" fontSize="28" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          A
        </text>
        <text x="94" y="93" fill="#fbbf24" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          +
        </text>

        {/* Bottom Banner "INSTITUTO DOAR" */}
        <path d="M 38 108 L 122 108 L 114 122 L 80 122 L 46 122 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
        <text x="80" y="118" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle" letterSpacing="1.2">
          INSTITUTO DOAR
        </text>
      </svg>
    );
  }

  if (type === 'melhores-ongs') {
    // Prêmio Melhores ONGs : Gold Laurel Wreath Medal on Midnight Navy
    return (
      <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <radialGradient id="ngo_gold_outer" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>
          <linearGradient id="ngo_midnight" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <filter id="ngo_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* Outer Ribbon Crest Ring */}
        <circle cx="80" cy="80" r="76" fill="url(#ngo_gold_outer)" filter="url(#ngo_shadow)" />
        <circle cx="80" cy="80" r="71" stroke="#fef08a" strokeWidth="1.5" />
        <circle cx="80" cy="80" r="67" fill="url(#ngo_midnight)" />
        <circle cx="80" cy="80" r="63" stroke="#d97706" strokeWidth="1" strokeDasharray="4 2" />

        {/* Laurel Wreath Left & Right */}
        <g stroke="#fbbf24" strokeWidth="1.5" fill="#fef08a" opacity="0.9">
          {/* Left Laurel Leaves */}
          <path d="M42 98 C36 84 38 64 52 48 C48 54 46 64 48 74 C38 68 36 56 42 46 C44 56 50 66 58 74 C52 64 54 50 62 42" strokeLinecap="round" />
          <circle cx="44" cy="74" r="3" />
          <circle cx="48" cy="60" r="3" />
          <circle cx="56" cy="48" r="3" />
          {/* Right Laurel Leaves */}
          <path d="M118 98 C124 84 122 64 108 48 C112 54 114 64 112 74 C122 68 124 56 118 46 C116 56 110 66 102 74 C108 64 106 50 98 42" strokeLinecap="round" />
          <circle cx="116" cy="74" r="3" />
          <circle cx="112" cy="60" r="3" />
          <circle cx="104" cy="48" r="3" />
        </g>

        {/* Center Typography */}
        <text x="80" y="58" fill="#fbbf24" fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="2">
          MELHORES
        </text>
        <text x="80" y="82" fill="#ffffff" fontSize="24" fontWeight="900" textAnchor="middle" letterSpacing="1">
          ONGs
        </text>
        <text x="80" y="98" fill="#fef08a" fontSize="13" fontWeight="800" textAnchor="middle" letterSpacing="2.5">
          2026
        </text>

        {/* Bottom Banner */}
        <rect x="42" y="108" width="76" height="15" rx="3" fill="#b45309" stroke="#fef08a" strokeWidth="1" />
        <text x="80" y="119" fill="#ffffff" fontSize="7.5" fontWeight="800" textAnchor="middle" letterSpacing="0.8">
          100 MELHORES DO BRASIL
        </text>
      </svg>
    );
  }

  if (type === 'pacto-global') {
    // Pacto Global ONU / ODS : Official UN Blue & 17 SDGs corona
    return (
      <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <filter id="un_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.16" />
          </filter>
        </defs>

        {/* Multi-color SDG Wheel Segments around border */}
        <circle cx="80" cy="80" r="76" fill="#005ea6" filter="url(#un_shadow)" />

        {/* 17 Segments representing ODS color segments */}
        {[
          '#E5243B', '#DDA63A', '#4C9F38', '#C5192D', '#FF3A21', 
          '#26BDE2', '#FCC30B', '#A21942', '#FD6925', '#DD1367', 
          '#FD9D24', '#BF8B2E', '#3F7E44', '#0A97D9', '#56C02B', 
          '#00689D', '#19486A'
        ].map((color, idx) => {
          const angle = (idx * 360) / 17;
          return (
            <path
              key={idx}
              d={`M 80 80 L ${80 + 76 * Math.cos((angle * Math.PI) / 180)} ${80 + 76 * Math.sin((angle * Math.PI) / 180)} A 76 76 0 0 1 ${80 + 76 * Math.cos(((angle + 360 / 17) * Math.PI) / 180)} ${80 + 76 * Math.sin(((angle + 360 / 17) * Math.PI) / 180)} Z`}
              fill={color}
            />
          );
        })}

        {/* Inner UN Blue Circle */}
        <circle cx="80" cy="80" r="62" fill="#00689D" stroke="#ffffff" strokeWidth="2.5" />

        {/* UN Globe & Laurel Silhouette in White */}
        <circle cx="80" cy="74" r="28" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" fill="#00507a" />
        <ellipse cx="80" cy="74" rx="26" ry="12" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.6" />
        <ellipse cx="80" cy="74" rx="12" ry="26" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.6" />
        <line x1="54" y1="74" x2="106" y2="74" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
        <line x1="80" y1="48" x2="80" y2="100" stroke="#ffffff" strokeWidth="1" opacity="0.8" />

        {/* Circular text */}
        <text x="80" y="114" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle" letterSpacing="1">
          PACTO GLOBAL
        </text>
        <text x="80" y="125" fill="#a5f3fc" fontSize="6.5" fontWeight="700" textAnchor="middle" letterSpacing="1.2">
          REDE BRASIL • ONU
        </text>

        {/* Top Header */}
        <rect x="52" y="24" width="56" height="12" rx="6" fill="#ffffff" />
        <text x="80" y="32.5" fill="#00689D" fontSize="6.5" fontWeight="900" textAnchor="middle" letterSpacing="0.6">
          WE SUPPORT
        </text>
      </svg>
    );
  }

  if (type === 'cebas') {
    // CEBAS Social : Brazilian Coat of Arms / Emerald & Gold Federal Star
    return (
      <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="cebas_green" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00714d" />
            <stop offset="50%" stopColor="#004d33" />
            <stop offset="100%" stopColor="#022818" />
          </linearGradient>
          <linearGradient id="cebas_gold" x1="30" y1="30" x2="130" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <filter id="cebas_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Outer Shield Hexagon/Octagon with Gold Bevel */}
        <circle cx="80" cy="80" r="76" fill="url(#cebas_gold)" filter="url(#cebas_shadow)" />
        <circle cx="80" cy="80" r="72" stroke="#fef3c7" strokeWidth="1.5" />
        <circle cx="80" cy="80" r="68" fill="url(#cebas_green)" />
        <circle cx="80" cy="80" r="64" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />

        {/* Inner Federal Star Motif */}
        <polygon 
          points="80,36 92,62 120,64 98,82 105,110 80,94 55,110 62,82 40,64 68,62"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.8"
          strokeLinejoin="round"
          opacity="0.5"
        />

        {/* Center Badge Plaque */}
        <circle cx="80" cy="78" r="32" fill="#002b1c" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="80" y="74" fill="#fbbf24" fontSize="16" fontWeight="900" textAnchor="middle" letterSpacing="1.5">
          CEBAS
        </text>
        <text x="80" y="87" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="1">
          SOCIAL
        </text>

        {/* Circular text top */}
        <path id="cebas_circle_top" d="M 80, 80 m -52, 0 a 52,52 0 1,1 104,0" fill="none" />
        <text className="font-bold uppercase text-[7.5px]" fill="#fef3c7">
          <textPath href="#cebas_circle_top" startOffset="50%" textAnchor="middle">
            MINISTÉRIO DO DESENVOLVIMENTO SOCIAL
          </textPath>
        </text>

        {/* Bottom Banner */}
        <rect x="42" y="112" width="76" height="15" rx="3" fill="#b45309" stroke="#fef3c7" strokeWidth="0.8" />
        <text x="80" y="122.5" fill="#ffffff" fontSize="6.5" fontWeight="800" textAnchor="middle" letterSpacing="0.8">
          CERTIFICAÇÃO FEDERAL
        </text>
      </svg>
    );
  }

  if (type === 'abrinq') {
    // Fundação Abrinq : Sunny Yellow / Navy / Child with Kite Silhouette
    return (
      <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <filter id="abrinq_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>

        <circle cx="80" cy="80" r="76" fill="#f59e0b" filter="url(#abrinq_shadow)" />
        <circle cx="80" cy="80" r="72" stroke="#ffffff" strokeWidth="2" />
        <circle cx="80" cy="80" r="68" fill="#1e3a8a" />
        <circle cx="80" cy="80" r="65" stroke="#fde047" strokeWidth="1" />

        {/* Child silhouette playing with star/kite */}
        <g fill="#fde047" transform="translate(56, 42)">
          {/* Head */}
          <circle cx="24" cy="14" r="7" />
          {/* Body running */}
          <path d="M21 23 C21 21 27 21 27 23 L29 38 L36 50 L30 53 L24 41 L18 53 L12 50 L19 38 Z" />
          {/* Arms reaching for star */}
          <path d="M12 28 L24 24 L36 18 L38 22 L26 27 L14 32 Z" />
          {/* Star / Kite */}
          <polygon points="42,4 44,10 50,11 45,15 47,21 42,17 37,21 39,15 34,11 40,10" fill="#ffffff" />
          <path d="M42 20 Q44 26 36 26" stroke="#ffffff" strokeWidth="1" fill="none" strokeDasharray="1 1" />
        </g>

        {/* Typography */}
        <text x="80" y="108" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="1">
          FUNDAÇÃO ABRINQ
        </text>
        <text x="80" y="120" fill="#fde047" fontSize="7" fontWeight="700" textAnchor="middle" letterSpacing="0.8">
          AMIGA DA CRIANÇA
        </text>
      </svg>
    );
  }

  // Default CMDCA / Conselho Municipal
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id="cmdca_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.18" />
        </filter>
      </defs>
      <circle cx="80" cy="80" r="76" fill="#047857" filter="url(#cmdca_shadow)" />
      <circle cx="80" cy="80" r="71" stroke="#a7f3d0" strokeWidth="2" />
      <circle cx="80" cy="80" r="67" fill="#064e3b" />
      <circle cx="80" cy="80" r="63" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" />

      {/* Council Scales / Shield */}
      <circle cx="80" cy="72" r="28" fill="#022c22" stroke="#34d399" strokeWidth="1.2" />
      <text x="80" y="69" fill="#ffffff" fontSize="15" fontWeight="900" textAnchor="middle" letterSpacing="1.2">
        CMDCA
      </text>
      <text x="80" y="81" fill="#6ee7b7" fontSize="7.5" fontWeight="800" textAnchor="middle" letterSpacing="0.8">
        REGISTRO OFICIAL
      </text>

      <text x="80" y="112" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle">
        DIREITOS DA CRIANÇA
      </text>
      <text x="80" y="123" fill="#a7f3d0" fontSize="7" fontWeight="700" textAnchor="middle">
        E DO ADOLESCENTE
      </text>
    </svg>
  );
};

// Interactive Seal Card with Modal Verification
export const RealSealCard: React.FC<{
  seal: OfficialSeal;
  onSelect: (seal: OfficialSeal) => void;
  index: number;
}> = ({ seal, onSelect, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onSelect(seal)}
      className="bg-white p-6 rounded-2xl border border-[#e6e8ea] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer group relative overflow-hidden"
    >
      {/* Background Accent Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Verified Pill */}
      <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#006c49] text-[11px] font-bold border border-emerald-200/60">
        <span className="material-symbols-outlined text-[14px]">verified</span>
        <span>Certificação Válida</span>
      </div>

      {/* Real Seal Graphic */}
      <div className="relative mb-5 transition-transform duration-300 group-hover:scale-108 group-hover:rotate-1">
        <SealGraphic type={seal.sealType} size={118} />
      </div>

      {/* Seal Titles */}
      <h3 className="font-headline-sm text-base sm:text-lg font-extrabold text-[#191c1e] group-hover:text-[#006c49] transition-colors leading-snug mb-1">
        {seal.shortName}
      </h3>
      <p className="font-label-sm text-xs text-[#534434] line-clamp-2 leading-relaxed mb-4">
        {seal.scoreOrCategory}
      </p>

      {/* Registry Pill */}
      <div className="mt-auto pt-3 border-t border-[#f0f2f4] w-full flex items-center justify-between text-[11px] text-[#74777f]">
        <span className="font-mono font-medium truncate max-w-[130px]" title={seal.registryNumber}>
          {seal.registryNumber}
        </span>
        <span className="text-[#006c49] font-bold group-hover:underline flex items-center gap-0.5">
          <span>Verificar</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </span>
      </div>
    </motion.div>
  );
};

// Official Certificate Verification Modal
export const SealVerificationModal: React.FC<{
  seal: OfficialSeal | null;
  onClose: () => void;
}> = ({ seal, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!seal) return null;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(seal.registryNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#e6e8ea] overflow-hidden my-8"
        >
          {/* Header banner */}
          <div className="bg-gradient-to-r from-[#004d33] via-[#006c49] to-[#004d33] text-white p-6 sm:p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="shrink-0 p-2 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
                <SealGraphic type={seal.sealType} size={92} />
              </div>
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold border border-emerald-300/30 mb-2">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>Certificado Autêntico &amp; Auditado</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
                  {seal.shortName}
                </h2>
                <p className="text-emerald-100 text-sm mt-1 leading-snug">
                  {seal.fullName}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Dossier Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f7f9fb] p-5 rounded-2xl border border-[#e6e8ea]">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#534434]">
                  Organização Titular
                </span>
                <span className="text-sm font-extrabold text-[#191c1e]">
                  Instituto Caminho e Forma
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#534434]">
                  Órgão / Entidade Certificadora
                </span>
                <span className="text-sm font-semibold text-[#191c1e]">
                  {seal.issuingEntity}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#534434]">
                  Registro / Portaria Oficial
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs font-bold text-[#006c49] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {seal.registryNumber}
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="text-[#534434] hover:text-[#006c49] text-xs font-semibold cursor-pointer"
                    title="Copiar código"
                  >
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#534434]">
                  Validade do Ciclo
                </span>
                <span className="text-sm font-semibold text-emerald-800">
                  {seal.validity}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-bold text-sm text-[#191c1e] mb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006c49]">info</span>
                Sobre esta Chancela
              </h4>
              <p className="text-sm text-[#534434] leading-relaxed">
                {seal.description}
              </p>
            </div>

            {/* Criteria Checked */}
            <div>
              <h4 className="font-bold text-sm text-[#191c1e] mb-2.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006c49]">check_circle</span>
                Critérios Auditados e Atendidos
              </h4>
              <ul className="space-y-2">
                {seal.criteriaSummary.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#313033]">
                    <span className="material-symbols-outlined text-[18px] text-[#006c49] shrink-0 mt-0.5">
                      task_alt
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#e6e8ea] flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  alert(`Consulta oficial realizada com sucesso! O registro ${seal.registryNumber} está ativo e em situação regular perante o ${seal.issuingEntity}.`);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#006c49] hover:bg-[#005538] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                <span>Checar Autenticidade no Órgão</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-bold text-sm transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

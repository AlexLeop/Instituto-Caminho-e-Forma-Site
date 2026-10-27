import React from 'react';

interface PartnerLogo {
  id: string;
  name: string;
  render: () => React.ReactNode;
}

const PARTNERS: PartnerLogo[] = [
  {
    id: 'baixo-araguaia',
    name: 'Baixo Araguaia',
    render: () => (
      <svg viewBox="0 0 110 110" className="h-16 sm:h-20 w-auto" fill="currentColor">
        <circle cx="55" cy="55" r="50" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <circle cx="55" cy="55" r="44" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" fill="none" />
        {/* Arched BAIXO */}
        <text x="55" y="32" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="0.25em" fontFamily="sans-serif">BAIXO</text>
        {/* BA Monogram */}
        <text x="55" y="66" textAnchor="middle" fontSize="34" fontWeight="900" letterSpacing="-0.04em" fontFamily="serif">BA</text>
        {/* Horizontal bar accents */}
        <line x1="22" y1="53" x2="33" y2="53" stroke="currentColor" strokeWidth="1.5" />
        <line x1="77" y1="53" x2="88" y2="53" stroke="currentColor" strokeWidth="1.5" />
        {/* ARAGUAIA */}
        <text x="55" y="82" textAnchor="middle" fontSize="10.5" fontWeight="800" letterSpacing="0.22em" fontFamily="sans-serif">ARAGUAIA</text>
        <text x="55" y="93" textAnchor="middle" fontSize="5.5" fontWeight="600" letterSpacing="0.08em" fontFamily="sans-serif" opacity="0.8">O MELHOR BAR DO GRAJAÚ</text>
      </svg>
    ),
  },
  {
    id: 'ex-touro',
    name: 'Ex-Touro',
    render: () => (
      <svg viewBox="0 0 160 55" className="h-10 sm:h-12 w-auto" fill="currentColor">
        {/* EX·TOURO Wordmark */}
        <text x="80" y="34" textAnchor="middle" fontSize="28" fontWeight="900" letterSpacing="0.08em" fontFamily="sans-serif">
          EX<tspan fontSize="20" dy="-3">·</tspan><tspan dy="3">TOURO</tspan>
        </text>
        {/* Subtitle */}
        <text x="80" y="47" textAnchor="middle" fontSize="6.5" fontWeight="700" letterSpacing="0.28em" fontFamily="sans-serif" opacity="0.85">
          CORTES FINOS &amp; HAMBÚRGUERES ARTESANAIS
        </text>
      </svg>
    ),
  },
  {
    id: 'ogro-steaks',
    name: 'Ogro Steaks',
    render: () => (
      <svg viewBox="0 0 130 75" className="h-13 sm:h-16 w-auto" fill="currentColor">
        {/* OGRO */}
        <text x="65" y="36" textAnchor="middle" fontSize="38" fontWeight="900" letterSpacing="0.04em" fontFamily="Impact, sans-serif" stroke="currentColor" strokeWidth="0.5">
          OGRO
        </text>
        {/* STEAKS */}
        <text x="65" y="68" textAnchor="middle" fontSize="30" fontWeight="800" letterSpacing="0.12em" fontFamily="Impact, sans-serif" stroke="currentColor" strokeWidth="0.5">
          STEAKS
        </text>
      </svg>
    ),
  },
  {
    id: 'rao-burger',
    name: 'Rão Burger',
    render: () => (
      <svg viewBox="0 0 140 60" className="h-11 sm:h-13 w-auto" fill="currentColor">
        {/* Burger icon */}
        <g transform="translate(102, 14)">
          <path d="M2 10C2 4.5 6 1 12 1C18 1 22 4.5 22 10H2Z" fill="currentColor" />
          <rect x="1" y="12" width="22" height="2.5" rx="1" fill="currentColor" />
          <path d="M3 16H21C21 19 17 21 12 21C7 21 3 19 3 16Z" fill="currentColor" />
        </g>
        {/* RÃO */}
        <text x="50" y="32" textAnchor="middle" fontSize="28" fontWeight="900" letterSpacing="0.02em" fontFamily="sans-serif">
          RÃO
        </text>
        <line x1="24" y1="9" x2="76" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* BURGER */}
        <text x="50" y="52" textAnchor="middle" fontSize="16" fontWeight="900" letterSpacing="0.22em" fontFamily="sans-serif">
          BURGER
        </text>
      </svg>
    ),
  },
  {
    id: 'nozuki',
    name: 'Nozuki',
    render: () => (
      <svg viewBox="0 0 160 55" className="h-10 sm:h-12 w-auto" fill="currentColor">
        <line x1="15" y1="11" x2="145" y2="11" stroke="currentColor" strokeWidth="2" />
        <text x="80" y="37" textAnchor="middle" fontSize="26" fontWeight="400" letterSpacing="0.32em" fontFamily="sans-serif">
          NOZUKI
        </text>
        <line x1="15" y1="47" x2="145" y2="47" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'chef-vegetais',
    name: 'Chef dos Vegetais',
    render: () => (
      <svg viewBox="0 0 85 90" className="h-14 sm:h-17 w-auto" fill="currentColor">
        {/* Leaves top */}
        <path d="M42 22C42 12 40 4 42 2C44 4 43 12 43 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M38 18C34 10 28 6 26 8C27 12 33 16 38 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M46 18C50 10 56 6 58 8C57 12 51 16 46 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Carrot head & face */}
        <path d="M28 24C28 24 42 21 56 24C60 40 50 64 42 74C34 64 24 40 28 24Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
        {/* Eyes & smile */}
        <circle cx="37" cy="40" r="2" fill="currentColor" />
        <circle cx="47" cy="40" r="2" fill="currentColor" />
        <path d="M38 50C40 53 44 53 46 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Plate / Collar below */}
        <ellipse cx="42" cy="76" rx="34" ry="7" stroke="currentColor" strokeWidth="2.5" fill="none" />
      </svg>
    ),
  },
  {
    id: 'ambev-social',
    name: 'Programa VOA Ambev',
    render: () => (
      <svg viewBox="0 0 150 55" className="h-9 sm:h-11 w-auto" fill="currentColor">
        <text x="75" y="30" textAnchor="middle" fontSize="24" fontWeight="900" letterSpacing="0.14em" fontFamily="sans-serif">
          AMBEV
        </text>
        <text x="75" y="47" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="0.32em" fontFamily="sans-serif" opacity="0.85">
          PROGRAMA VOA
        </text>
      </svg>
    ),
  },
  {
    id: 'agrofuturo',
    name: 'AgroFuturo',
    render: () => (
      <svg viewBox="0 0 160 55" className="h-9 sm:h-11 w-auto" fill="currentColor">
        {/* Leaf icon */}
        <path d="M22 36C22 22 32 14 42 14C42 28 32 36 22 36Z" fill="currentColor" />
        <path d="M22 36C29 32 35 24 38 18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Text */}
        <text x="96" y="30" textAnchor="middle" fontSize="20" fontWeight="800" letterSpacing="0.08em" fontFamily="sans-serif">
          AgroFuturo
        </text>
        <text x="96" y="44" textAnchor="middle" fontSize="7" fontWeight="600" letterSpacing="0.2em" fontFamily="sans-serif" opacity="0.8">
          SUSTENTABILIDADE RURAL
        </text>
      </svg>
    ),
  },
  {
    id: 'grupo-integrar',
    name: 'Grupo Integrar',
    render: () => (
      <svg viewBox="0 0 160 55" className="h-9 sm:h-11 w-auto" fill="currentColor">
        {/* Diamond logo mark */}
        <polygon points="26,12 36,27 26,42 16,27" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <circle cx="26" cy="27" r="3.5" fill="currentColor" />
        {/* Text */}
        <text x="96" y="28" textAnchor="middle" fontSize="19" fontWeight="900" letterSpacing="0.12em" fontFamily="sans-serif">
          INTEGRAR
        </text>
        <text x="96" y="42" textAnchor="middle" fontSize="7" fontWeight="700" letterSpacing="0.25em" fontFamily="sans-serif" opacity="0.8">
          DESENVOLVIMENTO SOCIAL
        </text>
      </svg>
    ),
  },
];

export const PartnerLogosCarousel: React.FC = () => {
  const [isPaused, setIsPaused] = React.useState(false);

  // Triplicamos os logos para garantir efeito contínuo infinito e sem saltos visíveis
  const duplicatedPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <div 
      className="w-full relative group/carousel py-2 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes marqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(calc(-100% / 3), 0, 0);
          }
        }
        .partner-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 34s linear infinite;
          will-change: transform;
        }
        .partner-marquee-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      {/* Sombras suaves nas extremidades para indicar continuidade e transição suave */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />

      {/* Track que rola automaticamente sem necessidade de clique */}
      <div 
        className={`partner-marquee-track items-center gap-10 sm:gap-14 lg:gap-18 py-3 ${isPaused ? 'paused' : ''}`}
      >
        {duplicatedPartners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            title={partner.name}
            className="shrink-0 flex items-center justify-center cursor-pointer transition-all duration-300 filter grayscale text-slate-500 opacity-65 hover:opacity-100 hover:grayscale-0 hover:text-slate-900 hover:scale-105"
          >
            {partner.render()}
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';

const PARTNERS = [
  {
    id: 'jm',
    name: 'JM Empreendimentos Imobiliários',
    image: '/parcerias/logo-jm-removebg-preview.png',
    width: 283,
    height: 204,
  },
  {
    id: 'allex-leopoldo',
    name: 'Allex Leopoldo — Soluções em Tecnologia',
    image: '/parcerias/Minha_Logo-removebg-preview.png',
    width: 500,
    height: 177,
  },
  {
    id: 'motta',
    name: 'Motta — Serviços Contábeis e Empresariais',
    image: '/parcerias/motta-contabilidade-removebg-preview.png',
    width: 500,
    height: 342,
  },
];

export const PartnerLogosCarousel: React.FC = () => (
  <div className="partner-marquee relative w-full overflow-hidden py-2" role="region" aria-label="Parceiros e apoiadores institucionais">
    <style>{`
      @keyframes partnerMarqueeScroll {
        to { transform: translateX(-33.333333%); }
      }
      .partner-marquee-track {
        display: flex;
        width: max-content;
        animation: partnerMarqueeScroll 34s linear infinite;
      }
      .partner-marquee:hover .partner-marquee-track {
        animation-play-state: paused;
      }
      @media (prefers-reduced-motion: reduce) {
        .partner-marquee-track { animation: none; width: 100%; }
        .partner-marquee-group { width: 100%; flex-wrap: wrap; justify-content: center; padding-right: 0; }
        .partner-marquee-group[aria-hidden="true"] { display: none; }
      }
    `}</style>
    <div className="partner-marquee-track">
      {[0, 1, 2].map(group => (
        <div key={group} aria-hidden={group > 0 ? true : undefined} className="partner-marquee-group flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16">
          {PARTNERS.map(partner => (
            <div key={partner.id} title={partner.name} className="flex h-32 w-56 shrink-0 items-center justify-center sm:h-36 sm:w-64">
              <img src={partner.image} alt={group === 0 ? partner.name : ''} width={partner.width} height={partner.height} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

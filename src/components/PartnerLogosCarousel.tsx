import React, { useId, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { InstituteLogo } from './InstituteLogo';

const JIREH_GARAGE = {
  name: 'Jireh Garage',
  image: '/parcerias/jireh-garage.png',
  website: 'https://jirehgarageoficial.netlify.app/',
  phone: '(21) 96868-1684',
  email: 'jireh.jirehgarage@gmail.com',
  address: 'Avenida Prefeito Isoldackson Cruz de Brito, nº 20',
  postalCode: '23825-840',
};

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

export const PartnerLogosCarousel: React.FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <>
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
          .partner-marquee:has(button:focus-visible) .partner-marquee-track { animation: none; width: 100%; }
          .partner-marquee:has(button:focus-visible) .partner-marquee-group { width: 100%; flex-wrap: wrap; justify-content: center; padding-right: 0; }
          .partner-marquee:has(button:focus-visible) .partner-marquee-group[aria-hidden="true"] { display: none; }
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
              <button
                type="button"
                tabIndex={group === 0 ? undefined : -1}
                aria-haspopup="dialog"
                aria-label={`Visitar o site de ${JIREH_GARAGE.name}`}
                title={JIREH_GARAGE.name}
                onClick={() => dialogRef.current?.showModal()}
                className="flex h-32 w-56 shrink-0 cursor-pointer items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#b45309] sm:h-36 sm:w-64"
              >
                <img src={JIREH_GARAGE.image} alt="" width={2172} height={724} loading="lazy" decoding="async" className="h-full w-full object-contain" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-lenis-prevent
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%_-_1.5rem)] max-w-lg overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm sm:p-8"
      >
        <div className="mb-6 flex items-center justify-center gap-3 sm:gap-5">
          <InstituteLogo size="sm" />
          <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-[#166534]" />
          <img src={JIREH_GARAGE.image} alt={JIREH_GARAGE.name} width={2172} height={724} className="h-auto w-24 object-contain sm:w-32" />
        </div>
        <h2 id={titleId} className="text-balance text-center font-serif text-xl font-bold sm:text-2xl">
          Você vai acessar o site da Jireh Garage
        </h2>
        <p id={descriptionId} className="mt-2 text-center text-sm leading-relaxed text-slate-600">
          Ao confirmar, você será redirecionado para o site da empresa parceira.
        </p>
        <dl className="my-6 grid gap-3 rounded-xl bg-slate-50 px-4 py-4 text-sm">
          <div>
            <dt className="font-semibold">Contato</dt>
            <dd className="mt-0.5 text-slate-700">{JIREH_GARAGE.phone}</dd>
          </div>
          <div>
            <dt className="font-semibold">E-mail</dt>
            <dd className="mt-0.5 break-all text-slate-700">{JIREH_GARAGE.email}</dd>
          </div>
          <div>
            <dt className="font-semibold">Endereço</dt>
            <dd className="mt-0.5 text-slate-700">{JIREH_GARAGE.address}<br />CEP {JIREH_GARAGE.postalCode}</dd>
          </div>
        </dl>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="min-h-11 cursor-pointer rounded-xl border border-slate-300 px-3 text-sm font-bold hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b45309]"
          >
            Cancelar
          </button>
          <a
            href={JIREH_GARAGE.website}
            className="flex min-h-11 items-center justify-center rounded-xl bg-[#b45309] px-3 text-sm font-bold text-white hover:bg-[#92400e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b45309]"
          >
            Confirmar
          </a>
        </div>
      </dialog>
    </>
  );
};

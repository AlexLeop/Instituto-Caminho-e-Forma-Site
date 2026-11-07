import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Facebook, Instagram, type LucideIcon } from 'lucide-react';
import { InstituteLogo } from './InstituteLogo';

interface Partner {
  id: string;
  name: string;
  image: string;
  width: number;
  height: number;
  redirect?: {
    title: string;
    description: string;
    phone: string;
    email: string;
    address?: { street: string; postalCode: string };
    links: { label: string; href: string; icon?: LucideIcon }[];
  };
}

const PARTNERS: Partner[] = [
  {
    id: 'jm',
    name: 'JM Empreendimentos Imobiliários',
    image: '/parcerias/logo-jm-removebg-preview.png',
    width: 283,
    height: 204,
    redirect: {
      title: 'Você vai acessar as redes sociais da JM Empreendimentos Imobiliários',
      description: 'Escolha a rede social que deseja visitar.',
      phone: '(21) 9 7032-6011',
      email: 'juliobessaribeiro@gmail.com',
      links: [
        { label: 'Instagram', href: 'https://www.instagram.com/juliobessacorretorimoveis?utm_source=qr&rpxt=MXB3eWZyaDlkYzVoMA==', icon: Instagram },
        { label: 'Facebook', href: 'https://www.facebook.com/share/1ABjASEz76', icon: Facebook },
      ],
    },
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
  {
    id: 'jireh-garage',
    name: 'Jireh Garage',
    image: '/parcerias/jireh-garage.png',
    width: 2172,
    height: 724,
    redirect: {
      title: 'Você vai acessar o site da Jireh Garage',
      description: 'Ao confirmar, você será redirecionado para o site da empresa parceira.',
      phone: '(21) 96868-1684',
      email: 'jireh.jirehgarage@gmail.com',
      address: { street: 'Avenida Prefeito Isoldackson Cruz de Brito, nº 20', postalCode: '23825-840' },
      links: [{ label: 'Confirmar', href: 'https://jirehgarageoficial.netlify.app/' }],
    },
  },
  {
    id: 'r1-solares',
    name: 'R1 Solares',
    image: '/parcerias/r1-solares.png',
    width: 1181,
    height: 1332,
    redirect: {
      title: 'Você vai acessar o Instagram da R1 Solares',
      description: 'Ao continuar, você será redirecionado para o Instagram da empresa parceira.',
      phone: '(21) 9 9269-5311',
      email: 'contato.r1solares@gmail.com',
      links: [
        { label: 'Instagram', href: 'https://www.instagram.com/r1.solares?utm_source=qr&srtk=MTk3cmg0dnRtajd0dQ==', icon: Instagram },
      ],
    },
  },
];

const partnerSlot = 'flex h-32 w-56 shrink-0 items-center justify-center sm:h-36 sm:w-64';

export const PartnerLogosCarousel: React.FC = () => {
  const [activePartner, setActivePartner] = useState<Partner | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const redirect = activePartner?.redirect;

  useEffect(() => {
    if (activePartner && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [activePartner]);

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
          .partner-marquee-group {
            flex-wrap: nowrap;
          }
          .partner-marquee:hover .partner-marquee-track {
            animation-play-state: paused;
          }
          .partner-marquee:has(button:focus-visible) .partner-marquee-track { animation: none; }
          .partner-marquee:has(button:focus-visible) .partner-marquee-group[aria-hidden="true"] { display: none; }
          @media (prefers-reduced-motion: reduce) {
            .partner-marquee-track { animation-duration: 90s; }
          }
        `}</style>
        <div className="partner-marquee-track">
          {[0, 1, 2].map(group => (
            <div key={group} aria-hidden={group > 0 ? true : undefined} className="partner-marquee-group flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16">
              {PARTNERS.map(partner => {
                const logo = (
                  <img src={partner.image} alt={group === 0 && !partner.redirect ? partner.name : ''} width={partner.width} height={partner.height} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
                );
                return partner.redirect ? (
                  <button
                    key={partner.id}
                    type="button"
                    tabIndex={group === 0 ? undefined : -1}
                    aria-haspopup="dialog"
                    aria-label={`Abrir opções de acesso de ${partner.name}`}
                    title={partner.name}
                    onFocus={event => {
                      if (event.currentTarget.matches(':focus-visible')) {
                        event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
                      }
                    }}
                    onClick={() => setActivePartner(partner)}
                    className={`${partnerSlot} cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#b45309]`}
                  >
                    {logo}
                  </button>
                ) : (
                  <div key={partner.id} title={partner.name} className={partnerSlot}>{logo}</div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <dialog
        ref={dialogRef}
        onClose={() => setActivePartner(null)}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-lenis-prevent
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%_-_1.5rem)] max-w-lg overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm sm:p-8"
      >
        {activePartner && redirect && (
          <>
            <div className="mb-6 flex items-center justify-center gap-3 sm:gap-5">
              <InstituteLogo size="sm" />
              <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-[#166534]" />
              <img
                src={activePartner.image}
                alt={activePartner.name}
                width={activePartner.width}
                height={activePartner.height}
                className={`h-auto min-w-0 object-contain ${activePartner.id === 'jm' ? 'max-h-[76px] w-28 sm:w-36' : 'max-h-16 w-24 sm:w-32'}`}
              />
            </div>
            <h2 id={titleId} className="text-balance text-center font-serif text-xl font-bold sm:text-2xl">
              {redirect.title}
            </h2>
            <p id={descriptionId} className="mt-2 text-center text-sm leading-relaxed text-slate-600">
              {redirect.description}
            </p>
            <dl className="my-6 grid gap-3 rounded-xl bg-slate-50 px-4 py-4 text-sm">
              <div>
                <dt className="font-semibold">Contato</dt>
                <dd className="mt-0.5 min-h-5 text-slate-700">{redirect.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold">E-mail</dt>
                <dd className="mt-0.5 min-h-5 break-all text-slate-700">{redirect.email}</dd>
              </div>
              {redirect.address && (
                <div>
                  <dt className="font-semibold">Endereço</dt>
                  <dd className="mt-0.5 text-slate-700">{redirect.address.street}<br />CEP {redirect.address.postalCode}</dd>
                </div>
              )}
            </dl>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className={`min-h-11 cursor-pointer rounded-xl border border-slate-300 px-3 text-sm font-bold hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b45309] ${redirect.links.length > 1 ? 'col-span-2 row-start-2' : ''}`}
              >
                Cancelar
              </button>
              {redirect.links.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#b45309] px-3 text-sm font-bold text-white hover:bg-[#92400e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b45309]"
                >
                  {link.icon && <link.icon aria-hidden="true" className="size-4 shrink-0" />}
                  {link.label}
                </a>
              ))}
            </div>
          </>
        )}
      </dialog>
    </>
  );
};

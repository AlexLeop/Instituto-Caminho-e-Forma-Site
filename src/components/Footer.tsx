import React, { useState } from 'react';
import { NavPage } from '../types';
import { SUPPORTER_PORTAL_ENABLED } from '../config/features';
import { InstituteLogo } from './InstituteLogo';
import { SealGraphic } from './RealSeals';
import { WhatsAppIcon, InstagramIcon } from './SocialIcons';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
  onOpenTransparency: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTransparency }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="w-full bg-white text-slate-900 border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Col 1: About */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <InstituteLogo size="md" variant="horizontal" />
          </div>
          <p className="font-sans text-sm text-slate-600 leading-relaxed">
            Ação continuada pelo desenvolvimento integral de famílias vulneráveis, combinando acolhimento alimentar, formação profissional e autonomia comunitária.
          </p>
          <p className="font-sans text-xs text-slate-500 leading-relaxed">
            Organização da Sociedade Civil dedicada à transformação social, qualificação profissional e cidadania em Itaguaí e região.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-lg text-slate-900 font-bold">Navegação Institucional</h3>
          <ul className="flex flex-col gap-2.5 font-sans text-sm text-slate-600">
            <li>
              <button 
                onClick={() => { onNavigate('inicio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#b45309] transition-colors text-left font-medium cursor-pointer"
              >
                Início
              </button>
            </li>
            <li>
              <button 
                onClick={() => { onNavigate('projetos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#b45309] transition-colors text-left font-medium cursor-pointer"
              >
                Projetos Comunitários
              </button>
            </li>
            <li>
              <button 
                onClick={() => { onNavigate('cursos-e-capacitacao'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#b45309] transition-colors text-left font-medium cursor-pointer"
              >
                Cursos &amp; Oficinas Práticas
              </button>
            </li>
            <li>
              <button 
                onClick={() => { onNavigate('feira-virtual'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#b45309] transition-colors text-left font-medium cursor-pointer"
              >
                Feira Solidária das Famílias
              </button>
            </li>
            <li>
              <button 
                onClick={() => { onNavigate('seja-parceiro'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#b45309] transition-colors text-left font-medium cursor-pointer"
              >
                Parcerias Corporativas ESG
              </button>
            </li>
            {SUPPORTER_PORTAL_ENABLED && (
            <li>
              <button 
                onClick={() => { onNavigate('portal-do-apoiador'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#b45309] transition-colors text-left flex items-center gap-1 font-bold cursor-pointer text-[#b45309]"
              >
                <span className="material-symbols-outlined text-[15px] text-[#b45309]">workspace_premium</span>
                <span>Portal do Apoiador</span>
              </button>
            </li>
            )}
            <li>
              <button 
                onClick={() => { onNavigate('transparencia'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#166534] transition-colors text-left flex items-center gap-1 font-bold cursor-pointer text-[#166534]"
              >
                <span className="material-symbols-outlined text-[15px] text-[#166534]">verified_user</span>
                <span>Portal da Transparência</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => { onNavigate('contato'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#b45309] transition-colors text-left font-medium cursor-pointer"
              >
                Fale Conosco
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Compromisso & Selos */}
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-lg text-slate-900 font-bold">Auditoria &amp; Selos</h3>
          <p className="font-sans text-sm text-slate-600 leading-relaxed">
            Auditado periodicamente por consultorias independentes e alinhado aos ODS da ONU.
          </p>
          <div className="flex flex-col gap-2.5">
            <button 
              onClick={onOpenTransparency}
              className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl text-left border border-slate-200 shadow-2xs transition-all cursor-pointer group"
            >
              <SealGraphic type="doar" size={32} className="shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col leading-tight">
                <span className="font-sans text-xs text-slate-900 font-bold">Selo Doar A+</span>
                <span className="text-[11px] text-slate-500">Padrão Máximo de Gestão &amp; Transparência</span>
              </div>
            </button>
            <button 
              onClick={onOpenTransparency}
              className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl text-left border border-slate-200 shadow-2xs transition-all cursor-pointer group"
            >
              <SealGraphic type="melhores-ongs" size={32} className="shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col leading-tight">
                <span className="font-sans text-xs text-slate-900 font-bold">Melhores ONGs 2026</span>
                <span className="text-[11px] text-slate-500">Top 100 Organizações Sociais do Brasil</span>
              </div>
            </button>
            <button 
              onClick={onOpenTransparency}
              className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl text-left border border-slate-200 shadow-2xs transition-all cursor-pointer group"
            >
              <SealGraphic type="pacto-global" size={32} className="shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col leading-tight">
                <span className="font-sans text-xs text-slate-900 font-bold">Pacto Global ONU</span>
                <span className="text-[11px] text-slate-500">Rede Brasil • Compromisso ODS 2030</span>
              </div>
            </button>
          </div>
        </div>

        {/* Col 4: Newsletter */}
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-lg text-slate-900 font-bold">Boletim Comunitário</h3>
          <p className="font-sans text-sm text-slate-600 leading-relaxed">
            Receba mensalmente nossas histórias de campo, balanços de atendimento e prestação de contas.
          </p>
          <div className="flex flex-col gap-1.5">
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 font-sans text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30" 
                placeholder="Seu melhor e-mail" 
                type="email"
                required
              />
              <button 
                className="bg-[#166534] hover:bg-[#14532d] text-white px-4 py-2.5 rounded-xl font-sans text-sm font-bold transition-colors shrink-0 flex items-center justify-center cursor-pointer shadow-xs" 
                type="submit"
                title="Cadastrar e-mail"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
            {subscribed ? (
              <span className="font-sans text-xs text-[#166534] font-bold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Inscrição confirmada com sucesso.
              </span>
            ) : (
              <span className="font-sans text-xs text-slate-500">
                Sem spam. Respeitamos rigorosamente sua privacidade e a LGPD.
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <a 
              href="https://wa.me/5521987428647?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Instituto%20Caminho%20e%20Forma" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp: (21) 98742-8647" 
              title="Falar no WhatsApp: (21) 98742-8647"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#25D366]/20 flex items-center justify-center text-[#166534] hover:text-[#25D366] transition-all cursor-pointer border border-slate-200 hover:border-[#25D366]"
            >
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
            </a>
            <a 
              href="https://www.instagram.com/institutocaminhoeforma" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram: @institutocaminhoeforma" 
              title="Instagram: @institutocaminhoeforma"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-pink-50 flex items-center justify-center text-slate-700 hover:text-pink-600 transition-all cursor-pointer border border-slate-200 hover:border-pink-200"
            >
              <InstagramIcon className="w-5 h-5 text-pink-600" />
            </a>
            <a 
              href="mailto:institutocaminhoeforma@gmail.com"
              aria-label="Enviar E-mail" 
              title="institutocaminhoeforma@gmail.com"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-amber-50 flex items-center justify-center text-slate-700 hover:text-[#b45309] transition-all cursor-pointer border border-slate-200 hover:border-amber-200"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
            </a>
            <a 
              href="tel:+5521987428647" 
              aria-label="Ligar para o Instituto" 
              title="(21) 98742-8647"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-all cursor-pointer border border-slate-200"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
            </a>
          </div>
        </div>
      </div>

      {/* Subfooter */}
      <div className="bg-slate-50 text-slate-600 py-6 border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3 font-sans text-xs">
          {/* Dados Legais e Endereço Oficial movidos da Coluna 1 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left text-slate-600 border-b border-slate-200 pb-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1">
              <span className="font-bold text-slate-900">Instituto Caminho e Forma</span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span><strong className="text-slate-900">CNPJ:</strong> 18.360.956/0001-60</span>
              <span className="text-slate-400 hidden md:inline">•</span>
              <span><strong className="text-slate-900">Sede:</strong> Rua Otilia Borges, S/nº Lote 25, Quadra 25 – Bairro Brisamar – Itaguaí / RJ – CEP: 23.823-390</span>
            </div>
            <div className="shrink-0 text-[11px] text-slate-500">
              Utilidade Pública &amp; Certificação Social
            </div>
          </div>

          {/* Copyright & Termos */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-1">
            <div>© {new Date().getFullYear()} Instituto Caminho e Forma. Todos os direitos reservados.</div>
            <div className="flex items-center gap-6">
              <button 
                onClick={onOpenTransparency} 
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Política de Privacidade
              </button>
              <button 
                onClick={onOpenTransparency} 
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Termos de Uso
              </button>
              <button 
                onClick={onOpenTransparency} 
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Estatuto Social
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

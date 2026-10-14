import React, { useState, useRef, useEffect } from 'react';
import { NavPage } from '../types';
import { 
  HERO_IMAGE, 
  HERO_SLIDES,
  ABOUT_IMAGE, 
  TECH_COURSE_BANNER, 
  PROJECTS, 
  MARKET_PRODUCTS, 
  TESTIMONIALS 
} from '../data/mockData';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { PartnerLogosCarousel } from './PartnerLogosCarousel';

interface HomeViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenDonation: (projectName?: string) => void;
  onOpenTransparency: () => void;
  onSelectProduct: (product: typeof MARKET_PRODUCTS[0]) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenDonation,
  onOpenTransparency,
  onSelectProduct
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('doacao');
  const [contactMessage, setContactMessage] = useState('');
  const [contactFeedback, setContactFeedback] = useState(false);

  // Loop de Imagens da Hero com Transição Suave (Crossfade / Esmaecer)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Parallax & Transições de Scroll entre Hero e a Próxima Seção (Curtain Overlap)
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroBgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.45, 0.1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.93]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.7], ['blur(0px)', 'blur(4px)']);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const scrollToSection = (id: string) => {
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(`#${id}`, { offset: -20, duration: 1.2 });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactFeedback(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <div className="flex flex-col w-full bg-[#fbf9f5] text-[#1c1917]">
      {/* HERO SECTION STICKY COM TRANSIÇÃO EM CORTINA SOBREPOSTA */}
      <motion.section 
        ref={heroRef}
        style={{ 
          scale: heroScale,
          opacity: heroOpacity,
          filter: heroBlur
        }}
        className="sticky top-0 w-full h-screen min-h-screen flex flex-col justify-between overflow-hidden bg-[#1c1917] pt-20 sm:pt-24 pb-6 sm:pb-8 will-change-transform origin-center z-10"
      >
          {/* Camada Parallax & Dissolve Loop do Background com Efeito Ken Burns */}
          <motion.div 
            style={{ y: heroBgY }}
            className="absolute inset-0 -top-24 -bottom-24 z-0 pointer-events-none will-change-transform overflow-hidden"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <div 
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <div 
                    className={`w-full h-full bg-cover bg-center filter brightness-[0.42] contrast-[1.08] transition-transform duration-[6500ms] ease-out ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`} 
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  />
                </div>
              );
            })}

            {/* Gradientes e Vinhetas Cinematográficas */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#1c1917] via-black/40 to-black/75 pointer-events-none" />
            <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/55 via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-0 z-20 bg-[#b45309]/10 mix-blend-color pointer-events-none" />
          </motion.div>

          {/* Conteúdo Central da Hero */}
          <motion.div 
            style={{ y: heroTextY }}
            className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center py-6 sm:py-8"
          >
            <div className="max-w-[720px] flex flex-col gap-4 sm:gap-5">
              {/* Display Headline Editorial com Literata */}
              <motion.h1 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl sm:text-4xl lg:text-[2.65rem] text-white font-serif tracking-tight drop-shadow-md font-bold leading-[1.18]"
              >
                Dignidade, autonomia e futuro para quem constrói o nosso chão.
              </motion.h1>

              {/* Subtitle Humanista com Manrope */}
              <motion.p 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-sans text-sm sm:text-base text-stone-200/90 max-w-[580px] drop-shadow-sm leading-relaxed font-normal"
              >
                No Instituto Caminho e Forma, atuamos diariamente ao lado de mais de 450 famílias com segurança alimentar, capacitação profissional emancipatória e fortalecimento comunitário permanente.
              </motion.p>

              {/* CTAs Diretos, Elegantes e Responsivos */}
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenDonation()}
                  className="inline-flex items-center justify-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm sm:text-base font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                  <span>Apoiar Nossas Famílias</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection('projetos-destaque')}
                  className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-sans text-sm sm:text-base font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer border border-white/20"
                >
                  <span>Conhecer Projetos em Campo</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* FAIXA INTEGRADA DE IMPACTO E TRANSPARÊNCIA */}
          <div className="relative z-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-auto pb-4 sm:pb-6">
            {/* Barra Superior do Impacto: Contexto da Foto em Loop + Indicador de Scroll Suave */}
            <div className="flex items-center justify-between gap-4 mb-3">
              {/* Tag e Navegação do Loop de Fotos Autênticas */}
              <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white/95 text-xs shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                <span className="font-sans font-medium text-[11px] sm:text-xs tracking-wide">
                  {HERO_SLIDES[currentSlideIndex].contextTag}
                </span>
                <div className="flex items-center gap-1.5 ml-2 border-l border-white/20 pl-2">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlideIndex(i)}
                      aria-label={`Ver foto ${i + 1}: ${HERO_SLIDES[i].contextTag}`}
                      className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                        i === currentSlideIndex 
                          ? 'w-5 bg-[#f59e0b]' 
                          : 'w-1.5 bg-white/40 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Convite de Scroll Animado com Efeito de Transição */}
              <motion.button
                style={{ opacity: scrollIndicatorOpacity }}
                onClick={() => scrollToSection('secao-parceiros')}
                className="hidden sm:inline-flex items-center gap-2 text-stone-200 hover:text-white text-xs font-semibold px-3.5 py-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/15 cursor-pointer transition-all pointer-events-auto group shadow-md"
              >
                <span>Conheça os parceiros</span>
                <motion.span 
                  animate={{ y: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="material-symbols-outlined text-[16px] text-[#f59e0b] group-hover:translate-y-0.5 transition-transform"
                >
                  south
                </motion.span>
              </motion.button>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-[#1c1917]/85 backdrop-blur-md border border-white/10 text-white"
            >
              <div className="flex flex-col gap-0.5 border-l-2 border-[#b45309] pl-3.5">
                <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  +15<span className="text-base sm:text-lg text-[#b45309] font-sans ml-1">mil</span>
                </div>
                <span className="font-sans text-xs sm:text-sm font-semibold text-stone-200">
                  Pessoas Atendidas
                </span>
                <p className="font-sans text-[11px] sm:text-xs text-stone-400">Nutrição, acolhimento e formação contínua</p>
              </div>

              <div className="flex flex-col gap-0.5 border-l-2 border-[#166534] pl-3.5">
                <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  8<span className="text-base sm:text-lg text-[#166534] font-sans ml-1">núcleos</span>
                </div>
                <span className="font-sans text-xs sm:text-sm font-semibold text-stone-200">
                  Núcleos Comunitários
                </span>
                <p className="font-sans text-[11px] sm:text-xs text-stone-400">Polos de atendimento em Itaguaí e região</p>
              </div>

              <div className="flex flex-col gap-0.5 border-l-2 border-[#b45309] pl-3.5">
                <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  120<span className="text-base sm:text-lg text-[#b45309] font-sans ml-1">ton</span>
                </div>
                <span className="font-sans text-xs sm:text-sm font-semibold text-stone-200">
                  Alimentos Distribuídos
                </span>
                <p className="font-sans text-[11px] sm:text-xs text-stone-400">Segurança alimentar e combate à fome</p>
              </div>

              <div 
                onClick={onOpenTransparency}
                className="flex flex-col gap-0.5 border-l-2 border-[#166534] pl-3.5 cursor-pointer group"
                title="Acessar Portal da Transparência"
              >
                <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight group-hover:text-[#4ade80] transition-colors flex items-baseline gap-1">
                  100<span className="text-base sm:text-lg font-sans">%</span>
                </div>
                <span className="font-sans text-xs sm:text-sm font-semibold text-stone-200 flex items-center gap-1 group-hover:text-white transition-colors">
                  <span>Auditoria Aberta</span>
                  <span className="material-symbols-outlined text-[14px] text-[#4ade80]">open_in_new</span>
                </span>
                <p className="font-sans text-[11px] sm:text-xs text-stone-400">Balanços e notas fiscais auditados por BDO</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

      {/* EMPRESAS QUE CONFIAM NA GENTE / PRÓXIMA SEÇÃO ELEVADA QUE COBRE A HERO COM TRANSIÇÃO SUAVE */}
      <section 
        id="secao-parceiros"
        className="w-full relative z-20 -mt-10 sm:-mt-14 rounded-t-[36px] sm:rounded-t-[48px] bg-[#f5f1ea] border-t border-white/80 shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.55)] pt-8 pb-12 overflow-hidden"
      >
        {/* Barra decorativa sutil de elevação (sheet pill handle) */}
        <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-[#d6cec2] rounded-full mx-auto mb-5 opacity-70" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center font-sans text-xs sm:text-[13px] font-bold text-[#57534e] uppercase tracking-[0.2em] mb-6">
            Empresas que confiam na gente
          </p>
          <PartnerLogosCarousel />
        </div>
      </section>

      {/* SEÇÃO SOBRE NÓS & PILARES DE ATUAÇÃO COM DESIGN EDITORIAL */}
      <section className="w-full py-18 sm:py-24 bg-[#f5f1ea] border-b border-[#e7e2da]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col gap-5"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1917] font-bold leading-tight">
              Uma trajetória tecida na escuta e na autonomia comunitária.
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#57534e] leading-relaxed">
              Fundado em 2014, o Instituto Caminho e Forma nasceu da união entre educadores populares e famílias locais que não aceitavam mais a lógica do assistencialismo que aprisiona. Criamos estruturas permanentes: cozinhas comunitárias geridas pelas próprias mães, ateliês vocacionais e apoio jurídico e psicológico sem burocracia.
            </p>
            
            {/* Foto Real com Legenda Integrada */}
            <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden shadow-md mt-2 border border-[#e7e2da]">
              <img 
                src={ABOUT_IMAGE} 
                alt="Atendimento comunitário e formação de jovens no Instituto" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-serif text-base sm:text-lg italic text-stone-100 leading-snug">
                  "A dignidade humana começa no prato de comida e se consolida quando a pessoa tem ferramentas reais para transformar o seu próprio chão."
                </p>
                <span className="font-sans text-xs text-[#fef3c7] font-semibold block mt-2">
                  Maria Clara Silva • Fundadora e Coordenadora Comunitária
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7 flex flex-col gap-4"
          >
            {/* Pilar 1 */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-[#e7e2da] hover:border-[#b45309]/40 transition-colors">
              <div className="flex items-start gap-4">
                <span className="font-serif text-2xl font-bold text-[#b45309] shrink-0">01</span>
                <div>
                  <h3 className="font-serif text-xl text-[#1c1917] font-bold mb-1">
                    Acolhimento &amp; Segurança Básica
                  </h3>
                  <p className="font-sans text-sm text-[#57534e] leading-relaxed">
                    Garantia de segurança alimentar continuada, distribuição de cestas agroecológicas, suporte pediátrico e apoio socioemocional em situações de emergência familiar.
                  </p>
                </div>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-[#e7e2da] hover:border-[#166534]/40 transition-colors">
              <div className="flex items-start gap-4">
                <span className="font-serif text-2xl font-bold text-[#166534] shrink-0">02</span>
                <div>
                  <h3 className="font-serif text-xl text-[#1c1917] font-bold mb-1">
                    Escola de Saberes &amp; Emancipação
                  </h3>
                  <p className="font-sans text-sm text-[#57534e] leading-relaxed">
                    Trilhas formativas em tecnologia, gastronomia artesanal e biojoias com mentoria individual, estágio parceiro e apoio direto à abertura de pequenos negócios locais.
                  </p>
                </div>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-[#e7e2da] hover:border-[#b45309]/40 transition-colors">
              <div className="flex items-start gap-4">
                <span className="font-serif text-2xl font-bold text-[#b45309] shrink-0">03</span>
                <div>
                  <h3 className="font-serif text-xl text-[#1c1917] font-bold mb-1">
                    Rede Ativa de Cidadania e Voluntariado
                  </h3>
                  <p className="font-sans text-sm text-[#57534e] leading-relaxed">
                    Mais de 400 voluntários profissionais (psicólogos, advogados populares, monitores e educadores) integrados em um modelo organizado de mentoria contínua.
                  </p>
                </div>
              </div>
            </div>

            {/* Pilar 4 - Transparência */}
            <div 
              onClick={onOpenTransparency}
              className="bg-[#ede7dc]/70 p-6 rounded-2xl border border-[#d6cec2] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#ede7dc] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px] text-[#166534]">verified_user</span>
                <div>
                  <h4 className="font-sans text-sm sm:text-base font-bold text-[#1c1917]">
                    Balanços Abertos &amp; Auditoria Externa
                  </h4>
                  <p className="font-sans text-xs text-[#57534e]">
                    100% dos recursos são comprovados com notas fiscais e relatórios bimestrais disponíveis a qualquer cidadão.
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-[#166534] group-hover:translate-x-1 transition-transform shrink-0">
                arrow_forward
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO PROJETOS EM ANDAMENTO */}
      <section className="w-full py-18 sm:py-24 bg-[#fbf9f5] border-b border-[#e7e2da]" id="projetos-destaque">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-2 max-w-[760px]">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1917] font-bold">
                Projetos comunitários em campo
              </h2>
              <p className="font-sans text-base sm:text-lg text-[#57534e] leading-relaxed">
                Acompanhe a aplicação direta das doações em ações concretas de acolhimento infantil, segurança alimentar e capacitação profissional no território.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('projetos')}
              className="inline-flex items-center gap-2 font-sans text-sm font-bold text-[#b45309] hover:text-[#92400e] transition-colors self-start md:self-auto cursor-pointer"
            >
              <span>Ver todos os 14 projetos</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.slice(0, 3).map((proj, idx) => {
              const categoryBadge = proj.categoryTagType === 'secondary' 
                ? 'bg-[#166534] text-white' 
                : proj.categoryTagType === 'primary' 
                ? 'bg-[#b45309] text-white' 
                : 'bg-[#44403c] text-white';

              const barColor = proj.categoryTagType === 'secondary' 
                ? 'bg-[#166534]' 
                : 'bg-[#b45309]';

              return (
                <motion.div 
                  key={proj.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col border border-[#e7e2da]"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <img 
                      src={proj.image} 
                      alt={proj.title} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className={`absolute top-3 left-3 ${categoryBadge} font-sans text-xs px-3 py-1 rounded-md font-bold shadow-xs`}>
                      {proj.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md font-sans text-xs font-bold text-[#1c1917] shadow-xs border border-[#e7e2da]">
                      {proj.progressPercent}% Concluído
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                    <div>
                      <h3 className="font-serif text-xl text-[#1c1917] font-bold mb-2">
                        {proj.title}
                      </h3>
                      <p className="font-sans text-sm text-[#57534e] leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="w-full bg-[#ede7dc] h-2.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${proj.progressPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`${barColor} h-full rounded-full`}
                        />
                      </div>
                      <div className="flex justify-between items-center font-sans text-xs sm:text-sm">
                        <span className="text-[#1c1917] font-bold">
                          R$ {proj.raisedAmount.toLocaleString('pt-BR')} arrecadados
                        </span>
                        <span className="text-[#78716c]">
                          Meta: R$ {proj.goalAmount.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <motion.button 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onOpenDonation(proj.title)}
                        className="flex-1 text-center bg-[#b45309] hover:bg-[#92400e] text-white py-3 rounded-xl font-sans text-sm font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        Apoiar este Projeto
                      </motion.button>
                      <button 
                        onClick={() => onNavigate('projetos')}
                        className="p-3 rounded-xl bg-[#ede7dc] hover:bg-[#e3dcd0] text-[#1c1917] transition-colors cursor-pointer" 
                        title="Ver detalhes"
                      >
                        <span className="material-symbols-outlined text-[20px]">info</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEÇÃO CURSOS E CAPACITAÇÃO */}
      <section className="w-full py-18 sm:py-24 bg-[#f5f1ea] border-b border-[#e7e2da] text-[#1c1917]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs flex flex-col lg:flex-row items-center gap-12 border border-[#e7e2da]"
          >
            <div className="flex-1 flex flex-col gap-5">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1917] font-bold leading-tight">
                Educação prática para autonomia profissional e geração de renda
              </h2>
              <p className="font-sans text-base sm:text-lg text-[#57534e] leading-relaxed">
                Nossas oficinas foram desenhadas a partir das vocações e demandas da própria comunidade. Mais do que certificados, entregamos formação técnica aplicada, mentoria de negócios e apoio à inserção produtiva no mercado.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-2">
                {[
                  { title: 'Inclusão Digital & Informática', desc: 'Letramento digital, pacote escritório e suporte técnico básico.' },
                  { title: 'Panificação & Gastronomia', desc: 'Produção artesanal de pães, boas práticas e nutrição comunitária.' },
                  { title: 'Artesanato & Biojoias', desc: 'Economia circular, reaproveitamento de fibras e design autoral.' },
                  { title: 'Gestão Financeira & Negócios', desc: 'Precificação correta, cooperativismo e abertura de MEI.' },
                ].map((track, i) => (
                  <div 
                    key={i}
                    className="bg-[#fbf9f5] p-4 rounded-xl border border-[#e7e2da] flex flex-col gap-1"
                  >
                    <span className="font-serif text-base font-bold text-[#1c1917]">{track.title}</span>
                    <span className="font-sans text-xs text-[#57534e]">{track.desc}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('cursos-e-capacitacao')}
                  className="inline-flex items-center gap-2 bg-[#166534] hover:bg-[#14532d] text-white px-8 py-3.5 rounded-xl font-sans text-sm font-bold shadow-xs transition-all cursor-pointer"
                >
                  <span>Conferir Grade Completa &amp; Inscrições</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </motion.button>
                <span className="font-sans text-xs font-semibold text-[#57534e] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#166534] text-[18px]">verified</span> Investimento social acessível revertido para manter os projetos
                </span>
              </div>
            </div>

            <div className="w-full lg:w-[480px] h-[380px] rounded-2xl overflow-hidden shadow-md relative shrink-0 border border-[#e7e2da]">
              <img 
                src={TECH_COURSE_BANNER} 
                alt="Turma em sala de informática e capacitação" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-[#1c1917]/90 text-white px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold shadow-sm backdrop-blur-sm border border-white/10">
                Inscrições Abertas
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO FEIRA VIRTUAL SOLIDÁRIA */}
      <section className="w-full py-18 sm:py-24 bg-[#fbf9f5] border-b border-[#e7e2da]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-2 max-w-[760px]">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1917] font-bold">
                Feira solidária das famílias
              </h2>
              <p className="font-sans text-base sm:text-lg text-[#57534e] leading-relaxed">
                Produtos artesanais, pães e biojoias criados por alunos de nossas oficinas. <strong className="text-[#1c1917] font-semibold">100% do valor da sua compra é destinado diretamente à família artesã</strong>.
              </p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('feira-virtual')}
              className="inline-flex items-center gap-2 bg-[#ede7dc] hover:bg-[#e3dcd0] text-[#1c1917] px-6 py-3.5 rounded-xl font-sans text-sm font-bold transition-all cursor-pointer shadow-xs self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-[18px] text-[#b45309]">storefront</span>
              <span>Acessar Vitrine Completa</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MARKET_PRODUCTS.slice(0, 3).map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col border border-[#e7e2da]"
              >
                <div className="h-64 w-full relative overflow-hidden group">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md font-sans text-xs text-[#1c1917] font-bold shadow-xs border border-[#e7e2da]">
                    {item.categoryTag}
                  </span>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1 gap-5">
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <h4 className="font-serif text-lg text-[#1c1917] font-bold">{item.title}</h4>
                      <span className="font-serif text-lg text-[#b45309] font-bold">{item.priceFormatted}</span>
                    </div>
                    <p className="font-sans text-sm text-[#57534e] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectProduct(item)}
                    className="w-full text-center py-3 bg-[#ede7dc] hover:bg-[#b45309] hover:text-white text-[#1c1917] font-sans text-sm rounded-xl transition-colors cursor-pointer font-bold"
                  >
                    Adquirir na Feira
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO SEJA PARCEIRO */}
      <section className="w-full py-18 sm:py-24 bg-[#f5f1ea] border-b border-[#e7e2da]" id="parceiros">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 flex flex-col gap-5"
            >
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1917] font-bold leading-tight">
                Alianças estratégicas com impacto socioambiental direto
              </h2>
              <p className="font-sans text-base sm:text-lg text-[#57534e] leading-relaxed">
                Conectamos o investimento corporativo ESG da sua empresa a resultados mensuráveis, auditados e com comprovação técnica no território. Fornecemos relatórios bimestrais para seus balanços de sustentabilidade.
              </p>
              
              <div className="flex flex-col gap-3.5 pt-1">
                <div className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-[#e7e2da]">
                  <span className="material-symbols-outlined text-[#166534] text-[24px] mt-0.5 shrink-0">verified</span>
                  <div>
                    <h4 className="font-serif text-base text-[#1c1917] font-bold">Leis de Incentivo Fiscal (IRPJ)</h4>
                    <p className="font-sans text-xs sm:text-sm text-[#57534e] leading-relaxed">
                      Destine até 1% do seu Imposto de Renda devido via FIA (Fundo da Infância) ou Fundo do Idoso sem custo adicional à sua operação.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-[#e7e2da]">
                  <span className="material-symbols-outlined text-[#b45309] text-[24px] mt-0.5 shrink-0">groups</span>
                  <div>
                    <h4 className="font-serif text-base text-[#1c1917] font-bold">Voluntariado Corporativo Estruturado</h4>
                    <p className="font-sans text-xs sm:text-sm text-[#57534e] leading-relaxed">
                      Mobilize seus colaboradores para oficinas de mentoria profissional, revitalização de espaços educativos e mutirões técnicos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-[#e7e2da]">
                  <span className="material-symbols-outlined text-[#44403c] text-[24px] mt-0.5 shrink-0">domain</span>
                  <div>
                    <h4 className="font-serif text-base text-[#1c1917] font-bold">Adoção de Salas e Turmas Técnicas</h4>
                    <p className="font-sans text-xs sm:text-sm text-[#57534e] leading-relaxed">
                      Adote uma turma de capacitação por 12 meses, garantindo insumos, computadores e auxílio de transporte para os formandos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('seja-parceiro')}
                  className="inline-flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white px-8 py-4 rounded-xl font-sans text-sm font-bold shadow-xs transition-all cursor-pointer"
                >
                  <span>Apresentação Institucional para Empresas</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-6 flex flex-col gap-4"
            >
              <div className="bg-white p-6 sm:p-8 rounded-3xl flex flex-col gap-5 shadow-xs border border-[#e7e2da]">
                <h3 className="font-serif text-2xl text-[#1c1917] font-bold">
                  Canais diretos de contribuição
                </h3>
                
                <div className="space-y-3">
                  <div className="p-4 bg-[#fbf9f5] rounded-xl flex items-center justify-between border border-[#e7e2da]">
                    <div>
                      <span className="font-sans text-sm font-bold text-[#1c1917] block">
                        Contribuição Mensal Recorrente
                      </span>
                      <span className="font-sans text-xs text-[#57534e]">
                        Apoio contínuo para manter refeições e professores
                      </span>
                    </div>
                    <button 
                      onClick={() => onOpenDonation()}
                      className="bg-[#b45309] hover:bg-[#92400e] text-white px-4 py-2 rounded-lg font-sans text-xs font-bold transition-colors cursor-pointer"
                    >
                      Assinar
                    </button>
                  </div>

                  <div className="p-4 bg-[#fbf9f5] rounded-xl flex items-center justify-between border border-[#e7e2da]">
                    <div>
                      <span className="font-sans text-sm font-bold text-[#1c1917] block">
                        Doação Única via Chave PIX
                      </span>
                      <span className="font-sans text-xs text-[#57534e]">
                        Aporte pontual com recibo fiscal imediato
                      </span>
                    </div>
                    <button 
                      onClick={() => onOpenDonation()}
                      className="bg-[#166534] hover:bg-[#14532d] text-white px-4 py-2 rounded-lg font-sans text-xs font-bold transition-colors cursor-pointer"
                    >
                      PIX Agora
                    </button>
                  </div>

                  <div className="p-4 bg-[#fbf9f5] rounded-xl flex items-center justify-between border border-[#e7e2da]">
                    <div>
                      <span className="font-sans text-sm font-bold text-[#1c1917] block">
                        Doação de Equipamentos e Insumos
                      </span>
                      <span className="font-sans text-xs text-[#57534e]">
                        Computadores, tecidos, alimentos não-perecíveis
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        const el = document.getElementById('contato-secao');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-[#ede7dc] hover:bg-[#e3dcd0] text-[#1c1917] px-4 py-2 rounded-lg font-sans text-xs font-bold transition-colors cursor-pointer"
                    >
                      Agendar
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-[#f5f1ea] rounded-xl flex items-center gap-3.5 border border-[#e7e2da]">
                  <span className="material-symbols-outlined text-[28px] text-[#166534]">verified_user</span>
                  <div className="flex flex-col">
                    <span className="font-sans text-xs sm:text-sm font-bold text-[#1c1917]">Certificação OSCIP e CEBAS</span>
                    <span className="font-sans text-xs text-[#57534e]">Entidade com reconhecimento público e prestação de contas homologada.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HISTÓRIAS REAIS DA COMUNIDADE (SEM ESTRELAS DE E-COMMERCE) */}
      <section className="w-full py-18 sm:py-24 bg-[#fbf9f5] border-b border-[#e7e2da]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-[760px] mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1917] font-bold">
              Histórias de quem constrói e vive o Instituto
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#57534e] mt-2">
              A solidariedade autêntica não é sobre favor, é sobre reciprocidade e reconhecimento do valor de cada pessoa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white p-7 sm:p-8 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-6 border border-[#e7e2da]"
              >
                <div className="flex flex-col gap-4">
                  <span className="font-serif text-4xl text-[#b45309] leading-none select-none">“</span>
                  <p className="font-serif text-base sm:text-lg text-[#1c1917] italic leading-relaxed -mt-3">
                    {t.quote}
                  </p>
                </div>
                
                <div className="flex items-center gap-3.5 pt-4 border-t border-[#f5f1ea]">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#ede7dc] shrink-0 border border-[#e7e2da]">
                    <img className="w-full h-full object-cover" alt={t.name} src={t.avatar} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-bold text-[#1c1917]">{t.name}</span>
                    <span className="font-sans text-xs text-[#78716c]">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO CONTATO INSTITUCIONAL */}
      <section className="w-full py-18 sm:py-24 bg-[#f5f1ea] border-b border-[#e7e2da]" id="contato-secao">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Mensagem e Contexto Institucional */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex flex-col gap-6"
            >
              <div className="space-y-4">
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-bold tracking-tight">
                  Fale com a equipe do Instituto
                </h2>
                <p className="font-sans text-base text-[#57534e] leading-relaxed">
                  Estamos à disposição para receber sua proposta de voluntariado, esclarecer dúvidas sobre doações ou agendar uma visita guiada às nossas oficinas e núcleos de atendimento em Itaguaí.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#e7e2da] shadow-2xs flex flex-col gap-4 text-xs font-sans text-[#57534e]">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#166534]/10 text-[#166534] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </span>
                  <div>
                    <strong className="text-[#1c1917] block">Tempo Médio de Retorno</strong>
                    <span>Respondemos mensagens em até 24 horas úteis.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#b45309]/10 text-[#b45309] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </span>
                  <div>
                    <strong className="text-[#1c1917] block">Acolhimento Direto</strong>
                    <span>Cada contato é direcionado aos coordenadores de projeto.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#78716c]/10 text-[#78716c] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                  </span>
                  <div>
                    <strong className="text-[#1c1917] block">Privacidade Respeitada</strong>
                    <span>Tratamento seguro em estrita conformidade com a LGPD.</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Formulário Institucional */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl shadow-xs border border-[#e7e2da]"
            >
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-bold text-[#1c1917]" htmlFor="nome">
                      Nome Completo
                    </label>
                    <input 
                      id="nome" 
                      required 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf9f5] text-[#1c1917] placeholder:text-[#a8a29e] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 border border-[#e7e2da]" 
                      placeholder="Seu nome" 
                      type="text" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-bold text-[#1c1917]" htmlFor="email">
                      E-mail de Contato
                    </label>
                    <input 
                      id="email" 
                      required 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf9f5] text-[#1c1917] placeholder:text-[#a8a29e] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 border border-[#e7e2da]" 
                      placeholder="seu@email.com" 
                      type="email" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-bold text-[#1c1917]" htmlFor="telefone">
                      Telefone / WhatsApp
                    </label>
                    <input 
                      id="telefone" 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf9f5] text-[#1c1917] placeholder:text-[#a8a29e] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 border border-[#e7e2da]" 
                      placeholder="(21) 98742-8647" 
                      type="tel" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-bold text-[#1c1917]" htmlFor="assunto">
                      Finalidade do Contato
                    </label>
                    <select 
                      id="assunto" 
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf9f5] text-[#1c1917] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 border border-[#e7e2da]"
                    >
                      <option value="doacao">Quero Apoiar o Instituto com Doação</option>
                      <option value="voluntariado">Candidatura para Voluntariado</option>
                      <option value="parceria">Parceria Institucional ou Empresarial</option>
                      <option value="duvidas">Dúvidas Gerais e Transparência</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-bold text-[#1c1917]" htmlFor="mensagem">
                    Mensagem
                  </label>
                  <textarea 
                    id="mensagem" 
                    required 
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#fbf9f5] text-[#1c1917] placeholder:text-[#a8a29e] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 resize-none border border-[#e7e2da]" 
                    placeholder="Como você gostaria de colaborar conosco?" 
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#1c1917] hover:bg-black text-white py-4 rounded-xl font-sans text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2" 
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Enviar Mensagem</span>
                </motion.button>

                {contactFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-[#dcfce7] border border-[#166534]/30 text-[#166534] font-sans text-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>Mensagem recebida com sucesso! Nossa equipe retornará em até 24 horas úteis.</span>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BANNER FINAL DE CONVOCAÇÃO SOCIAL */}
      <section className="w-full py-20 bg-[#166534] text-white relative overflow-hidden">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-5 relative z-10">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold max-w-[920px] leading-tight">
            Nenhuma comunidade avança sozinha quando nos unimos com respeito e ação.
          </h2>
          <p className="font-sans text-base sm:text-lg max-w-[700px] text-emerald-100/90 leading-relaxed">
            Seja com uma doação regular, uma oficina voluntária ou uma aliança institucional: sua participação faz a diferença agora.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenDonation()}
              className="bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm font-bold px-8 py-4 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Apoiar o Instituto Agora
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const el = document.getElementById('contato-secao');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white/15 hover:bg-white/25 text-white font-sans text-sm font-semibold px-8 py-4 rounded-xl transition-all cursor-pointer border border-white/20"
            >
              Cadastrar-se como Voluntário
            </motion.button>
          </div>
        </div>
      </section>

      {/* SEÇÃO STANDALONE: DÚVIDAS FREQUENTES (FAQ) - Movida para após o banner de convocação */}
      <section className="w-full py-20 sm:py-28 bg-[#f5f1ea] border-b border-[#e7e2da]" id="duvidas-frequentes">
        <div className="max-w-[960px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1917] font-bold tracking-tight mb-3">
              Dúvidas Frequentes
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#57534e]">
              Respostas claras sobre doações, prestação de contas, cursos e voluntariado no Instituto.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <details className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-[#e7e2da] shadow-2xs hover:shadow-xs transition-shadow">
              <summary className="font-serif text-base sm:text-lg font-bold text-[#1c1917] list-none flex justify-between items-center">
                <span>Como recebo o comprovante fiscal da minha doação?</span>
                <span className="w-8 h-8 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#1c1917] group-open:rotate-180 transition-transform shrink-0 ml-3">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </summary>
              <p className="font-sans text-sm sm:text-base text-[#57534e] pt-3 leading-relaxed border-t border-[#e7e2da]/60 mt-3">
                O comprovante fiscal e recibo oficial são disparados automaticamente para o seu e-mail logo após a confirmação bancária, contendo o CNPJ 18.360.956/0001-60 e todas as informações para sua segurança e prestação de contas.
              </p>
            </details>

            <details className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-[#e7e2da] shadow-2xs hover:shadow-xs transition-shadow">
              <summary className="font-serif text-base sm:text-lg font-bold text-[#1c1917] list-none flex justify-between items-center">
                <span>Posso doar alimentos ou materiais pessoalmente na sede?</span>
                <span className="w-8 h-8 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#1c1917] group-open:rotate-180 transition-transform shrink-0 ml-3">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </summary>
              <p className="font-sans text-sm sm:text-base text-[#57534e] pt-3 leading-relaxed border-t border-[#e7e2da]/60 mt-3">
                Sim! Recebemos alimentos não-perecíveis, itens de higiene e insumos para oficinas de segunda a sexta, das 8h às 17h, em nossa sede oficial na Rua Otilia Borges, S/nº Lote 25, Quadra 25 – Bairro Leandro, Itaguaí / RJ.
              </p>
            </details>

            <details className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-[#e7e2da] shadow-2xs hover:shadow-xs transition-shadow">
              <summary className="font-serif text-base sm:text-lg font-bold text-[#1c1917] list-none flex justify-between items-center">
                <span>Onde consulto os relatórios de auditoria e balanços financeiros?</span>
                <span className="w-8 h-8 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#1c1917] group-open:rotate-180 transition-transform shrink-0 ml-3">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </summary>
              <p className="font-sans text-sm sm:text-base text-[#57534e] pt-3 leading-relaxed border-t border-[#e7e2da]/60 mt-3">
                No menu superior, na aba "Portal da Transparência", você tem acesso aberto a balanços contábeis, certidões negativas de débito, atas estatutárias e relatórios de auditoria independente.
              </p>
            </details>

            <details className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-[#e7e2da] shadow-2xs hover:shadow-xs transition-shadow">
              <summary className="font-serif text-base sm:text-lg font-bold text-[#1c1917] list-none flex justify-between items-center">
                <span>Como funciona o encaminhamento dos alunos aos empregos?</span>
                <span className="w-8 h-8 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#1c1917] group-open:rotate-180 transition-transform shrink-0 ml-3">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </summary>
              <p className="font-sans text-sm sm:text-base text-[#57534e] pt-3 leading-relaxed border-t border-[#e7e2da]/60 mt-3">
                Mantemos convênios com empresas e cooperativas parceiras. Ao concluir os módulos práticos, os formandos contam com mentoria de currículo e são conectados prioritariamente às vagas abertas no território.
              </p>
            </details>

            <details className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-[#e7e2da] shadow-2xs hover:shadow-xs transition-shadow">
              <summary className="font-serif text-base sm:text-lg font-bold text-[#1c1917] list-none flex justify-between items-center">
                <span>Como minha empresa pode se tornar parceira institucional ou apoiar via ESG?</span>
                <span className="w-8 h-8 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#1c1917] group-open:rotate-180 transition-transform shrink-0 ml-3">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </summary>
              <p className="font-sans text-sm sm:text-base text-[#57534e] pt-3 leading-relaxed border-t border-[#e7e2da]/60 mt-3">
                Marcas e fundações podem apadrinhar turmas inteiras, apoiar núcleos comunitários ou destinar incentivos fiscais. Nossa diretoria apresentará os modelos de parceria com métricas de impacto verificáveis.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

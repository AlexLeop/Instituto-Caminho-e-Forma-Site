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
import { DONATION_TOTALS, formatDonationAmount } from '../data/donations';

interface HomeViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenDonation: (projectName?: string) => void;
  onOpenTransparency: () => void;
  onSelectProduct: (product: typeof MARKET_PRODUCTS[0]) => void;
  onSelectProject?: (project: typeof PROJECTS[0]) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenDonation,
  onOpenTransparency,
  onSelectProduct,
  onSelectProject
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('Dúvidas sobre Cursos e Capacitação');
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

  // Parallax & Transições de Scroll suaves
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroBgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

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
      setContactFeedback(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col w-full bg-white text-slate-900">
      {/* HERO SECTION - LIGHT & EDITORIAL */}
      <motion.section
        ref={heroRef}
        className="relative w-full min-h-[calc(100vh-4rem)] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-white pt-20 sm:pt-24 pb-8 sm:pb-12 z-10"
      >
        {/* Camada Parallax & Dissolve Loop do Background com Imagens Vivas em Luz Natural e Resolução 4K */}
        <motion.div
          style={{ y: heroBgY }}
          className="absolute inset-0 -top-20 -bottom-20 z-0 pointer-events-none will-change-transform overflow-hidden"
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
                  className={`w-full h-full bg-cover bg-center filter brightness-[1.0] contrast-[1.06] saturate-[1.15] transition-transform duration-[6500ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  style={{ backgroundImage: `url('${slide.url}')` }}
                />
              </div>
            );
          })}

          {/* Camada Sutil de Ambientação */}
          <div className="absolute inset-0 z-10 bg-slate-900/5 pointer-events-none" />

          {/* Efeito Degradê em Movimento (Ambient Glowing Orbs da Marca em Âmbar e Esmeralda) */}
          <motion.div
            animate={{
              x: [0, 45, -35, 0],
              y: [0, -35, 25, 0],
              scale: [1, 1.15, 0.95, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-32 -left-28 w-[550px] h-[550px] lg:w-[750px] lg:h-[750px] bg-gradient-to-br from-[#b45309]/24 via-[#d97706]/16 to-transparent rounded-full blur-3xl pointer-events-none z-20 mix-blend-multiply sm:mix-blend-normal"
          />

          <motion.div
            animate={{
              x: [0, -50, 40, 0],
              y: [0, 40, -45, 0],
              scale: [1, 0.9, 1.18, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/4 -right-28 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] bg-gradient-to-tl from-[#166534]/22 via-[#15803d]/15 to-transparent rounded-full blur-3xl pointer-events-none z-20"
          />

          <motion.div
            animate={{
              x: [-30, 40, -20, -30],
              y: [20, -30, 15, 20],
              scale: [0.95, 1.12, 0.96, 0.95],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-10 left-1/3 w-[420px] h-[420px] lg:w-[580px] lg:h-[580px] bg-[#f59e0b]/14 rounded-full blur-3xl pointer-events-none z-20"
          />

          {/* Gradientes Direcionais de Fusão: Alto Contraste para o Texto e Transição Suave */}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-white/95 via-white/70 via-35% to-transparent to-75% pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none z-20" />
        </motion.div>

        {/* Conteúdo Central da Hero */}
        <motion.div
          style={{ y: heroTextY }}
          className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center py-8 sm:py-12"
        >
          <div className="max-w-[760px] flex flex-col gap-4 sm:gap-5">
            {/* Selo / Eyebrow discreto e elegante */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#d6cec2] text-[#44403c] text-xs font-semibold w-fit shadow-2xs backdrop-blur-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
              <span>Ação Comunitária &amp; Cidadania em Itaguaí e Região</span>
            </motion.div>

            {/* Display Headline Editorial com Literata */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-[3.25rem] text-slate-900 font-serif tracking-tight font-bold leading-[1.12] text-balance drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]"
            >
              Dignidade, autonomia e futuro para quem constrói o nosso chão.
            </motion.h1>

            {/* Subtitle Humanista com Manrope */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-base sm:text-lg text-[#292524] max-w-[620px] leading-relaxed font-medium text-pretty drop-shadow-[0_1px_2px_rgba(251,249,245,0.95)]"
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
                className="inline-flex items-center justify-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm sm:text-base font-bold px-6 py-3.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                <span>Apoiar Nossas Famílias</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('projetos-destaque')}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-sans text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl transition-all cursor-pointer border border-slate-200 shadow-2xs"
              >
                <span>Conhecer Projetos em Campo</span>
                <span className="material-symbols-outlined text-[18px] text-[#b45309]">arrow_downward</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* FAIXA INTEGRADA DE IMPACTO E TRANSPARÊNCIA */}
        <div className="relative z-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-auto pb-2 sm:pb-4">
          {/* Barra Superior do Impacto: Contexto da Foto em Loop + Indicador de Scroll Suave */}
          <div className="flex items-center justify-between gap-4 mb-3">
            {/* Tag e Navegação do Loop de Fotos Autênticas */}
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-800 text-xs shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#b45309] animate-pulse" />
              <span className="font-sans font-semibold text-[11px] sm:text-xs tracking-wide text-slate-800">
                {HERO_SLIDES[currentSlideIndex].contextTag}
              </span>
              <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    aria-label={`Ver foto ${i + 1}: ${HERO_SLIDES[i].contextTag}`}
                    className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                      i === currentSlideIndex
                        ? 'w-5 bg-[#b45309]'
                        : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Convite de Scroll Animado com Efeito de Transição */}
            <motion.button
              style={{ opacity: scrollIndicatorOpacity }}
              onClick={() => scrollToSection('secao-parceiros')}
              className="hidden sm:inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-slate-200 cursor-pointer transition-all pointer-events-auto group shadow-xs"
            >
              <span>Conheça os parceiros</span>
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="material-symbols-outlined text-[16px] text-[#b45309] group-hover:translate-y-0.5 transition-transform"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm text-slate-900"
          >
            <div className="flex flex-col gap-0.5 border-l-2 border-[#b45309] pl-3.5">
              <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                350
              </div>
              <span className="font-sans text-xs sm:text-sm font-bold text-slate-900">
                Famílias Atendidas
              </span>
              <p className="font-sans text-[11px] sm:text-xs text-slate-500">Nutrição, acolhimento e formação contínua</p>
            </div>

            <div className="flex flex-col gap-0.5 border-l-2 border-[#166534] pl-3.5">
              <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                400<span className="text-base sm:text-lg text-[#166534] font-sans ml-1 font-semibold">kg</span>
              </div>
              <span className="font-sans text-xs sm:text-sm font-bold text-slate-900">
                Alimentos Distribuídos
              </span>
              <p className="font-sans text-[11px] sm:text-xs text-slate-500">Segurança alimentar e combate à fome</p>
            </div>

            <div className="flex flex-col gap-0.5 border-l-2 border-[#b45309] pl-3.5">
              <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                3<span className="text-base sm:text-lg text-[#b45309] font-sans ml-1 font-semibold">núcleos</span>
              </div>
              <span className="font-sans text-xs sm:text-sm font-bold text-slate-900">
                Núcleos Comunitários
              </span>
              <p className="font-sans text-[11px] sm:text-xs text-slate-500">Polos de atendimento em Itaguaí e região</p>
            </div>

            <button
              type="button"
              onClick={onOpenTransparency}
              title="Acessar Portal da Transparência"
              className="group flex flex-col items-start gap-0.5 rounded-r-lg border-l-2 border-[#166534] pl-3.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#166534]"
            >
              <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight group-hover:text-[#166534]">
                100<span className="text-base sm:text-lg font-sans font-semibold text-[#166534] ml-1">%</span>
              </span>
              <span className="flex items-center gap-1 font-sans text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#166534]">
                Auditoria Aberta
                <span className="material-symbols-outlined text-[15px] text-[#166534]" aria-hidden="true">open_in_new</span>
              </span>
              <span className="font-sans text-[11px] sm:text-xs text-slate-500">Balanços e notas fiscais auditados pelos fiscais do instituto</span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* SEÇÃO PARCEIROS E APOIADORES INSTITUCIONAIS - Fiel à referência do usuário */}
      <section
        id="secao-parceiros"
        className="w-full relative z-20 bg-slate-50 py-14 sm:py-20 border-b border-slate-200"
      >
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Seção */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="font-sans text-xs sm:text-[13px] font-bold text-[#b45309] tracking-[0.16em] uppercase mb-2.5">
              Articulação &amp; Sustentabilidade
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl text-[#111827] font-bold tracking-tight mb-3">
              Parceiros e Apoiadores Institucionais
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Empresas, cooperativas e iniciativas que somam esforços ao Instituto Caminho e Forma pelo desenvolvimento socioeconômico de Itaguaí.
            </p>
          </div>

          {/* Carrossel de Logos com Auto-scroll Contínuo */}
          <div className="mb-10 sm:mb-12">
            <PartnerLogosCarousel />
          </div>

          {/* Linha Divisória Sutil e Link de Ação Institucional */}
          <div className="border-t border-slate-200 pt-8 flex items-center justify-center text-center">
            <p className="font-sans text-xs sm:text-sm text-slate-600">
              Sua empresa deseja apoiar as ações sociais do Instituto ou destinar incentivos fiscais?{' '}
              <button
                type="button"
                onClick={() => onNavigate('seja-parceiro')}
                className="inline-flex items-center gap-1 text-[#b45309] hover:text-[#92400e] font-bold transition-colors cursor-pointer ml-1"
              >
                <span>Seja um Parceiro Institucional</span>
                <span className="text-base leading-none">→</span>
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO SOBRE NÓS & LIDERANÇA FUNDADORA - DESIGN EDITORIAL ABERTO (SEM CARDS) */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-200" id="sobre">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">

          {/* Título e Descrição da Seção no Topo (Quem somos) - Ocupando a largura total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3 mb-10 sm:mb-12 w-full"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-bold leading-tight">
              Quem somos
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed mt-1 w-full">
              O Instituto Caminho e Forma surgiu da visão do Professor Jorge Antônio Ramos Nascimento de que o esporte, aliado à educação e a valores sólidos, pode abrir caminhos para uma vida melhor. Desde 2012, essa visão mobilizou professores, famílias, alunos e apoiadores em torno de um propósito comum.
            </p>
          </motion.div>

          {/* Layout Principal: Foto Compacta e Conteúdo Editorial que preenche todo o espaço */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch">
            
            {/* 1. COLUNA DA ESQUERDA: FOTO DO CO-FUNDADOR NA PROPORÇÃO NATURAL */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full sm:w-[260px] lg:w-[280px] shrink-0 flex flex-col"
            >
              <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-slate-100">
                <img 
                  src="/equipe/Pastor Jorge Antônio Ramos.jpg" 
                  alt="Pastor Jorge Antônio Ramos - Co-Fundador do Instituto Caminho e Forma" 
                  className="w-full h-auto block"
                />

                {/* Identificação na base da foto */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent p-4 sm:p-5 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                    Pastor Jorge Antônio Ramos
                  </h3>
                  <p className="font-sans text-xs text-amber-300 font-medium mt-1">
                    Co-Fundador do Instituto Caminho e Forma
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 2. COLUNA DA DIREITA: CONTEÚDO EDITORIAL QUE OCUPA TODO O ESPAÇO */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1 min-w-0 flex flex-col justify-between gap-6"
            >
              
              {/* Topo da Direita: Tagline + Título "Um sonho que virou um legado!" + Descrição da Citação */}
              <div className="pb-6 border-b border-slate-200">
                {/* Tagline reposicionada no topo do bloco de conteúdo */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase mb-2">
                  <span className="text-[#b45309] font-bold">Origem &amp; Liderança</span>
                  <span>•</span>
                  <span>Esporte</span>
                  <span>•</span>
                  <span>Educação</span>
                  <span>•</span>
                  <span>Valores</span>
                  <span>•</span>
                  <span>Um Futuro Melhor</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2.25rem] text-slate-900 font-extrabold leading-[1.15] tracking-tight">
                  Um sonho que virou um legado!
                </h3>
                <p className="font-serif text-base sm:text-lg text-slate-600 font-medium leading-relaxed italic mt-3">
                  "Mais que um Instituto, somos uma grande família que acredita no poder do esporte, da educação e dos valores para transformar vidas."
                </p>
              </div>

              {/* Parte Inferior: História de Origem (esquerda) + Lista Vertical de Valores (direita) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-1">
                
                {/* História de Origem */}
                <div className="md:col-span-7 space-y-3.5 text-slate-700 font-sans text-sm sm:text-base leading-relaxed">
                  <p>
                    O <strong>Instituto Caminho e Forma</strong> foi fundado em <strong className="text-slate-900">2012</strong> por <strong>Jorge Antônio Ramos Nascimento</strong>, que tinha um sonho claro e inspirador: fazer com que pessoas enxergassem o caminho para uma vida melhor.
                  </p>
                  <p>
                    Através de uma conduta pautada na moral e na ética, escolheu o esporte, especialmente a disciplina milenar do <strong>Taekwondo</strong> como ferramenta pedagógica e emancipatória de transformação social, acolhendo crianças e jovens das comunidades de Itaguaí.
                  </p>
                </div>

                {/* Lista Vertical de Valores */}
                <div className="md:col-span-5 md:border-l md:border-slate-200 md:pl-6 space-y-0">
                  <span className="font-sans text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                    Pilares Fundamentais
                  </span>
                  
                  {/* DISCIPLINA */}
                  <div className="flex items-center gap-3 py-2 border-b border-slate-200">
                    <span className="material-symbols-outlined text-slate-800 text-[18px] shrink-0">track_changes</span>
                    <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                      Disciplina
                    </span>
                  </div>

                  {/* RESPEITO */}
                  <div className="flex items-center gap-3 py-2 border-b border-slate-200">
                    <span className="material-symbols-outlined text-slate-800 text-[18px] shrink-0">handshake</span>
                    <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                      Respeito
                    </span>
                  </div>

                  {/* SOLIDARIEDADE */}
                  <div className="flex items-center gap-3 py-2 border-b border-slate-200">
                    <span className="material-symbols-outlined text-slate-800 text-[18px] shrink-0">groups</span>
                    <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                      Solidariedade
                    </span>
                  </div>

                  {/* SUPERAÇÃO */}
                  <div className="flex items-center gap-3 py-2 border-b border-slate-200">
                    <span className="material-symbols-outlined text-slate-800 text-[18px] shrink-0">trending_up</span>
                    <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                      Superação
                    </span>
                  </div>

                  {/* VALORES */}
                  <div className="flex items-center gap-3 py-2">
                    <span className="material-symbols-outlined text-slate-800 text-[18px] shrink-0">favorite</span>
                    <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                      Valores
                    </span>
                  </div>
                </div>

              </div>

            </motion.div>

          </div>

          {/* LIDERANÇA EXECUTIVA & EQUIPE TÉCNICA: PRESIDENTE E ASSISTENTE SOCIAL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-10 sm:pt-12 mt-12 sm:mt-16 border-t border-slate-200">
            
            {/* 1. Presidente - Carlos Alexandre */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-stretch"
            >
              {/* Foto (redimensionada para proporção harmoniosa com o texto) */}
              <div className="w-full sm:w-[190px] lg:w-[210px] xl:w-[220px] shrink-0">
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                  <img 
                    src="/equipe/carlos-alexandre-diretor.jpeg" 
                    alt="Carlos Alexandre - Presidente do Instituto Caminho e Forma"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <span className="font-sans text-[11px] uppercase font-bold tracking-wider text-[#b45309] block mb-1">
                    Presidência
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                    Carlos Alexandre
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-500 font-medium mt-0.5 mb-2.5">
                    Presidente do Instituto Caminho e Forma
                  </p>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                    À frente da governança institucional e do planejamento estratégico, atua na articulação de alianças e na formulação de projetos voltados à proteção e ao desenvolvimento integral de crianças e jovens.
                  </p>
                </div>

                {/* Qualificações (2 itens, no mesmo padrão da assistente social) */}
                <div className="pt-3 border-t border-slate-100 mt-3">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                    Formação &amp; Especializações
                  </span>
                  <ul className="space-y-2 font-sans text-xs sm:text-[13px] text-slate-700">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#b45309] text-[18px] shrink-0 leading-none">school</span>
                      <span className="leading-snug">Pós-Graduação em <strong>Ciência Política</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#b45309] text-[18px] shrink-0 leading-none">verified_user</span>
                      <span className="leading-snug">Pós-Graduação em <strong>ECA</strong> (Estatuto da Criança e do Adolescente)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 2. Assistente Social - Cristiana de Oliveira Vieira */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-stretch"
            >
              {/* Foto (redimensionada para proporção harmoniosa com o texto) */}
              <div className="w-full sm:w-[190px] lg:w-[210px] xl:w-[220px] shrink-0">
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                  <img 
                    src="/equipe/cristiana-de-oliveira-assistente-social.jpeg" 
                    alt="Cristiana de Oliveira Vieira - Assistente Social do Instituto Caminho e Forma" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <span className="font-sans text-[11px] uppercase font-bold tracking-wider text-emerald-700 block mb-1">
                    Serviço Social &amp; Acolhimento
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                    Cristiana de Oliveira Vieira
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-500 font-medium mt-0.5 mb-2.5">
                    Assistente Social Responsável
                  </p>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Coordena o acompanhamento socioassistencial das famílias atendidas, promovendo a garantia de direitos, o acesso a redes públicas de proteção e o fortalecimento de vínculos comunitários.
                  </p>
                </div>

                {/* Qualificações */}
                <div className="pt-3 border-t border-slate-100 mt-3">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                    Formação &amp; Especializações
                  </span>
                  <ul className="space-y-2 font-sans text-xs sm:text-[13px] text-slate-700">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 leading-none">school</span>
                      <span className="leading-snug">Pós-Graduação Lato Sensu em <strong>Serviço Social e Políticas Sociais</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 leading-none">workspace_premium</span>
                      <span className="leading-snug">Bacharelado em <strong>Serviço Social</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* SEÇÃO PROJETOS EM ANDAMENTO */}
      <section className="w-full py-16 sm:py-24 bg-slate-50 border-b border-slate-200" id="projetos-destaque">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-2 max-w-[760px]">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-bold">
                Projetos comunitários em campo
              </h2>
              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Conheça os projetos e suas metas de arrecadação para apoiar ações de acolhimento infantil, segurança alimentar e capacitação profissional no território.
              </p>
            </div>
            <button
              onClick={() => onNavigate('projetos')}
              className="inline-flex items-center gap-2 font-sans text-sm font-bold text-[#b45309] hover:text-[#92400e] transition-colors self-start md:self-auto cursor-pointer"
            >
              <span>Ver todos os {PROJECTS.length} projetos</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-950">Total de doações recebidas: {formatDonationAmount(DONATION_TOTALS.totalCents)}</p>
              <p className="mt-1 text-sm text-emerald-900">Fundo geral: {formatDonationAmount(DONATION_TOTALS.generalFundCents)} • Cursos EAD: {formatDonationAmount(DONATION_TOTALS.eadCoursesCents)}</p>
              <p className="mt-1 text-sm text-emerald-900">As doações são contabilizadas separadamente conforme sua destinação.</p>
            </div>
            <button type="button" onClick={() => onNavigate('transparencia')} className="min-h-11 shrink-0 self-start rounded-xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-100">Acompanhar doações</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.slice(0, 3).map((proj, idx) => {
              const categoryBadge = proj.categoryTagType === 'secondary'
                ? 'bg-[#166534] text-white'
                : proj.categoryTagType === 'primary'
                  ? 'bg-[#b45309] text-white'
                  : 'bg-slate-700 text-white';

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
                  className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col border border-slate-200 hover:border-slate-300"
                >
                  <div
                    onClick={() => onSelectProject ? onSelectProject(proj) : onNavigate('projetos')}
                    className="relative h-64 w-full overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className={`absolute top-3 left-3 ${categoryBadge} font-sans text-xs px-3 py-1 rounded-md font-bold shadow-xs`}>
                      {proj.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md font-sans text-xs font-bold text-slate-900 shadow-xs border border-slate-200">
                      {proj.progressPercent}% da meta de arrecadação
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                    <div>
                      <h3
                        onClick={() => onSelectProject ? onSelectProject(proj) : onNavigate('projetos')}
                        className="font-serif text-xl text-slate-900 font-bold mb-2 cursor-pointer hover:text-[#b45309] transition-colors"
                      >
                        {proj.title}
                      </h3>
                      <p className="font-sans text-sm text-slate-600 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${proj.progressPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`${barColor} h-full rounded-full`}
                        />
                      </div>
                      <div className="flex justify-between items-center font-sans text-xs sm:text-sm">
                        <span className="text-slate-900 font-bold">
                          R$ {proj.raisedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} arrecadados
                        </span>
                        <span className="text-slate-500">
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
                        onClick={() => onSelectProject ? onSelectProject(proj) : onNavigate('projetos')}
                        className="p-3 rounded-xl bg-slate-100 hover:bg-[#b45309] hover:text-white text-slate-800 transition-colors cursor-pointer"
                        title="Ver detalhes completos do projeto"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
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
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-200 text-slate-900" id="cursos">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Coluna Esquerda: Texto + 4 Trilhas + Botão */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 flex flex-col gap-6"
            >
              <div className="space-y-3">
                <span className="font-sans text-xs uppercase text-[#b45309] font-bold tracking-wider">
                  Capacitação Profissional
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-bold leading-tight">
                  Educação prática para autonomia profissional e geração de renda
                </h2>
                <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                  Nossas oficinas foram desenhadas a partir das vocações e demandas da própria comunidade. Mais do que certificados, entregamos formação técnica aplicada, mentoria de negócios e apoio à inserção produtiva no mercado.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Inclusão Digital & Informática', desc: 'Letramento digital, pacote escritório e suporte técnico básico.' },
                  { title: 'Panificação & Gastronomia', desc: 'Produção artesanal de pães, boas práticas e nutrição comunitária.' },
                  { title: 'Artesanato & Biojoias', desc: 'Economia circular, reaproveitamento de fibras e design autoral.' },
                  { title: 'Gestão Financeira & Negócios', desc: 'Precificação correta, cooperativismo e abertura de MEI.' },
                ].map((track, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-2xs hover:border-[#b45309]/30 transition-colors"
                  >
                    <span className="font-serif text-base font-bold text-slate-900">{track.title}</span>
                    <span className="font-sans text-xs text-slate-600 leading-relaxed">{track.desc}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('cursos-e-capacitacao')}
                  className="inline-flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white px-8 py-3.5 rounded-xl font-sans text-sm font-bold shadow-xs transition-all cursor-pointer"
                >
                  <span>Conferir Grade Completa &amp; Inscrições</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </motion.button>
                <span className="font-sans text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#166534] text-[18px]">verified</span> Investimento social acessível revertido para manter os projetos
                </span>
              </div>
            </motion.div>

            {/* Coluna Direita: Imagem de Destaque */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="w-full max-w-[500px] aspect-4/3 rounded-2xl overflow-hidden shadow-md relative border border-slate-200">
                <img
                  src={TECH_COURSE_BANNER}
                  alt="Turma em sala de informática e capacitação"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-slate-900/90 text-white px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold shadow-sm backdrop-blur-sm border border-white/10">
                  Inscrições Abertas
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO FEIRA VIRTUAL SOLIDÁRIA */}
      <section className="w-full py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-2 max-w-[760px]">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-bold">
                Feira solidária das famílias
              </h2>
              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Produtos artesanais, pães e biojoias criados por alunos de nossas oficinas. <strong className="text-slate-900 font-semibold">100% do valor da sua compra é destinado diretamente à família artesã</strong>.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('feira-virtual')}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-6 py-3.5 rounded-xl font-sans text-sm font-bold transition-all cursor-pointer shadow-xs self-start md:self-auto"
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
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col border border-slate-200 hover:border-slate-300"
              >
                <div className="h-64 w-full relative overflow-hidden group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md font-sans text-xs text-slate-900 font-bold shadow-xs border border-slate-200">
                    {item.categoryTag}
                  </span>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1 gap-5">
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <h4 className="font-serif text-lg text-slate-900 font-bold">{item.title}</h4>
                      <span className="font-serif text-lg text-[#b45309] font-bold">{item.priceFormatted}</span>
                    </div>
                    <p className="font-sans text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectProduct(item)}
                    className="w-full text-center py-3 bg-slate-100 hover:bg-[#b45309] hover:text-white text-slate-800 font-sans text-sm rounded-xl transition-colors cursor-pointer font-bold"
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
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-200" id="empresas">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Headline & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3 mb-10 max-w-4xl"
          >
            <span className="font-sans text-xs uppercase text-[#b45309] font-bold tracking-wider">
              Parcerias &amp; Investimento Social
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-bold leading-tight">
              Alianças estratégicas com impacto socioambiental direto
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed mt-1">
              Conectamos o investimento corporativo ESG da sua empresa a resultados mensuráveis, auditados e com comprovação técnica no território. Fornecemos relatórios bimestrais para seus balanços de sustentabilidade.
            </p>
          </motion.div>

          {/* Bottom Grid: 3 Oportunidades on Left, Canais de Contribuição on Right (horizontal alignment) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Coluna Esquerda: 3 Modalidades + Botão */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-6 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3.5">
                <div className="flex items-start gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs">
                  <span className="material-symbols-outlined text-[#166534] text-[24px] mt-0.5 shrink-0">verified</span>
                  <div>
                    <h4 className="font-serif text-base text-slate-900 font-bold">Leis de Incentivo Fiscal (IRPJ)</h4>
                    <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                      Destine até 1% do seu Imposto de Renda devido via FIA (Fundo da Infância) ou Fundo do Idoso sem custo adicional à sua operação.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs">
                  <span className="material-symbols-outlined text-[#b45309] text-[24px] mt-0.5 shrink-0">groups</span>
                  <div>
                    <h4 className="font-serif text-base text-slate-900 font-bold">Voluntariado Corporativo Estruturado</h4>
                    <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                      Mobilize seus colaboradores para oficinas de mentoria profissional, revitalização de espaços educativos e mutirões técnicos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs">
                  <span className="material-symbols-outlined text-slate-700 text-[24px] mt-0.5 shrink-0">domain</span>
                  <div>
                    <h4 className="font-serif text-base text-slate-900 font-bold">Adoção de Salas e Turmas Técnicas</h4>
                    <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
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

            {/* Coluna Direita: Card Canais Diretos de Contribuição */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-6 flex flex-col"
            >
              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl flex flex-col justify-between h-full gap-5 shadow-xs border border-slate-200">
                <h3 className="font-serif text-2xl text-slate-900 font-bold">
                  Canais diretos de contribuição
                </h3>

                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-xl flex items-center justify-between border border-slate-200 shadow-2xs">
                    <div>
                      <span className="font-sans text-sm font-bold text-slate-900 block">
                        Contribuição Mensal Recorrente
                      </span>
                      <span className="font-sans text-xs text-slate-500">
                        Apoio contínuo para manter refeições e professores
                      </span>
                    </div>
                    <button
                      onClick={() => onOpenDonation()}
                      className="bg-[#b45309] hover:bg-[#92400e] text-white px-4 py-2 rounded-lg font-sans text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Assinar
                    </button>
                  </div>

                  <div className="p-4 bg-white rounded-xl flex items-center justify-between border border-slate-200 shadow-2xs">
                    <div>
                      <span className="font-sans text-sm font-bold text-slate-900 block">
                        Doação Única via Chave PIX
                      </span>
                      <span className="font-sans text-xs text-slate-500">
                        Aporte pontual com recibo fiscal imediato
                      </span>
                    </div>
                    <button
                      onClick={() => onOpenDonation()}
                      className="bg-[#166534] hover:bg-[#14532d] text-white px-4 py-2 rounded-lg font-sans text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      PIX Agora
                    </button>
                  </div>

                  <div className="p-4 bg-white rounded-xl flex items-center justify-between border border-slate-200 shadow-2xs">
                    <div>
                      <span className="font-sans text-sm font-bold text-slate-900 block">
                        Doação de Equipamentos e Insumos
                      </span>
                      <span className="font-sans text-xs text-slate-500">
                        Computadores, tecidos, alimentos não-perecíveis
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const el = document.getElementById('contato-secao');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg font-sans text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Agendar
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl flex items-center gap-3.5 border border-slate-200 shadow-2xs">
                  <span className="material-symbols-outlined text-[28px] text-[#166534]">verified_user</span>
                  <div className="flex flex-col">
                    <span className="font-sans text-xs sm:text-sm font-bold text-slate-900">Certificação OSCIP e CEBAS</span>
                    <span className="font-sans text-xs text-slate-500">Entidade com reconhecimento público e prestação de contas homologada.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HISTÓRIAS REAIS DA COMUNIDADE (SEM ESTRELAS DE E-COMMERCE) */}
      <section className="w-full py-16 sm:py-24 bg-slate-50 border-b border-slate-200" id="historias">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3 mb-10 sm:mb-12 max-w-4xl"
          >
            <span className="font-sans text-xs uppercase text-[#b45309] font-bold tracking-wider">
              Depoimentos &amp; Transformação
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-bold leading-tight">
              Histórias de quem constrói e vive o Instituto
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed mt-1">
              A solidariedade autêntica não é sobre favor, é sobre reciprocidade e reconhecimento do valor de cada pessoa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white p-7 sm:p-8 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-6 border border-slate-200 hover:border-slate-300"
              >
                <div className="flex flex-col gap-4">
                  <span className="font-serif text-4xl text-[#b45309] leading-none select-none">“</span>
                  <p className="font-serif text-base sm:text-lg text-slate-800 italic leading-relaxed -mt-3">
                    {t.quote}
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img className="w-full h-full object-cover" alt={t.name} src={t.avatar} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-bold text-slate-900">{t.name}</span>
                    <span className="font-sans text-xs text-slate-500">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO CONTATO INSTITUCIONAL & SEDE */}
      <section className="w-full py-14 sm:py-20 bg-white border-b border-slate-200" id="contato-secao">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho da Seção */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="text-[#b45309] font-bold text-xs sm:text-[13px] tracking-[0.16em] uppercase block mb-1.5">
                ATENDIMENTO &amp; LOCALIZAÇÃO
              </span>
              <h2 className="font-serif sm:font-sans text-2xl sm:text-3xl lg:text-[32px] text-slate-900 font-bold tracking-tight">
                Fale Conosco e Conheça Nossa Sede
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-slate-600 md:text-right max-w-md leading-relaxed">
              Canais abertos para atendimento a famílias, matrículas em oficinas, acolhimento comunitário e articulação com parceiros institucionais.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Card Esquerdo: Envie sua Mensagem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between h-full"
            >
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Envie sua Mensagem
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 mb-5">
                  Nossa equipe retornará seu contato com agilidade e atenção.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 flex-1 h-full justify-between">
                {/* Linha 1: Nome Completo e E-mail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="nome">
                      Nome Completo *
                    </label>
                    <input
                      id="nome"
                      required
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309] focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="email">
                      E-mail *
                    </label>
                    <input
                      id="email"
                      required
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309] focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Linha 2: Telefone e Assunto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="telefone">
                      WhatsApp / Telefone *
                    </label>
                    <input
                      id="telefone"
                      required
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="(DDD) 90000-0000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309] focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="assunto">
                      Assunto / Interesse *
                    </label>
                    <div className="relative">
                      <select
                        id="assunto"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309] focus:border-transparent appearance-none bg-white transition-all cursor-pointer pr-9"
                      >
                        <option value="Dúvidas sobre Cursos e Capacitação">Dúvidas sobre Cursos e Capacitação</option>
                        <option value="Parcerias Institucionais e ESG">Parcerias Institucionais e ESG</option>
                        <option value="Voluntariado e Apoio Comunitário">Voluntariado e Apoio Comunitário</option>
                        <option value="Doações e Apoio Financeiro">Doações e Apoio Financeiro</option>
                        <option value="Outros Assuntos">Outros Assuntos</option>
                      </select>
                      <span className="material-symbols-outlined text-[18px] text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Linha 3: Mensagem (Aumentado e flexível para igualar a altura do card vizinho) */}
                <div className="flex flex-col gap-1 flex-1 min-h-[190px] lg:min-h-[220px]">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="mensagem">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    required
                    rows={7}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Escreva sua dúvida, proposta ou solicitação..."
                    className="w-full flex-1 min-h-[180px] lg:min-h-[210px] px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309] focus:border-transparent resize-none transition-all bg-white"
                  />
                </div>

                {/* Rodapé do Formulário */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 mt-auto">
                  <p className="text-[11px] text-slate-500 max-w-[270px] leading-relaxed">
                    Seus dados são confidenciais e utilizados estritamente pela coordenação do Instituto Caminho e Forma.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#b45309] hover:bg-[#92400e] text-white py-3 px-6 rounded-lg font-sans text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer self-end sm:self-auto shrink-0"
                    type="submit"
                  >
                    <span>Enviar Mensagem</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </motion.button>
                </div>

                {contactFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-sans text-xs sm:text-sm flex items-center gap-2 mt-2"
                  >
                    <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
                    <span>Mensagem recebida com sucesso! Nossa equipe retornará seu contato com agilidade.</span>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Card Direito: Localização da Sede */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between h-full"
            >
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Localização da Sede
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 mb-5">
                  Conheça o espaço onde realizamos nossas oficinas, reuniões de governança e atendimentos comunitários.
                </p>

                {/* Lista de Informações com Ícones Circulares */}
                <div className="flex flex-col gap-3.5 mb-5">
                  {/* Endereço Oficial */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-[#b45309] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-semibold text-slate-900">Endereço Oficial</span>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Rua Otilia Borges, Lote 25, Quadra 25<br />
                        Bairro Brisamar – Itaguaí / RJ<br />
                        CEP: 23.823-390
                      </p>
                    </div>
                  </div>

                  {/* Horário de Funcionamento */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-[#b45309] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-semibold text-slate-900">Horário de Funcionamento</span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Segunda a Sexta-feira: 08h às 17h
                      </p>
                    </div>
                  </div>

                  {/* Canais Oficiais */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-semibold text-slate-900">Canais Oficiais</span>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        WhatsApp: <a href="https://wa.me/5521987428647" target="_blank" rel="noopener noreferrer" className="hover:text-[#059669] font-medium transition-colors">(21) 98742-8647</a><br />
                        E-mail: <a href="mailto:institutocaminhoeforma@gmail.com" className="hover:text-[#b45309] font-medium transition-colors">institutocaminhoeforma@gmail.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mapa Google Maps e Botão de Rota */}
              <div className="mt-auto pt-2">
                <div className="w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-2xs">
                  <iframe
                    title="Mapa da Sede do Instituto Caminho e Forma"
                    src="https://maps.google.com/maps?q=Rua%20Otilia%20Borges%2C%20Brisamar%2C%20Itagua%C3%AD%20-%20RJ&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Rua+Otilia+Borges+Lote+25+Quadra+25+Bairro+Brisamar+Itaguai+RJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2.5 py-2.5 px-4 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#b45309] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    near_me
                  </span>
                  <span>Abrir e Traçar Rota no Google Maps</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BANNER FINAL DE CONVOCAÇÃO SOCIAL */}
      <section className="w-full py-16 sm:py-20 bg-[#166534] text-white relative overflow-hidden">
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
              className="bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm font-bold px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
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
              className="bg-white/15 hover:bg-white/25 text-white font-sans text-sm font-semibold px-8 py-3.5 rounded-xl transition-all cursor-pointer border border-white/20"
            >
              Cadastrar-se como Voluntário
            </motion.button>
          </div>
        </div>
      </section>

      {/* SEÇÃO STANDALONE: DÚVIDAS FREQUENTES (FAQ) */}
      <section className="w-full py-16 sm:py-24 bg-slate-50 border-b border-slate-200" id="duvidas-frequentes">
        <div className="max-w-[960px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-sans text-xs uppercase text-[#b45309] font-bold tracking-wider block mb-2">
              Tira-Dúvidas &amp; Transparência
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-bold tracking-tight mb-3">
              Dúvidas Frequentes
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600">
              Respostas claras sobre doações, prestação de contas, cursos e voluntariado no Instituto.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <details className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
              <summary className="font-serif text-base sm:text-lg font-bold text-slate-900 list-none flex justify-between items-center">
                <span>Como recebo o comprovante fiscal da minha doação?</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-open:rotate-180 transition-transform shrink-0 ml-3">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </summary>
              <p className="font-sans text-sm sm:text-base text-slate-600 pt-3 leading-relaxed border-t border-slate-100 mt-3">
                O comprovante fiscal e recibo oficial são disparados automaticamente para o seu e-mail logo após a confirmação bancária, contendo o CNPJ 18.360.956/0001-60 e todas as informações para sua segurança e prestação de contas.
              </p>
            </details>

            <details className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
              <summary className="font-serif text-base sm:text-lg font-bold text-slate-900 list-none flex justify-between items-center">
                <span>Posso doar alimentos ou materiais pessoalmente na sede?</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-open:rotate-180 transition-transform shrink-0 ml-3">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </summary>
              <p className="font-sans text-sm sm:text-base text-slate-600 pt-3 leading-relaxed border-t border-slate-100 mt-3">
                Sim! Recebemos alimentos não-perecíveis, itens de higiene e insumos para oficinas de segunda a sexta, das 8h às 17h, em nossa sede oficial na Rua Otilia Borges, S/nº Lote 25, Quadra 25 – Bairro Brisamar, Itaguaí / RJ.
              </p>
            </details>

            <details className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
              <summary className="font-serif text-base sm:text-lg font-bold text-slate-900 list-none flex justify-between items-center">
                <span>Onde consulto os relatórios de auditoria e balanços financeiros?</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-open:rotate-180 transition-transform shrink-0 ml-3">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </summary>
              <p className="font-sans text-sm sm:text-base text-slate-600 pt-3 leading-relaxed border-t border-slate-100 mt-3">
                No menu superior, na aba "Portal da Transparência", você tem acesso aberto a balanços contábeis, certidões negativas de débito, atas estatutárias e relatórios de auditoria independente.
              </p>
            </details>

            <details className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
              <summary className="font-serif text-base sm:text-lg font-bold text-slate-900 list-none flex justify-between items-center">
                <span>Como funciona o encaminhamento dos alunos aos empregos?</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-open:rotate-180 transition-transform shrink-0 ml-3">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </summary>
              <p className="font-sans text-sm sm:text-base text-slate-600 pt-3 leading-relaxed border-t border-slate-100 mt-3">
                Mantemos convênios com empresas e cooperativas parceiras. Ao concluir os módulos práticos, os formandos contam com mentoria de currículo e são conectados prioritariamente às vagas abertas no território.
              </p>
            </details>

            <details className="group cursor-pointer bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
              <summary className="font-serif text-base sm:text-lg font-bold text-slate-900 list-none flex justify-between items-center">
                <span>Como minha empresa pode se tornar parceira institucional ou apoiar via ESG?</span>
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-open:rotate-180 transition-transform shrink-0 ml-3">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </span>
              </summary>
              <p className="font-sans text-sm sm:text-base text-slate-600 pt-3 leading-relaxed border-t border-slate-100 mt-3">
                Marcas e fundações podem apadrinhar turmas inteiras, apoiar núcleos comunitários ou destinar incentivos fiscais. Nossa diretoria apresentará os modelos de parceria com métricas de impacto verificáveis.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

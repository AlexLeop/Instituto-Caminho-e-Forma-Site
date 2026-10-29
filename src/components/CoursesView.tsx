import React, { useState, useMemo, useRef } from 'react';
import { Course } from '../types';
import { COURSES, TEACHERS } from '../data/mockData';
import { formatDonationAmount } from '../data/donations';
import { DonationSyncStatus, useDonationTotals } from '../hooks/useDonationTotals';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

interface CoursesViewProps {
  onEnrollCourse: (course: Course) => void;
  onOpenVolunteer: (type: 'teach' | 'sponsor') => void;
  onOpenDonation: (destination: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ onEnrollCourse, onOpenVolunteer, onOpenDonation }) => {
  const DONATION_TOTALS = useDonationTotals();
  const [selectedCat, setSelectedCat] = useState<'all' | 'tech' | 'crafts' | 'business'>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'presencial' | 'semipresencial'>('all');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const heroParallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchCat = selectedCat === 'all' || course.category === selectedCat;
      const matchMode = selectedMode === 'all' || course.mode === selectedMode;
      return matchCat && matchMode;
    });
  }, [selectedCat, selectedMode]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Top Intro Section with Parallax Background */}
      <section ref={heroRef} className="relative w-full overflow-hidden bg-white pt-36 pb-16 lg:pt-44 lg:pb-24 border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl text-slate-900 mb-4 tracking-tight font-bold"
            >
              Aprender para Transformar: <span className="text-[#b45309]">Cursos &amp; Capacitação</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-sans text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed"
            >
              Oficinas práticas de qualificação e empreendedorismo com certificação. O investimento social acessível é 100% revertido para manter os projetos socioassistenciais do Instituto.
            </motion.p>

            <div className="mb-8 w-full rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left text-emerald-950">
              <p className="text-sm font-bold">Apoio aos cursos EAD: {formatDonationAmount(DONATION_TOTALS.eadCoursesCents)} recebidos</p>
              <p className="mt-1 text-sm">Doação destinada aos cursos de educação a distância do Instituto, contabilizada separadamente do fundo geral.</p>
              <DonationSyncStatus />
              <button type="button" onClick={() => onOpenDonation('cursos-ead')} className="mt-3 min-h-11 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">Apoiar os cursos EAD</button>
            </div>

            {/* Highlights Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-800 font-sans text-sm"
            >
              <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-xl shadow-xs border border-slate-200">
                <span className="material-symbols-outlined text-[#166534] text-[20px]">payments</span>
                <span className="font-semibold">Investimento Social Acessível</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-xl shadow-xs border border-slate-200">
                <span className="material-symbols-outlined text-[#b45309] text-[20px]">workspace_premium</span>
                <span className="font-semibold">Certificado Reconhecido</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-xl shadow-xs border border-slate-200">
                <span className="material-symbols-outlined text-[#166534] text-[20px]">volunteer_activism</span>
                <span className="font-semibold">100% Revertido a Projetos</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Search & Course Directory */}
      <section className="w-full py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar Controls */}
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-xs mb-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border border-slate-200">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'Todos os Cursos' },
                { id: 'business', label: 'Empreendedorismo & Gestão' },
                { id: 'crafts', label: 'Elétrica & Infraestrutura' },
                { id: 'tech', label: 'Informática & Manutenção' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCat(tab.id as typeof selectedCat)}
                  className={`px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer font-bold ${
                    selectedCat === tab.id
                      ? 'bg-[#b45309] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mode selector */}
            <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
              <span className="font-sans text-xs text-slate-600 font-semibold">Formato:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setSelectedMode('all')}
                  className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
                    selectedMode === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedMode('presencial')}
                  className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
                    selectedMode === 'presencial' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Presencial
                </button>
                <button
                  onClick={() => setSelectedMode('semipresencial')}
                  className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
                    selectedMode === 'semipresencial' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Híbrido
                </button>
              </div>
            </div>
          </div>

          {/* Course Cards Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredCourses.map((course) => (
                <motion.article 
                  key={course.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-200"
                >
                  {/* Course Image & Badges */}
                  <div className="h-56 relative overflow-hidden group">
                    <img 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" 
                      src={course.image} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    
                    <span className="absolute top-3 left-3 bg-[#b45309] text-white font-sans text-xs px-3 py-1 rounded-lg font-bold shadow-xs">
                      {course.categoryLabel}
                    </span>
                    {course.badge && (
                      <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#166534] font-sans text-xs px-2.5 py-1 rounded-lg font-bold shadow-xs border border-slate-200">
                        {course.badge}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white font-sans text-xs">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span> {course.hours}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">routine</span> {course.shift}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h3 className="font-serif text-xl text-slate-900 font-bold mb-2">
                        {course.title}
                      </h3>
                      <p className="font-sans text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-sans text-xs text-slate-500 block">{course.requirementOrDetail.label}</span>
                          <strong className="text-slate-900">{course.requirementOrDetail.value}</strong>
                        </div>
                        <div className="text-right">
                          <span className="font-sans text-xs text-slate-500 block">Investimento Social</span>
                          <strong className="text-[#b45309] font-bold">{course.investment}</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-600">Início da Turma:</span>
                        <strong className="text-[#166534]">{course.startDate}</strong>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button" 
                        onClick={() => onEnrollCourse(course)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm py-3 rounded-xl shadow-xs transition-all cursor-pointer font-bold"
                      >
                        <span>Inscrever-se no Curso</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Process Steps: Como Funciona o Processo de Seleção */}
      <section className="w-full py-16 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-sans text-xs text-[#b45309] uppercase font-bold tracking-wider block mb-1">
              Transparência &amp; Inclusão
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 font-bold tracking-tight">
              Como Funciona o Processo de Seleção
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Nosso compromisso é priorizar pessoas em situação de vulnerabilidade, mães solo e jovens de Itaguaí em busca do primeiro emprego digno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              { num: '01', title: 'Inscrição Simples', desc: 'Preencha o formulário online ou venha pessoalmente à nossa secretaria com documento com foto.', color: 'text-[#b45309] bg-amber-50 border border-amber-200' },
              { num: '02', title: 'Entrevista Acolhedora', desc: 'Conversa com nossos assistentes sociais para entender seus objetivos pessoais e validar critérios de prioridade.', color: 'text-[#166534] bg-emerald-50 border border-emerald-200' },
              { num: '03', title: 'Matrícula & Taxa Solidária', desc: 'Contribuição social acessível revertida aos projetos (com política de bolsa integral para extrema vulnerabilidade), kit e uniforme.', color: 'text-[#b45309] bg-amber-50 border border-amber-200' },
              { num: '04', title: 'Aulas & Mentoria', desc: 'Formação com oficinas dinâmicas, projeto final real e conexão imediata com o mercado parceiro.', color: 'text-[#166534] bg-emerald-50 border border-emerald-200' }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="bg-slate-50 p-6 rounded-2xl shadow-xs hover:shadow-xl transition-all flex flex-col items-start border border-slate-200"
              >
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center font-serif text-xl font-bold mb-4 shadow-2xs`}>
                  {step.num}
                </div>
                <h3 className="font-serif text-lg text-slate-900 font-bold mb-2">{step.title}</h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Teachers & Partners Section */}
      <section className="w-full py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="max-w-xl">
              <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight">
                Corpo docente solidário
              </h2>
              <p className="font-sans text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                Profissionais em atividade nas principais organizações e mestres de ofício que dedicam suas horas para abrir caminhos reais.
              </p>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="font-sans text-xs sm:text-sm text-[#166534] bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                Mais de 45 voluntários ativos neste semestre
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEACHERS.map((teacher, idx) => (
              <motion.div 
                key={teacher.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="bg-white p-6 rounded-2xl shadow-xs hover:shadow-xl transition-all flex flex-col items-start border border-slate-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-[#b45309]/30 shrink-0">
                    <img alt={teacher.name} className="w-full h-full object-cover" src={teacher.avatar} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-slate-900 font-bold">{teacher.name}</h3>
                    <span className="font-sans text-xs text-[#b45309] font-semibold">{teacher.role}</span>
                  </div>
                </div>
                <p className="font-sans text-sm text-slate-600 mb-4 leading-relaxed italic">
                  "{teacher.quote}"
                </p>
                <div className="flex items-center gap-1.5 text-[#166534] font-sans text-xs bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mt-auto">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span className="font-semibold">{teacher.badge}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action: Seja Professor Voluntário */}
      <section className="w-full py-16 bg-[#166534] text-white relative overflow-hidden">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-left">
              <span className="bg-white/15 px-3.5 py-1 rounded-md font-sans text-xs uppercase font-bold tracking-wider inline-block mb-2">
                Faça Parte da Rede
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 leading-tight">
                Quer ser um Professor Voluntário ou Mentor?
              </h2>
              <p className="font-sans text-sm sm:text-base text-emerald-100 leading-relaxed">
                Doe algumas horas do seu mês para ensinar um ofício, revisar currículos ou guiar projetos de educandos. Transforme trajetórias com sua experiência prática.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenVolunteer('teach')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                <span>Quero Ensinar</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenVolunteer('sponsor')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-sans text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all cursor-pointer font-bold border border-white/20"
              >
                <span className="material-symbols-outlined text-[20px]">handshake</span>
                <span>Apadrinhar uma Turma</span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

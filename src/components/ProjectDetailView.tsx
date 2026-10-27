import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, ProjectPhoto } from '../types';
import { DonationCheckout } from './DonationCheckout';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onOpenTransparency: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onOpenTransparency
}) => {
  const [lightboxPhoto, setLightboxPhoto] = useState<ProjectPhoto | null>(null);

  const categoryBadgeClass = project.categoryTagType === 'secondary'
    ? 'bg-[#166534]/15 text-[#14532d] border-[#166534]/30'
    : 'bg-[#b45309]/15 text-[#92400e] border-[#b45309]/30';

  const progressBgClass = project.categoryTagType === 'secondary'
    ? 'bg-[#166534]'
    : 'bg-[#b45309]';

  return (
    <div className="w-full bg-white pb-20">
      
      {/* ========================================================== */}
      {/* 1. TOP HEADER / HERO SECTION COM IMAGEM AO FUNDO & DEGRADÊ */}
      {/* ========================================================== */}
      <section className="relative w-full border-b border-slate-200 overflow-hidden pt-28 sm:pt-32 pb-14 lg:pb-16 bg-slate-100 min-h-[340px] flex items-center">
        {/* Background Image of the Project with smooth degradê overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={project.image}
            alt={project.title}
            style={{ objectPosition: project.imagePosition }}
            className="w-full h-full object-cover object-right lg:object-center"
          />
          {/* Degradê horizontal suave: cobre a esquerda para alto contraste do texto e revela a foto no lado direito */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/92 to-slate-50/35" />
          {/* Degradê vertical suave para fusão com o header e a borda inferior */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-transparent to-slate-50/60" />
          
          {/* Ambient Subtle Orbs mantendo o efeito degradê da marca em movimento suave */}
          <motion.div 
            animate={{
              x: [0, 35, -25, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.12, 0.95, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-[#b45309]/18 rounded-full blur-3xl pointer-events-none" 
          />
          <motion.div 
            animate={{
              x: [0, -40, 30, 0],
              y: [0, 30, -35, 0],
              scale: [1, 0.92, 1.15, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 -right-24 w-80 h-80 bg-[#166534]/18 rounded-full blur-3xl pointer-events-none" 
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          
          {/* Breadcrumb & Top Badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 font-sans text-xs text-slate-600 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs w-fit">
              <button 
                onClick={onBack} 
                className="hover:text-[#b45309] font-medium transition-colors cursor-pointer"
              >
                Projetos
              </button>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">
                {project.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-bold border backdrop-blur-md shadow-2xs ${categoryBadgeClass} bg-white/85`}>
                <span className="material-symbols-outlined text-[15px]">category</span>
                {project.category}
              </span>
              {project.enrollmentOpen && <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900">Inscrições abertas</span>}

              {project.showAuditBadge !== false && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 text-[#14532d] font-sans text-xs font-bold border border-[#166534]/30 backdrop-blur-md shadow-2xs">
                <span className="material-symbols-outlined text-[15px] text-[#166534]">verified</span>
                Auditoria BDO • 100% Auditado
              </span>}
            </div>
          </div>

          {/* Title & Introduction Row */}
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-bold tracking-tight">
              {project.title}
            </h1>
            <p className="font-sans text-base sm:text-lg text-slate-700 mt-3 leading-relaxed">
              {project.description}
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================== */}
      {/* 2. MAIN 2-COLUMN LAYOUT: NARRATIVE (LEFT) + CHECKOUT (RIGHT)*/}
      {/* ========================================================== */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ======================================================== */}
          {/* COLUNA ESQUERDA (8 colunas): NARRATIVA EDITORIAL DO PROJETO */}
          {/* ======================================================== */}
          <main className="lg:col-span-8 flex flex-col">

            {/* SEÇÃO 1: SOBRE A INICIATIVA & DIAGNÓSTICO (Texto corrido editorial, sem cards excessivos) */}
            <section className="mb-12 pb-10 border-b border-slate-200">
              <div className="font-sans text-xs uppercase tracking-wider text-[#b45309] font-bold mb-1">
                Diagnóstico &amp; Metodologia
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mb-6">
                Como este projeto atua na transformação da comunidade
              </h2>

              {project.fullStory ? (
                <div className="space-y-6 font-sans text-base text-slate-700 leading-relaxed">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#b45309]" />
                      O Cenário Territorial Enfrentado
                    </h3>
                    <p className="pl-4 text-slate-600 leading-relaxed border-l-2 border-slate-200">
                      {project.fullStory.problem}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#166534]" />
                      A Solução Prática e Estrutura Mobilizada
                    </h3>
                    <p className="pl-4 text-slate-600 leading-relaxed border-l-2 border-[#166534]/40">
                      {project.fullStory.solution}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-900" />
                      Metodologia &amp; Acompanhamento Multidisciplinar
                    </h3>
                    <p className="pl-4 text-slate-600 leading-relaxed border-l-2 border-slate-300">
                      {project.fullStory.methodology}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="font-sans text-base text-slate-600 leading-relaxed">
                  {project.description}
                </p>
              )}
            </section>

            {/* SEÇÃO MARCOS DE IMPACTO & NÚMEROS CHAVE */}
            {project.milestones && project.milestones.length > 0 && (
              <section className="mb-12 pb-10 border-b border-slate-200">
                <div className="font-sans text-xs uppercase tracking-wider text-[#166534] font-bold mb-1">
                  Métricas de Impacto
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mb-6">
                  Resultados e Metas Alcançadas no Território
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.milestones.map((ms, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
                    >
                      <div className="font-serif text-3xl sm:text-4xl font-bold text-[#b45309] mb-1">
                        {ms.number}
                      </div>
                      <div className="font-sans text-sm font-bold text-slate-900 mb-0.5">
                        {ms.label}
                      </div>
                      <div className="font-sans text-xs text-slate-500">
                        {ms.sublabel}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SEÇÃO INFORMAÇÕES PRÁTICAS & FUNCIONAMENTO */}
            <section className="mb-12 pb-10 border-b border-slate-200">
              <div className="font-sans text-xs uppercase tracking-wider text-[#b45309] font-bold mb-1">
                Atendimento &amp; Funcionamento
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mb-6">
                Como Funciona na Prática
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#166534] text-[22px] shrink-0 mt-0.5">location_on</span>
                  <div>
                    <span className="font-sans text-xs font-bold uppercase text-slate-500 block">Local das Atividades</span>
                    <span className="font-sans text-sm font-semibold text-slate-900">{project.location || 'Sede do Instituto - Itaguaí, RJ'}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#166534] text-[22px] shrink-0 mt-0.5">payments</span>
                  <div>
                    <span className="font-sans text-xs font-bold uppercase text-slate-500 block">Investimento para a Família</span>
                    <span className="font-sans text-sm font-semibold text-emerald-800">100% Gratuito à População</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#b45309] text-[22px] shrink-0 mt-0.5">groups</span>
                  <div>
                    <span className="font-sans text-xs font-bold uppercase text-slate-500 block">Público Atendido</span>
                    <span className="font-sans text-sm font-semibold text-slate-900">{project.impactBeneficiaries}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#b45309] text-[22px] shrink-0 mt-0.5">event_available</span>
                  <div>
                    <span className="font-sans text-xs font-bold uppercase text-slate-500 block">Status da Iniciativa</span>
                    <span className="font-sans text-sm font-semibold text-slate-900">{project.status} • {project.startDate || 'Em andamento'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SEÇÃO 2: GALERIA FOTOGRÁFICA (Visual limpo, fotos reais com legendas) */}
            {project.gallery && project.gallery.length > 0 && (
              <section className="mb-12 pb-10 border-b border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="font-sans text-xs uppercase tracking-wider text-[#b45309] font-bold mb-1">
                      {project.galleryIsIllustrative ? 'Imagens Ilustrativas' : 'Registro Fotográfico'}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight">
                      O Dia a Dia nas Ações
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {project.gallery.length} {project.galleryIsIllustrative ? 'imagens' : 'fotos do acervo'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((photo, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxPhoto(photo)}
                      className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative h-60 transition-all duration-300 hover:shadow-md"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: photo.objectPosition }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <p className="text-white text-xs font-medium leading-relaxed">
                          {photo.caption}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-bold mt-1">
                          <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                          Ampliar foto
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SEÇÃO 3: CORPO DOCENTE & EDUCADORES (Lista editorial sofisticada) */}
            {project.teachers && project.teachers.length > 0 && (
              <section className="mb-12 pb-10 border-b border-slate-200">
                <div className="font-sans text-xs uppercase tracking-wider text-[#166534] font-bold mb-1">
                  Equipe Responsável
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mb-6">
                  Educadores e Especialistas na Condução do Projeto
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.teachers.map((teacher) => (
                    <div 
                      key={teacher.id}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200"
                    >
                      {teacher.avatar ? <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-xs"
                      /> : <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-2xl font-bold text-emerald-900">{teacher.name.charAt(0)}</div>}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-base font-bold text-slate-900">
                            {teacher.name}
                          </h4>
                          {teacher.badge && (
                            <span className="text-[10px] uppercase font-bold bg-[#b45309]/10 text-[#92400e] px-2 py-0.5 rounded">
                              {teacher.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-[#166534] mb-1.5">
                          {teacher.role}
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {teacher.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SEÇÃO 4: AGENDA DE EVENTOS & ENCONTROS (Lista cronológica limpa) */}
            {project.events && project.events.length > 0 && (
              <section className="mb-12 pb-10 border-b border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="font-sans text-xs uppercase tracking-wider text-[#b45309] font-bold mb-1">
                      Agenda &amp; Ações Abertas
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight">
                      Próximas Oficinas e Encontros com a Comunidade
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Aberto para visitas
                  </span>
                </div>

                <div className="space-y-4">
                  {project.events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#b45309] flex flex-col items-center justify-center shrink-0 border border-slate-200">
                          <span className="material-symbols-outlined text-[22px]">event</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#166534] border border-emerald-200">
                              {evt.badge || 'Atividade'}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {evt.date} • {evt.time}
                            </span>
                          </div>
                          <h4 className="font-serif text-base font-bold text-slate-900 mb-1">
                            {evt.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed mb-1">
                            {evt.description}
                          </p>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {evt.location}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/5521987428647?text=${encodeURIComponent(project.enrollmentOpen ? `Olá! Gostaria de me inscrever no projeto ${project.title}. Aulas: ${evt.date}, das ${evt.time}.` : `Olá! Gostaria de saber mais sobre a atividade "${evt.title}" do projeto ${project.title}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start sm:self-center px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors shrink-0"
                      >
                        {project.enrollmentOpen ? 'Inscrever-se pelo WhatsApp' : 'Participar'}
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SEÇÃO 5: DEPOIMENTO REAL (Bloco institucional de honra e citação) */}
            {project.beneficiaryStory && (
              <section className="mb-12 pb-10 border-b border-slate-200">
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <img
                    src={project.beneficiaryStory.avatar}
                    alt={project.beneficiaryStory.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border-2 border-white shadow-sm ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="font-sans text-xs uppercase tracking-wider text-[#b45309] font-bold mb-1">
                      História Real de Transformação
                    </div>
                    <blockquote className="font-serif italic text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                      {project.beneficiaryStory.quote}
                    </blockquote>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {project.beneficiaryStory.story}
                    </p>
                    <div className="text-xs font-bold text-slate-900">
                      {project.beneficiaryStory.name}{' '}
                      <span className="font-normal text-slate-500">• {project.beneficiaryStory.role}</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* SEÇÃO 6: PRESTAÇÃO DE CONTAS & APLICAÇÃO DOS RECURSOS */}
            {project.budgetAllocation && project.budgetAllocation.length > 0 && (
              <section className="mb-8">
                <div className="font-sans text-xs uppercase tracking-wider text-[#166534] font-bold mb-1">
                  Transparência Ativa
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mb-6">
                  Previsão de Aplicação dos Recursos
                </h2>

                <div className="space-y-4 mb-6">
                  {project.budgetAllocation.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                        <span>{item.label}</span>
                        <span className="text-slate-900">{item.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Distribuição prevista para futuras doações. Nenhuma doação destinada a este projeto até o momento.
                  </p>
                  <button
                    onClick={onOpenTransparency}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#b45309]">receipt_long</span>
                    <span>Acessar Balanço Completo</span>
                  </button>
                </div>
              </section>
            )}

          </main>


          {/* ======================================================== */}
          {/* COLUNA DIREITA (4 colunas): CHECKOUT SOLIDÁRIO (STICKY)    */}
          {/* ======================================================== */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
              
              {/* Header do Checkout */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#b45309] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <span className="font-serif text-lg font-bold text-slate-900">Apoiar este Projeto</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-[#b45309] border border-amber-200 px-2 py-0.5 rounded">
                  Direto
                </span>
              </div>

              <DonationCheckout key={project.id} projectId={project.id} />
            </div>

            {/* Selo de Garantia e Contato do Polo */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <span className="material-symbols-outlined text-[16px] text-[#166534]">verified_user</span>
                <span>Comprovante da sua contribuição</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Guarde o comprovante do seu banco. Se precisar de um recibo, entre em contato com o Instituto informando a referência da cobrança.
              </p>
            </div>
          </aside>

        </div>
      </div>

      {/* Lightbox Modal de Foto */}
      <AnimatePresence>
        {lightboxPhoto && (
          <div 
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption}
                className="w-full max-h-[70vh] object-cover"
              />
              <div className="p-6 bg-white">
                <p className="font-sans text-sm text-slate-800 leading-relaxed">
                  {lightboxPhoto.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

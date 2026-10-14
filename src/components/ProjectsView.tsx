import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { PROJECTS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsViewProps {
  onOpenDonation: (projectName: string) => void;
  onOpenTransparency: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onOpenDonation, onOpenTransparency }) => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'Todos os Projetos' },
    { id: 'educacao', label: 'Educação' },
    { id: 'alimentar', label: 'Segurança Alimentar' },
    { id: 'renda', label: 'Empoderamento & Renda' },
    { id: 'sustentabilidade', label: 'Sustentabilidade' },
  ];

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return PROJECTS;
    return PROJECTS.filter((p) => {
      const cat = p.category.toLowerCase();
      if (filter === 'educacao') return cat.includes('educação') || cat.includes('digital');
      if (filter === 'alimentar') return cat.includes('alimentar');
      if (filter === 'renda') return cat.includes('renda') || cat.includes('empoderamento');
      if (filter === 'sustentabilidade') return cat.includes('sustentabilidade') || cat.includes('hortas');
      return true;
    });
  }, [filter]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Header */}
      <section className="bg-[#f5f1ea] pt-36 pb-14 lg:pt-44 lg:pb-20 border-b border-[#e7e2da]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1c1917] mb-4 font-bold tracking-tight"
          >
            Nossos Projetos Comunitários
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-base sm:text-lg lg:text-xl text-[#57534e] leading-relaxed max-w-2xl mx-auto"
          >
            Ações territoriais com metas mensuráveis, acompanhamento familiar próximo e prestação de contas 100% aberta à sociedade.
          </motion.p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenTransparency}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#f0ece4] rounded-xl border border-[#e7e2da] font-sans text-sm text-[#166534] font-semibold shadow-xs cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Auditoria Externa dos Projetos</span>
            </motion.button>
          </div>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="w-full bg-[#fbf9f5] py-8 border-b border-[#e7e2da]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-5 py-2.5 rounded-xl font-sans text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1c1917] text-white shadow-sm'
                      : 'bg-[#f0ece4] text-[#57534e] hover:bg-[#e7e2da]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects List with Motion Grid */}
      <section className="w-full bg-[#fbf9f5] pb-20 pt-8">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((proj) => {
                const tagColor = proj.categoryTagType === 'secondary'
                  ? 'bg-[#166534] text-white'
                  : proj.categoryTagType === 'primary'
                  ? 'bg-[#b45309] text-white'
                  : 'bg-[#57534e] text-white';

                const barColor = proj.categoryTagType === 'secondary'
                  ? 'bg-[#166534]'
                  : proj.categoryTagType === 'primary'
                  ? 'bg-[#b45309]'
                  : 'bg-[#57534e]';

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    whileHover={{ y: -8 }}
                    key={proj.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col border border-[#e7e2da]"
                  >
                    <div className="relative h-60 w-full overflow-hidden group">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className={`absolute top-3 left-3 ${tagColor} font-sans text-xs px-3 py-1 rounded-lg font-bold shadow-xs`}>
                        {proj.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg font-sans text-xs font-bold text-[#1c1917] shadow-xs border border-[#e7e2da]">
                        {proj.progressPercent}% da Meta
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                      <div>
                        <h3 className="font-serif text-xl text-[#1c1917] font-bold mb-2">
                          {proj.title}
                        </h3>
                        <p className="font-sans text-sm text-[#57534e] line-clamp-3 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="w-full bg-[#ede7dc] h-3 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${proj.progressPercent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className={`${barColor} h-full rounded-full`}
                          />
                        </div>
                        <div className="flex justify-between items-center font-sans text-xs sm:text-sm">
                          <span className="text-[#1c1917] font-bold">
                            Arrecadado: R$ {proj.raisedAmount.toLocaleString('pt-BR')}
                          </span>
                          <span className="text-[#78716c]">
                            Meta: R$ {proj.goalAmount.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onOpenDonation(proj.title)}
                          className="flex-1 text-center bg-[#b45309] hover:bg-[#92400e] text-white py-3 rounded-xl font-sans text-sm font-bold transition-colors cursor-pointer shadow-sm"
                        >
                          Apoiar este Projeto
                        </motion.button>
                        <button
                          onClick={() => setSelectedProjectForDetails(proj)}
                          className="p-3 rounded-xl bg-[#ede7dc] hover:bg-[#e3dcd0] text-[#1c1917] transition-colors cursor-pointer"
                          title="Ver detalhes completos"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProjectForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-[#e7e2da]"
          >
            <button
              onClick={() => setSelectedProjectForDetails(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f5f1ea] text-[#57534e] hover:text-[#1c1917] flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="h-64 w-full rounded-2xl overflow-hidden mb-6">
              <img
                src={selectedProjectForDetails.image}
                alt={selectedProjectForDetails.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#b45309] text-white text-xs font-bold px-3 py-1 rounded-md">
                {selectedProjectForDetails.category}
              </span>
              <span className="text-xs text-[#166534] font-bold bg-[#166534]/15 px-2.5 py-1 rounded-md">
                {selectedProjectForDetails.progressPercent}% financiado
              </span>
            </div>

            <h2 className="font-serif text-2xl text-[#1c1917] font-bold mb-3">
              {selectedProjectForDetails.title}
            </h2>

            <p className="font-sans text-sm text-[#57534e] leading-relaxed mb-6">
              {selectedProjectForDetails.description}
            </p>

            <div className="bg-[#f5f1ea] p-5 rounded-2xl mb-6 border border-[#e7e2da]">
              <div className="flex justify-between text-sm mb-2 font-bold">
                <span className="text-[#1c1917]">Total Arrecadado</span>
                <span className="text-[#b45309]">R$ {selectedProjectForDetails.raisedAmount.toLocaleString('pt-BR')} / R$ {selectedProjectForDetails.goalAmount.toLocaleString('pt-BR')}</span>
              </div>
              <div className="w-full bg-[#e7e2da] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#b45309] h-full rounded-full"
                  style={{ width: `${selectedProjectForDetails.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const title = selectedProjectForDetails.title;
                  setSelectedProjectForDetails(null);
                  onOpenDonation(title);
                }}
                className="flex-1 py-3.5 bg-[#b45309] hover:bg-[#92400e] text-white rounded-xl font-sans text-sm font-bold transition-colors cursor-pointer"
              >
                Apoiar com Doação Agora
              </motion.button>
              <button
                onClick={() => setSelectedProjectForDetails(null)}
                className="px-6 py-3.5 bg-[#ede7dc] hover:bg-[#e3dcd0] text-[#1c1917] rounded-xl font-sans text-sm font-semibold transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

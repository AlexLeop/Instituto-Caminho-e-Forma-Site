import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { PROJECTS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsViewProps {
  onOpenDonation: (projectName: string) => void;
  onOpenTransparency: () => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ 
  onOpenDonation, 
  onOpenTransparency,
  onSelectProject
}) => {
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos os Projetos' },
    { id: 'danca', label: 'Dança & Cultura' },
    { id: 'esporte', label: 'Esportes & Lutas' },
    { id: 'atendimento', label: 'Atendimento & Cidadania' },
    { id: 'sede', label: 'Sede & Comunidade' },
  ];

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return PROJECTS;
    return PROJECTS.filter((p) => {
      const cat = p.category.toLowerCase();
      if (filter === 'danca') return cat.includes('dança') || cat.includes('cultura');
      if (filter === 'esporte') return cat.includes('esporte') || cat.includes('luta');
      if (filter === 'atendimento') return cat.includes('atendimento') || cat.includes('cidadania') || cat.includes('social');
      if (filter === 'sede') return cat.includes('sede') || cat.includes('comunidade');
      return true;
    });
  }, [filter]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Header */}
      <section className="bg-slate-50 pt-36 pb-14 lg:pt-44 lg:pb-20 border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl text-slate-900 mb-4 font-bold tracking-tight"
          >
            Nossos Projetos Comunitários
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            Ações territoriais com metas mensuráveis, acompanhamento familiar próximo e prestação de contas 100% aberta à sociedade.
          </motion.p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenTransparency}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-sans text-sm text-[#166534] font-semibold shadow-xs cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Auditoria Externa dos Projetos</span>
            </motion.button>
          </div>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="w-full bg-white py-8 border-b border-slate-200">
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
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
      <section className="w-full bg-slate-50 pb-20 pt-8">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((proj) => {
                const tagColor = proj.categoryTagType === 'secondary'
                  ? 'bg-[#166534] text-white'
                  : proj.categoryTagType === 'primary'
                  ? 'bg-[#b45309] text-white'
                  : 'bg-slate-700 text-white';

                const barColor = proj.categoryTagType === 'secondary'
                  ? 'bg-[#166534]'
                  : proj.categoryTagType === 'primary'
                  ? 'bg-[#b45309]'
                  : 'bg-slate-700';

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    whileHover={{ y: -8 }}
                    key={proj.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-200"
                  >
                    <div 
                      onClick={() => onSelectProject(proj)}
                      className="relative h-60 w-full overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className={`absolute top-3 left-3 ${tagColor} font-sans text-xs px-3 py-1 rounded-lg font-bold shadow-xs`}>
                        {proj.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg font-sans text-xs font-bold text-slate-900 shadow-xs border border-slate-200">
                        {proj.progressPercent}% da Meta
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                      <div>
                        <h3 
                          onClick={() => onSelectProject(proj)}
                          className="font-serif text-xl text-slate-900 font-bold mb-2 cursor-pointer hover:text-[#b45309] transition-colors"
                        >
                          {proj.title}
                        </h3>
                        <p className="font-sans text-sm text-slate-600 line-clamp-3 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${proj.progressPercent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className={`${barColor} h-full rounded-full`}
                          />
                        </div>
                        <div className="flex justify-between items-center font-sans text-xs sm:text-sm">
                          <span className="text-slate-900 font-bold">
                            Arrecadado: R$ {proj.raisedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-slate-500">
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
                          onClick={() => onSelectProject(proj)}
                          className="p-3 rounded-xl bg-slate-100 hover:bg-[#b45309] hover:text-white text-slate-800 transition-colors cursor-pointer"
                          title="Ver página de detalhes completa"
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
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_SEALS, RealSealCard, SealVerificationModal, OfficialSeal } from './RealSeals';

interface TransparencyViewProps {
  onOpenDonation: (projectName?: string) => void;
}

interface DocItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  publishedDate: string;
  fileSize: string;
  year: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const DOCUMENTS_DATA: DocItem[] = [
  {
    id: 'bdo-2026',
    title: 'Parecer de Auditoria Independente BDO - Exercício 2026',
    category: 'auditoria',
    categoryLabel: 'Auditoria Externa',
    description: 'Opinião sem ressalvas sobre as demonstrações financeiras e cumprimento de diretrizes estatutárias no exercício corrente de 2026.',
    publishedDate: '15/03/2026',
    fileSize: 'PDF • 3.5 MB',
    year: '2026',
    icon: 'description',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-[#006c49]'
  },
  {
    id: 'relatorio-2026',
    title: 'Relatório de Atividades e Plano de Impacto Social 2026',
    category: 'relatorio',
    categoryLabel: 'Impacto Vigente',
    description: 'Metas operacionais, prestação bimestral de contas e impacto dos mais de 9.400 cidadãos e famílias atendidos em 2026.',
    publishedDate: '02/02/2026',
    fileSize: 'PDF • 16.2 MB',
    year: '2026',
    icon: 'auto_stories',
    iconBg: 'bg-amber-50',
    iconColor: 'text-[#b45309]'
  },
  {
    id: 'balanco-2026',
    title: 'Demonstrações Contábeis e Balancete Patrimonial 2026',
    category: 'balanco',
    categoryLabel: 'Contabilidade',
    description: 'DRE consolidada, notas explicativas e conciliação bancária integral do exercício 2026.',
    publishedDate: '10/01/2026',
    fileSize: 'PDF • 2.4 MB',
    year: '2026',
    icon: 'calculate',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700'
  },
  {
    id: 'estatuto-2026',
    title: 'Estatuto Social Atualizado e Ata de Eleição do Conselho (2026-2029)',
    category: 'institucional',
    categoryLabel: 'Estatuto e Atas',
    description: 'Ata de posse da diretoria executiva e consolidação do estatuto no Cartório de Títulos e Documentos com vigência até 2029.',
    publishedDate: 'Vigência: 2026-2029',
    fileSize: 'PDF • 2.1 MB',
    year: '2026',
    icon: 'gavel',
    iconBg: 'bg-stone-100',
    iconColor: 'text-[#191c1e]'
  },
  {
    id: 'cnds-2026',
    title: 'Pacote Unificado de CNDs, FGTS, Trabalhista e CEBAS 2026',
    category: 'certidoes',
    categoryLabel: 'Certidões Fiscais',
    description: 'Certidões negativas da Receita Federal, CNDT e certificados de isenção previdenciária em dia para o exercício fiscal 2026.',
    publishedDate: 'Emitido em: 18/04/2026',
    fileSize: 'PDF • 1.1 MB',
    year: '2026',
    icon: 'verified',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-[#00714d]'
  },
  {
    id: 'bdo-2025',
    title: 'Parecer de Auditoria Independente BDO - Exercício 2025',
    category: 'auditoria',
    categoryLabel: 'Auditoria Externa',
    description: 'Conclusão favorável e aprovação integral pelo Conselho Fiscal e Assembleia Geral Ordinária do exercício 2025.',
    publishedDate: '20/03/2025',
    fileSize: 'PDF • 3.8 MB',
    year: '2025',
    icon: 'description',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-[#006c49]'
  },
  {
    id: 'relatorio-2025',
    title: 'Relatório Anual Consolidado de Atividades e Impacto 2025',
    category: 'relatorio',
    categoryLabel: 'Impacto Anual',
    description: 'Consolidação das contas de 2025 com parecer positivo unânime dos conselheiros fiscais.',
    publishedDate: '15/02/2025',
    fileSize: 'PDF • 13.5 MB',
    year: '2025',
    icon: 'auto_stories',
    iconBg: 'bg-amber-50',
    iconColor: 'text-[#b45309]'
  },
  {
    id: 'balanco-2025',
    title: 'Demonstrações Financeiras e Balanço Patrimonial Anual 2025',
    category: 'balanco',
    categoryLabel: 'Contabilidade',
    description: 'Balanço aprovado por unanimidade na Assembleia Ordinária de Prestação de Contas de 2025.',
    publishedDate: '10/01/2025',
    fileSize: 'PDF • 2.2 MB',
    year: '2025',
    icon: 'calculate',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700'
  },
  {
    id: 'pwc-2024',
    title: 'Auditoria Externa PwC - Exercício Fiscal 2024',
    category: 'auditoria',
    categoryLabel: 'Auditoria Externa',
    description: 'Relatório de asseguração contábil sem ressalvas sobre os projetos de segurança alimentar e capacitação profissional.',
    publishedDate: '18/03/2024',
    fileSize: 'PDF • 3.4 MB',
    year: '2024',
    icon: 'description',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-[#006c49]'
  },
  {
    id: 'relatorio-2024',
    title: 'Relatório Anual de Atividades e Prestação de Contas 2024',
    category: 'relatorio',
    categoryLabel: 'Impacto Anual',
    description: 'Métricas e prestação de contas dos 8.200 cidadãos assistidos ao longo de 2024.',
    publishedDate: '02/02/2024',
    fileSize: 'PDF • 12.1 MB',
    year: '2024',
    icon: 'auto_stories',
    iconBg: 'bg-amber-50',
    iconColor: 'text-[#b45309]'
  }
];

export const TransparencyView: React.FC<TransparencyViewProps> = ({ onOpenDonation: _onOpenDonation }) => {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [quickViewDoc, setQuickViewDoc] = useState<DocItem | null>(null);
  const [ombudsmanModalOpen, setOmbudsmanModalOpen] = useState(false);
  const [ombudsmanSubject, setOmbudsmanSubject] = useState('');
  const [ombudsmanMessage, setOmbudsmanMessage] = useState('');
  const [ombudsmanIsAnonymous, setOmbudsmanIsAnonymous] = useState(true);
  const [ombudsmanSuccess, setOmbudsmanSuccess] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);
  const [selectedProjectExtract, setSelectedProjectExtract] = useState<string | null>(null);
  const [selectedSeal, setSelectedSeal] = useState<OfficialSeal | null>(null);

  const filteredDocs = useMemo(() => {
    return DOCUMENTS_DATA.filter((doc) => {
      const matchYear = selectedYear === 'all' || doc.year === selectedYear;
      const matchQuery = 
        !searchQuery || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchYear && matchQuery;
    });
  }, [selectedYear, searchQuery]);

  const handleDownload = (doc: DocItem, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setDownloadSuccessToast(`Download iniciado: ${doc.title} (${doc.fileSize})`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4000);
  };

  const handleOmbudsmanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOmbudsmanSuccess(true);
    setTimeout(() => {
      setOmbudsmanSuccess(false);
      setOmbudsmanModalOpen(false);
      setOmbudsmanSubject('');
      setOmbudsmanMessage('');
    }, 3000);
  };

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitSuccess(true);
    setTimeout(() => {
      setVisitSuccess(false);
      setVisitModalOpen(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#f7f9fb]">
      {/* Toast Notification */}
      <AnimatePresence>
        {downloadSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 bg-[#166534] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#14532d]"
          >
            <span className="material-symbols-outlined text-[22px]">download_done</span>
            <span className="font-sans text-sm font-semibold">{downloadSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Ambient Glow Decorator & Hero */}
      <section className="relative w-full overflow-hidden bg-[#f2f4f6] pt-36 pb-16 lg:pt-44 lg:pb-24 border-b border-[#e6e8ea]">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          className="absolute -top-32 right-10 w-96 h-96 bg-[#f59e0b]/20 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.18, 1], opacity: [0.10, 0.20, 0.10], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 11, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 -left-20 w-80 h-80 bg-[#006c49]/15 rounded-full blur-3xl pointer-events-none" 
        />
        
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overline Tag */}
          <motion.div 
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6cf8bb]/40 text-[#004d33] font-label-md text-xs sm:text-sm font-bold shadow-xs">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Prestação de Contas Aberta • Ética e Governança</span>
            </span>
            <span className="hidden sm:inline-flex text-[#534434] font-label-sm text-xs tracking-widest uppercase font-semibold">
              Atualizado: Ano Fiscal 2026 • Exercício em Curso
            </span>
          </motion.div>

          {/* Main Heading & Humanist Text */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-8 flex flex-col gap-3"
            >
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight font-bold leading-[1.15]">
                Cada centavo a serviço da <span className="text-[#b45309] underline decoration-[#b45309]/30 decoration-4 underline-offset-8">dignidade humana</span>.
              </h1>
              <p className="font-sans text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mt-2 leading-relaxed">
                Acreditamos que a confiança pública é a pedra fundamental da transformação social. No <strong>Instituto Caminho e Forma</strong>, nossos livros contábeis, decisões colegiadas e notas fiscais são auditados por firmas globais independentes e disponibilizados integralmente à sociedade.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4"
            >
              <motion.div 
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-4 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">policy</span>
                </div>
                <div className="min-w-0">
                  <span className="block font-serif text-base text-slate-900 font-bold">Auditoria Sem Ressalvas</span>
                  <span className="block font-sans text-xs text-slate-500">Parecer emitido pela BDO Brasil</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-4 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#b45309] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">account_balance</span>
                </div>
                <div className="min-w-0">
                  <span className="block font-serif text-base text-slate-900 font-bold">Certificação OSCIP &amp; CEBAS</span>
                  <span className="block font-sans text-xs text-slate-500">Conformidade integral ao Ministério da Justiça</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -6, scale: 1.02 }} 
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#166534] font-bold uppercase tracking-wider">Aplicação de Doações</span>
                <span className="material-symbols-outlined text-[#166534] text-[24px] group-hover:scale-110 transition-transform">trending_up</span>
              </div>
              <div className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight">0%</div>
              <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Nenhuma doação recebida ou aplicada até o momento.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              whileHover={{ y: -6, scale: 1.02 }} 
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#b45309] font-bold uppercase tracking-wider">Conformidade</span>
                <span className="material-symbols-outlined text-[#b45309] text-[24px] group-hover:scale-110 transition-transform">verified</span>
              </div>
              <div className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight">100%</div>
              <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Contas auditadas por auditores externos independentes credenciados pelo CFC.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.36 }}
              whileHover={{ y: -6, scale: 1.02 }} 
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-[#e6e8ea] hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-sm text-xs text-[#006c49] font-bold uppercase tracking-wider">Doações Recebidas</span>
                <span className="material-symbols-outlined text-[#006c49] text-[24px] group-hover:scale-110 transition-transform">payments</span>
              </div>
              <div className="font-headline-xl text-3xl sm:text-4xl text-[#191c1e] font-extrabold tracking-tight">R$ 0,00</div>
              <p className="font-body-sm text-xs sm:text-sm text-[#534434] mt-2 leading-relaxed">
                O Instituto ainda não recebeu doações. Total arrecadado: R$ 0,00.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.44 }}
              whileHover={{ y: -6, scale: 1.02 }} 
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-[#e6e8ea] hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-sm text-xs text-[#545f73] font-bold uppercase tracking-wider">Regularidade</span>
                <span className="material-symbols-outlined text-[#545f73] text-[24px] group-hover:scale-110 transition-transform">task_alt</span>
              </div>
              <div className="font-headline-xl text-3xl sm:text-4xl text-[#191c1e] font-extrabold tracking-tight">Zero</div>
              <p className="font-body-sm text-xs sm:text-sm text-[#534434] mt-2 leading-relaxed">
                Pendências jurídicas, trabalhistas ou fiscais. CNDs e CEBAS vigentes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Editorial Section: Flow of Funds (Visual Data Analytics) */}
      <section className="w-full py-16 sm:py-20 bg-white border-b border-[#e6e8ea]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <span className="font-label-sm text-xs text-[#006c49] font-bold uppercase tracking-widest block mb-1">
                Matriz Orçamentária & Financeira 2026 • Instituto Caminho e Forma
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-4xl text-[#191c1e] font-extrabold">
                Origem e Destinação dos Recursos
              </h2>
            </div>
            <p className="font-body-sm text-sm sm:text-base text-[#534434] max-w-md leading-relaxed">
              O Instituto ainda não recebeu doações. Os valores de entrada e aplicação de donativos estão zerados.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* De onde vem o recurso */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#f7f9fb] p-6 sm:p-8 rounded-3xl border border-[#e6e8ea] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-[#e0e3e5]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#006c49]" />
                    <h3 className="font-headline-sm text-xl text-[#191c1e] font-bold">De onde vem o recurso</h3>
                  </div>
                  <span className="font-label-md text-sm text-[#534434] font-bold">Total: R$ 0,00</span>
                </div>

                <div className="flex flex-col gap-5 mt-6">
                  {/* Item 1 */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="font-semibold text-[#191c1e]">Empresas &amp; Fundos ESG</span>
                      <span className="font-bold text-[#191c1e]">0% <span className="font-normal text-[#534434]">(R$ 0,00)</span></span>
                    </div>
                    <div className="w-full h-3 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '0%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.1 }}
                        className="h-full bg-[#006c49] rounded-full" 
                      />
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="font-semibold text-[#191c1e]">Doações de Pessoas Físicas</span>
                      <span className="font-bold text-[#191c1e]">0% <span className="font-normal text-[#534434]">(R$ 0,00)</span></span>
                    </div>
                    <div className="w-full h-3 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '0%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
                        className="h-full bg-[#f59e0b] rounded-full" 
                      />
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="font-semibold text-[#191c1e]">Editais Públicos, FIA &amp; Pronac</span>
                      <span className="font-bold text-[#191c1e]">0% <span className="font-normal text-[#534434]">(R$ 0,00)</span></span>
                    </div>
                    <div className="w-full h-3 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '0%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
                        className="h-full bg-[#545f73] rounded-full" 
                      />
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="font-semibold text-[#191c1e]">Eventos Beneficentes &amp; Feira Solidária</span>
                      <span className="font-bold text-[#191c1e]">0% <span className="font-normal text-[#534434]">(R$ 0,00)</span></span>
                    </div>
                    <div className="w-full h-3 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '0%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.4 }}
                        className="h-full bg-[#ffb95f] rounded-full" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 bg-white p-4 rounded-xl border border-[#e0e3e5] flex items-center gap-3 text-[#534434]">
                <span className="material-symbols-outlined text-[#006c49] text-[22px]">info</span>
                <p className="font-body-sm text-xs sm:text-sm">
                  Nenhuma doação recebida até o momento.
                </p>
              </div>
            </motion.div>

            {/* Onde aplicamos cada real */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-[#f7f9fb] p-6 sm:p-8 rounded-3xl border border-[#e6e8ea] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-[#e0e3e5]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#855300]" />
                    <h3 className="font-headline-sm text-xl text-[#191c1e] font-bold">Onde aplicamos cada real</h3>
                  </div>
                  <span className="font-label-md text-sm text-[#006c49] font-bold">Aplicado: R$ 0,00</span>
                </div>

                <div className="flex flex-col gap-5 mt-6">
                  {/* Item 1 */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="font-semibold text-[#191c1e]">Projetos Sociais &amp; Oficinas Comunitárias</span>
                      <span className="font-bold text-[#191c1e]">0% <span className="font-normal text-[#534434]">(R$ 0,00)</span></span>
                    </div>
                    <div className="w-full h-3 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '0%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.1 }}
                        className="h-full bg-[#006c49] rounded-full" 
                      />
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="font-semibold text-[#191c1e]">Formação Técnica, Mentoria &amp; Didáticos</span>
                      <span className="font-bold text-[#191c1e]">0% <span className="font-normal text-[#534434]">(R$ 0,00)</span></span>
                    </div>
                    <div className="w-full h-3 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '0%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
                        className="h-full bg-[#f59e0b] rounded-full" 
                      />
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="font-semibold text-[#191c1e]">Infraestrutura, Manutenção &amp; Espaços</span>
                      <span className="font-bold text-[#191c1e]">0% <span className="font-normal text-[#534434]">(R$ 0,00)</span></span>
                    </div>
                    <div className="w-full h-3 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '0%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
                        className="h-full bg-[#545f73] rounded-full" 
                      />
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="font-semibold text-[#191c1e]">Governança, Contabilidade &amp; Captação</span>
                      <span className="font-bold text-[#191c1e]">0% <span className="font-normal text-[#534434]">(R$ 0,00)</span></span>
                    </div>
                    <div className="w-full h-3 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '0%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.4 }}
                        className="h-full bg-[#855300] rounded-full" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 bg-white p-4 rounded-xl border border-[#e0e3e5] flex items-center gap-3 text-[#534434]">
                <span className="material-symbols-outlined text-[#855300] text-[22px]">thumb_up</span>
                <p className="font-body-sm text-xs sm:text-sm">
                  Não há despesas realizadas com doações, pois nenhum donativo foi recebido.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Central de Downloads e Balanços */}
      <section className="w-full py-16 sm:py-20 bg-[#f2f4f6]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
          >
            <div>
              <span className="font-label-sm text-xs text-[#855300] font-bold uppercase tracking-widest block mb-1">
                Documentação Oficial Auditada
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-4xl text-[#191c1e] font-extrabold">
                Central de Downloads e Balanços
              </h2>
            </div>
            <p className="font-body-sm text-sm sm:text-base text-[#534434] max-w-md leading-relaxed">
              Acesse livremente os pareceres completos dos auditores, relatórios anuais de atividades e demonstrações fiscais em formato PDF pesquisável.
            </p>
          </motion.div>

          {/* Filters & Categories Toolbar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#e6e8ea]"
          >
            {/* Years Pill Selector */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {['2026', '2025', '2024', 'all'].map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`relative px-4 py-2 rounded-xl font-label-md text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedYear === y
                      ? 'text-white'
                      : 'text-[#534434] hover:bg-[#e0e3e5] hover:text-[#191c1e]'
                  }`}
                >
                  {selectedYear === y && (
                    <motion.div
                      layoutId="transparencyYearTab"
                      className="absolute inset-0 bg-[#006c49] rounded-xl shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">
                    {y === '2026' ? '2026 (Exercício Vigente)' : y === 'all' ? 'Todos os Exercícios' : y}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#867461] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar por documento..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-body-sm text-sm placeholder:text-[#867461] focus:outline-none focus:ring-2 focus:ring-[#855300]/40 border border-[#e0e3e5] transition-all"
                />
              </div>
              {(searchQuery || selectedYear !== '2026') && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedYear('2026');
                  }}
                  className="text-[#534434] hover:text-[#191c1e] px-3 py-2 rounded-xl font-label-sm text-xs font-bold flex items-center gap-1 shrink-0 bg-[#e6e8ea] hover:bg-[#e0e3e5] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span> Limpar
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-2xl shadow-xs hover:shadow-xl transition-all flex flex-col justify-between border border-[#e6e8ea]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-xl ${doc.iconBg} ${doc.iconColor} flex items-center justify-center shrink-0`}>
                        <span className="material-symbols-outlined text-[24px]">{doc.icon}</span>
                      </div>
                      <span className="px-3 py-1 rounded-md bg-[#f2f4f6] text-[#534434] font-label-sm text-xs font-bold">
                        {doc.categoryLabel}
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-base sm:text-lg text-[#191c1e] font-bold line-clamp-2">
                      {doc.title}
                    </h4>
                    <p className="font-body-sm text-xs sm:text-sm text-[#534434] mt-2 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#f2f4f6] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[11px] text-[#534434]">{doc.publishedDate}</span>
                      <span className="font-label-sm text-[11px] text-[#867461] font-semibold">{doc.fileSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuickViewDoc(doc)}
                        className="p-2 rounded-xl hover:bg-[#f2f4f6] text-[#534434] hover:text-[#191c1e] transition-colors cursor-pointer"
                        title="Visualização Rápida"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button
                        onClick={(e) => handleDownload(doc, e)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006c49] text-white hover:bg-[#00714d] transition-colors font-label-sm text-xs font-bold shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>Baixar</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Prestação de Contas dos Projetos Ativos */}
      <section className="w-full py-16 sm:py-20 bg-white border-b border-[#e6e8ea]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-label-sm text-xs text-[#006c49] font-bold uppercase tracking-widest block mb-1">
                Acompanhamento Direto
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-4xl text-[#191c1e] font-extrabold">
                Execução Orçamentária dos Projetos
              </h2>
            </div>
            <p className="font-body-sm text-sm sm:text-base text-[#534434] max-w-md leading-relaxed">
              Confira o status de captação, desembolso e conformidade fiscal de cada iniciativa comunitária em andamento.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projeto 1 */}
            <motion.div whileHover={{ y: -6 }} className="bg-[#f7f9fb] rounded-3xl overflow-hidden shadow-xs border border-[#e6e8ea] flex flex-col justify-between">
              <div>
                <div 
                  className="bg-cover bg-center w-full h-52 relative"
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVp18X22FY86alp_TPy5Rwb6AoJro_4qJLB-LxRp85Z_qOiRKUMhoXFi0WhUa3DTfb18DhH_lNXZH_95YmQf13leQYCWG_Yeh9HmcEx-jLjOYfhb096zFRaGaP9z_CSCn3t4QBjkIXkAHe7wnNZIyttm3t_wL71UhjPE8-ie-cXVhBvk_d7Er4YoOpZ6VCptkGmjxaH9jb1su3H9K0fEvBLp_IThhevjdwdc5QqNQ0I02y7zm8LpM6')` }}
                >
                  <span className="absolute top-4 left-4 bg-[#006c49] text-white font-label-sm text-xs px-3 py-1 rounded-md font-bold shadow-xs">
                    Em Execução Ativa
                  </span>
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="font-headline-sm text-xl text-[#191c1e] font-bold">Mesa Farta &amp; Nutrição Solidária</h3>
                  <p className="font-body-sm text-sm text-[#534434] mt-2 leading-relaxed">
                    Segurança alimentar para 420 famílias da periferia metropolitana, com compras diretas da agricultura familiar regional.
                  </p>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex justify-between items-center text-xs mb-1 font-bold">
                      <span className="text-[#534434]">Arrecadado: <strong className="text-[#191c1e]">R$ 0,00</strong></span>
                      <span className="text-[#534434]">Meta: <strong className="text-[#191c1e]">R$ 35.000</strong></span>
                    </div>
                    <div className="w-full h-2.5 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <div className="h-full bg-[#006c49] rounded-full" style={{ width: '0%' }} />
                    </div>
                    <div className="flex justify-between items-center mt-1 text-xs font-bold text-[#006c49]">
                      <span>0% alcançado</span>
                      <span>R$ 35.000 restantes</span>
                    </div>
                  </div>

                  {/* Compliance Checks */}
                  <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-[#e0e3e5]">
                    <div className="flex items-center gap-2 text-[#534434] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[#006c49] text-[18px]">receipt_long</span>
                      <span>Nenhuma despesa realizada com doações</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#534434] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[#006c49] text-[18px]">verified</span>
                      <span>Aguardando as primeiras doações</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedProjectExtract('Mesa Farta & Nutrição Solidária')}
                  className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-white hover:bg-[#e0e3e5] text-[#191c1e] font-label-md text-sm font-bold transition-colors cursor-pointer border border-[#e0e3e5]"
                >
                  <span>Ver Extrato Individual do Projeto</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </motion.div>

            {/* Projeto 2 */}
            <motion.div whileHover={{ y: -6 }} className="bg-[#f7f9fb] rounded-3xl overflow-hidden shadow-xs border border-[#e6e8ea] flex flex-col justify-between">
              <div>
                <div 
                  className="bg-cover bg-center w-full h-52 relative"
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAf-R5pOHyI3I2GYqEeOJywtLU9VDV5B9_JHuEazshx9l9oMMtFhINLgC2cR0ZlvXxRb-4FqpbOtgapRWDZyBpqCCoUYYdFqNrm_kW5DOWGMndDyA22WpRSRZoOR96b-pSxTNrNKRBlvd6UNWqDBojzt_lUJA4xvIfhm3q2QdQoW93x13MgoL3tUfZgvrq69az4OSpT-FDD2OWxNFkslNEcgDS6WYXnq3NOdpkWfUEssj45WopTn5hj')` }}
                >
                  <span className="absolute top-4 left-4 bg-[#855300] text-white font-label-sm text-xs px-3 py-1 rounded-md font-bold shadow-xs">
                    Fase de Expansão
                  </span>
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="font-headline-sm text-xl text-[#191c1e] font-bold">Educação do Amanhã: Tech Social</h3>
                  <p className="font-body-sm text-sm text-[#534434] mt-2 leading-relaxed">
                    Inclusão digital e aulas de programação básica para adolescentes em contraturno escolar, equipando dois novos polos.
                  </p>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex justify-between items-center text-xs mb-1 font-bold">
                      <span className="text-[#534434]">Arrecadado: <strong className="text-[#191c1e]">R$ 0,00</strong></span>
                      <span className="text-[#534434]">Meta: <strong className="text-[#191c1e]">R$ 50.000</strong></span>
                    </div>
                    <div className="w-full h-2.5 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: '0%' }} />
                    </div>
                    <div className="flex justify-between items-center mt-1 text-xs font-bold text-[#855300]">
                      <span>0% alcançado</span>
                      <span>R$ 50.000 restantes</span>
                    </div>
                  </div>

                  {/* Compliance Checks */}
                  <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-[#e0e3e5]">
                    <div className="flex items-center gap-2 text-[#534434] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[#006c49] text-[18px]">storefront</span>
                      <span>Nenhuma compra realizada com doações</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#534434] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[#006c49] text-[18px]">laptop</span>
                      <span>Aguardando as primeiras doações</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedProjectExtract('Educação do Amanhã: Tech Social')}
                  className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-white hover:bg-[#e0e3e5] text-[#191c1e] font-label-md text-sm font-bold transition-colors cursor-pointer border border-[#e0e3e5]"
                >
                  <span>Ver Extrato Individual do Projeto</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </motion.div>

            {/* Projeto 3 */}
            <motion.div whileHover={{ y: -6 }} className="bg-[#f7f9fb] rounded-3xl overflow-hidden shadow-xs border border-[#e6e8ea] flex flex-col justify-between">
              <div>
                <div 
                  className="bg-cover bg-center w-full h-52 relative"
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnWxrOFEls6ZQi2DRpewePsnFeAdYvRjyKXcgy9Uwk7IYNhve6ercDzxSKavRboUsvuKnk6G53-YVPQN6JROQeEj2QrgwV0OC1mwkNEQGc1S22yrfU7AZVUUEfrRsclxRTPrOCOJ-tUSa0aZll-erJmwSB0T03tLZTGh4-GksI6Vrr5y_U7JdraOmgQ6NB4GrQ3kufiDde5IuTzGaGEjjxi9j-sfP-Gr5GWtti6RAb2cBW_PgCL_dq')` }}
                >
                  <span className="absolute top-4 left-4 bg-[#006c49] text-white font-label-sm text-xs px-3 py-1 rounded-md font-bold shadow-xs">
                    Em Captação
                  </span>
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="font-headline-sm text-xl text-[#191c1e] font-bold">Costurando Autonomia Feminina</h3>
                  <p className="font-body-sm text-sm text-[#534434] mt-2 leading-relaxed">
                    Capacitação em corte e costura industrial e empreendedorismo coletivo para mulheres chefes de família monoparental.
                  </p>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex justify-between items-center text-xs mb-1 font-bold">
                      <span className="text-[#534434]">Arrecadado: <strong className="text-[#191c1e]">R$ 0,00</strong></span>
                      <span className="text-[#534434]">Meta: <strong className="text-[#191c1e]">R$ 28.000</strong></span>
                    </div>
                    <div className="w-full h-2.5 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <div className="h-full bg-[#006c49] rounded-full" style={{ width: '0%' }} />
                    </div>
                    <div className="flex justify-between items-center mt-1 text-xs font-bold text-[#006c49]">
                      <span>0% alcançado</span>
                      <span>R$ 28.000 restantes</span>
                    </div>
                  </div>

                  {/* Compliance Checks */}
                  <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-[#e0e3e5]">
                    <div className="flex items-center gap-2 text-[#534434] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[#006c49] text-[18px]">precision_manufacturing</span>
                      <span>Nenhuma aquisição realizada com doações</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#534434] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[#006c49] text-[18px]">verified_user</span>
                      <span>Nenhum repasse de doações realizado</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedProjectExtract('Costurando Autonomia Feminina')}
                  className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-white hover:bg-[#e0e3e5] text-[#191c1e] font-label-md text-sm font-bold transition-colors cursor-pointer border border-[#e0e3e5]"
                >
                  <span>Ver Extrato Individual do Projeto</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Conselho de Governança, Compliance & Canal de Denúncias */}
      <section className="w-full py-16 sm:py-20 bg-[#f2f4f6]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Coluna de Pessoas da Governança */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div>
                <span className="font-label-sm text-xs text-[#006c49] font-bold uppercase tracking-widest block mb-1">
                  Liderança Voluntária e Independente
                </span>
                <h2 className="font-headline-lg text-2xl sm:text-4xl text-[#191c1e] font-extrabold">
                  Conselho Deliberativo e Fiscal
                </h2>
                <p className="font-body-sm text-sm sm:text-base text-[#534434] max-w-2xl mt-2 leading-relaxed">
                  Nenhum membro do Conselho Deliberativo ou Fiscal recebe remuneração pelo exercício do mandato, garantindo independência plena na fiscalização dos atos de gestão.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Conselheiro 1 */}
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e6e8ea] flex items-start gap-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#e0e3e5]"
                    alt="Dra. Helena Vasconcelos"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkGPBN9iL2KwY6e6rgraOcHkUAa1sfKSGcHl3aAC__Gr1OFZSSh4_QBd8ncnhhNDvlI5S9i_d1SESbPzKYISI2GW6_ZxisrJyGVSTY6gwQFfQXYV1izGfZUgkNCfAzD0omV5zXHDG5RgOFq_OlNzNagpcR9QTn9HxraNWnkGZQXo5mv-FSaRsgIDJ1LUTTaYn83J4tvwmeCErbzaZY0hfMZzpu3kXMxFQFLQIovLwI1np3A2xyPx9a"
                  />
                  <div>
                    <h4 className="font-headline-sm text-base font-bold text-[#191c1e]">Dra. Helena Vasconcelos</h4>
                    <span className="font-label-sm text-xs text-[#006c49] font-bold block">Presidente do Conselho Deliberativo</span>
                    <p className="font-body-sm text-xs text-[#534434] mt-1.5 leading-relaxed">
                      Professora Doutora em Direito Público (USP), especialista em regulação do Terceiro Setor e Direitos Humanos.
                    </p>
                  </div>
                </div>

                {/* Conselheiro 2 */}
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e6e8ea] flex items-start gap-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#e0e3e5]"
                    alt="Carlos Eduardo Prado"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByUK_PJmI3voQT3BeqjfGfRZ8ndWdU9O_825uk6jwB7834IqwzHd6_3EGwnMNaO5sLZSUOBrJq8Xhow7QI-QSHbvhQlJi_8uIahlGIJ_iIcK0K0NhlsPySDfs8buWr94sT6a8unN6tvvC0rl2TOL698tCR7l0ZlCoFAAYIRKfoHIy5F3erk7DJ1LBxdEp8P_7AMQo5jRhhVPjDQqIqGSE1rudWPPjK4jKlMPR0CTLImoOqBBz0M_P7"
                  />
                  <div>
                    <h4 className="font-headline-sm text-base font-bold text-[#191c1e]">Carlos Eduardo Prado</h4>
                    <span className="font-label-sm text-xs text-[#855300] font-bold block">Presidente do Conselho Fiscal</span>
                    <p className="font-body-sm text-xs text-[#534434] mt-1.5 leading-relaxed">
                      Auditor tributário e perito contábil com 25 anos de experiência na administração pública e auditoria independente.
                    </p>
                  </div>
                </div>

                {/* Conselheiro 3 */}
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e6e8ea] flex items-start gap-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#e0e3e5]"
                    alt="Marina Albuquerque"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkFLqDoq3Exkvd6ojbmtI1sydCANY1X0QbrrUfaZ3bUX4-XjdYMJxYpcErXGPBHlPd1goBtrW0S1vGKBByLFppVZBJKs9nVqjr59WKEgnVz-jxhN1CznWPPbT8WfuUWdmy1c4OeD5kzIHNUqtKPlSruzMrk4dvzH9xOHxRNcvVLGzq1Hy0U_mbR9OBnzPLMhRERzV1hvtepokr3YEScw6jLDpuKzQeMtJX5Xw7PAY5VDuI29St7COd"
                  />
                  <div>
                    <h4 className="font-headline-sm text-base font-bold text-[#191c1e]">Marina Albuquerque</h4>
                    <span className="font-label-sm text-xs text-[#545f73] font-bold block">Conselheira Fiscal Independente</span>
                    <p className="font-body-sm text-xs text-[#534434] mt-1.5 leading-relaxed">
                      Especialista em governança ESG e mensuração de impacto social em fundações filantrópicas globais.
                    </p>
                  </div>
                </div>

                {/* Conselheiro 4 */}
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#e6e8ea] flex items-start gap-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#e0e3e5]"
                    alt="Prof. Ronaldo Guimarães"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4493x-fN8vpNhJ7dqE2XzCj95q6VBvGeuy9DxoCEj14qJGcGSemeiy3ahBM7NOu-E9T4OX5pFu_CLXCwlQek4wUw7Hg51ft1QmaKORAKjB8Y73H1IiQqxXAFooQA4fqAA5mZJ9qyXfoe9hdm2uOkX39hLDBcsgYMHPxdWTSt2WcgBHNTgVSvsA5nUx6jQladSWCorcaD54CQTo3pbKdBMxOdDYqYflIhhoKfO2TZ3g0n_p1Pyfbf7"
                  />
                  <div>
                    <h4 className="font-headline-sm text-base font-bold text-[#191c1e]">Prof. Ronaldo Guimarães</h4>
                    <span className="font-label-sm text-xs text-[#006c49] font-bold block">Vogal do Conselho Comunitário</span>
                    <p className="font-body-sm text-xs text-[#534434] mt-1.5 leading-relaxed">
                      Pedagogo e ativista comunitário, articulador de projetos educativos em periferias e liderança de base local.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna de Compliance & Ouvidoria */}
            <div className="lg:col-span-4 bg-[#2d3133] text-[#eff1f3] p-7 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b] text-[#613b00] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">security</span>
                  </div>
                  <span className="font-label-lg text-base font-bold text-white">Compliance &amp; Ouvidoria</span>
                </div>

                <h3 className="font-headline-sm text-xl text-white font-bold mb-3">
                  Canal de Integridade e Denúncia Anônima
                </h3>
                <p className="font-body-sm text-xs sm:text-sm text-[#eff1f3]/80 leading-relaxed">
                  Operado por empresa terceirizada independente. Garantia absoluta de sigilo, proteção contra retaliação e investigação rigorosa de qualquer indício de desvio ético.
                </p>

                <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-white/10 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#f59e0b] text-[20px]">phone_in_talk</span>
                    <span className="font-semibold text-white">0800 770 4500 (Ligação Gratuita)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#f59e0b] text-[20px]">mark_email_read</span>
                    <span className="font-semibold text-white">institutocaminhoeformaoficial@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#f59e0b] text-[20px]">lock</span>
                    <span className="text-[#eff1f3]/80">Protocolo Criptografado Ponta a Ponta</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => setOmbudsmanModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 w-full bg-[#f59e0b] hover:bg-[#ffb95f] text-[#613b00] font-label-lg text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer font-bold shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">report_problem</span>
                  <span>Registrar Manifestação Segura</span>
                </button>
                <span className="block text-center font-label-sm text-[11px] text-[#eff1f3]/60 mt-2">
                  Você pode optar por manter anonimato absoluto.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selos de Conformidade e Reconhecimento - Selos Reais Auditados */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-[#e6e8ea]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-[#006c49] font-label-sm text-xs font-bold uppercase tracking-wider border border-emerald-200/70 mb-2">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>Chancelas Oficiais e Acreditações</span>
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-4xl text-[#191c1e] font-extrabold mt-1 mb-3">
              Selos e Padrões Reais de Excelência
            </h2>
            <p className="font-body-md text-sm sm:text-base text-[#534434] max-w-2xl mx-auto mb-12 leading-relaxed">
              O <strong>Instituto Caminho e Forma</strong> é avaliado e certificado periodicamente pelos órgãos de controle federal, conselhos estaduais e acreditadoras independentes do terceiro setor. Clique em qualquer selo para verificar o registro oficial e os critérios auditados.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {OFFICIAL_SEALS.map((seal: OfficialSeal, idx: number) => (
              <RealSealCard 
                key={seal.id} 
                seal={seal} 
                index={idx} 
                onSelect={(selected: OfficialSeal) => setSelectedSeal(selected)} 
              />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#f7f9fb] border border-[#e6e8ea] text-xs text-[#534434]"
          >
            <span className="material-symbols-outlined text-[#006c49] text-[18px]">verified_user</span>
            <span>Todas as chancelas possuem conformidade documental ativa e estão disponíveis para consulta no Diário Oficial e nos portais das entidades certificadoras.</span>
          </motion.div>
        </div>
      </section>

      {/* CTA Final: Visita e Auditoria Presencial Aberta */}
      <section className="w-full py-16 sm:py-20 bg-[#e6e8ea]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10 border border-[#d8dadc]">
            <div className="max-w-2xl">
              <span className="font-label-sm text-xs text-[#855300] font-bold uppercase tracking-widest block mb-1">
                Nossas Portas Estão Abertas
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-4xl text-[#191c1e] font-extrabold">
                Quer conferir os livros contábeis de perto?
              </h2>
              <p className="font-body-md text-sm sm:text-base text-[#534434] mt-2 leading-relaxed">
                Seja você um doador individual de R$ 20, representante de fundação mantenedora ou cidadão da nossa comunidade: agende um café com nosso time financeiro, consulte qualquer documento físico e assista às aulas e oficinas em plena atividade.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mt-6 text-[#191c1e] font-label-md text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c49] text-[20px]">location_on</span>
                  <span>Rua Otilia Borges, S/nº Lote 25, Quadra 25 – Bairro Leandro – Itaguaí / RJ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c49] text-[20px]">schedule</span>
                  <span>Segunda a Sexta, das 09h às 17h</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => setVisitModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#855300] text-[#613b00] hover:text-white font-label-lg text-sm sm:text-base px-8 py-4 rounded-xl shadow-md transition-all cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                <span>Agendar Visita à Sede</span>
              </button>
              <a
                href="tel:+5521987428647"
                className="inline-flex items-center justify-center gap-2 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] font-label-lg text-sm sm:text-base px-8 py-4 rounded-xl transition-colors font-bold border border-[#e0e3e5]"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                <span>(21) 98742-8647 • Controladoria</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Document Modal */}
      {quickViewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-[#e6e8ea]"
          >
            <button
              onClick={() => setQuickViewDoc(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f2f4f6] text-[#534434] hover:text-[#191c1e] flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className={`p-3 rounded-2xl ${quickViewDoc.iconBg} ${quickViewDoc.iconColor} material-symbols-outlined text-[28px]`}>
                {quickViewDoc.icon}
              </span>
              <div>
                <span className="text-xs text-[#006c49] font-bold uppercase">{quickViewDoc.categoryLabel}</span>
                <h3 className="font-headline-sm text-lg sm:text-xl text-[#191c1e] font-bold">{quickViewDoc.title}</h3>
              </div>
            </div>

            <p className="text-sm text-[#534434] leading-relaxed mb-6">
              {quickViewDoc.description}
            </p>

            <div className="bg-[#f2f4f6] p-4 rounded-2xl mb-6 text-xs text-[#534434] space-y-1">
              <p><strong>Exercício de Referência:</strong> Ano Fiscal {quickViewDoc.year}</p>
              <p><strong>Data de Publicação Oficial:</strong> {quickViewDoc.publishedDate}</p>
              <p><strong>Certificado Digital:</strong> Hash SHA-256 ICP-Brasil Válido</p>
              <p><strong>Formato:</strong> {quickViewDoc.fileSize}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  handleDownload(quickViewDoc);
                  setQuickViewDoc(null);
                }}
                className="flex-1 py-3.5 bg-[#006c49] hover:bg-[#00714d] text-white font-label-md text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Baixar Documento em PDF</span>
              </button>
              <button
                onClick={() => setQuickViewDoc(null)}
                className="px-6 py-3.5 bg-[#e0e3e5] hover:bg-[#d8dadc] text-[#191c1e] font-label-md text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Ombudsman Modal (Canal de Denúncias Seguras) */}
      {ombudsmanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-[#e6e8ea]"
          >
            <button
              onClick={() => setOmbudsmanModalOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f2f4f6] text-[#534434] hover:text-[#191c1e] flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f59e0b] text-[#613b00] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[26px]">security</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-xl text-[#191c1e] font-bold">Manifestação Segura</h3>
                <span className="text-xs text-[#006c49] font-bold">Protocolo Criptografado Ponta a Ponta</span>
              </div>
            </div>

            {ombudsmanSuccess ? (
              <div className="p-6 bg-[#6cf8bb]/20 border border-[#006c49]/30 rounded-2xl text-center space-y-2">
                <span className="material-symbols-outlined text-[48px] text-[#006c49]">check_circle</span>
                <h4 className="font-headline-sm text-lg text-[#002113] font-bold">Manifestação Registrada com Sucesso!</h4>
                <p className="text-xs text-[#002113]">
                  Seu número de protocolo é <strong>#OUV-2026-8849</strong>. Guarde este código para acompanhar o parecer da comissão independente.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOmbudsmanSubmit} className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-[#f2f4f6] rounded-xl text-xs text-[#534434]">
                  <input
                    type="checkbox"
                    id="anon"
                    checked={ombudsmanIsAnonymous}
                    onChange={(e) => setOmbudsmanIsAnonymous(e.target.checked)}
                    className="w-4 h-4 accent-[#006c49]"
                  />
                  <label htmlFor="anon" className="cursor-pointer font-semibold text-[#191c1e]">
                    Quero manter meu anonimato absoluto (não coletamos IP nem dados pessoais)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                    Tipo de Manifestação
                  </label>
                  <select
                    value={ombudsmanSubject}
                    onChange={(e) => setOmbudsmanSubject(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm border border-[#e0e3e5] focus:outline-none focus:ring-2 focus:ring-[#855300]/40"
                  >
                    <option value="">Selecione...</option>
                    <option value="duvida-fiscal">Dúvida sobre Balanço Contábil</option>
                    <option value="denuncia-etica">Denúncia de Conduta Ética</option>
                    <option value="sugestao-processo">Sugestão de Aprimoramento de Governança</option>
                    <option value="solicitacao-doc">Solicitação de Documento Específico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                    Relato Detalhado
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={ombudsmanMessage}
                    onChange={(e) => setOmbudsmanMessage(e.target.value)}
                    placeholder="Descreva detalhadamente o fato, datas, locais e eventuais pessoas envolvidas..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm border border-[#e0e3e5] focus:outline-none focus:ring-2 focus:ring-[#855300]/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#855300] hover:bg-[#653e00] text-white font-label-lg text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Enviar Manifestação com Protocolo Seguro
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Visit Schedule Modal */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#e6e8ea]"
          >
            <button
              onClick={() => setVisitModalOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f2f4f6] text-[#534434] hover:text-[#191c1e] flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <h3 className="font-headline-sm text-xl text-[#191c1e] font-bold mb-1">Agendar Visita à Sede</h3>
            <p className="text-xs text-[#534434] mb-4">Venha tomar um café e conferir nossos livros contábeis e projetos sociais.</p>

            {visitSuccess ? (
              <div className="p-6 bg-[#6cf8bb]/20 border border-[#006c49]/30 rounded-2xl text-center space-y-2">
                <span className="material-symbols-outlined text-[48px] text-[#006c49]">calendar_today</span>
                <h4 className="font-headline-sm text-base text-[#002113] font-bold">Visita Pré-Agendada!</h4>
                <p className="text-xs text-[#002113]">Nossa equipe de controladoria enviará a confirmação com endereço completo e instruções de acesso.</p>
              </div>
            ) : (
              <form onSubmit={handleVisitSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#191c1e] mb-1">Seu Nome</label>
                  <input required type="text" placeholder="Nome completo" className="w-full px-4 py-2.5 rounded-xl bg-[#f2f4f6] text-sm border border-[#e0e3e5]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#191c1e] mb-1">E-mail</label>
                  <input required type="email" placeholder="seu@email.com" className="w-full px-4 py-2.5 rounded-xl bg-[#f2f4f6] text-sm border border-[#e0e3e5]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#191c1e] mb-1">Data Preferencial</label>
                  <input required type="date" className="w-full px-4 py-2.5 rounded-xl bg-[#f2f4f6] text-sm border border-[#e0e3e5]" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-[#f59e0b] hover:bg-[#855300] text-[#613b00] hover:text-white font-bold rounded-xl text-sm transition-colors cursor-pointer mt-2">
                  Confirmar Agendamento
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Project Extract Modal */}
      {selectedProjectExtract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-[#e6e8ea]"
          >
            <button
              onClick={() => setSelectedProjectExtract(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f2f4f6] text-[#534434] hover:text-[#191c1e] flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <span className="text-xs font-bold text-[#006c49] uppercase">Extrato Orçamentário Detalhado</span>
            <h3 className="font-headline-sm text-xl text-[#191c1e] font-bold mt-1 mb-4">{selectedProjectExtract}</h3>

            <div className="space-y-3 bg-[#f2f4f6] p-4 rounded-2xl text-sm mb-6">
              <p className="font-bold text-[#191c1e]">Doações recebidas: R$ 0,00</p>
              <p className="text-[#534434]">Nenhuma doação recebida ou movimentação de donativos registrada para este projeto.</p>
            </div>

            <button
              onClick={() => setSelectedProjectExtract(null)}
              className="w-full py-3.5 bg-[#006c49] text-white font-bold rounded-xl text-sm hover:bg-[#00714d] transition-colors cursor-pointer"
            >
              Fechar Extrato
            </button>
          </motion.div>
        </div>
      )}

      {/* Official Seal Verification Modal */}
      <SealVerificationModal
        seal={selectedSeal}
        onClose={() => setSelectedSeal(null)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './SocialIcons';

interface SupporterPortalViewProps {
  onOpenDonation: () => void;
  onNavigateHome: () => void;
  onOpenTransparency: () => void;
}

export const SupporterPortalView: React.FC<SupporterPortalViewProps> = ({
  onOpenDonation,
  onNavigateHome,
  onOpenTransparency,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmedEvents, setConfirmedEvents] = useState<{ [key: string]: boolean }>({});
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCopyBadgeCode = () => {
    const embedCode = `<div class="caminho-forma-badge" data-supporter="AP-2024-88492" data-tier="ouro">\n  <a href="https://institutocaminhoeforma.org.br/apoiador/AP-2024-88492" target="_blank" rel="noopener">\n    <img src="https://institutocaminhoeforma.org.br/selos/mantenedor-ouro.svg" alt="Mantenedor Ouro - Instituto Caminho e Forma" width="240" height="240" />\n  </a>\n</div>`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(embedCode).then(() => {
        showToast('Código do Selo Digital copiado para a área de transferência!');
      }).catch(() => {
        showToast('Código pronto para copiar!');
      });
    } else {
      showToast('Código pronto para copiar!');
    }
  };

  const handleCopyCoupon = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCoupon(true);
        showToast(`Cupom ${code} copiado com sucesso!`);
        setTimeout(() => setCopiedCoupon(false), 3000);
      });
    }
  };

  const toggleEventConfirm = (eventId: string, eventTitle: string) => {
    setConfirmedEvents((prev) => {
      const nextState = !prev[eventId];
      if (nextState) {
        showToast(`Presença confirmada no encontro: "${eventTitle}". Enviamos os detalhes por e-mail!`);
      } else {
        showToast(`Inscrição cancelada para: "${eventTitle}".`);
      }
      return { ...prev, [eventId]: nextState };
    });
  };

  const handleDownloadReceipt = (month: string, amount: string) => {
    showToast(`Gerando Recibo Oficial de Doação (${month} - ${amount})...`);
    setTimeout(() => {
      window.print();
    }, 600);
  };

  const shareText = encodeURIComponent(
    'Tenho muito orgulho em ser Apoiador Nível Ouro do Instituto Caminho e Forma em Itaguaí/RJ! Conheça o trabalho de capacitação e autonomia comunitária: https://institutocaminhoeforma.org.br'
  );

  return (
    <div className="w-full bg-white pt-24 sm:pt-28 pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 font-sans text-sm"
          >
            <span className="material-symbols-outlined text-[#22c55e] text-[20px]">check_circle</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner / User Quick Stats Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full bg-slate-50 border-b border-slate-200 overflow-hidden py-10 lg:py-14"
      >
        {/* Ambient Subtle Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#b45309]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#166534]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb & Member Badge Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 font-sans text-xs text-slate-500">
              <button onClick={onNavigateHome} className="hover:text-slate-900 transition-colors cursor-pointer">
                Início
              </button>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-600">Portal do Apoiador</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-900 font-bold">Painel Geral de Membro</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b45309]/15 text-[#92400e] font-sans text-xs font-bold border border-[#b45309]/30">
                <span className="material-symbols-outlined text-[16px] text-[#b45309]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
                Apoiador Nível Ouro
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#166534]/15 text-[#14532d] font-sans text-xs font-bold border border-[#166534]/30">
                <span className="material-symbols-outlined text-[16px] text-[#166534]">verified</span>
                Membro Ativo há 1 ano e 4 meses
              </span>
            </div>
          </div>

          {/* Welcome Main Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-8 flex flex-col sm:flex-row items-start gap-5"
            >
              <div className="relative shrink-0">
                <img
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md border-2 border-white ring-2 ring-slate-200"
                  alt="Retrato de Marcelo Soares - Mantenedor"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW7qYKVxycbB6AbyazTYA4caA8tpT7e-_jMFlAD05hUYWhi_cAqB_Er8_KO0MJAMKESb18D5Atv6BWAOyNFx7EkPpMj9t1yh6pLzyfL5fgiRmIW0WDjI7j0UvRaG617NXl0cgS2Hk-qce18WsTD-haaXM7sH51k0vQCPSWb-ITdunbAWtjYRhgNo5PsD9rf32UJJt0OecJLNbS_UutMZA8mIMGw4SNkWW1RANbSB1cVwA1kdxkx97A"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#b45309] text-white flex items-center justify-center text-[12px] shadow-sm border-2 border-white"
                  title="Certificado Nível Ouro"
                >
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    workspace_premium
                  </span>
                </span>
              </div>

              <div className="flex flex-col">
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 font-bold tracking-tight">
                  Olá, Marcelo Soares!
                </h1>
                <p className="font-sans text-sm sm:text-base text-slate-600 mt-2 leading-relaxed max-w-2xl">
                  Bem-vindo ao seu ambiente exclusivo de acompanhamento e transformação social no{' '}
                  <strong className="text-slate-900">Instituto Caminho e Forma</strong>. Sua contribuição contínua sustenta sonhos, capacitações técnicas e autonomias reais para famílias de Itaguaí.
                </p>
              </div>
            </motion.div>

            {/* Quick CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenDonation}
                className="inline-flex items-center justify-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm font-bold px-5 py-3 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                <span>Fazer Nova Doação Avulsa</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRecurringModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-sans text-sm font-semibold px-5 py-3 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-600">manage_accounts</span>
                <span>Gerenciar Doações Recorrentes</span>
              </motion.button>
            </motion.div>
          </div>

          {/* 4 Personal Impact Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
            {/* Metric 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-xs text-slate-500 uppercase tracking-wider font-bold">Total Contribuído</span>
                <div className="w-10 h-10 rounded-xl bg-[#b45309]/10 flex items-center justify-center text-[#b45309]">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl text-slate-900 font-bold tracking-tight">R$ 0,00</div>
                <div className="flex items-center gap-1.5 mt-1.5 font-sans text-xs text-[#166534] font-medium">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>100% auditado externamente</span>
                </div>
              </div>
            </motion.div>

            {/* Metric 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-xs text-slate-500 uppercase tracking-wider font-bold">Impacto Real</span>
                <div className="w-10 h-10 rounded-xl bg-[#166534]/10 flex items-center justify-center text-[#166534]">
                  <span className="material-symbols-outlined text-[22px]">diversity_1</span>
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl text-slate-900 font-bold tracking-tight">34 Famílias</div>
                <div className="flex items-center gap-1.5 mt-1.5 font-sans text-xs text-slate-600">
                  <span className="material-symbols-outlined text-[15px]">groups</span>
                  <span>Alimentação e capacitação digna</span>
                </div>
              </div>
            </motion.div>

            {/* Metric 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.36 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-xs text-slate-500 uppercase tracking-wider font-bold">Cursos &amp; Bolsa Social</span>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                  <span className="material-symbols-outlined text-[22px]">school</span>
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl text-slate-900 font-bold tracking-tight">2 Cursos</div>
                <div className="flex items-center gap-1.5 mt-1.5 font-sans text-xs text-[#166534] font-medium">
                  <span className="material-symbols-outlined text-[15px]">trending_up</span>
                  <span>Em andamento (bolsas custeadas)</span>
                </div>
              </div>
            </motion.div>

            {/* Metric 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.44 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-xs text-slate-500 uppercase tracking-wider font-bold">Comunidade &amp; Rodas</span>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <span className="material-symbols-outlined text-[22px]">event_available</span>
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl text-slate-900 font-bold tracking-tight">4 Encontros</div>
                <div className="flex items-center gap-1.5 mt-1.5 font-sans text-xs text-slate-600">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>Próxima assembleia em 28 Jun</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Destaque de Honra (Selo Oficial & Certificação) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full"
      >
        <div className="relative bg-gradient-to-br from-white via-white to-slate-50 rounded-3xl p-6 sm:p-8 lg:p-12 border border-slate-200 shadow-sm overflow-hidden">
          {/* Decorative Backdrop Graphic */}
          <div className="absolute right-0 top-0 w-80 h-full opacity-5 pointer-events-none flex items-center justify-center">
            <svg className="w-96 h-96 text-[#b45309] fill-current" viewBox="0 0 200 200">
              <path d="M100 0 L122 68 L195 68 L136 110 L158 178 L100 136 L42 178 L64 110 L5 68 L78 68 Z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Visual Badge Illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 flex flex-col items-center text-center p-6 sm:p-8 bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-xs"
            >
              <div className="relative w-44 h-44 mb-5 flex items-center justify-center">
                {/* Ambient golden ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#b45309] via-[#f59e0b] to-[#166534] opacity-25 animate-pulse" />
                <div className="relative w-36 h-36 rounded-full bg-white flex flex-col items-center justify-center p-3 text-center shadow-md border-4 border-slate-100">
                  <span className="material-symbols-outlined text-[48px] text-[#b45309]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    military_tech
                  </span>
                  <span className="font-sans text-[10px] uppercase font-extrabold tracking-widest text-slate-900 mt-1">
                    Selo Oficial
                  </span>
                  <span className="font-sans text-[9px] text-slate-500 font-medium leading-tight">
                    Instituto Caminho e Forma
                  </span>
                </div>
              </div>

              <span className="font-serif text-xl sm:text-2xl text-slate-900 font-bold">
                Certificação Ouro de Mantenedor
              </span>
              <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2 max-w-sm leading-relaxed">
                Reconhecimento institucional concedido pelo <strong className="text-slate-900">Instituto Caminho e Forma</strong> pelo compromisso ininterrupto com a equidade social e a cidadania ativa em Itaguaí e região.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 rounded-lg font-sans text-xs text-slate-600 border border-slate-200">
                <span className="material-symbols-outlined text-[16px] text-[#166534]">fingerprint</span>
                <span>
                  ID Autenticidade: <strong className="text-slate-900 font-mono">#AP-2024-88492</strong>
                </span>
              </div>
            </motion.div>

            {/* Honour description & actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#166534] text-white font-sans text-xs font-bold uppercase tracking-wider">
                  Chancela Ética Verificada
                </span>
                <span className="text-slate-500 font-sans text-xs">• Registro Auditado 2026</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 font-bold tracking-tight">
                Seu legado é palpável, certificado e compartilhado.
              </h2>
              <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
                Como apoiador nível Ouro, Marcelo, você integra um grupo seleto de cidadãos que transformam vulnerabilidade em dignidade através de autonomia formativa e fomento ao microempreendedorismo local. Seu certificado possui assinatura digital válida e chancela pedagógica.
              </p>

              {/* Interactive Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCertificateModal(true)}
                  className="inline-flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm font-bold px-5 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Baixar Certificado Oficial (PDF)</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyBadgeCode}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-sans text-sm font-semibold px-4 py-3 rounded-xl transition-colors cursor-pointer border border-slate-300"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-600">code</span>
                  <span>Copiar Selo p/ LinkedIn / Site</span>
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://api.whatsapp.com/send?text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#166534] hover:bg-[#14532d] text-white font-sans text-sm font-bold px-4 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Compartilhar Impacto</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 3: Histórico de Doações e Transparência do Impacto */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="font-sans text-xs uppercase tracking-wider text-[#b45309] font-bold">
              Transparência Ativa
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mt-1">
              Histórico de Apoio &amp; Destinação Real
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => showToast('Gerando Informe de Rendimentos IR 2026 consolidado em PDF...')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-sans text-xs sm:text-sm font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#b45309]">receipt_long</span>
              <span>Emitir Informe de Rendimentos IR 2026</span>
            </motion.button>
          </div>
        </div>

        {/* 2-Column Split: Table on Left (8 cols), Where Money Worked on Right (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <h3 className="font-serif text-lg sm:text-xl text-slate-900 font-bold">
                Últimos Lançamentos Registrados
              </h3>
              <span className="font-sans text-xs text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#166534]">verified</span>
                Auditoria Contábil Independente
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-4 rounded-l-xl">Data</th>
                    <th className="py-3 px-4">Finalidade / Projeto</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Comprovante</th>
                  </tr>
                </thead>
                <tbody><tr><td colSpan={5} className="py-8 px-4 text-center text-sm text-slate-600">Nenhuma doação recebida até o momento.</td></tr></tbody>
              </table>
            </div>
          </motion.div>

          {/* Right Panel: Where money worked */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-4 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[#166534] font-sans text-xs font-bold mb-2">
                <span className="material-symbols-outlined text-[18px]">insights</span>
                <span>Rastreabilidade em Tempo Real</span>
              </div>
              <h3 className="font-serif text-xl text-slate-900 font-bold">
                Aplicação das doações
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                No Instituto Caminho e Forma, cada centavo do apoiador tem destino pré-determinado e prestação contábil aberta.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                {/* Impact Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#166534]/15 text-[#166534] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">nutrition</span>
                  </div>
                  <div>
                    <span className="font-sans text-xs sm:text-sm text-slate-900 font-bold block">
                      R$ 0,00 • Cestas Agroecológicas
                    </span>
                    <span className="font-sans text-xs text-slate-600 leading-snug block mt-0.5">
                      Alimentos orgânicos adquiridos de pequenos agricultores e hortas comunitárias locais de Itaguaí.
                    </span>
                  </div>
                </div>

                {/* Impact Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#b45309]/15 text-[#b45309] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">handyman</span>
                  </div>
                  <div>
                    <span className="font-sans text-xs sm:text-sm text-slate-900 font-bold block">
                      R$ 0,00 • Insumos de Oficina Técnica
                    </span>
                    <span className="font-sans text-xs text-slate-600 leading-snug block mt-0.5">
                      Farinhas e manutenção da batedeira industrial da turma de Panificação Solidária.
                    </span>
                  </div>
                </div>

                {/* Impact Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                  </div>
                  <div>
                    <span className="font-sans text-xs sm:text-sm text-slate-900 font-bold block">
                      R$ 0,00 • Auditoria &amp; Infraestrutura
                    </span>
                    <span className="font-sans text-xs text-slate-600 leading-snug block mt-0.5">
                      Garantia de conformidade, conexão banda larga e espaço seguro aos educandos.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Mini-Bar */}
            <div className="mt-8 pt-4 border-t border-slate-200">
              <div className="flex justify-between font-sans text-xs mb-1.5 text-slate-600">
                <span>Eficiência Programática</span>
                <span className="font-bold text-[#166534]">0% aplicado</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#166534] h-full rounded-full transition-all" style={{ width: '0%' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 4: Ambiente de Aprendizado e Cursos Solidários */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 w-full"
      >
        <div className="mb-8">
          <div className="font-sans text-xs uppercase tracking-wider text-[#b45309] font-bold">
            Educação Compartilhada
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mt-1">
            Ambiente de Aprendizado Solidário
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
            Aqui o conhecimento gera autonomia mútua: ao estudar, você adquire habilidades práticas e financia diretamente a formação de jovens e mães solo de Itaguaí.
          </p>
        </div>

        {/* Sub-Block A: Meus Cursos em Andamento */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#166534] text-[24px]">play_circle</span>
            <h3 className="font-serif text-xl text-slate-900 font-bold">Meus Cursos em Andamento</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Curso Ativo 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#b45309]/10 text-[#92400e] font-sans text-xs font-bold">
                    Finanças Sociais
                  </span>
                  <span className="font-sans text-xs text-slate-500">Módulo 4 de 6</span>
                </div>
                <h4 className="font-serif text-xl text-slate-900 font-bold">
                  Gestão Financeira &amp; Investimentos de Impacto
                </h4>
                <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Princípios ESG, estruturação de microcrédito comunitário e finanças orientadas à sustentabilidade socioambiental.
                </p>

                {/* Progress Indicator */}
                <div className="mt-5">
                  <div className="flex justify-between font-sans text-xs mb-1.5 text-slate-900">
                    <span>Progresso do Apoiador</span>
                    <span className="font-bold text-[#b45309]">65% concluído</span>
                  </div>
                  <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-[#b45309] h-full rounded-full transition-all" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-sans text-xs text-[#166534] font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>Bolsa financiada: <strong>Lucas Gabriel (Turma Itaguaí)</strong></span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => showToast('Abrindo sala de aula virtual do módulo 4...')}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>Continuar Aula</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Curso Ativo 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#166534]/10 text-[#14532d] font-sans text-xs font-bold">
                    Desenvolvimento Comunitário
                  </span>
                  <span className="font-sans text-xs text-slate-500">Módulo 2 de 5</span>
                </div>
                <h4 className="font-serif text-xl text-slate-900 font-bold">
                  Liderança Comunitária e Negócios Sociais
                </h4>
                <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Metodologias ativas de mobilização popular, desenho de projetos participativos e governança cooperativa.
                </p>

                {/* Progress Indicator */}
                <div className="mt-5">
                  <div className="flex justify-between font-sans text-xs mb-1.5 text-slate-900">
                    <span>Progresso do Apoiador</span>
                    <span className="font-bold text-[#166534]">30% concluído</span>
                  </div>
                  <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-[#166534] h-full rounded-full transition-all" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-sans text-xs text-[#166534] font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>Bolsa financiada: <strong>Beatriz M. (Turma Leandro)</strong></span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => showToast('Carregando grade curricular e materiais de apoio...')}
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-sans text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer border border-slate-300"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-600">list_alt</span>
                  <span>Acessar Módulos</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sub-Block B: Cursos Disponíveis para Aquisição Solidária */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b45309] text-[24px]">storefront</span>
              <h3 className="font-serif text-xl text-slate-900 font-bold">Vitrine Solidária: Adquira e Financie 1 Aluno</h3>
            </div>
            <span className="font-sans text-xs text-[#166534] font-bold bg-[#166534]/10 px-3 py-1 rounded-full">
              100% da receita convertida em bolsa integral
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vitrine 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-44 w-full">
                <img
                  className="w-full h-full object-cover"
                  alt="Empreendedorismo Social e Captação de Recursos"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAScC5yP3hzsNLO9wTr_MRMKXDRG7eVk8KCh1-nWWp4I1Xv3rm0cXoskw2bugwtW28hptGqvDR0Ok7_XIWRxI7y7oWdK4E04dOLOr5iQobnkKNqNFmkEtzO_QrUmiyd34w8D7zm-04A4YAf7E_npRZM8CIOefLUEBk5Lrt8xQUREsX1zMMdfnM7xywYU5vvhvfF9YSsoXFApU3iDF6Li6vS4qSfrKzpyLNFgsjYXDW-mGJTYqL9nNJ8"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-slate-900 font-sans text-xs font-bold shadow-xs border border-slate-200">
                  Certificado Incluso
                </span>
              </div>
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h4 className="font-serif text-lg text-slate-900 font-bold leading-snug">
                    Empreendedorismo Social e Captação de Recursos
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Aprenda a estruturar planos de sustentabilidade financeira, editais e campanhas de matchfunding comunitário.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-xs text-slate-500">Investimento com Propósito:</span>
                    <span className="font-serif text-xl text-[#b45309] font-bold">R$ 120,00</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenDonation}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                    <span>Adquirir e Financiar 1 Aluno</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Vitrine 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-44 w-full">
                <img
                  className="w-full h-full object-cover"
                  alt="Comunicação Não-Violenta e Mediação de Conflitos"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7y7q952QGnGGo87XJ9480p6THN49MovKqCpQAEX1apSUjw4_ledtEOaw9oR5tZMyVBnswlS638ZC0Lfxd7L83jYhnl5ChBA0RrzHtn0YK3EhC7AWTSfxhvm4958EHcxl2HR5AMdEIOJBIMT1Z-7HQWVHAJh3Rgks2yZlv3ndXkVurIH0ozIb1WZILR43kums954NfnUnt8-bzFfskqHzkKbNmNpAgH-TPnYh9gEXNpWBHHfaM0Tmj"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-slate-900 font-sans text-xs font-bold shadow-xs border border-slate-200">
                  Acesso Vitalício
                </span>
              </div>
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h4 className="font-serif text-lg text-slate-900 font-bold leading-snug">
                    Comunicação Não-Violenta e Mediação de Conflitos
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Ferramentas práticas de diálogo restaurativo para times, famílias e mediação de convivência em territórios urbanos.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-xs text-slate-500">Investimento com Propósito:</span>
                    <span className="font-serif text-xl text-[#166534] font-bold">R$ 95,00</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenDonation}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-sans text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer border border-slate-300"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                    <span>Adquirir e Apoiar</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Vitrine 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-44 w-full">
                <img
                  className="w-full h-full object-cover"
                  alt="Sustentabilidade e Práticas ESG na Prática"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLx-XyQNkstwuibKeuWF9AcKTwdEVU7YvDLWubJwH8obBdkn1C198oxrnnQm3m2zIwnviPdSLU07JesSaVfewfEaTCKlP5pU8Sotww1nxZXoKmlRGevfr53HxVX6WDXswyFhL6Cz51ZSIQVUO_SuRErC6mueHlwynFZm1eC3OfEcRnkHcXRH6h_mSTPCja-t_p5_uMHTcItyqzKTTO21rAiOsooou3wzyiPeShYbT-vVyX3L1jFvNq"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-slate-900 font-sans text-xs font-bold shadow-xs border border-slate-200">
                  Mentoria Mensal
                </span>
              </div>
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h4 className="font-serif text-lg text-slate-900 font-bold leading-snug">
                    Sustentabilidade e Práticas ESG na Prática
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Como pequenas empresas e cidadãos podem implementar metas claras de descarbonização, inclusão e compras éticas.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-xs text-slate-500">Investimento com Propósito:</span>
                    <span className="font-serif text-xl text-[#b45309] font-bold">R$ 150,00</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenDonation}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-sans text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer border border-slate-300"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                    <span>Adquirir e Apoiar</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 5: Agenda de Eventos Exclusivos para Apoiadores */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="w-full bg-slate-50 border-y border-slate-200 py-12 lg:py-16"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-sans text-xs uppercase tracking-wider text-[#166534] font-bold">
                Comunhão e Presença
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mt-1">
                Agenda de Encontros Exclusivos
              </h2>
              <p className="font-sans text-sm sm:text-base text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                Espaços de diálogo, prestação de contas olho no olho e vivências afetivas no coração dos nossos polos em Itaguaí.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 font-sans text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="material-symbols-outlined text-[16px] text-[#b45309]">pin_drop</span>
              <span>Sede Itaguaí / RJ &amp; Salas Virtuais</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Event 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#166534]/15 text-[#14532d] font-sans text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">apartment</span> Presencial na Sede
                  </span>
                  <span className="font-sans text-xs text-[#b45309] font-bold">Vagas Limitadas</span>
                </div>
                <div className="text-slate-500 font-sans text-xs font-semibold">
                  Sábado, 15 de Junho • 09:30 às 13:00
                </div>
                <h4 className="font-serif text-lg text-slate-900 font-bold mt-1.5 leading-snug">
                  Roda de Conversa com Formandos &amp; Visita Guiada ao Polo Comunitário
                </h4>
                <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  Venha conhecer de perto os alunos da turma de Panificação e Artesanato que você apoiou em Itaguaí. Café colonial comunitário incluso com produtos locais.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleEventConfirm('event-1', 'Roda de Conversa com Formandos')}
                  className={`w-full inline-flex items-center justify-center gap-2 font-sans text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-colors cursor-pointer ${
                    confirmedEvents['event-1']
                      ? 'bg-[#166534] text-white'
                      : 'bg-[#166534]/10 hover:bg-[#166534] text-[#166534] hover:text-white'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {confirmedEvents['event-1'] ? 'task_alt' : 'check_circle'}
                  </span>
                  <span>{confirmedEvents['event-1'] ? 'Presença Confirmada!' : 'Confirmar Presença'}</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Event 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-900 font-sans text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">videocam</span> Online via Zoom
                  </span>
                  <span className="font-sans text-xs text-slate-500">Transparência Anual</span>
                </div>
                <div className="text-slate-500 font-sans text-xs font-semibold">
                  Sexta, 28 de Junho • 19:30 às 21:00
                </div>
                <h4 className="font-serif text-lg text-slate-900 font-bold mt-1.5 leading-snug">
                  Assembleia Anual de Prestação de Contas &amp; Diálogo com a Diretoria
                </h4>
                <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  Apresentação detalhada dos balanços do 1º semestre de 2026, parecer da auditoria externa e votação consultiva sobre novas frentes territoriais.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleEventConfirm('event-2', 'Assembleia Anual de Prestação de Contas')}
                  className={`w-full inline-flex items-center justify-center gap-2 font-sans text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer ${
                    confirmedEvents['event-2']
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {confirmedEvents['event-2'] ? 'event_available' : 'calendar_add_on'}
                  </span>
                  <span>{confirmedEvents['event-2'] ? 'Salvo no Calendário!' : 'Adicionar à Minha Agenda'}</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Event 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#b45309]/15 text-[#92400e] font-sans text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">workspace_premium</span> Exclusivo Apoiadores Ouro
                  </span>
                  <span className="font-sans text-xs text-slate-500">Gastronomia Afetiva</span>
                </div>
                <div className="text-slate-500 font-sans text-xs font-semibold">
                  Quarta, 10 de Julho • 18:30 às 21:30
                </div>
                <h4 className="font-serif text-lg text-slate-900 font-bold mt-1.5 leading-snug">
                  Workshop de Culinária Afetiva com os Chefs da Cooperativa
                </h4>
                <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  Uma noite de aprendizado prático e troca de receitas tradicionais da culinária ancestral brasileira conduzida por cozinheiras formadas no instituto.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleEventConfirm('event-3', 'Workshop de Culinária Afetiva')}
                  className={`w-full inline-flex items-center justify-center gap-2 font-sans text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-colors cursor-pointer ${
                    confirmedEvents['event-3']
                      ? 'bg-[#b45309] text-white'
                      : 'bg-[#b45309]/10 hover:bg-[#b45309] text-[#b45309] hover:text-white'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {confirmedEvents['event-3'] ? 'done_all' : 'lock_open'}
                  </span>
                  <span>{confirmedEvents['event-3'] ? 'Vaga Ouro Reservada!' : 'Reservar Minha Vaga Ouro'}</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 6: Clube de Benefícios & Vantagens Exclusivas */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-12 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="font-sans text-xs uppercase tracking-wider text-[#b45309] font-bold">
                Reconhecimento &amp; Reciprocidade
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mt-1">
                Seu Clube de Benefícios Solidários
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 font-sans text-xs text-slate-600 border border-slate-200">
              <span className="material-symbols-outlined text-[#166534] text-[18px]">stars</span>
              <span>Status: <strong>Benefícios Ativos &amp; Vitalícios</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between hover:bg-slate-100 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#b45309]/15 text-[#b45309] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">local_mall</span>
                </div>
                <h4 className="font-serif text-lg text-slate-900 font-bold">20% de Desconto na Feira</h4>
                <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Economize em cerâmicas, pães artesanais e biojoias produzidas pelas famílias cooperadas do Caminho e Forma.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="font-mono text-xs text-[#b45309] font-bold">APOIADOR-OURO-20</span>
                <button
                  onClick={() => handleCopyCoupon('APOIADOR-OURO-20')}
                  className="inline-flex items-center gap-1 text-xs text-slate-900 hover:text-[#b45309] font-semibold cursor-pointer"
                  title="Copiar cupom"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>{copiedCoupon ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </motion.div>

            {/* Benefit 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between hover:bg-slate-100 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#166534]/15 text-[#166534] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">mail</span>
                </div>
                <h4 className="font-serif text-lg text-slate-900 font-bold">Cartas Afetivas Trimestrais</h4>
                <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Relatório reservado contendo cartas digitalizadas escritas à mão pelos alunos beneficiados contando sua evolução.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 font-sans text-xs text-[#166534] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <button
                  onClick={() => showToast('Abrindo caderno digital de cartas afetivas de Maio/2026...')}
                  className="hover:underline cursor-pointer"
                >
                  Edição de Maio já disponível
                </button>
              </div>
            </motion.div>

            {/* Benefit 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between hover:bg-slate-100 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">notifications_active</span>
                </div>
                <h4 className="font-serif text-lg text-slate-900 font-bold">Acesso Antecipado a Oficinas</h4>
                <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Inscrição prioritária com 48 horas de antecedência para workshops concorridos e para o bazar beneficente anual.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 font-sans text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#166534]">check</span>
                <span>Notificações VIP automáticas ativas</span>
              </div>
            </motion.div>

            {/* Benefit 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between hover:bg-slate-100 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
                  <WhatsAppIcon className="w-7 h-7 text-[#25D366]" />
                </div>
                <h4 className="font-serif text-lg text-slate-900 font-bold">Canal Exclusivo de WhatsApp</h4>
                <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Contato direto com a coordenadora de relações comunitárias para tirar dúvidas sobre destinação e voluntariado.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 font-sans text-xs">
                <a
                  className="text-[#166534] hover:underline font-bold inline-flex items-center gap-1"
                  href="https://wa.me/5521987428647?text=Ol%C3%A1%2C%20sou%20o%20Marcelo%20Soares%20(Apoiador%20Ouro%20%23AP-2024-88492)%20e%20gostaria%20de%20conversar%20com%20a%20coordena%C3%A7%C3%A3o."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Falar com a Coordenação</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 7: FAQ Rápido & Suporte do Apoiador */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full"
      >
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 lg:p-12 border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-serif text-xl sm:text-2xl text-slate-900 font-bold">
              Precisa de ajuda com sua doação ou certificado?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Nossa equipe de relacionamento com mantenedores está pronta para ajustar dados de cartão, alterar valor da contribuição mensal ou emitir certidões personalizadas de filantropia corporativa em Itaguaí.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-sans text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
              href="mailto:institutocaminhoeformaoficial@gmail.com"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              <span>institutocaminhoeformaoficial@gmail.com</span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#166534] hover:bg-[#14532d] text-white font-sans text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer"
              href="tel:+5521987428647"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>(21) 98742-8647</span>
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* Certificate Official Modal Preview */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 border-4 border-[#b45309]/30 shadow-2xl relative"
            >
              <button
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#b45309]/10 flex items-center justify-center text-[#b45309] mb-4">
                  <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    military_tech
                  </span>
                </div>
                <span className="font-sans text-xs tracking-widest uppercase font-bold text-[#b45309]">
                  República Federativa do Brasil • Estado do Rio de Janeiro
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-slate-900 font-bold mt-1">
                  Certificado de Mantenedor Social
                </h3>
                <p className="font-sans text-xs text-slate-500 mt-0.5">
                  Instituto Caminho e Forma • CNPJ: 18.360.956/0001-60
                </p>

                <div className="my-6 p-6 bg-white rounded-2xl border border-slate-200 text-left w-full font-serif text-base sm:text-lg text-slate-900 leading-relaxed">
                  Certificamos com honra e reconhecimento institucional que <strong className="text-[#b45309]">Marcelo Soares</strong> é mantenedor ativo de <strong className="text-[#166534]">Nível Ouro</strong> do Instituto Caminho e Forma, contribuindo diretamente para o fomento de oficinas de capacitação profissional, acolhimento social e segurança alimentar comunitária em Itaguaí/RJ.
                </div>

                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-slate-500 border-t border-slate-200 pt-4">
                  <div>
                    <span>Código de Registro:</span> <strong className="font-mono text-slate-900">#AP-2024-88492</strong>
                  </div>
                  <div>
                    <span>Data de Emissão:</span> <strong className="text-slate-900">10 de Maio de 2026</strong>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 justify-center w-full">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="inline-flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm font-bold px-6 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    <span>Imprimir / Salvar PDF</span>
                  </button>
                  <button
                    onClick={() => setShowCertificateModal(false)}
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-sans text-sm font-semibold px-5 py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recurring Management Modal */}
      <AnimatePresence>
        {showRecurringModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setShowRecurringModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#b45309]/10 text-[#b45309] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-slate-900 font-bold">Assinatura Mensal Ativa</h3>
                  <span className="font-sans text-xs text-[#166534] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Cobrança automática ativa
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 font-sans text-sm space-y-2 mb-6">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Plano Atual:</span>
                  <strong className="text-slate-900">Mantenedor Ouro</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Valor Mensal:</span>
                  <strong className="text-slate-900 text-base font-bold">R$ 150,00 / mês</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Forma de Cobrança:</span>
                  <span className="text-slate-900">Cartão Mastercard •••• 4092</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Próximo Lançamento:</span>
                  <span className="text-[#166534] font-bold">10 de Junho de 2026</span>
                </div>
              </div>

              <p className="font-sans text-xs text-slate-600 leading-relaxed mb-6">
                Você pode pausar, alterar o valor ou atualizar a forma de pagamento a qualquer instante diretamente com nossa controladora financeira ou pelo WhatsApp oficial.
              </p>

              <div className="flex flex-col gap-2.5">
                <a
                  href="https://wa.me/5521987428647?text=Ol%C3%A1%2C%20gostaria%20de%20ajustar%20minha%20doa%C3%A7%C3%A3o%20recorrente%20(Marcelo%20Soares%20-%20AP-2024-88492)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#166534] hover:bg-[#14532d] text-white font-sans text-sm font-bold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Ajustar via WhatsApp Oficial</span>
                </a>
                <button
                  onClick={() => {
                    setShowRecurringModal(false);
                    showToast('Link seguro para atualização de cartão enviado ao seu e-mail!');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-sans text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Atualizar Cartão de Crédito
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

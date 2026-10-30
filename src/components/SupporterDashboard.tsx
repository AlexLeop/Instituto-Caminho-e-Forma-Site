import { motion } from 'motion/react';
import type { SupporterProfile, SupporterDonation } from '../../shared/supporter';
import { formatDonationAmount as money } from '../data/donations';
import { PROJECTS } from '../data/mockData';
import { WhatsAppIcon } from './SocialIcons';
const formatDate = (value: string | null | undefined) => value ? new Date(value.length === 10 ? value + 'T12:00:00-03:00' : value).toLocaleDateString('pt-BR', {timeZone: 'America/Sao_Paulo'}) : 'Não informada';
interface Props {profile: SupporterProfile; busy: boolean; error: string; onOpenDonation: () => void; onNavigateHome: () => void; onLogout: () => void; onRefresh: () => void; onDownload: () => void; onDownloadRecord: (record: SupporterDonation) => void; onLoadMore: () => void}
// Layout recovered from the original portal (4c4f0a6). All personal data comes from the authenticated profile.
export function SupporterDashboard({profile, busy, error, onOpenDonation, onNavigateHome, onLogout, onRefresh, onDownload, onDownloadRecord, onLoadMore}: Props) {
 const destinations = profile.destinations ?? [];
 const initials = profile.name.trim().split(/\s+/).slice(0,2).map(part => part[0]).join('').toUpperCase() || 'A';
 const educationTotal = destinations.filter(item => item.destinationId === 'cursos-ead').reduce((total,item) => total + item.paidCents,0);
 return <div className="w-full bg-white pt-24 sm:pt-28 pb-20" aria-label="Meu painel de apoiador">
 {error && <p role="alert" className="mx-auto mb-5 max-w-[1400px] rounded-xl bg-red-50 px-5 py-4 text-sm text-red-900">{error}</p>}
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
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-600">Portal do Apoiador</span>
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-900 font-bold">Painel Geral de Membro</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b45309]/15 text-[#92400e] font-sans text-xs font-bold border border-[#b45309]/30">
                <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-[#b45309]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                Apoiador do Instituto
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#166534]/15 text-[#14532d] font-sans text-xs font-bold border border-[#166534]/30">
                <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-[#166534]">lock</span>
                {profile.firstPaidOn ? 'Primeira doação em ' + formatDate(profile.firstPaidOn) : 'Acesso restrito'}
              </span>
              <button type="button" disabled={busy} onClick={onLogout} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-60"><span className="material-symbols-outlined text-[16px]" aria-hidden="true">logout</span>Sair da minha conta</button>
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
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#b45309]/10 text-[#92400e] border-2 border-white ring-2 ring-slate-200 flex items-center justify-center font-serif text-3xl font-bold" aria-hidden="true">{initials}</div>
              </div>

              <div className="flex flex-col">
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 font-bold tracking-tight">
                  Olá, {profile.name}!
                </h1>
                <p className="font-sans text-sm sm:text-base text-slate-600 mt-2 leading-relaxed max-w-2xl">
                  Bem-vindo ao seu ambiente exclusivo de acompanhamento e transformação social no{' '}
                  <strong className="text-slate-900">Instituto Caminho e Forma</strong>. Aqui você acompanha suas contribuições, seus destinos e as informações vinculadas ao seu cadastro.
                </p>
                <p className="mt-3 break-all font-sans text-xs text-slate-600">{profile.email} · CPF com final {profile.documentSuffix}</p>
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
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                <span>Fazer Nova Doação Avulsa</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRefresh} disabled={busy}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-sans text-sm font-semibold px-5 py-3 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                type="button"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-slate-600">manage_accounts</span>
                <span>Atualizar minhas doações</span>
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
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">payments</span>
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl text-slate-900 font-bold tracking-tight">{money(profile.totalCents)}</div>
                <div className="flex items-center gap-1.5 mt-1.5 font-sans text-xs text-[#166534] font-medium">
                  <span aria-hidden="true" className="material-symbols-outlined text-[15px]">verified</span>
                  <span>Pagamentos confirmados no seu histórico</span>
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
                <span className="font-sans text-xs text-slate-500 uppercase tracking-wider font-bold">Projetos Apoiados</span>
                <div className="w-10 h-10 rounded-xl bg-[#166534]/10 flex items-center justify-center text-[#166534]">
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">diversity_1</span>
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl text-slate-900 font-bold tracking-tight">{destinations.length} {destinations.length === 1 ? 'projeto' : 'projetos'}</div>
                <div className="flex items-center gap-1.5 mt-1.5 font-sans text-xs text-slate-600">
                  <span aria-hidden="true" className="material-symbols-outlined text-[15px]">groups</span>
                  <span>Destinos das suas contribuições confirmadas</span>
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
                <span className="font-sans text-xs text-slate-500 uppercase tracking-wider font-bold">Contribuições Confirmadas</span>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">school</span>
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl text-slate-900 font-bold tracking-tight">{profile.donationCount} {profile.donationCount === 1 ? 'doação' : 'doações'}</div>
                <div className="flex items-center gap-1.5 mt-1.5 font-sans text-xs text-[#166534] font-medium">
                  <span aria-hidden="true" className="material-symbols-outlined text-[15px]">trending_up</span>
                  <span>Recebimentos vinculados ao seu cadastro</span>
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
                <span className="font-sans text-xs text-slate-500 uppercase tracking-wider font-bold">Última Doação</span>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">event_available</span>
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl text-slate-900 font-bold tracking-tight">{formatDate(profile.lastPaidOn)}</div>
                <div className="flex items-center gap-1.5 mt-1.5 font-sans text-xs text-slate-600">
                  <span aria-hidden="true" className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>Data do seu último pagamento confirmado</span>
                </div>
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
              onClick={onDownload} disabled={busy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-sans text-xs sm:text-sm font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-[#b45309]">receipt_long</span>
              <span>Baixar extrato CSV</span>
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
            className="lg:col-span-8 min-w-0 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <h3 className="font-serif text-lg sm:text-xl text-slate-900 font-bold">
                Últimos Lançamentos Registrados
              </h3>
              <span className="font-sans text-xs text-slate-500 flex items-center gap-1">
                <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-[#166534]">verified</span>
                Somente suas contribuições
              </span>
            </div>

            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Minhas contribuições" data-lenis-prevent>
              <table className="w-full min-w-[620px] text-left font-sans text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-4 rounded-l-xl">Data</th>
                    <th className="py-3 px-4">Finalidade / Projeto</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Extrato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">{profile.donations.map(record => {
 const paid = record.status === 'PAID' && record.paidCents >= record.amountCents;
 return <tr key={record.id}><td className="py-4 px-4 whitespace-nowrap">{formatDate(paid ? record.paidOn : record.createdAt)}</td><td className="py-4 px-4"><span className="font-semibold text-slate-900">{record.destinationTitle}</span><span className="mt-1 block text-xs text-slate-600">{paid ? 'Confirmada' : record.status === 'CANCELLED' ? 'Cancelada' : record.status === 'LATE' ? 'Vencida' : 'Aguardando confirmação'}</span><span className="mt-1 block max-w-[250px] break-all text-[11px] text-slate-500">{record.id}</span></td><td className="py-4 px-4">{record.method}</td><td className="py-4 px-4 whitespace-nowrap font-semibold tabular-nums">{money(paid ? record.paidCents : record.amountCents)}</td><td className="py-4 px-4 text-right"><button type="button" disabled={busy} onClick={() => onDownloadRecord(record)} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-xs font-semibold text-[#166534] hover:underline disabled:opacity-60" aria-label={'Baixar extrato da contribuição ' + record.id}><span className="material-symbols-outlined text-[18px]" aria-hidden="true">download</span>Baixar</button></td></tr>;
})}{profile.donations.length === 0 && <tr><td colSpan={5} className="py-8 px-4 text-center text-sm text-slate-600">Nenhuma contribuição vinculada ao seu cadastro.</td></tr>}</tbody>
              </table>
            </div>
            {profile.nextPage && <button type="button" onClick={onLoadMore} disabled={busy} className="mt-5 min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 disabled:opacity-60">Ver mais contribuições</button>}
            <p className="mt-5 text-xs leading-relaxed text-slate-600">O extrato contém apenas suas contribuições e não substitui um recibo emitido pelo Instituto.</p>
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
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">insights</span>
                <span>Seu Apoio, Seus Destinos</span>
              </div>
              <h3 className="font-serif text-xl text-slate-900 font-bold">
                Destinação das suas doações
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Os valores abaixo somam somente suas doações confirmadas em cada projeto, incluindo todas as páginas do seu histórico.
              </p>

              <div className="mt-6 flex flex-col gap-4">{destinations.map(destination => <div key={destination.destinationId ?? 'nao-identificado'} className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-[#166534]/15 text-[#166534] flex items-center justify-center shrink-0 mt-0.5"><span className="material-symbols-outlined text-[18px]" aria-hidden="true">volunteer_activism</span></div><div className="min-w-0 flex-1"><span className="font-sans text-xs sm:text-sm text-slate-900 font-bold block">{destination.title}</span><span className="font-sans text-sm text-[#166534] font-bold block mt-1 tabular-nums">{money(destination.paidCents)}</span><span className="font-sans text-xs text-slate-600 block mt-1">{destination.donationCount} {destination.donationCount === 1 ? 'contribuição confirmada' : 'contribuições confirmadas'}</span></div></div>)}</div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-200"><div className="flex justify-between font-sans text-xs text-slate-600"><span>Total contribuído por você</span><strong className="text-[#166534] tabular-nums">{money(profile.totalCents)}</strong></div><p className="mt-3 text-xs leading-relaxed text-slate-600">O destino original da sua doação permanece registrado. Realocações posteriores são acompanhadas pela equipe na prestação de contas.</p></div>
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
            Acompanhe as informações de formação e os projetos ligados às suas contribuições.
          </p>
        </div>

        <div className="mb-12"><div className="flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-[#166534] text-[24px]" aria-hidden="true">play_circle</span><h3 className="font-serif text-xl text-slate-900 font-bold">Meus Cursos em Andamento</h3></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs"><span className="material-symbols-outlined text-[#166534] text-[28px]" aria-hidden="true">school</span><h4 className="mt-3 font-serif text-lg text-slate-900 font-bold">Suas inscrições e formações</h4><p className="mt-2 font-sans text-sm text-slate-600 leading-relaxed">Quando houver inscrições e informações de progresso vinculadas ao seu cadastro, elas serão exibidas neste espaço.</p></div><div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs"><span className="material-symbols-outlined text-[#b45309] text-[28px]" aria-hidden="true">volunteer_activism</span><h4 className="mt-3 font-serif text-lg text-slate-900 font-bold">Seu apoio aos cursos EAD</h4><p className="mt-2 font-serif text-2xl text-[#166534] font-bold tabular-nums">{money(educationTotal)}</p><p className="mt-2 font-sans text-sm text-slate-600 leading-relaxed">Valor das suas doações confirmadas destinadas aos cursos EAD. Uma doação não corresponde a uma matrícula.</p></div></div></div>
        <div><div className="flex items-center gap-2 mb-6"><span className="material-symbols-outlined text-[#b45309] text-[24px]" aria-hidden="true">volunteer_activism</span><h3 className="font-serif text-xl text-slate-900 font-bold">Projetos que Você Apoia</h3></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{destinations.map(destination => {
 const project = PROJECTS.find(item => item.id === destination.destinationId);
 return <motion.article key={destination.destinationId ?? 'nao-identificado'} whileHover={{y: -4}} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs flex flex-col"><div className="relative h-44 overflow-hidden bg-slate-50"><img src={project?.image ?? '/logo-emblema.svg'} alt={project ? project.title : 'Instituto Caminho e Forma'} className={project ? 'h-full w-full object-cover' : 'h-full w-full object-contain p-7'} /></div><div className="p-5 sm:p-6 flex flex-col flex-1 justify-between"><div><h4 className="font-serif text-lg text-slate-900 font-bold leading-snug">{destination.title}</h4><p className="mt-2 text-sm text-slate-600">Suas contribuições confirmadas para este destino.</p></div><div className="mt-6 pt-4 border-t border-slate-100"><div className="flex flex-wrap items-baseline justify-between gap-2"><span className="font-sans text-xs text-slate-500">Seu apoio:</span><span className="font-serif text-xl text-[#b45309] font-bold tabular-nums">{money(destination.paidCents)}</span></div>{project && <a href={'/projetos/' + project.id} className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-sans text-sm font-semibold text-[#166534] hover:underline">Conhecer o projeto<span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span></a>}</div></div></motion.article>;
})}</div></div>
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
              <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-[#b45309]">pin_drop</span>
              <span>Sede Itaguaí / RJ &amp; Salas Virtuais</span>
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><span className="material-symbols-outlined text-[#166534] text-[28px]" aria-hidden="true">event_available</span><p className="mt-3 font-sans text-sm text-slate-600 leading-relaxed">Os encontros e convites vinculados ao seu cadastro serão exibidos aqui quando estiverem disponíveis.</p></div>
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
              <span aria-hidden="true" className="material-symbols-outlined text-[#166534] text-[18px]">stars</span>
              <span>Status: <strong>Consulte seus benefícios</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[
 {icon: 'local_mall', title: 'Benefícios na Feira', text: 'Cupons e benefícios vinculados ao seu cadastro serão apresentados neste espaço.'},
 {icon: 'mail', title: 'Cartas e Relatórios', text: 'Seus documentos e comunicações individuais serão exibidos aqui quando disponibilizados.'},
 {icon: 'notifications_active', title: 'Oficinas e Atividades', text: 'Informações de inscrições e acessos vinculados ao seu cadastro aparecerão aqui.'},
].map(item => <div key={item.title} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between"><div className="flex flex-col gap-3"><div className="w-12 h-12 rounded-xl bg-[#b45309]/15 text-[#b45309] flex items-center justify-center"><span className="material-symbols-outlined text-[28px]" aria-hidden="true">{item.icon}</span></div><h4 className="font-serif text-lg text-slate-900 font-bold">{item.title}</h4><p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">{item.text}</p></div><p className="mt-5 pt-3 border-t border-slate-200 font-sans text-xs text-slate-500">Ainda não disponível no seu portal</p></div>)}<div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between"><div className="flex flex-col gap-3"><div className="w-12 h-12 rounded-xl bg-[#25D366]/15 text-[#166534] flex items-center justify-center"><WhatsAppIcon className="w-7 h-7 text-[#166534]" /></div><h4 className="font-serif text-lg text-slate-900 font-bold">Atendimento ao Apoiador</h4><p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">Converse com a equipe sobre seu acesso, suas contribuições ou seus comprovantes.</p></div><div className="mt-5 pt-3 border-t border-slate-200 font-sans text-xs"><a href="https://wa.me/5521987428647" target="_blank" rel="noopener noreferrer" className="text-[#166534] hover:underline font-bold inline-flex min-h-11 items-center gap-1">Falar com a Coordenação<span className="material-symbols-outlined text-[14px]" aria-hidden="true">open_in_new</span></a></div></div></div>
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
              Precisa de ajuda com sua doação?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Nossa equipe pode ajudar com seu acesso, conferir as informações das suas contribuições e orientar sobre a emissão de comprovantes.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:shrink-0">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-sans text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
              href="mailto:institutocaminhoeforma@gmail.com"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">mail</span>
              <span className="min-w-0 break-all">institutocaminhoeforma@gmail.com</span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#166534] hover:bg-[#14532d] text-white font-sans text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer"
              href="tel:+5521987428647"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">call</span>
              <span>(21) 98742-8647</span>
            </motion.a>
          </div>
        </div>
      </motion.section>


 </div>;
}

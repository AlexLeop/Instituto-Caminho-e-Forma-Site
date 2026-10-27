import React, { useState } from 'react';
import { DONATION_TOTALS, formatDonationAmount } from '../data/donations';

interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransparencyModal: React.FC<TransparencyModalProps> = ({ isOpen, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (docName: string) => {
    setDownloadSuccess(docName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3 text-[#166534]">
            <span className="material-symbols-outlined text-[28px] text-[#166534]">verified_user</span>
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                Portal da Transparência &amp; Governança
              </h3>
              <p className="font-sans text-xs text-slate-500">
                Auditoria independente, conformidade com os ODS e prestação pública de contas
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-[#166534]">
            <span className="material-symbols-outlined text-[18px]">download_done</span>
            <span>Download iniciado: {downloadSuccess} (demonstrativo certificado)</span>
          </div>
        )}

        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
            <p>Total de doações recebidas: <strong>{formatDonationAmount(DONATION_TOTALS.totalCents)}</strong></p>
            <p className="mt-1">Fundo geral do Instituto: {formatDonationAmount(DONATION_TOTALS.generalFundCents)}.</p>
          </div>
          {/* Key Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <span className="font-serif text-2xl font-bold text-[#166534] block">100%</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Auditoria Externa</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <span className="font-serif text-2xl font-bold text-[#b45309] block">0%</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Atividade Fim</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <span className="font-serif text-2xl font-bold text-slate-600 block">0%</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Administrativo</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <span className="font-serif text-2xl font-bold text-[#166534] block">Selo A+</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Instituto Doar</span>
            </div>
          </div>

          {/* Legal Registrations */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Razão Social:</span>
              <span>Instituto Caminho e Forma de Ação Comunitária e Cidadania</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">CNPJ:</span>
              <span>18.360.956/0001-60</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Qualificação:</span>
              <span>OSCIP (Ministério da Justiça) e Certificação CEBAS</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Registro Municipal CMDCA / FIA:</span>
              <span>Processo nº 4892/2016 - Itaguaí / RJ</span>
            </div>
          </div>

          {/* Downloadable Documents */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#b45309]">description</span>
              <span>Relatórios Anuais e Pareceres dos Auditores</span>
            </h4>
            <div className="space-y-2">
              {[
                { title: 'Demonstrações Contábeis & Balancete Patrimonial 2026 (Auditado por BDO)', size: '3.6 MB', date: 'Mar/2026' },
                { title: 'Relatório de Impacto Social & Indicadores ODS 2026', size: '5.8 MB', date: 'Fev/2026' },
                { title: 'Parecer do Conselho Fiscal e Aprovação de Contas 2026', size: '1.4 MB', date: 'Jan/2026' },
                { title: 'Estatuto Social Consolidado & Atas de Eleição da Diretoria (2026-2029)', size: '920 KB', date: 'Vigente 2026' },
              ].map((doc, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="material-symbols-outlined text-red-700 text-[22px] shrink-0">picture_as_pdf</span>
                    <div className="min-w-0">
                      <p className="font-serif text-xs font-bold text-slate-900 truncate">{doc.title}</p>
                      <span className="text-[11px] text-slate-500">{doc.size} • {doc.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(doc.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#166534] hover:bg-emerald-50 transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Baixar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ODS Goals */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <h5 className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-1">
              Conformidade com os Objetivos de Desenvolvimento Sustentável (ODS)
            </h5>
            <p className="font-sans text-xs text-[#166534] leading-relaxed">
              O Instituto Caminho e Forma atua em conformidade com o <strong>ODS 1 (Erradicação da Pobreza)</strong>, <strong>ODS 2 (Fome Zero e Agricultura Sustentável)</strong>, <strong>ODS 4 (Educação de Qualidade)</strong>, <strong>ODS 8 (Trabalho Decente e Crescimento Econômico)</strong> e <strong>ODS 10 (Redução das Desigualdades)</strong>.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-200 transition-colors cursor-pointer"
          >
            Fechar Portal
          </button>
        </div>
      </div>
    </div>
  );
};

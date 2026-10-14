import React, { useState } from 'react';
import { motion } from 'motion/react';

interface PartnersViewProps {
  onOpenTransparency: () => void;
  onOpenVolunteer: (type: 'teach' | 'sponsor') => void;
}

export const PartnersView: React.FC<PartnersViewProps> = ({ onOpenTransparency, onOpenVolunteer }) => {
  const [profitEstimate, setProfitEstimate] = useState<string>('500000');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [interestType, setInterestType] = useState('Incentivo Fiscal (FIA / Fundo do Idoso)');
  const [submitted, setSubmitted] = useState(false);

  const parsedProfit = parseFloat(profitEstimate) || 0;
  const estimatedTaxDeduction = parsedProfit * 0.01;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            Sua Empresa Como Agente de Transformação
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-base sm:text-lg lg:text-xl text-[#57534e] leading-relaxed max-w-2xl mx-auto"
          >
            Conectamos marcas a projetos auditados de impacto social com métricas ESG tangíveis, relatórios de governança e destinação de incentivos fiscais.
          </motion.p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenVolunteer('sponsor')}
              className="px-7 py-3.5 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-base font-semibold shadow-md transition-all cursor-pointer"
            >
              Apadrinhar uma Turma
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenTransparency}
              className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#f0ece4] border border-[#e7e2da] text-[#166534] font-sans text-base font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span>Dossiê de Transparência Fiscal</span>
            </motion.button>
          </div>
          </div>
        </div>
      </section>

      {/* Main Content & Simulator */}
      <section className="w-full bg-[#fbf9f5] py-16 border-b border-[#e7e2da]">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="space-y-3">
              <span className="font-sans text-xs uppercase text-[#b45309] font-bold tracking-wider">
                Vantagens &amp; Modalidades de Parceria
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1c1917] font-bold">
                Modelos Flexíveis Adaptados à Sua Estratégia de Sustentabilidade
              </h2>
            </div>

            <div className="space-y-4">
              <motion.div 
                whileHover={{ y: -4 }}
                className="p-6 bg-white rounded-2xl border border-[#e7e2da] shadow-xs flex items-start gap-4 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#166534]/15 flex items-center justify-center text-[#166534] shrink-0">
                  <span className="material-symbols-outlined text-[30px]">account_balance</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#1c1917] font-bold">1% do IRPJ Sem Custo Adicional</h3>
                  <p className="font-sans text-sm text-[#57534e] mt-1 leading-relaxed">
                    Empresas tributadas pelo Lucro Real podem destinar até 1% do seu imposto de renda devido diretamente para os projetos aprovados no CMDCA / FIA. O valor é 100% abatido no tributo.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="p-6 bg-white rounded-2xl border border-[#e7e2da] shadow-xs flex items-start gap-4 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#b45309]/15 flex items-center justify-center text-[#b45309] shrink-0">
                  <span className="material-symbols-outlined text-[30px]">groups</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#1c1917] font-bold">Voluntariado Corporativo Estruturado</h3>
                  <p className="font-sans text-sm text-[#57534e] mt-1 leading-relaxed">
                    Programas sob medida para seus colaboradores realizarem mentoria de carreira, oficinas de programação, simulação de dinâmicas e mutirões em Itaguaí.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="p-6 bg-white rounded-2xl border border-[#e7e2da] shadow-xs flex items-start gap-4 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#ede7dc] flex items-center justify-center text-[#1c1917] shrink-0">
                  <span className="material-symbols-outlined text-[30px]">workspace_premium</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#1c1917] font-bold">Relatórios Bimestrais de Impacto ESG</h3>
                  <p className="font-sans text-sm text-[#57534e] mt-1 leading-relaxed">
                    Fornecemos métricas estruturadas nos padrões GRI e SASB, com banco de fotos documentais e depoimentos para compor o Relatório Integrado de Sustentabilidade da sua empresa.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Simulator Box */}
            <div className="p-7 bg-[#f5f1ea] border border-[#e7e2da] rounded-3xl">
              <div className="flex items-center gap-2 text-[#b45309] mb-2 font-bold">
                <span className="material-symbols-outlined text-[24px]">calculate</span>
                <span className="font-sans text-xs uppercase tracking-wider font-bold">
                  Calculadora de Potencial de Incentivo Fiscal
                </span>
              </div>
              <p className="font-sans text-sm text-[#57534e] mb-4 leading-relaxed">
                Simule quanto sua empresa pode destinar via FIA (Fundo da Infância e da Adolescência) deduzindo integralmente do Imposto de Renda:
              </p>

              <div className="space-y-4">
                <label className="block font-sans text-xs font-semibold text-[#1c1917]">
                  Estimativa de Lucro Real Anual da Empresa (R$):
                </label>
                <input
                  type="number"
                  value={profitEstimate}
                  onChange={(e) => setProfitEstimate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#e7e2da] text-[#1c1917] font-serif text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                  step="50000"
                />

                <div className="p-5 bg-white rounded-2xl border border-[#e7e2da] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#78716c] block">Incentivo Estimado (1% do IRPJ)</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#b45309]">
                      R$ {estimatedTaxDeduction.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span className="text-xs text-[#166534] font-bold bg-[#166534]/15 px-3 py-1.5 rounded-xl text-center">
                    Custo zero para a empresa
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-5 bg-white p-7 sm:p-9 rounded-3xl border border-[#e7e2da] shadow-sm flex flex-col justify-between">
            <div>
              <span className="font-sans text-xs text-[#166534] font-bold uppercase tracking-wider">
                Atendimento Executivo
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1c1917] font-bold mb-2">
                Conecte Sua Marca ao Instituto Caminho e Forma
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#57534e] mb-6 leading-relaxed">
                Nossa diretoria de parcerias e compliance agendará uma reunião executiva com apresentação técnica e visitas guiadas aos polos de Itaguaí.
              </p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-[#166534]/15 border border-[#166534]/30 rounded-2xl text-center flex flex-col items-center gap-3 my-auto"
              >
                <span className="material-symbols-outlined text-[48px] text-[#166534]">check_circle</span>
                <h4 className="font-serif text-lg text-[#166534] font-bold">Solicitação Recebida com Sucesso!</h4>
                <p className="font-sans text-xs text-[#1c1917]">
                  Nossa assessoria ESG entrará em contato com os responsáveis da {companyName || 'sua empresa'} em até 1 dia útil.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-sans text-xs font-semibold text-[#1c1917] mb-1">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Razão Social ou Nome Fantasia"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f5f1ea] text-[#1c1917] font-sans text-sm border border-[#e7e2da] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-[#1c1917] mb-1">
                      Nome do Representante
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f5f1ea] text-[#1c1917] font-sans text-sm border border-[#e7e2da] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-[#1c1917] mb-1">
                      Telefone Corporativo
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(21) 90000-0000"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f5f1ea] text-[#1c1917] font-sans text-sm border border-[#e7e2da] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-[#1c1917] mb-1">
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="diretoria@empresa.com.br"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f5f1ea] text-[#1c1917] font-sans text-sm border border-[#e7e2da] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-[#1c1917] mb-1">
                    Interesse Principal
                  </label>
                  <select
                    value={interestType}
                    onChange={(e) => setInterestType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f5f1ea] text-[#1c1917] font-sans text-sm border border-[#e7e2da] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                  >
                    <option value="Incentivo Fiscal (FIA / Fundo do Idoso)">Destinação de Imposto de Renda (FIA / Idoso)</option>
                    <option value="Apadrinhamento de Sala ou Curso">Apadrinhamento de Turma / Sala Técnica</option>
                    <option value="Voluntariado Corporativo para Colaboradores">Voluntariado Corporativo e Mentoria</option>
                    <option value="Doação de Equipamentos ou Alimentos">Doação de Máquinas, TI ou Insumos</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Solicitar Reunião de Parceria</span>
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

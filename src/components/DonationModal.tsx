import React, { useState } from 'react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject?: string;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, initialProject }) => {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<'single' | 'monthly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [project, setProject] = useState<string>(initialProject || 'geral');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorCpf, setDonorCpf] = useState<string>('');
  const [wantsTaxReceipt, setWantsTaxReceipt] = useState<boolean>(true);
  const [status, setStatus] = useState<'form' | 'processing' | 'confirmed'>('form');
  const [pixCopied, setPixCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const presetAmounts = [30, 50, 100, 250];

  const effectiveAmount = isCustom ? (parseFloat(customAmount) || 0) : amount;

  const handleSelectPreset = (val: number) => {
    setIsCustom(false);
    setAmount(val);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(true);
    setCustomAmount(e.target.value);
  };

  const pixKey = '00020126580014br.gov.bcb.pix013612345678000190520400005303986540' + 
    effectiveAmount.toFixed(2).replace('.', '') + '5802BR5925INSTITUTO FUTURO BRASIL6009SAO PAULO62070503***6304';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0) return;

    setStatus('processing');
    setTimeout(() => {
      setStatus('confirmed');
    }, 1200);
  };

  const resetAndClose = () => {
    setStatus('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#fbf9f5] text-[#1c1917] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 border border-[#e7e2da]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e7e2da]">
          <div className="flex items-center gap-2.5 text-[#b45309]">
            <span className="material-symbols-outlined text-[26px] text-[#b45309]">favorite</span>
            <span className="font-serif text-2xl text-[#1c1917] font-bold tracking-tight">
              Apoie o Instituto
            </span>
          </div>
          <button 
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full bg-[#f5f1ea] hover:bg-[#e7e2da] flex items-center justify-center text-[#1c1917] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {status === 'confirmed' ? (
          <div className="py-6 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1c1917]">
                Muito Obrigado, {donorName || 'Apoiador'}!
              </h3>
              <p className="font-sans text-sm text-[#57534e] mt-2">
                Sua contribuição de <strong className="text-[#166534]">R$ {effectiveAmount.toFixed(2)}</strong> ({frequency === 'monthly' ? 'mensal' : 'única'}) foi registrada com sucesso!
              </p>
              <p className="font-sans text-xs text-[#78716c] mt-1">
                O recibo oficial para dedução no Imposto de Renda (OSCIP/FIA) foi enviado para <strong>{donorEmail || 'seu e-mail'}</strong>.
              </p>
            </div>

            <div className="bg-[#f5f1ea] p-4 rounded-2xl w-full text-left font-sans text-sm text-[#57534e] border border-[#e7e2da]">
              <div className="flex justify-between py-1.5 border-b border-[#e7e2da]">
                <span>Destinação:</span>
                <strong className="text-[#1c1917] capitalize">{project === 'geral' ? 'Fundo Geral Emergencial' : project}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#e7e2da]">
                <span>Forma:</span>
                <strong className="text-[#1c1917] uppercase">{paymentMethod}</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Transparência:</span>
                <span className="text-[#166534] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> 100% Auditado
                </span>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-full py-3.5 bg-[#b45309] hover:bg-[#92400e] text-white font-bold rounded-xl transition-all shadow-sm"
            >
              Concluir &amp; Voltar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
            {/* Frequency Toggle */}
            <div className="grid grid-cols-2 p-1 bg-[#f5f1ea] border border-[#e7e2da] rounded-xl text-sm">
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`py-2 rounded-lg transition-all font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  frequency === 'monthly'
                    ? 'bg-white text-[#1c1917] shadow-sm font-bold border border-[#e7e2da]'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#b45309]">cached</span>
                <span>Doação Mensal</span>
              </button>
              <button
                type="button"
                onClick={() => setFrequency('single')}
                className={`py-2 rounded-lg transition-all font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  frequency === 'single'
                    ? 'bg-white text-[#1c1917] shadow-sm font-bold border border-[#e7e2da]'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#166534]">favorite</span>
                <span>Doação Única</span>
              </button>
            </div>

            {/* Presets Grid */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
                Escolha o valor do seu impacto
              </label>
              <div className="grid grid-cols-4 gap-2">
                {presetAmounts.map((val) => {
                  const selected = !isCustom && amount === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelectPreset(val)}
                      className={`py-2.5 rounded-xl text-sm transition-all cursor-pointer border ${
                        selected
                          ? 'bg-[#b45309] text-white border-[#b45309] font-bold shadow-xs'
                          : 'bg-white text-[#1c1917] border-[#e7e2da] hover:bg-[#f5f1ea]'
                      }`}
                    >
                      R$ {val}
                    </button>
                  );
                })}
              </div>

              {/* Custom amount */}
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-[#78716c]">R$</span>
                <input
                  type="number"
                  placeholder="Outro valor (ex: 75,00)"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl bg-white text-[#1c1917] text-sm border focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 ${
                    isCustom ? 'border-[#b45309] ring-2 ring-[#b45309]/20 font-bold' : 'border-[#e7e2da]'
                  }`}
                  min="5"
                />
              </div>
            </div>

            {/* Project designation */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
                Destinar para um projeto específico
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white text-[#1c1917] text-sm border border-[#e7e2da] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
              >
                <option value="geral">Fundo Geral de Acolhimento Comunitário</option>
                <option value="Educação do Amanhã">Educação do Amanhã (Letramento e TI Infantil)</option>
                <option value="Mesa Farta & Nutrição Solidária">Mesa Farta &amp; Nutrição Solidária</option>
                <option value="Costurando Autonomia Feminina">Costurando Autonomia Feminina (Mães Solos)</option>
                <option value="Hortas Urbanas e Agroecologia">Hortas Urbanas e Pomar Agroecológico</option>
              </select>
            </div>

            {/* Donor basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#78716c]">Seu Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white text-[#1c1917] placeholder:text-[#a8a29e] text-sm border border-[#e7e2da] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#78716c]">Seu E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="Para envio do recibo"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white text-[#1c1917] placeholder:text-[#a8a29e] text-sm border border-[#e7e2da] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'bg-emerald-50 border-[#166534] text-[#166534] font-bold shadow-xs'
                      : 'bg-white border-[#e7e2da] text-[#78716c] hover:bg-[#f5f1ea]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                  <span>PIX Instantâneo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-amber-50 border-[#b45309] text-[#b45309] font-bold shadow-xs'
                      : 'bg-white border-[#e7e2da] text-[#78716c] hover:bg-[#f5f1ea]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  <span>Cartão de Crédito</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('boleto')}
                  className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    paymentMethod === 'boleto'
                      ? 'bg-[#f5f1ea] border-stone-600 text-[#1c1917] font-bold shadow-xs'
                      : 'bg-white border-[#e7e2da] text-[#78716c] hover:bg-[#f5f1ea]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">receipt</span>
                  <span>Boleto Bancário</span>
                </button>
              </div>
            </div>

            {/* Payment Details Section */}
            {paymentMethod === 'pix' && (
              <div className="p-3 bg-[#f5f1ea] rounded-2xl flex flex-col items-center text-center gap-2 border border-[#e7e2da]">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-[#e7e2da]">
                  {/* Visual QR Code Representation */}
                  <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="30" height="30" fill="#1c1917" />
                    <rect x="15" y="15" width="20" height="20" fill="white" />
                    <rect x="20" y="20" width="10" height="10" fill="#1c1917" />
                    <rect x="60" y="10" width="30" height="30" fill="#1c1917" />
                    <rect x="65" y="15" width="20" height="20" fill="white" />
                    <rect x="70" y="20" width="10" height="10" fill="#1c1917" />
                    <rect x="10" y="60" width="30" height="30" fill="#1c1917" />
                    <rect x="15" y="65" width="20" height="20" fill="white" />
                    <rect x="20" y="70" width="10" height="10" fill="#1c1917" />
                    <rect x="50" y="50" width="15" height="15" fill="#166534" />
                    <rect x="70" y="60" width="20" height="10" fill="#1c1917" />
                    <rect x="55" y="75" width="15" height="15" fill="#1c1917" />
                    <rect x="75" y="75" width="15" height="15" fill="#1c1917" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="w-full py-2 bg-white hover:bg-[#f5f1ea] border border-[#e7e2da] rounded-xl text-xs font-bold text-[#1c1917] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>{pixCopied ? 'Chave Copiada com Sucesso!' : 'Copiar Código Pix Copia e Cola'}</span>
                </button>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="flex flex-col gap-2 p-3 bg-[#f5f1ea] rounded-2xl border border-[#e7e2da]">
                <input
                  type="text"
                  placeholder="Número do Cartão (0000 0000 0000 0000)"
                  className="w-full px-3 py-2 rounded-xl bg-white text-[#1c1917] text-sm border border-[#e7e2da]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Validade (MM/AA)"
                    className="w-full px-3 py-2 rounded-xl bg-white text-[#1c1917] text-sm border border-[#e7e2da]"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full px-3 py-2 rounded-xl bg-white text-[#1c1917] text-sm border border-[#e7e2da]"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'boleto' && (
              <div className="p-3 bg-[#f5f1ea] rounded-2xl text-center border border-[#e7e2da] text-xs text-[#57534e]">
                <p>O boleto bancário será gerado e enviado para o seu e-mail com vencimento para 3 dias úteis.</p>
              </div>
            )}

            {/* Tax receipt toggle */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={wantsTaxReceipt}
                onChange={(e) => setWantsTaxReceipt(e.target.checked)}
                className="mt-1 accent-[#166534] w-4 h-4 rounded"
              />
              <span className="text-xs text-[#57534e]">
                Desejo recibo fiscal oficial com CNPJ para fins de dedução em Imposto de Renda (FIA / Fundo do Idoso).
              </span>
            </label>

            {/* Action Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#b45309] hover:bg-[#92400e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              <span>
                Confirmar Doação de R$ {effectiveAmount.toFixed(2)}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

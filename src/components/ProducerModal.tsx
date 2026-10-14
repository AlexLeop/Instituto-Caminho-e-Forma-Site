import React, { useState } from 'react';

interface ProducerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProducerModal: React.FC<ProducerModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [productType, setProductType] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2d3133]/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-[#191c1e] rounded-2xl max-w-lg w-full p-5 sm:p-7 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 border border-[#e6e8ea]">
        <div className="flex items-center justify-between pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-2 text-[#006c49]">
            <span className="material-symbols-outlined text-[24px]">store</span>
            <span className="font-headline-sm text-headline-sm text-[#191c1e] font-bold">
              Cadastro de Empreendedor Comunitário
            </span>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] flex items-center justify-center text-[#191c1e] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-6 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#6cf8bb]/30 text-[#006c49] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-[#191c1e]">
                Cadastro Enviado com Sucesso!
              </h3>
              <p className="font-body-md text-body-md text-[#534434] mt-2">
                Obrigado, <strong>{name}</strong>! Nossa equipe da Incubadora de Negócios Sociais entrará em contato em até 48 horas úteis para agendar a sessão fotográfica gratuita dos seus produtos.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-[#006c49] hover:bg-[#00714d] text-white font-label-lg text-label-lg rounded-xl transition-all font-bold"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-3">
            <p className="font-body-sm text-body-sm text-[#534434]">
              Preencha suas informações para que nossa equipe de apoio pedagógico e comercial entre em contato para agendar sua mentoria de precificação justa e fotografar seus produtos gratuitamente.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-label-sm text-label-sm font-semibold text-[#191c1e] mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome do produtor / artesão"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-body-sm text-body-sm border border-[#e0e3e5] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm font-semibold text-[#191c1e] mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(21) 98742-8647"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-body-sm text-body-sm border border-[#e0e3e5] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm font-semibold text-[#191c1e] mb-1">
                    Bairro / Comunidade
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Bairro da Esperança"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-body-sm text-body-sm border border-[#e0e3e5] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-semibold text-[#191c1e] mb-1">
                  O que você produz ou quer comercializar?
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Panos de prato bordados, pães doces artesanais, biojoias de sementes, geleias..."
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-body-sm text-body-sm border border-[#e0e3e5] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/2 py-2.5 rounded-xl bg-[#e6e8ea] text-[#191c1e] font-label-md text-label-md hover:bg-[#d8dadc] transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-[#006c49] hover:bg-[#00714d] text-white font-label-lg text-label-lg font-bold shadow-sm transition-all"
              >
                Enviar Cadastro
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

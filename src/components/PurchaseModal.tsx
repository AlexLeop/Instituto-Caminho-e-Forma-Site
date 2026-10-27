import React, { useState } from 'react';
import { MarketProduct } from '../types';
import { WhatsAppIcon } from './SocialIcons';

interface PurchaseModalProps {
  product: MarketProduct | null;
  onClose: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, onClose }) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá, Instituto Caminho e Forma! Meu nome é ${buyerName} e tenho interesse em apoiar comprando o produto: "${product.title}" (${product.priceFormatted}), feito por ${product.producer}. Forma de entrega: ${deliveryMethod === 'pickup' ? 'Retirada na sede' : 'Ciclo-entrega solidária'}.`
    );
    window.open(`https://wa.me/5521987428647?text=${text}`, '_blank');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5 text-[#b45309]">
            <span className="material-symbols-outlined text-[26px]">shopping_cart_checkout</span>
            <span className="font-serif text-2xl text-slate-900 font-bold tracking-tight">
              Finalizar Compra Solidária
            </span>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-6 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Pedido Preparado, {buyerName}!
              </h3>
              <p className="font-sans text-sm text-slate-600 mt-2">
                Você está apoiando diretamente a família de <strong>{product.producer}</strong> com <strong>{product.priceFormatted}</strong> (100% de repasse direto).
              </p>
              <p className="font-sans text-xs text-slate-500 mt-2">
                Conclua a confirmação diretamente pelo nosso canal no WhatsApp para receber a chave Pix do produtor e agendar sua entrega.
              </p>
            </div>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" />
              <span>Abrir WhatsApp &amp; Concluir Pedido</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3.5 border border-slate-200">
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-[#166534] block truncate">
                  {product.categoryTag}
                </span>
                <h4 className="font-serif text-base font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">
                  {product.title}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">
                    {product.producer}
                  </span>
                  <strong className="text-[#b45309] font-bold text-base">
                    {product.priceFormatted}
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl flex items-start gap-2.5 border border-emerald-200">
              <span className="material-symbols-outlined text-[#166534] text-[20px] shrink-0 mt-0.5">verified</span>
              <p className="font-sans text-xs text-[#166534] leading-relaxed">
                <strong>100% do valor vai para quem produz:</strong> O Instituto Caminho e Forma cede a plataforma gratuitamente e não retém nenhuma taxa de intermediação.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Seu Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Como deseja ser chamado?"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Seu WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(21) 98742-8647"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Preferência de Entrega
                </label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value as 'pickup' | 'delivery')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                >
                  <option value="pickup">Retirada grátis na sede (Rua Solidariedade, 120)</option>
                  <option value="delivery">Ciclo-entrega solidária em domicílio (valor repassado ao ciclista)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/2 py-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors font-semibold text-sm cursor-pointer border border-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Apoiar via WhatsApp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

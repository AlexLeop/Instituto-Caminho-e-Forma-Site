import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './SocialIcons';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber = '5521987428647',
  defaultMessage = 'Olá! Gostaria de informações sobre as ações e projetos do Instituto Caminho e Forma.',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pointer-events-none select-none">
      {/* Tooltip / Balão discreto de chamada */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto hidden sm:flex items-center gap-2 bg-[#1c1917] text-white px-3.5 py-2 rounded-xl shadow-xl border border-white/10"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="font-sans text-xs font-bold leading-tight">Fale com o Instituto</span>
              <span className="font-sans text-[11px] text-[#a8a29e] leading-tight">WhatsApp: (21) 98742-8647</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Flutuante Principal */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atendimento via WhatsApp do Instituto Caminho e Forma: (21) 98742-8647"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="pointer-events-auto relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-colors cursor-pointer group focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Glow / Pulse suave */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none group-hover:hidden" />

        {/* Ícone Oficial WhatsApp */}
        <WhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9 text-white filter drop-shadow-sm transition-transform group-hover:scale-105" />

        {/* Ponto de status online */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full shadow-xs" />
      </motion.a>
    </div>
  );
};

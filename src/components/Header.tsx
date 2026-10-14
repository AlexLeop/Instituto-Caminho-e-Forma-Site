import React, { useState, useEffect } from 'react';
import { NavPage } from '../types';
import { InstituteLogo } from './InstituteLogo';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon, InstagramIcon } from './SocialIcons';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenDonation: () => void;
  onOpenTransparency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenDonation,
  onOpenTransparency
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: NavPage }[] = [
    { label: 'Início', page: 'inicio' },
    { label: 'Projetos', page: 'projetos' },
    { label: 'Cursos e Capacitação', page: 'cursos-e-capacitacao' },
    { label: 'Feira Virtual', page: 'feira-virtual' },
    { label: 'Seja Parceiro', page: 'seja-parceiro' },
    { label: 'Transparência', page: 'transparencia' },
    { label: 'Contato', page: 'contato' },
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Somente a barra de navegação principal (2) fica transparente na Hero da página inicial.
  // Conforme o scroll na Hero (0 a 460px), o fundo transiciona suavemente de 0% para 100% sólido.
  // Todos os conteúdos (logo, links, botões) mantêm 100% de opacidade.
  const isHeroPage = currentPage === 'inicio';
  const heroThreshold = 460;
  const scrollRatio = isHeroPage ? Math.min(1, Math.max(0, scrollY / heroThreshold)) : 1;
  const isTransparent = isHeroPage && scrollRatio < 0.45;

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Barra de Navegação Principal - Fica 100% transparente na Hero e ganha fundo no scroll */}
      <div 
        style={{
          backgroundColor: isHeroPage ? `rgba(251, 249, 245, ${scrollRatio})` : '#fbf9f5',
          backdropFilter: isHeroPage && scrollRatio > 0.05 ? `blur(${Math.min(16, scrollRatio * 16)}px)` : (isHeroPage ? 'none' : 'blur(16px)'),
          WebkitBackdropFilter: isHeroPage && scrollRatio > 0.05 ? `blur(${Math.min(16, scrollRatio * 16)}px)` : (isHeroPage ? 'none' : 'blur(16px)'),
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: isHeroPage ? `rgba(231, 226, 218, ${scrollRatio})` : '#e7e2da',
          boxShadow: isHeroPage 
            ? (scrollRatio > 0.1 ? `0 4px 20px -2px rgba(28, 25, 23, ${scrollRatio * 0.08})` : 'none')
            : '0 4px 20px -2px rgba(28, 25, 23, 0.04)',
        }}
        className="transition-[border-color,box-shadow] duration-200"
      >
        <div className="h-14 sm:h-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('inicio')}
            className="flex items-center text-left group cursor-pointer focus:outline-none shrink-0"
            aria-label="Instituto Caminho e Forma - Início"
          >
            <InstituteLogo size="md" variant="horizontal" theme={isTransparent ? 'white' : 'dark'} />
          </button>

          {/* Desktop Navigation Links - Nunca quebram linha */}
          <nav className="hidden xl:flex items-center flex-nowrap gap-0.5 lg:gap-1 p-0.5 shrink-0">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`relative px-2.5 py-1.5 rounded-lg font-sans text-xs lg:text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? isTransparent
                        ? 'bg-white/20 text-white font-bold backdrop-blur-sm'
                        : 'bg-[#b45309]/10 text-[#b45309] font-bold'
                      : isTransparent
                        ? 'text-white/90 hover:text-white hover:bg-white/10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                        : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f1ea]'
                  }`}
                >
                  {item.label}
                  {isActive && !isTransparent && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#b45309] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Botão Portal do Apoiador ao lado do Apoie o Instituto */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Botão Portal do Apoiador (exibido ao lado do botão Apoie o Instituto) */}
            <button 
              type="button"
              onClick={() => handleNavClick('portal-do-apoiador')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-sans text-xs sm:text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                currentPage === 'portal-do-apoiador'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : isTransparent
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm shadow-xs'
                    : 'bg-[#ede7dc]/80 hover:bg-[#ede7dc] text-[#1c1917] border border-[#d6cec2]'
              }`}
              title="Acessar o Portal do Apoiador"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">account_circle</span>
              <span>Portal do Apoiador</span>
            </button>

            {/* Botão Principal: Apoie o Instituto */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenDonation}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#b45309] hover:bg-[#92400e] text-white text-xs sm:text-[13px] font-bold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">favorite</span>
              <span>Apoie o Instituto</span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`xl:hidden p-2 rounded-lg transition-colors shadow-xs ${
                isTransparent 
                  ? 'bg-white/90 hover:bg-white text-[#1c1917]' 
                  : 'bg-[#ede7dc] hover:bg-[#e3dcd0] text-[#1c1917]'
              }`}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden bg-[#fbf9f5] border-b border-[#e7e2da] px-4 py-4 shadow-lg overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleNavClick(item.page)}
                    className={`text-left px-4 py-2.5 rounded-lg font-sans text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#b45309]/15 text-[#b45309] font-bold'
                        : 'text-[#57534e] hover:bg-[#f5f1ea] font-medium'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Portal do Apoiador destacado no menu mobile */}
              <button
                onClick={() => handleNavClick('portal-do-apoiador')}
                className={`text-left px-4 py-2.5 rounded-lg font-sans text-sm font-semibold transition-colors flex items-center gap-2 ${
                  currentPage === 'portal-do-apoiador'
                    ? 'bg-[#b45309]/15 text-[#b45309] font-bold'
                    : 'text-[#1c1917] bg-[#ede7dc]/60 hover:bg-[#ede7dc] font-semibold'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-[#b45309]">account_circle</span>
                <span>Portal do Apoiador</span>
              </button>

              <button
                onClick={() => {
                  onOpenDonation();
                  setMobileMenuOpen(false);
                }}
                className="text-center px-4 py-3 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm font-bold flex items-center justify-center gap-2 mt-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                <span>Apoie o Instituto</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

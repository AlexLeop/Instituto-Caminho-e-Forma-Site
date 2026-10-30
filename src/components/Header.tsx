import { NavigationLink } from './NavigationLink';
import React, { useState, useEffect } from 'react';
import { NavPage } from '../types';
import { SUPPORTER_PORTAL_ENABLED } from '../config/features';
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



  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Barra de Navegação Principal */}
      <div 
        style={{
          backgroundColor: scrollY > 10 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: '#e2e8f0',
          boxShadow: scrollY > 10 ? '0 4px 20px -2px rgba(15, 23, 42, 0.04)' : 'none',
        }}
        className="transition-[background-color,border-color,box-shadow] duration-200"
      >
        <div className="h-14 sm:h-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <NavigationLink href="/"
            onClick={() => handleNavClick('inicio')}
            className="flex items-center text-left group cursor-pointer focus:outline-none shrink-0"
            aria-label="Instituto Caminho e Forma - Início"
          >
            <InstituteLogo size="md" variant="horizontal" theme="dark" />
          </NavigationLink>

          {/* Desktop Navigation Links - Nunca quebram linha */}
          <nav className="hidden xl:flex items-center flex-nowrap gap-0.5 lg:gap-1 p-0.5 shrink-0">
            {navItems.map((item) => {
              const isActive = currentPage === item.page || (item.page === 'projetos' && currentPage === 'detalhes-projeto');
              return (
                <NavigationLink href={item.page === 'inicio' ? '/' : item.page === 'contato' ? '/#contato-secao' : `/${item.page}`}
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`relative px-2.5 py-2 font-sans text-xs lg:text-[13.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 bg-transparent ${
                    isActive
                      ? 'text-[#b45309] font-bold'
                      : 'text-slate-600 hover:text-[#b45309]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-0.5 left-2 right-2 h-[2px] bg-[#b45309] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </NavigationLink>
              );
            })}
          </nav>

          {/* Ações de apoio ao Instituto */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Botão Portal do Apoiador (exibido ao lado do botão Apoie o Instituto) */}
            {SUPPORTER_PORTAL_ENABLED && (
            <NavigationLink href="/portal-do-apoiador"
              type="button"
              onClick={() => handleNavClick('portal-do-apoiador')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-sans text-xs sm:text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                currentPage === 'portal-do-apoiador'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
              title="Acessar o Portal do Apoiador"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">account_circle</span>
              <span>Portal do Apoiador</span>
            </NavigationLink>
            )}

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
              className="xl:hidden p-2 rounded-lg transition-colors shadow-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
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
            className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 shadow-lg overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.page || (item.page === 'projetos' && currentPage === 'detalhes-projeto');
                return (
                  <NavigationLink href={item.page === 'inicio' ? '/' : item.page === 'contato' ? '/#contato-secao' : `/${item.page}`}
                    key={item.page}
                    onClick={() => handleNavClick(item.page)}
                    className={`text-left px-4 py-2.5 rounded-lg font-sans text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-amber-50 text-[#b45309] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    {item.label}
                  </NavigationLink>
                );
              })}

              {/* Portal do Apoiador destacado no menu mobile */}
              {SUPPORTER_PORTAL_ENABLED && (
              <NavigationLink href="/portal-do-apoiador"
                onClick={() => handleNavClick('portal-do-apoiador')}
                className={`text-left px-4 py-2.5 rounded-lg font-sans text-sm font-semibold transition-colors flex items-center gap-2 ${
                  currentPage === 'portal-do-apoiador'
                    ? 'bg-amber-50 text-[#b45309] font-bold'
                    : 'text-slate-800 bg-slate-50 hover:bg-slate-100 font-semibold'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-[#b45309]">account_circle</span>
                <span>Portal do Apoiador</span>
              </NavigationLink>
              )}

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

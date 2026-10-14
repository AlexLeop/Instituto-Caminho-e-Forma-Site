import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavPage, Course, MarketProduct } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CoursesView } from './components/CoursesView';
import { MarketView } from './components/MarketView';
import { ProjectsView } from './components/ProjectsView';
import { PartnersView } from './components/PartnersView';
import { DonationModal } from './components/DonationModal';
import { CourseEnrollModal } from './components/CourseEnrollModal';
import { PurchaseModal } from './components/PurchaseModal';
import { ProducerModal } from './components/ProducerModal';
import { VolunteerModal } from './components/VolunteerModal';
import { TransparencyView } from './components/TransparencyView';
import { SupporterPortalView } from './components/SupporterPortalView';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

const pathToPage = (pathname: string): NavPage => {
  const segment = pathname.replace(/^\/+/, '').split('/')[0].split('?')[0].split('#')[0];
  const validPages: NavPage[] = [
    'inicio',
    'projetos',
    'cursos-e-capacitacao',
    'feira-virtual',
    'seja-parceiro',
    'transparencia',
    'portal-do-apoiador'
  ];
  return validPages.includes(segment as NavPage) ? (segment as NavPage) : 'inicio';
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>(() => {
    if (typeof window !== 'undefined') {
      return pathToPage(window.location.pathname);
    }
    return 'inicio';
  });
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedProjectForDonation, setSelectedProjectForDonation] = useState<string | undefined>(undefined);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<MarketProduct | null>(null);
  const [producerModalOpen, setProducerModalOpen] = useState(false);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [volunteerType, setVolunteerType] = useState<'teach' | 'sponsor'>('teach');

  // Sincroniza histórico do navegador com as páginas do site
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(pathToPage(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle page navigation
  const handleNavigate = (page: NavPage) => {
    if (page === 'contato') {
      if (currentPage !== 'inicio') {
        setCurrentPage('inicio');
        window.history.pushState({}, '', '/');
      }
      setTimeout(() => {
        const el = document.getElementById('contato-secao');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return;
    }

    setCurrentPage(page);
    const targetUrl = page === 'inicio' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDonation = (projectName?: string) => {
    setSelectedProjectForDonation(projectName);
    setDonationModalOpen(true);
  };

  const handleOpenVolunteer = (type: 'teach' | 'sponsor') => {
    setVolunteerType(type);
    setVolunteerModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] text-[#1c1917] font-sans selection:bg-[#b45309] selection:text-white">
      {/* Persistent Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenDonation={() => handleOpenDonation()}
        onOpenTransparency={() => handleNavigate('transparencia')}
      />

      {/* Main Content Area */}
      <main className="w-full bg-[#fbf9f5] flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentPage === 'inicio' && (
              <HomeView
                onNavigate={handleNavigate}
                onOpenDonation={handleOpenDonation}
                onOpenTransparency={() => handleNavigate('transparencia')}
                onSelectProduct={(p) => setSelectedProductForPurchase(p)}
              />
            )}

            {currentPage === 'cursos-e-capacitacao' && (
              <CoursesView
                onEnrollCourse={(c) => setSelectedCourseForEnroll(c)}
                onOpenVolunteer={handleOpenVolunteer}
              />
            )}

            {currentPage === 'feira-virtual' && (
              <MarketView
                onSelectProduct={(p) => setSelectedProductForPurchase(p)}
                onOpenProducerModal={() => setProducerModalOpen(true)}
              />
            )}

            {currentPage === 'projetos' && (
              <ProjectsView
                onOpenDonation={handleOpenDonation}
                onOpenTransparency={() => handleNavigate('transparencia')}
              />
            )}

            {currentPage === 'seja-parceiro' && (
              <PartnersView
                onOpenTransparency={() => handleNavigate('transparencia')}
                onOpenVolunteer={handleOpenVolunteer}
              />
            )}

            {currentPage === 'transparencia' && (
              <TransparencyView
                onOpenDonation={handleOpenDonation}
              />
            )}

            {currentPage === 'portal-do-apoiador' && (
              <SupporterPortalView
                onOpenDonation={() => handleOpenDonation()}
                onNavigateHome={() => handleNavigate('inicio')}
                onOpenTransparency={() => handleNavigate('transparencia')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenTransparency={() => handleNavigate('transparencia')}
      />

      {/* Interactive Modals */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => {
          setDonationModalOpen(false);
          setSelectedProjectForDonation(undefined);
        }}
        initialProject={selectedProjectForDonation}
      />

      <CourseEnrollModal
        course={selectedCourseForEnroll}
        onClose={() => setSelectedCourseForEnroll(null)}
      />

      <PurchaseModal
        product={selectedProductForPurchase}
        onClose={() => setSelectedProductForPurchase(null)}
      />

      <ProducerModal
        isOpen={producerModalOpen}
        onClose={() => setProducerModalOpen(false)}
      />

      <VolunteerModal
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        type={volunteerType}
      />

      {/* Botão Flutuante Oficial do WhatsApp */}
      <WhatsAppFloatingButton />
    </div>
  );
}

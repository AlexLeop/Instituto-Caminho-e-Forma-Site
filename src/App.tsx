import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { NavPage, Course, MarketProduct, Project } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CoursesView } from './components/CoursesView';
import { MarketView } from './components/MarketView';
import { ProjectsView } from './components/ProjectsView';
import { ProjectDetailView } from './components/ProjectDetailView';
import { PartnersView } from './components/PartnersView';
import { DonationModal } from './components/DonationModal';
import { CourseEnrollModal } from './components/CourseEnrollModal';
import { PurchaseModal } from './components/PurchaseModal';
import { ProducerModal } from './components/ProducerModal';
import { VolunteerModal } from './components/VolunteerModal';
import { TransparencyView } from './components/TransparencyView';
import { SupporterPortalView } from './components/SupporterPortalView';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { PROJECTS } from './data/mockData';
import { SUPPORTER_PORTAL_ENABLED } from './config/features';

const pathToPage = (pathname: string): NavPage => {
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('id')) {
      return 'detalhes-projeto';
    }
  }
  const segment = pathname.replace(/^\/+/, '').split('/')[0].split('?')[0].split('#')[0];
  if (segment === 'detalhes-projeto' || segment === 'projeto') {
    return 'detalhes-projeto';
  }
  const validPages: NavPage[] = [
    'inicio',
    'projetos',
    'detalhes-projeto',
    'cursos-e-capacitacao',
    'feira-virtual',
    'seja-parceiro',
    'transparencia',
    ...(SUPPORTER_PORTAL_ENABLED ? ['portal-do-apoiador' as const] : [])
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id');
      if (id) {
        const found = PROJECTS.find((p) => p.id === id);
        if (found) return found;
      }
    }
    return PROJECTS[0] || null;
  });
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedProjectForDonation, setSelectedProjectForDonation] = useState<string | undefined>(undefined);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<MarketProduct | null>(null);
  const [producerModalOpen, setProducerModalOpen] = useState(false);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [volunteerType, setVolunteerType] = useState<'teach' | 'sponsor'>('teach');

  // Inicialização do Smooth Scrolling (Lenis) para sensação ultra-suave e fluida
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  // Pausa rolagem de fundo quando modais estão abertos
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      donationModalOpen ||
      selectedCourseForEnroll ||
      selectedProductForPurchase ||
      producerModalOpen ||
      volunteerModalOpen
    );
    if ((window as any).__lenis) {
      if (isAnyModalOpen) {
        (window as any).__lenis.stop();
      } else {
        (window as any).__lenis.start();
      }
    }
  }, [donationModalOpen, selectedCourseForEnroll, selectedProductForPurchase, producerModalOpen, volunteerModalOpen]);

  // Sincroniza histórico do navegador com as páginas do site
  useEffect(() => {
    const handlePopState = () => {
      const page = pathToPage(window.location.pathname);
      setCurrentPage(page);
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id');
      if (id) {
        const found = PROJECTS.find((p) => p.id === id);
        if (found) setSelectedProject(found);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentPage('detalhes-projeto');
    window.history.pushState({}, '', `/projetos?id=${project.id}`);
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle page navigation
  const handleNavigate = (page: NavPage) => {
    if (page === 'portal-do-apoiador' && !SUPPORTER_PORTAL_ENABLED) page = 'inicio';
    if (page === 'contato') {
      if (currentPage !== 'inicio') {
        setCurrentPage('inicio');
        window.history.pushState({}, '', '/');
      }
      setTimeout(() => {
        const el = document.getElementById('contato-secao');
        if (el) {
          if ((window as any).__lenis) {
            (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 120);
      return;
    }

    setCurrentPage(page);
    const targetUrl = page === 'inicio' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-[#b45309] selection:text-white">
      {/* Persistent Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenDonation={() => handleOpenDonation()}
        onOpenTransparency={() => handleNavigate('transparencia')}
      />

      {/* Main Content Area */}
      <main className="w-full bg-white flex-1">
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
                onSelectProject={handleSelectProject}
              />
            )}

            {currentPage === 'cursos-e-capacitacao' && (
              <CoursesView
                onEnrollCourse={(c) => setSelectedCourseForEnroll(c)}
                onOpenVolunteer={handleOpenVolunteer}
                onOpenDonation={handleOpenDonation}
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
                onSelectProject={handleSelectProject}
              />
            )}

            {currentPage === 'detalhes-projeto' && (
              <ProjectDetailView
                project={selectedProject || PROJECTS[0]}
                onBack={() => handleNavigate('projetos')}
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

            {SUPPORTER_PORTAL_ENABLED && currentPage === 'portal-do-apoiador' && (
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
      {!donationModalOpen && <WhatsAppFloatingButton />}
    </div>
  );
}

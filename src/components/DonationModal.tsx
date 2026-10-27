import React, { useEffect, useRef } from 'react';
import { DonationCheckout } from './DonationCheckout';

interface DonationModalProps {isOpen: boolean; onClose: () => void; initialProject?: string}
export const DonationModal: React.FC<DonationModalProps> = ({isOpen, onClose, initialProject}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previous?.focus();
  }, [isOpen]);
  if (!isOpen) return null;
  const handleKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') onClose();
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')];
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last?.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first?.focus();}
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-3 backdrop-blur-sm sm:p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="donation-title" onKeyDown={handleKeys} className="my-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <h2 id="donation-title" className="font-serif text-2xl font-bold">Apoie o Instituto</h2>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar doação" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200"><span className="material-symbols-outlined" aria-hidden="true">close</span></button>
      </div>
      <DonationCheckout key={initialProject || 'geral'} initialProject={initialProject} allowProjectSelection />
    </div>
  </div>;
};

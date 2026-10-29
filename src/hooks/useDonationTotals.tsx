import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { DonationSummary } from '../../shared/donationReports';
import { DONATION_TOTALS } from '../data/donations';
import { PROJECTS } from '../data/mockData';

const TotalsContext = createContext<{summary: DonationSummary; status: 'loading' | 'current' | 'fallback'}>({summary: DONATION_TOTALS, status: 'fallback'});

export function DonationTotalsProvider({children}: {children: ReactNode}) {
  const [state, setState] = useState<{summary: DonationSummary; status: 'loading' | 'current' | 'fallback'}>({summary: DONATION_TOTALS, status: 'loading'});
  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    async function refresh() {
      if (controller || document.visibilityState === 'hidden') return;
      controller = new AbortController();
      const deadline = setTimeout(() => controller?.abort(), 55000);
      try {
        const response = await fetch('/api/donations', {signal: controller.signal});
        const {summary} = await response.json();
        if (!response.ok || !Number.isSafeInteger(summary?.totalCents) || !summary?.byDestination || !summary.updatedAt) throw new Error();
        if (active) setState({summary, status: summary.isStale ? 'fallback' : 'current'});
      } catch { if (active) setState(previous => ({...previous, status: 'fallback'})); }
      finally {clearTimeout(deadline); controller = undefined;}
    }
    void refresh();
    const timer = setInterval(() => void refresh(), 60000);
    const visible = () => {if (document.visibilityState === 'visible') void refresh();};
    document.addEventListener('visibilitychange', visible);
    return () => {active = false; clearInterval(timer); controller?.abort(); document.removeEventListener('visibilitychange', visible);};
  }, []);
  return <TotalsContext.Provider value={state}>{children}</TotalsContext.Provider>;
}

export const useDonationTotals = () => useContext(TotalsContext).summary;

export function useFundedProjects() {
  const summary = useDonationTotals();
  return useMemo(() => PROJECTS.map(project => {
    const raisedAmount = (summary.byDestination[project.id] ?? Math.round(project.raisedAmount * 100)) / 100;
    return {...project, raisedAmount, progressPercent: project.goalAmount > 0 ? Math.min(100, Math.round(raisedAmount / project.goalAmount * 100)) : 0};
  }), [summary]);
}

export function DonationSyncStatus() {
  const {summary, status} = useContext(TotalsContext);
  const date = new Date(summary.updatedAt).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'});
  return <p className="mt-2 text-xs leading-relaxed text-slate-600" role="status">
    {status === 'loading' ? 'Consultando os recebimentos confirmados…' : status === 'current' ? `Recebimentos conferidos em ${date}.` : `Última conciliação disponível: ${date}. A atualização bancária está temporariamente indisponível.`}
  </p>;
}

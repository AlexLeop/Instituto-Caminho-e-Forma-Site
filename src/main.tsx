import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DonationReportsView } from './components/DonationReportsView';
import { DonationTotalsProvider } from './hooks/useDonationTotals';

createRoot(document.getElementById('root')!).render(
  window.location.pathname.replace(/\/$/, '') === '/gestao/doacoes'
    ? <DonationReportsView />
    : <DonationTotalsProvider><App /></DonationTotalsProvider>
);

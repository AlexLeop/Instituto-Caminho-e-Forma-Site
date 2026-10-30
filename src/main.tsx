import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DonationReportsView } from './components/DonationReportsView';
import { DonationTotalsProvider } from './hooks/useDonationTotals';

const root = document.getElementById('root')!;
const application = (
  window.location.pathname.replace(/\/$/, '') === '/gestao/doacoes'
    ? <DonationReportsView />
    : <DonationTotalsProvider><App /></DonationTotalsProvider>
);
if (root.hasChildNodes()) hydrateRoot(root, application);
else createRoot(root).render(application);

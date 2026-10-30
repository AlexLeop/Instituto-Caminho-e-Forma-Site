import { renderToString } from 'react-dom/server';
import App from './App';
import { DonationTotalsProvider } from './hooks/useDonationTotals';
export function render(url: string) {
  return renderToString(<DonationTotalsProvider><App initialUrl={url} /></DonationTotalsProvider>);
}

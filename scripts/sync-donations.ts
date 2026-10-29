import dotenv from 'dotenv';
import { CoraClient } from '../server/cora/client.ts';
import { readCoraConfig } from '../server/cora/config.ts';
import { getDonationLedger } from '../server/donations/ledger.ts';
import { readDonationSummary } from '../server/donations/report.ts';

dotenv.config({quiet: true});
try {
  const ledger = getDonationLedger();
  if (!ledger) throw new Error('Configure SUPABASE_URL e SUPABASE_SECRET_KEY.');
  const end = new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
  const bank = await readDonationSummary(new CoraClient(readCoraConfig()), end, ledger);
  const saved = await ledger.summary();
  for (const key of ['totalCents', 'generalFundCents', 'eadCoursesCents', 'projectsCents', 'unassignedCents'] as const) {
    if (saved[key] !== bank[key]) throw new Error('Os totais do banco de dados diferem da conciliação Cora. Confira os registros antes de publicar.');
  }
  console.log(JSON.stringify({saved: true, totalCents: saved.totalCents, generalFundCents: saved.generalFundCents, eadCoursesCents: saved.eadCoursesCents}));
  console.log('Sincronização concluída. Testes preservados apenas no histórico privado. Nenhuma cobrança emitida.');
} catch (error) {
  console.error('Sincronização não concluída:', error instanceof Error ? error.message : 'operação indisponível');
  process.exitCode = 1;
}

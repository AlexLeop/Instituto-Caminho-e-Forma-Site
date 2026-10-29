import dotenv from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { CoraClient } from '../server/cora/client.ts';
import { readCoraConfig } from '../server/cora/config.ts';
import { readDonationReportPage, validateReportRange } from '../server/donations/report.ts';
import { donationRecordsCsv, summarizeDonations, type DonationRecord } from '../shared/donationReports.ts';

dotenv.config({quiet: true});
const args = process.argv.slice(2);
const option = (name: string) => {const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined;};
try {
  const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
  const {start, end} = validateReportRange(option('--start') ?? `${today.slice(0, 4)}-01-01`, option('--end') ?? today);
  const bank = new CoraClient(readCoraConfig());
  const records = new Map<string, DonationRecord>();
  let page: number | null = 1;
  while (page !== null) {
    if (page > 100) throw new Error('Reduza o período da consulta.');
    const report = await readDonationReportPage(bank, start, end, page);
    [...report.records, ...report.manualRecords].forEach(record => records.set(record.id, record));
    page = report.nextPage;
  }
  const output = path.resolve('scratch/prestacao-de-contas', `doacoes-${start}-a-${end}.csv`);
  await mkdir(path.dirname(output), {recursive: true});
  await writeFile(output, donationRecordsCsv([...records.values()]), {encoding: 'utf8', mode: 0o600});
  const summary = summarizeDonations([...records.values()]);
  console.log(`Relatório privado salvo em ${output}`);
  console.log(`Doações conciliadas (incluindo recebimento externo sem data): R$ ${(summary.totalCents / 100).toFixed(2)}. Testes excluídos. Nenhuma cobrança emitida.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Não foi possível exportar o relatório completo.');
  process.exitCode = 1;
}

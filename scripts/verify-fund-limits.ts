import dotenv from 'dotenv';
import postgres from 'postgres';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import { ledgerRow } from '../server/donations/ledger.ts';

dotenv.config({quiet: true});
const project = new URL(process.env.SUPABASE_URL ?? '').hostname.split('.')[0];
const databaseUrl = process.env.POSTGRES_URL_NON_POOLING!;
const target = new URL(databaseUrl);
if (!project || (!target.hostname.includes(project) && !decodeURIComponent(target.username).endsWith(`.${project}`))) throw new Error('Projeto PostgreSQL diferente do configurado.');
const ca = await readFile('scratch/supabase/prod-ca-2021.crt', 'utf8');
const sql = postgres(databaseUrl, {max: 1, prepare: false, connect_timeout: 10, ssl: {rejectUnauthorized: true, ca}});
const marker = randomUUID(), rollback = new Error('verification-rollback');
try {
  const before = (await sql`select public.donation_public_totals('production') as summary`)[0].summary;
  try {
    await sql.begin(async tx => {
      if (process.argv.includes('--test-migration')) {
        const migration = (await readFile('supabase/migrations/20261030001834_period_fund_limits.sql', 'utf8')).replace(/^begin;/, '').replace(/commit;\s*$/, '');
        await tx.unsafe(migration);
      }
      assert.equal((await tx`select count(*)::int as n from public.donation_ledger where environment='stage'`)[0].n, 0, 'Verification requires an empty Stage ledger.');
      const record = {id: marker, source: 'cora' as const, createdAt: new Date().toISOString(), paidOn: '2026-10-29', donorName: 'Verificação temporária', donorEmail: 'verification@example.com', maskedDocument: '*******1234', amountCents: 100000, paidCents: 100000, method: 'PIX', destinationId: 'boxe-formativo', destinationTitle: 'Boxe', originalDescription: 'Fixture temporária', reconciliationNote: 'Revertida ao encerrar a verificação', included: true};
      await tx`insert into public.donation_ledger ${tx([
        ledgerRow(record, 'stage'),
        ledgerRow({...record, id: marker+'-september', paidOn: '2026-09-15', amountCents: 200000, paidCents: 200000}, 'stage'),
        ledgerRow({...record, id: marker+'-test', amountCents: 3000, paidCents: 3000, included: false}, 'stage'),
        ledgerRow({...record, id: marker+'-pending', paidCents: 0}, 'stage', 'OPEN'),
        ledgerRow({...record, id: marker+'-external', source: 'externo', paidOn: null, destinationId: 'geral', amountCents: 16600, paidCents: 16600}, 'stage'),
      ])}`;
      const balance = async (id: string, start='2026-10-01', end='2026-10-29') => {
        const report = (await tx`select public.donation_fund_report('stage',${start}::date,${end}::date,1) as report`)[0].report;
        return report.balances.find((item: any) => item.destinationId === id);
      };
      const move = (source: string, destination: string, cents: number, id=randomUUID(), reversal: string | null=null, start='2026-10-01', end='2026-10-29') => tx`select public.record_donation_reallocation_in_period('stage',${id}::uuid,${source},${source},${destination},${destination},${cents},'Verificação temporária','Verificação financeira com reversão completa',${start}::date,${end}::date,${reversal}::uuid) as movement`;
      const rejectAmount = (action: () => Promise<unknown>) => assert.rejects(() => tx.savepoint(action), (error: any) => error.message === 'INSUFFICIENT_ALLOCATION');
      assert.equal((await balance('boxe-formativo')).allocatedCents, 300000);
      assert.equal((await balance('boxe-formativo')).availableCents, 100000);
      assert.equal((await balance('geral')).availableCents, 16600);
      await rejectAmount(() => move('boxe-formativo','ballet-infantil',100001));
      const first = randomUUID(); await move('boxe-formativo','ballet-infantil',80000,first);
      await move('boxe-formativo','ballet-infantil',80000,first);
      assert.equal((await tx`select count(*)::int as n from public.donation_fund_movements where environment='stage'`)[0].n, 1);
      assert.equal((await balance('boxe-formativo')).availableCents, 20000);
      assert.equal((await balance('ballet-infantil')).availableCents, 80000);
      assert.equal((await balance('ballet-infantil','2026-09-01','2026-09-30')).availableCents, 0);
      await tx`insert into public.donation_ledger ${tx([ledgerRow({...record,id:marker+'-november',paidOn:'2026-11-02'},'stage')])}`;
      await rejectAmount(() => move('boxe-formativo','ballet-infantil',20001));
      assert.equal((await balance('boxe-formativo','2026-09-01','2026-10-29')).availableCents, 220000);
      const second = randomUUID(); await move('ballet-infantil','treino-funcional',30000,second);
      // Unrelated newer donations cannot finance the reversal of already spent receipts.
      await tx`insert into public.donation_ledger ${tx([ledgerRow({...record,id:marker+'-other-ballet',paidOn:'2026-11-02',destinationId:'ballet-infantil'},'stage')])}`;
      await rejectAmount(() => move('ballet-infantil','boxe-formativo',80000,randomUUID(),first));
      await move('treino-funcional','ballet-infantil',30000,randomUUID(),second);
      await move('ballet-infantil','boxe-formativo',80000,randomUUID(),first);
      assert.equal((await balance('boxe-formativo')).availableCents, 100000);
      await assert.rejects(() => tx.savepoint(() => move('ballet-infantil','boxe-formativo',80000,randomUUID(),first)), (error: any) => error.message === 'ALREADY_REVERSED');
      assert.equal((await tx`select destination_id from public.donation_ledger where environment='stage' and id=${marker}`)[0].destination_id, 'boxe-formativo');
      const permissions = (await tx`select has_table_privilege('anon','public.donation_fund_movement_lines','SELECT') as anon_read,has_function_privilege('service_role','public.record_donation_reallocation(text,uuid,text,text,text,text,integer,text,text,uuid)','EXECUTE') as legacy_write`)[0];
      assert.equal(permissions.anon_read, false); assert.equal(permissions.legacy_write, false);
      throw rollback;
    });
  } catch (error) {if (error !== rollback) throw error;}
  assert.equal((await sql`select count(*)::int as n from public.donation_ledger where id like ${marker+'%'}`)[0].n, 0);
  assert.equal((await sql`select public.donation_public_totals('production') as summary`)[0].summary.totalCents, before.totalCents);
  console.log('Conferido: limite no período, centavo acima bloqueado, períodos sobrepostos, idempotência, entradas, estornos, exclusão de testes, doação externa e permissões. Todos os dados de verificação foram revertidos.');
} finally {await sql.end({timeout: 2});}

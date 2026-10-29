import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { X509Certificate } from 'node:crypto';
import postgres from 'postgres';

dotenv.config({quiet: true});
let sql: ReturnType<typeof postgres> | undefined;
try {
  const project = new URL(process.env.SUPABASE_URL ?? '').hostname.split('.')[0];
  const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!databaseUrl) throw new Error('Configure POSTGRES_URL_NON_POOLING para preparar o banco.');
  const target = new URL(databaseUrl);
  if (!target.hostname.includes(project) && !decodeURIComponent(target.username).endsWith(`.${project}`)) throw new Error('O projeto da conexão PostgreSQL difere do SUPABASE_URL.');
  const certificateResponse = await fetch('https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt');
  if (!certificateResponse.ok) throw new Error('Não foi possível obter o certificado oficial do banco.');
  const ca = await certificateResponse.text();
  if (new X509Certificate(ca).fingerprint256 !== '80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA') throw new Error('O certificado oficial do banco mudou; confira antes de continuar.');
  sql = postgres(databaseUrl, {max: 1, prepare: false, connect_timeout: 10, idle_timeout: 5, ssl: {rejectUnauthorized: true, ca}});
  if (process.argv.includes('--apply')) {
    for (const migration of ['20261029224832_donation_ledger.sql', '20261029233335_fund_reallocations_supporter_access.sql']) {
      const schema = await readFile(new URL(`../supabase/migrations/${migration}`, import.meta.url), 'utf8');
      await sql.unsafe(schema);
    }
    console.log('Estrutura das doações aplicada no projeto configurado.');
  }
  const tables = await sql`select c.relname, c.relrowsecurity,
    has_table_privilege('anon', c.oid, 'SELECT') as anonymous_read,
    has_table_privilege('authenticated', c.oid, 'SELECT') as authenticated_read,
    has_table_privilege('service_role', c.oid, 'DELETE') as service_delete
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname in ('donation_ledger','donation_ledger_events','donation_fund_movements','supporter_login_challenges','supporter_sessions')`;
  if (tables.length !== 5 || tables.some(table => !table.relrowsecurity || table.anonymous_read || table.authenticated_read || (table.service_delete && !table.relname.startsWith('supporter_')))) throw new Error('A proteção das tabelas de doações precisa ser conferida.');
  const rights = await sql`select has_function_privilege('anon','public.donation_public_totals(text)','EXECUTE') as public_execute`;
  if (rights[0].public_execute) throw new Error('A função de totais não pode ser executada diretamente pelo público.');
  console.log('Conferido: tabelas com RLS, leitura restrita ao servidor, histórico preservado e função de totais privada.');
} catch (error) {
  console.error('Não foi possível preparar/conferir o banco:', error instanceof Error && !('severity' in error) ? error.message : 'falha na operação PostgreSQL');
  process.exitCode = 1;
} finally {await sql?.end({timeout: 2});}

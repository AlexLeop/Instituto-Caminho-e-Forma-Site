import { useEffect, useRef, useState, type FormEvent } from 'react';
import { DONATION_DESTINATIONS } from '../../shared/donationDestinations';
import { donationRecordsCsv, summarizeDonations, type DonationRecord, type DonationReportPage } from '../../shared/donationReports';
import { formatDonationAmount as money } from '../data/donations';
import { FundReallocationsPanel } from './FundReallocationsPanel';

const field = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700';
const button = 'min-h-11 rounded-lg bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:opacity-50';
const today = () => new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
const displayDate = (value: string | null) => value ? value.slice(0, 10).split('-').reverse().join('/') : 'Não informada';

export function DonationReportsView() {
  const [password, setPassword] = useState('');
  const [start, setStart] = useState(`${today().slice(0, 4)}-01-01`);
  const [end, setEnd] = useState(today());
  const [destination, setDestination] = useState('todos');
  const [result, setResult] = useState<{records: DonationRecord[]; manual: DonationRecord[]; start: string; end: string; updatedAt: string; ignored: number; isStale: boolean} | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const access = useRef('');
  const request = useRef<AbortController | null>(null);
  const inactivity = useRef<ReturnType<typeof setTimeout> | null>(null);

  function logout() {
    request.current?.abort(); access.current = ''; setPassword(''); setResult(null); setError('');
    if (inactivity.current) clearTimeout(inactivity.current);
  }
  useEffect(() => {
    document.title = 'Prestação de contas | Instituto Caminho e Forma';
    const meta = document.createElement('meta'); meta.name = 'robots'; meta.content = 'noindex, nofollow'; document.head.appendChild(meta);
    const activity = () => {if (inactivity.current) clearTimeout(inactivity.current); inactivity.current = setTimeout(logout, 20 * 60000);};
    document.addEventListener('pointerdown', activity); document.addEventListener('keydown', activity); activity();
    return () => {meta.remove(); request.current?.abort(); if(inactivity.current) clearTimeout(inactivity.current); document.removeEventListener('pointerdown', activity); document.removeEventListener('keydown', activity);};
  }, []);

  async function load(event: FormEvent) {
    event.preventDefault();
    if (request.current) return;
    const key = access.current || password;
    setError(''); setResult(null); setBusy(true);
    const controller = new AbortController(); request.current = controller;
    const records = new Map<string, DonationRecord>();
    let manual: DonationRecord[] = [], ignored = 0, updatedAt = '', isStale = false;
    try {
      let page: number | null = 1;
      while (page !== null) {
        const deadline = setTimeout(() => controller.abort(), 55000);
        let response: Response;
        try {
          response = await fetch('/api/donations', {method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${key}`},
            body: JSON.stringify({start, end, page}), cache: 'no-store', signal: controller.signal});
        } finally {clearTimeout(deadline);}
        const data = await response.json();
        if (!response.ok || !data.report) {if (response.status === 401) {access.current = ''; setPassword('');} throw new Error(data.error?.message || 'Não foi possível obter o relatório completo.');}
        const report: DonationReportPage = data.report;
        isStale ||= report.isStale ?? false;
        report.records.forEach(record => records.set(record.id, record));
        manual = report.manualRecords; ignored += report.ignoredBankInvoices; updatedAt = report.generatedAt;
        page = report.nextPage;
        if (page !== null && page > 100) throw new Error('Reduza o período para consultar todos os registros.');
      }
      if (controller.signal.aborted) throw new DOMException('Consulta interrompida', 'AbortError');
      access.current = key; setPassword('');
      setResult({records: [...records.values()], manual, start, end, ignored, updatedAt, isStale});
    } catch (failure) {setError(failure instanceof Error && failure.name !== 'AbortError' ? failure.message : 'Consulta interrompida. Tente novamente; nenhum total parcial foi apresentado.');}
    finally {request.current = null; setBusy(false);}
  }

  const filtered = result?.records.filter(record => destination === 'todos' || (record.destinationId ?? 'nao-identificado') === destination) ?? [];
  const manual = result?.manual.filter(record => destination === 'todos' || record.destinationId === destination) ?? [];
  const summary = summarizeDonations(filtered);
  const excluded = filtered.filter(record => !record.included).reduce((sum, record) => sum + record.paidCents, 0);
  const breakdown = Object.entries(summary.byDestination);
  function download() {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([donationRecordsCsv([...filtered, ...manual])], {type: 'text/csv;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = `doacoes-${result.start}-a-${result.end}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
        <a href="/" className="text-sm font-semibold text-emerald-900 hover:underline">Instituto Caminho e Forma</a>
        {access.current && <button type="button" onClick={logout} className="min-h-11 px-3 text-sm font-semibold text-slate-700 hover:underline">Sair da área privada</button>}
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
      <h1 className="text-2xl font-bold sm:text-3xl">Prestação de contas das doações</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">Consulta privada dos recebimentos confirmados na Cora. O destino conciliado, a descrição original da cobrança e os pagamentos de teste ficam identificados separadamente.</p>
      <form onSubmit={load} className="mt-8 flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-5" aria-busy={busy}>
        {!access.current && <label className="min-w-0 flex-[2_1_220px] text-sm font-semibold">Chave de acesso
          <input type="password" autoComplete="current-password" required minLength={32} maxLength={512} disabled={busy} value={password} onChange={event => setPassword(event.target.value)} className={`${field} mt-2`} />
        </label>}
        <label className="min-w-0 flex-[1_1_150px] text-sm font-semibold">Pagamento a partir de
          <input type="date" required disabled={busy} value={start} onChange={event => setStart(event.target.value)} className={`${field} mt-2`} />
        </label>
        <label className="min-w-0 flex-[1_1_150px] text-sm font-semibold">Pagamento até
          <input type="date" required disabled={busy} value={end} onChange={event => setEnd(event.target.value)} className={`${field} mt-2`} />
        </label>
        <button disabled={busy} className={button}>{busy ? 'Consultando a Cora…' : 'Consultar recebimentos'}</button>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-slate-600">A chave não é salva no navegador. A área é encerrada após 20 minutos sem atividade. Os documentos dos doadores aparecem mascarados.</p>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-900">{error}</p>}
      {busy && <p role="status" className="mt-6 text-sm text-slate-700">Buscando todas as páginas e conferindo cada cobrança. Aguarde para visualizar os totais completos.</p>}
      {result && <section className="mt-8" aria-label="Resultado da conciliação">
        {result.isStale && <p role="status" className="mb-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-950">A consulta à Cora está temporariamente indisponível. Este relatório usa os registros salvos no banco de dados; pagamentos recentes podem ainda não aparecer.</p>}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="w-full text-sm font-semibold sm:w-80">
            <label htmlFor="report-destination">Destino</label>
            <select id="report-destination" value={destination} onChange={event => setDestination(event.target.value)} className={`${field} mt-2`}>
              <option value="todos">Todos os destinos</option>
              {DONATION_DESTINATIONS.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
              <option value="nao-identificado">Destino não identificado</option>
            </select>
          </div>
          <button onClick={download} type="button" className={button}>Baixar planilha CSV</button>
        </div>
        <h2 className="mt-8 text-lg font-bold">Doações do site no período</h2>
        <p className="mt-2 text-sm text-slate-600">{displayDate(result.start)} a {displayDate(result.end)} · Consulta em {new Date(result.updatedAt).toLocaleString('pt-BR')}</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <dl className="divide-y divide-slate-200">
            {breakdown.map(([id, amount]) => <div key={id} className="flex justify-between gap-4 p-4 text-sm"><dt>{DONATION_DESTINATIONS.find(item => item.id === id)?.title ?? 'Destino não identificado'}</dt><dd className="shrink-0 font-semibold tabular-nums">{money(amount)}</dd></div>)}
            <div className="flex justify-between gap-4 bg-emerald-50 p-4 font-bold text-emerald-950"><dt>Total de doações do site</dt><dd className="tabular-nums">{money(summary.totalCents)}</dd></div>
            <div className="flex justify-between gap-4 p-4 text-sm text-slate-600"><dt>Testes excluídos da arrecadação</dt><dd className="tabular-nums">{money(excluded)}</dd></div>
          </dl>
        </div>
        {summary.unassignedCents > 0 && <p className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-950">Há {money(summary.unassignedCents)} sem destino identificado. Confirme a destinação com o Instituto antes de utilizá-la na prestação de contas por projeto.</p>}
        <h2 className="mt-8 text-lg font-bold">Detalhamento dos pagamentos</h2>
        <p className="mt-2 text-xs text-slate-600 sm:hidden">Deslize a tabela para o lado para ver o destino e a conciliação de cada pagamento.</p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white" tabIndex={0} role="region" aria-label="Tabela de pagamentos, role horizontalmente para ver todas as colunas">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-700"><tr>{['Pagamento / referência', 'Doador', 'Destino conciliado', 'Recebido', 'Conciliação'].map(title => <th key={title} scope="col" className="p-4 font-semibold">{title}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-200">{filtered.map(record => <tr key={record.id} className={!record.included ? 'bg-amber-50' : ''}>
              <td className="p-4 align-top">{displayDate(record.paidOn)}<div className="mt-2 max-w-48 break-all text-xs text-slate-600">{record.id}</div><div className="mt-1 text-xs">{record.method}</div></td>
              <td className="p-4 align-top">{record.donorName}<div className="mt-2 max-w-48 break-all text-xs text-slate-600">{record.donorEmail}</div><div className="mt-1 text-xs text-slate-600">{record.maskedDocument}</div></td>
              <td className="p-4 align-top"><span className="font-semibold">{record.destinationTitle}</span><p className="mt-2 max-w-64 text-xs leading-relaxed text-slate-600">Original Cora: {record.originalDescription || 'Sem descrição'}</p></td>
              <td className="whitespace-nowrap p-4 align-top font-semibold tabular-nums">{money(record.paidCents)}</td>
              <td className="max-w-80 p-4 align-top text-xs leading-relaxed">{!record.included && <strong className="mb-2 block text-amber-950">Teste — não computar como doação</strong>}{record.reconciliationNote}</td>
            </tr>)}</tbody>
          </table>
          {filtered.length === 0 && <p className="p-6 text-sm text-slate-600">Nenhum pagamento do site encontrado para este período e destino.</p>}
        </div>
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5" aria-label="Recebimentos fora do checkout">
          <h2 className="text-lg font-bold">Recebimentos fora do checkout</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">Registros confirmados pelo Instituto, com data ainda não informada. Entram no total geral do site e na planilha em linhas separadas; não entram no total por período acima.</p>
          {manual.map(record => <div key={record.id} className="mt-4 border-t border-slate-200 pt-4"><p className="text-sm font-semibold">{record.destinationTitle}: {money(record.paidCents)}</p><p className="mt-2 text-xs leading-relaxed text-slate-600">{record.reconciliationNote}</p></div>)}
          {manual.length === 0 && <p className="mt-4 text-sm text-slate-600">Nenhum registro externo para este destino.</p>}
        </section>
        <p className="mt-4 text-xs leading-relaxed text-slate-600">{!result.isStale && `${result.ignored} cobrança(s) da conta sem a referência do checkout foram desconsideradas. `}O relatório não inclui transferências feitas diretamente à chave Pix. Os comprovantes bancários devem acompanhar a prestação de contas.</p>
        <FundReallocationsPanel accessKey={access.current} start={result.start} end={result.end} />
      </section>}
    </main>
  </div>;
}

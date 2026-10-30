import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { DONATION_DESTINATIONS, findDonationDestination } from '../../shared/donationDestinations';
import { parseAmount } from '../../shared/checkout';
import { fundMovementsCsv, type FundMovement, type FundReport, type ReallocationInput } from '../../shared/fundMovements';
import { formatDonationAmount as money } from '../data/donations';
import { DonationDestinationPicker } from './DonationDestinationPicker';

const field = 'mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700';
const button = 'min-h-11 rounded-lg bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50';
const secondary = 'min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50';

export function FundReallocationsPanel({accessKey, start, end}: {accessKey: string; start: string; end: string}) {
  const [report, setReport] = useState<FundReport | null>(null);
  const [sourceId, setSourceId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [amount, setAmount] = useState('');
  const [responsible, setResponsible] = useState('');
  const [reason, setReason] = useState('');
  const [reversal, setReversal] = useState<FundMovement | null>(null);
  const [review, setReview] = useState<ReallocationInput | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const [allBalances, setAllBalances] = useState(false);
  const attempt = useRef<{fingerprint: string; id: string} | null>(null);
  const controller = useRef<AbortController | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const amountField = useRef<HTMLInputElement>(null);
  const id = useId();
  const sourceBalance = report?.balances.find(balance => balance.destinationId === sourceId);
  const availableCents = sourceBalance?.availableCents ?? 0;
  const enteredCents = parseAmount(amount);
  const exceedsBalance = !!sourceId && enteredCents > availableCents;
  const amountError = exceedsBalance ? `O valor máximo disponível nesta origem e neste período é ${money(availableCents)}.` : '';
  useEffect(() => {amountField.current?.setCustomValidity(amountError);}, [amountError, report]);

  async function api(body: unknown, signal?: AbortSignal) {
    const response = await fetch('/api/donations', {method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessKey}`}, body: JSON.stringify(body), cache: 'no-store', signal});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Não foi possível acessar as realocações.');
    return data;
  }
  async function load(signal?: AbortSignal) {
    const movements = new Map<string, FundMovement>(); let page: number | null = 1, result: FundReport;
    do {
      if (page > 100) throw new Error('Reduza o período para consultar todas as realocações.');
      const data = await api({action: 'funds', start, end, page}, signal); result = data.funds;
      result.movements.forEach(movement => movements.set(movement.id, movement)); page = result.nextPage;
    } while (page !== null);
    if (!signal?.aborted) setReport({...result!, movements: [...movements.values()]});
  }
  useEffect(() => {
    let active = true;
    const request = new AbortController(); controller.current = request; setBusy(true); setReport(null); setReview(null); setError(''); setSuccess('');
    const timeout = setTimeout(() => request.abort(), 45000);
    void load(request.signal).catch(failure => {if (active) setError(failure instanceof Error && failure.name !== 'AbortError' ? failure.message : 'Não foi possível consultar as realocações. Tente atualizar a consulta.');}).finally(() => {clearTimeout(timeout); if (active) setBusy(false);});
    return () => {active = false; clearTimeout(timeout); controller.current?.abort();};
  }, [accessKey, start, end]);

  async function refresh() {
    setBusy(true); setError('');
    const request = new AbortController(); controller.current = request; const timeout = setTimeout(() => request.abort(), 45000);
    try {await load(request.signal);}
    catch (failure) {setError(failure instanceof Error && failure.name !== 'AbortError' ? failure.message : 'A consulta foi interrompida. Tente novamente.');}
    finally {clearTimeout(timeout); setBusy(false);}
  }

  function prepare(event: FormEvent) {
    event.preventDefault(); setError(''); setSuccess('');
    const amountCents = parseAmount(amount);
    if (!findDonationDestination(sourceId) || !findDonationDestination(destinationId) || sourceId === destinationId) {setError('Escolha projetos de origem e destino diferentes.'); return;}
    if (!Number.isSafeInteger(amountCents) || amountCents < 1) {setError('Informe um valor válido.'); return;}
    if (amountCents > availableCents) {setError('O valor supera o saldo disponível da origem no período selecionado.'); return;}
    if (responsible.trim().length < 3 || reason.trim().length < 10) {setError('Informe o responsável e explique o motivo com pelo menos 10 caracteres.'); return;}
    const input = {start, end, sourceId, destinationId, amountCents, responsible: responsible.trim().replace(/\s+/g, ' '), reason: reason.trim(), ...(reversal ? {reversalOf: reversal.id} : {})};
    const fingerprint = JSON.stringify(input);
    if (!attempt.current || attempt.current.fingerprint !== fingerprint) attempt.current = {fingerprint, id: crypto.randomUUID()};
    setReview({...input, id: attempt.current.id});
  }
  async function confirm() {
    if (!review || busy) return;
    setBusy(true); setError('');
    const request = new AbortController(); controller.current = request; const timeout = setTimeout(() => request.abort(), 45000);
    try {
      const result = await api({action: 'reallocate', movement: review}, request.signal);
      setReview(null); setReversal(null); setAmount(''); setReason(''); attempt.current = null;
      setSuccess(`Registro confirmado. Referência: ${result.movement.id}.`);
      await load(request.signal);
    } catch (failure) {setError(failure instanceof Error && failure.name !== 'AbortError' ? failure.message : 'A consulta foi interrompida. Tente novamente com os mesmos dados para recuperar o registro.');}
    finally {clearTimeout(timeout); setBusy(false);}
  }
  function reverse(movement: FundMovement) {
    setReversal(movement); setSourceId(movement.destinationId); setDestinationId(movement.sourceId); setAmount((movement.amountCents / 100).toFixed(2).replace('.', ',')); setReason(''); setReview(null); setSuccess(''); setError('');
    form.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
  function download() {
    if (!report) return;
    const url = URL.createObjectURL(new Blob([fundMovementsCsv(report.movements)], {type: 'text/csv;charset=utf-8'})); const link = document.createElement('a');
    link.href = url; link.download = `realocacoes-${start}-a-${end}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const balances = DONATION_DESTINATIONS.map(destination => ({...destination, ...report?.balances.find(balance => balance.destinationId === destination.id)})).filter(destination => allBalances || destination.receivedCents || destination.incomingCents || destination.outgoingCents);
  const reversed = new Set(report?.movements.map(movement => movement.reversalOf).filter(Boolean));

  return <section className="mt-10 border-t border-slate-300 pt-8" aria-label="Realocações de recursos">
    <h2 className="text-2xl font-bold text-slate-900">Realocações de recursos</h2>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">Registre mudanças na destinação dos recursos sem alterar a doação original. Cada saída de um projeto corresponde a uma entrada em outro; o total arrecadado permanece igual.</p>
    <button type="button" disabled={busy} onClick={() => void refresh()} className={`${secondary} mt-4`}>Atualizar saldos e histórico</button>
    {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-900">{error}</p>}
    {success && <p role="status" className="mt-4 break-all rounded-lg bg-emerald-50 p-4 text-sm text-emerald-950">{success}</p>}
    {busy && !report && <p role="status" className="mt-5 text-sm text-slate-700">Consultando saldos e histórico…</p>}
    {report && <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><h3 className="text-lg font-bold">Saldos destinados aos projetos</h3><button type="button" onClick={() => setAllBalances(value => !value)} className={secondary}>{allBalances ? 'Mostrar apenas projetos com recursos' : 'Mostrar todos os projetos'}</button></div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">O saldo acumulado considera todos os recebimentos e realocações. A coluna “Disponível no período” limita o registro aos recursos recebidos no período selecionado que ainda pertencem ao projeto. Doações externas confirmadas sem data informada estão incluídas. Estes valores representam destinações registradas, e não o saldo da conta bancária.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white" tabIndex={0} role="region" aria-label="Saldos por projeto">
        <table className="w-full min-w-[740px] text-left text-sm"><thead className="bg-slate-100 text-slate-700"><tr>{['Projeto','Recebido originalmente','Entradas por realocação','Saídas por realocação','Saldo acumulado','Disponível no período'].map(title => <th key={title} scope="col" className="p-4 font-semibold">{title}</th>)}</tr></thead><tbody className="divide-y divide-slate-200">{balances.map(balance => <tr key={balance.id}><td className="p-4 font-semibold">{balance.title}</td><td className="p-4 tabular-nums">{money(balance.receivedCents ?? 0)}</td><td className="p-4 tabular-nums">{money(balance.incomingCents ?? 0)}</td><td className="p-4 tabular-nums">{money(balance.outgoingCents ?? 0)}</td><td className="p-4 tabular-nums">{money(balance.allocatedCents ?? 0)}</td><td className="p-4 font-bold tabular-nums text-emerald-900">{money(balance.availableCents ?? 0)}</td></tr>)}</tbody></table>
      </div>
      <form ref={form} onSubmit={prepare} className="mt-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-busy={busy}>
        <h3 className="text-lg font-bold">{reversal ? 'Estornar uma realocação' : 'Registrar uma realocação'}</h3>
        {reversal && <p className="mt-2 break-all text-xs text-slate-600">Estorno do registro {reversal.id}. A correção cria um novo lançamento em sentido contrário.</p>}
        <fieldset disabled={busy || !!review} className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div><label htmlFor={`${id}-source`} className="mb-2 block text-sm font-semibold">Projeto de origem</label><DonationDestinationPicker id={`${id}-source`} value={sourceId} onChange={setSourceId} disabled={busy || !!review || !!reversal} /></div>
          <div><label htmlFor={`${id}-destination`} className="mb-2 block text-sm font-semibold">Projeto de destino</label><DonationDestinationPicker id={`${id}-destination`} value={destinationId} onChange={setDestinationId} disabled={busy || !!review || !!reversal} /></div>
          <div><label htmlFor={`${id}-amount`} className="text-sm font-semibold">Valor a realocar (R$)</label><input ref={amountField} id={`${id}-amount`} type="text" inputMode="decimal" required maxLength={13} readOnly={!!reversal} disabled={!sourceId} value={amount} onChange={event => setAmount(event.target.value)} aria-invalid={exceedsBalance} aria-describedby={`${id}-limit${exceedsBalance ? ` ${id}-amount-error` : ''}`} className={`${field} ${exceedsBalance ? 'border-red-600 focus:ring-red-700' : ''}`} /><p id={`${id}-limit`} className="mt-2 text-sm font-medium text-slate-700">{sourceId ? `Disponível para realocar no período: ${money(availableCents)}` : 'Selecione a origem para consultar o limite.'}</p>{amountError && <p id={`${id}-amount-error`} role="alert" className="mt-2 text-sm text-red-800">{amountError}</p>}</div>
          <label className="text-sm font-semibold">Responsável pelo registro<input type="text" required minLength={3} maxLength={120} value={responsible} onChange={event => setResponsible(event.target.value)} className={field} /></label>
          <label className="text-sm font-semibold md:col-span-2">Motivo e finalidade<textarea required minLength={10} maxLength={1000} rows={3} value={reason} onChange={event => setReason(event.target.value)} className={field} /></label>
        </fieldset>
        <p className="mt-4 text-xs leading-relaxed text-slate-600">A data de registro é preenchida automaticamente. Esta ação registra uma realocação interna; pagamentos e transferências bancárias são feitos separadamente.</p>
        {!review && <div className="mt-5 flex flex-wrap gap-3"><button disabled={busy || exceedsBalance || !sourceId || availableCents <= 0} className={button}>Conferir {reversal ? 'estorno' : 'realocação'}</button>{reversal && <button disabled={busy} type="button" onClick={() => {setReversal(null); setAmount(''); setReason('');}} className={secondary}>Cancelar estorno</button>}</div>}
        {review && <div className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-950"><h4 className="font-bold">Confira antes de registrar</h4><p className="mt-3">{money(review.amountCents)} de <strong>{findDonationDestination(review.sourceId)?.title}</strong> para <strong>{findDonationDestination(review.destinationId)?.title}</strong>.</p><p className="mt-2">Responsável: {review.responsible}</p><p className="mt-2 whitespace-pre-wrap">Motivo: {review.reason}</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={() => void confirm()} className={button}>{busy ? 'Registrando…' : 'Confirmar registro'}</button><button type="button" disabled={busy} onClick={() => setReview(null)} className={secondary}>Voltar e corrigir</button></div></div>}
      </form>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><div><h3 className="text-lg font-bold">Histórico de realocações e estornos</h3><p className="mt-2 text-xs text-slate-600">Período selecionado: {start.split('-').reverse().join('/')} a {end.split('-').reverse().join('/')}. Os registros não são apagados.</p></div><button disabled={busy || report.movements.length === 0} type="button" onClick={download} className={secondary}>Baixar realocações CSV</button></div>
      <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">{report.movements.map(movement => <article key={movement.id} className="p-5"><div className="flex flex-wrap justify-between gap-4"><div className="min-w-0 flex-1"><h4 className="font-semibold text-slate-900">{movement.sourceTitle} → {movement.destinationTitle}</h4><p className="mt-2 text-xs text-slate-600">{new Date(movement.createdAt).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'})} · Responsável informado: {movement.responsible}</p></div><strong className="text-lg tabular-nums">{money(movement.amountCents)}</strong></div><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{movement.reason}</p><p className="mt-3 break-all text-xs text-slate-600">Referência: {movement.id}{movement.reversalOf && ` · Estorno de: ${movement.reversalOf}`}</p>{!movement.reversalOf && <div className="mt-3">{reversed.has(movement.id) ? <span className="text-xs font-semibold text-slate-600">Registro estornado</span> : <button type="button" disabled={busy} onClick={() => reverse(movement)} className={secondary}>Estornar registro</button>}</div>}</article>)}</div>
      {report.movements.length === 0 && <p className="mt-4 text-sm text-slate-600">Nenhuma realocação registrada neste período.</p>}
    </>}
  </section>;
}

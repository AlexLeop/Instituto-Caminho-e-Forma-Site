import { useEffect, useRef, useState, type FormEvent } from 'react';
import { supporterStatementCsv, type SupporterProfile, type SupporterDonation } from '../../shared/supporter';
import { SUPPORTER_EMAIL_CODE_REQUIRED } from '../../shared/supporterAccess';
import { SupporterDashboard } from './SupporterDashboard';

interface SupporterPortalViewProps {onOpenDonation: () => void; onNavigateHome: () => void; onOpenTransparency: () => void}
const field = 'mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700';
const primary = 'min-h-12 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60';
const secondary = 'min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60';

export function SupporterPortalView({onOpenDonation, onNavigateHome, onOpenTransparency}: SupporterPortalViewProps) {
  const [profile, setProfile] = useState<SupporterProfile | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [phase, setPhase] = useState<'identity' | 'code'>('identity');
  const [email, setEmail] = useState('');
  const [suffix, setSuffix] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);
  const [resendAt, setResendAt] = useState(0);
  const [clock, setClock] = useState(Date.now());
  const controller = useRef<AbortController | null>(null);
  const sessionVersion = useRef(0);
  const channel = useRef<BroadcastChannel | null>(null);

  function clearSessionView() {
    sessionVersion.current++; controller.current?.abort();
    setProfile(null); setAuthenticated(false); setPhase('identity'); setCode(''); setMessage(''); setError('');
  }

  async function api(body?: unknown, page = 1) {
    const version = sessionVersion.current;
    const request = new AbortController(); controller.current = request;
    const timeout = setTimeout(() => request.abort(), 40000);
    try {
      const response = await fetch(`/api/supporter${body ? '' : `?page=${page}`}`, {method: body ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store', signal: request.signal,
        ...(body ? {headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)} : {})});
      const data = await response.json();
      if (version !== sessionVersion.current || request.signal.aborted) throw new DOMException('Consulta interrompida', 'AbortError');
      if (!response.ok) {if (response.status === 401) {setProfile(null); setAuthenticated(false);} throw Object.assign(new Error(data.error?.message || 'Não foi possível acessar suas doações.'), {status: response.status});}
      return data;
    } finally {clearTimeout(timeout); if (controller.current === request) controller.current = null;}
  }
  async function refresh(initial = false) {
    const version = sessionVersion.current;
    setBusy(true); setProfile(null); if (!initial) setError('');
    try {const data = await api(); setProfile(data.profile); setAuthenticated(true);}
    catch (failure) {if (version === sessionVersion.current && (failure as Error)?.name !== 'AbortError' && !(initial && (failure as any)?.status === 401)) setError(failure instanceof Error ? failure.message : 'Tente novamente.');}
    finally {if (version === sessionVersion.current) setBusy(false);}
  }
  useEffect(() => {void refresh(true); return () => controller.current?.abort();}, []);
  useEffect(() => {
    const revalidate = () => {
      if (document.visibilityState !== 'visible') return;
      clearSessionView(); void refresh(true);
    };
    const connection = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('icf-supporter-access') : null;
    channel.current = connection;
    if (connection) connection.onmessage = event => {
      if (!['signed-in', 'signed-out'].includes(event.data?.type)) return;
      clearSessionView(); setEmail(''); setSuffix('');
      if (event.data.type === 'signed-in') void refresh(true); else setBusy(false);
    };
    if (!connection) window.addEventListener('focus', revalidate);
    document.addEventListener('visibilitychange', revalidate);
    return () => {connection?.close(); channel.current = null; window.removeEventListener('focus', revalidate); document.removeEventListener('visibilitychange', revalidate);};
  }, []);
  useEffect(() => {
    if (phase !== 'code') return;
    const timer = setInterval(() => setClock(Date.now()), 1000); return () => clearInterval(timer);
  }, [phase]);
  useEffect(() => {
    if (!profile) return;
    const timer = setTimeout(() => {clearSessionView(); setBusy(false); setError('Sua sessão expirou. Entre novamente para consultar suas doações.');}, Math.max(0, Date.parse(profile.expiresAt) - Date.now()));
    return () => clearTimeout(timer);
  }, [profile?.expiresAt]);

  async function requestCode(event?: FormEvent) {
    const version = sessionVersion.current;
    event?.preventDefault(); setBusy(true); setError('');
    try {
      const result = await api({action: 'request-code', email, documentSuffix: suffix});
      setPhase('code'); setCode(''); setMessage(result.message); setResendAt(Date.now() + 60000); setClock(Date.now());
    } catch (failure) {if (version === sessionVersion.current && (failure as Error)?.name !== 'AbortError') setError(failure instanceof Error ? failure.message : 'Não foi possível solicitar o código.');}
    finally {if (version === sessionVersion.current) setBusy(false);}
  }
  async function login(event: FormEvent) {
    event.preventDefault(); clearSessionView(); const version = sessionVersion.current; setBusy(true);
    try {
      await api({action: 'login', email, documentSuffix: suffix});
      setEmail(''); setSuffix(''); setAuthenticated(true); channel.current?.postMessage({type: 'signed-in'}); await refresh();
    } catch (failure) {if (version === sessionVersion.current && (failure as Error)?.name !== 'AbortError') setError(failure instanceof Error ? failure.message : 'Confira os dados informados.');}
    finally {if (version === sessionVersion.current) setBusy(false);}
  }
  async function verify(event: FormEvent) {
    event.preventDefault(); const submittedCode = code; sessionVersion.current++; controller.current?.abort(); setProfile(null); setAuthenticated(false); const version = sessionVersion.current; setBusy(true); setError('');
    try {await api({action: 'verify-code', code: submittedCode}); setCode(''); setAuthenticated(true); channel.current?.postMessage({type: 'signed-in'}); await refresh();}
    catch (failure) {if (version === sessionVersion.current && (failure as Error)?.name !== 'AbortError') setError(failure instanceof Error ? failure.message : 'Confira o código recebido.');}
    finally {if (version === sessionVersion.current) setBusy(false);}
  }
  async function logout() {
    clearSessionView(); setEmail(''); setSuffix(''); const version = sessionVersion.current; setBusy(true);
    try {await api({action: 'logout'});} catch { /* Server session also expires after 30 minutes. */ }
    finally {if (version === sessionVersion.current) {channel.current?.postMessage({type: 'signed-out'}); setBusy(false);}}
  }
  function assertSameSupporter(next: SupporterProfile, expected: SupporterProfile) {
    if (next.email === expected.email && next.documentSuffix === expected.documentSuffix) return;
    clearSessionView(); void refresh(true); throw new DOMException('Sessão alterada', 'AbortError');
  }
  async function loadMore() {
    if (!profile?.nextPage) return;
    const version = sessionVersion.current;
    setBusy(true); setError('');
    try {const data = await api(undefined, profile.nextPage); assertSameSupporter(data.profile, profile); setProfile({...data.profile, donations: [...new Map([...profile.donations, ...data.profile.donations].map(record => [record.id, record])).values()]});}
    catch (failure) {if (version === sessionVersion.current && (failure as Error)?.name !== 'AbortError') setError(failure instanceof Error ? failure.message : 'Não foi possível carregar o histórico.');}
    finally {if (version === sessionVersion.current) setBusy(false);}
  }
  async function download() {
    if (!profile) return;
    const version = sessionVersion.current;
    setBusy(true); setError('');
    try {
      const records = new Map(profile.donations.map(record => [record.id, record])); let nextPage = profile.nextPage;
      while (nextPage !== null) {if (nextPage > 100) throw new Error('O histórico excede o limite de exportação. Entre em contato com o Instituto.'); const data = await api(undefined, nextPage); assertSameSupporter(data.profile, profile); data.profile.donations.forEach((record: SupporterDonation) => records.set(record.id, record)); nextPage = data.profile.nextPage;}
      const url = URL.createObjectURL(new Blob([supporterStatementCsv([...records.values()])], {type: 'text/csv;charset=utf-8'}));
      const link = document.createElement('a'); link.href = url; link.download = 'minhas-doacoes-instituto-caminho-e-forma.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (failure) {if (version === sessionVersion.current && (failure as Error)?.name !== 'AbortError') setError(failure instanceof Error ? failure.message : 'Não foi possível exportar o histórico.');}
    finally {if (version === sessionVersion.current) setBusy(false);}
  }

  function downloadRecord(record: SupporterDonation) {
    if (!profile?.donations.some(own => own.id === record.id)) return;
    const url = URL.createObjectURL(new Blob([supporterStatementCsv([record])], {type: 'text/csv;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'extrato-contribuicao-instituto-caminho-e-forma.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (authenticated && profile) return <SupporterDashboard profile={profile} busy={busy} error={error} onOpenDonation={onOpenDonation} onNavigateHome={onNavigateHome} onLogout={() => void logout()} onRefresh={() => void refresh()} onDownload={() => void download()} onDownloadRecord={downloadRecord} onLoadMore={() => void loadMore()} />;

  return <div className="w-full bg-white pt-28 pb-20 sm:pt-36">
    <div className="mx-auto max-w-5xl px-4 sm:px-8">
      <button onClick={onNavigateHome} type="button" className="mb-6 min-h-11 text-sm font-semibold text-emerald-800 hover:underline">Voltar ao início</button>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div><h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Área do apoiador</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">Acompanhe suas contribuições e os projetos que você apoiou no Instituto Caminho e Forma.</p></div>
        {authenticated && <button type="button" disabled={busy} onClick={() => void logout()} className={secondary}>Sair da minha conta</button>}
      </div>
      {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm leading-relaxed text-red-900">{error}</p>}
      {!authenticated && <section className="mt-8 max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-8" aria-label="Acesso restrito do apoiador">
        <h2 className="text-xl font-bold text-slate-900">{!SUPPORTER_EMAIL_CODE_REQUIRED || phase === 'identity' ? 'Acesse suas doações' : 'Confirme seu e-mail'}</h2>
        {!SUPPORTER_EMAIL_CODE_REQUIRED || phase === 'identity' ? <form onSubmit={SUPPORTER_EMAIL_CODE_REQUIRED ? requestCode : login} className="mt-5 space-y-5" aria-busy={busy}>
          <p className="text-sm leading-relaxed text-slate-600">Use o e-mail e os últimos quatro dígitos do CPF informados no checkout de uma doação confirmada.{SUPPORTER_EMAIL_CODE_REQUIRED && ' Enviaremos um código para esse e-mail.'}</p>
          <label className="block text-sm font-semibold text-slate-800">E-mail da doação<input type="email" autoComplete="email" required maxLength={254} disabled={busy} value={email} onChange={event => setEmail(event.target.value)} className={field} /></label>
          <label className="block text-sm font-semibold text-slate-800">Últimos 4 dígitos do CPF<input type="text" inputMode="numeric" autoComplete="off" required pattern="[0-9]{4}" maxLength={4} disabled={busy} value={suffix} onChange={event => setSuffix(event.target.value.replace(/\D/g, ''))} className={field} /></label>
          <button disabled={busy} className={`${primary} w-full`}>{busy ? 'Aguarde…' : SUPPORTER_EMAIL_CODE_REQUIRED ? 'Receber código por e-mail' : 'Entrar na área do apoiador'}</button>
        </form> : <form onSubmit={verify} className="mt-5 space-y-5" aria-busy={busy}>
          <p className="text-sm leading-relaxed text-slate-600">{message} Confira também a caixa de spam. O acesso precisa ser concluído em até 10 minutos.</p>
          <label className="block text-sm font-semibold text-slate-800">Código recebido por e-mail<input type="text" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6,10}" minLength={6} maxLength={10} disabled={busy} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, ''))} className={`${field} font-mono text-xl tracking-widest`} /></label>
          <button disabled={busy} className={`${primary} w-full`}>{busy ? 'Confirmando…' : 'Entrar na área do apoiador'}</button>
          <div className="flex flex-wrap gap-3"><button type="button" disabled={busy || clock < resendAt} onClick={() => void requestCode()} className={secondary}>{clock < resendAt ? `Reenviar em ${Math.ceil((resendAt-clock)/1000)}s` : 'Reenviar código'}</button><button type="button" disabled={busy} onClick={() => {setPhase('identity'); setCode(''); setError('');}} className={secondary}>Alterar dados</button></div>
        </form>}
        <p className="mt-5 text-xs leading-relaxed text-slate-600">Sua sessão dura até 30 minutos. Não pedimos o CPF completo, senha do banco ou dados do cartão.</p>
      </section>}
      {authenticated && !profile && <div className="mt-8"><p className="text-sm text-slate-700">{busy ? 'Consultando suas doações…' : 'Consulte seu histórico novamente.'}</p><button disabled={busy} onClick={() => void refresh()} className={`${primary} mt-4`}>Atualizar histórico</button></div>}
      <div className="mt-8 flex flex-wrap gap-4 text-sm"><button type="button" onClick={onOpenTransparency} className="min-h-11 font-semibold text-emerald-800 hover:underline">Conhecer a transparência do Instituto</button><a href="https://wa.me/5521987428647" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-emerald-800 hover:underline">Preciso de ajuda com meu acesso</a></div>
    </div>
  </div>;
}

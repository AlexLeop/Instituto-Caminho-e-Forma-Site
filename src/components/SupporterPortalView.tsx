import { useEffect, useRef, useState, type FormEvent } from 'react';
import { supporterStatementCsv, type SupporterProfile, type SupporterDonation } from '../../shared/supporter';
import { SUPPORTER_EMAIL_CODE_REQUIRED } from '../../shared/supporterAccess';
import { formatDonationAmount as money } from '../data/donations';

interface SupporterPortalViewProps {onOpenDonation: () => void; onNavigateHome: () => void; onOpenTransparency: () => void}
const field = 'mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700';
const primary = 'min-h-12 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60';
const secondary = 'min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60';
const date = (value: string | null) => value ? new Date(value.length === 10 ? `${value}T12:00:00-03:00` : value).toLocaleDateString('pt-BR', {timeZone: 'America/Sao_Paulo'}) : 'Não informada';

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

  async function api(body?: unknown, page = 1) {
    const request = new AbortController(); controller.current = request;
    const timeout = setTimeout(() => request.abort(), 40000);
    try {
      const response = await fetch(`/api/supporter${body ? '' : `?page=${page}`}`, {method: body ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store', signal: request.signal,
        ...(body ? {headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)} : {})});
      const data = await response.json();
      if (!response.ok) {if (response.status === 401) {setProfile(null); setAuthenticated(false);} throw Object.assign(new Error(data.error?.message || 'Não foi possível acessar suas doações.'), {status: response.status});}
      return data;
    } finally {clearTimeout(timeout); if (controller.current === request) controller.current = null;}
  }
  async function refresh(initial = false) {
    setBusy(true); if (!initial) setError('');
    try {const data = await api(); setProfile(data.profile); setAuthenticated(true);}
    catch (failure) {if (!(initial && (failure as any)?.status === 401)) setError(failure instanceof Error ? failure.message : 'Tente novamente.');}
    finally {setBusy(false);}
  }
  useEffect(() => {void refresh(true); return () => controller.current?.abort();}, []);
  useEffect(() => {
    if (phase !== 'code') return;
    const timer = setInterval(() => setClock(Date.now()), 1000); return () => clearInterval(timer);
  }, [phase]);
  useEffect(() => {
    if (!profile) return;
    const timer = setTimeout(() => {setProfile(null); setAuthenticated(false); setPhase('identity'); setCode(''); setError('Sua sessão expirou. Entre novamente para consultar suas doações.');}, Math.max(0, Date.parse(profile.expiresAt) - Date.now()));
    return () => clearTimeout(timer);
  }, [profile?.expiresAt]);

  async function requestCode(event?: FormEvent) {
    event?.preventDefault(); setBusy(true); setError('');
    try {
      const result = await api({action: 'request-code', email, documentSuffix: suffix});
      setPhase('code'); setCode(''); setMessage(result.message); setResendAt(Date.now() + 60000); setClock(Date.now());
    } catch (failure) {setError(failure instanceof Error ? failure.message : 'Não foi possível solicitar o código.');}
    finally {setBusy(false);}
  }
  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      await api({action: 'login', email, documentSuffix: suffix});
      setEmail(''); setSuffix(''); setAuthenticated(true); await refresh();
    } catch (failure) {setError(failure instanceof Error ? failure.message : 'Confira os dados informados.');}
    finally {setBusy(false);}
  }
  async function verify(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try {await api({action: 'verify-code', code}); setCode(''); setAuthenticated(true); await refresh();}
    catch (failure) {setError(failure instanceof Error ? failure.message : 'Confira o código recebido.');}
    finally {setBusy(false);}
  }
  async function logout() {
    controller.current?.abort(); setProfile(null); setAuthenticated(false); setPhase('identity'); setCode(''); setMessage(''); setBusy(true);
    try {await api({action: 'logout'});} catch { /* Server session also expires after 30 minutes. */ } finally {setBusy(false);}
  }
  async function loadMore() {
    if (!profile?.nextPage) return;
    setBusy(true); setError('');
    try {const data = await api(undefined, profile.nextPage); setProfile({...data.profile, donations: [...new Map([...profile.donations, ...data.profile.donations].map(record => [record.id, record])).values()]});}
    catch (failure) {setError(failure instanceof Error ? failure.message : 'Não foi possível carregar o histórico.');}
    finally {setBusy(false);}
  }
  async function download() {
    if (!profile) return;
    setBusy(true); setError('');
    try {
      const records = new Map(profile.donations.map(record => [record.id, record])); let nextPage = profile.nextPage;
      while (nextPage !== null) {if (nextPage > 100) throw new Error('O histórico excede o limite de exportação. Entre em contato com o Instituto.'); const data = await api(undefined, nextPage); data.profile.donations.forEach((record: SupporterDonation) => records.set(record.id, record)); nextPage = data.profile.nextPage;}
      const url = URL.createObjectURL(new Blob([supporterStatementCsv([...records.values()])], {type: 'text/csv;charset=utf-8'}));
      const link = document.createElement('a'); link.href = url; link.download = 'minhas-doacoes-instituto-caminho-e-forma.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (failure) {setError(failure instanceof Error ? failure.message : 'Não foi possível exportar o histórico.');}
    finally {setBusy(false);}
  }

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
      {profile && <section className="mt-8" aria-label="Meu histórico de doações">
        <div className="border-y border-slate-200 py-6"><h2 className="text-xl font-bold text-slate-900">Olá, {profile.name}.</h2><p className="mt-2 break-all text-sm text-slate-600">{profile.email} · CPF com final {profile.documentSuffix}</p><dl className="mt-6 flex flex-wrap gap-x-12 gap-y-5"><div><dt className="text-sm text-slate-600">Suas doações confirmadas</dt><dd className="mt-1 text-2xl font-bold text-emerald-900">{money(profile.totalCents)}</dd></div><div><dt className="text-sm text-slate-600">Contribuições confirmadas</dt><dd className="mt-1 text-2xl font-bold text-slate-900">{profile.donationCount}</dd></div></dl></div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-bold text-slate-900">Minhas contribuições</h2><div className="flex flex-wrap gap-3"><button disabled={busy} type="button" onClick={() => void download()} className={secondary}>Baixar extrato CSV</button><button type="button" onClick={onOpenDonation} className={primary}>Fazer outra doação</button></div></div>
        <div className="mt-4 divide-y divide-slate-200">{profile.donations.map(record => {
          const paid = record.status === 'PAID' && record.paidCents >= record.amountCents;
          return <article key={record.id} className="flex flex-wrap justify-between gap-4 py-5">
            <div className="min-w-0 flex-1"><h3 className="text-base font-semibold text-slate-900">{record.destinationTitle}</h3><p className="mt-2 text-sm text-slate-600">{paid ? `Pagamento em ${date(record.paidOn)}` : `Emissão em ${date(record.createdAt)}`} · {record.method}</p><p className="mt-2 break-all text-xs text-slate-600">Referência: {record.id}</p></div>
            <div><p className="text-right text-lg font-bold text-slate-900">{money(paid ? record.paidCents : record.amountCents)}</p><p className={`mt-2 text-right text-sm font-semibold ${paid ? 'text-emerald-800' : 'text-slate-600'}`}>{paid ? 'Confirmada' : record.status === 'CANCELLED' ? 'Cancelada' : record.status === 'LATE' ? 'Vencida' : 'Aguardando confirmação'}</p></div>
          </article>;
        })}</div>
        {profile.donations.length === 0 && <p className="py-6 text-sm text-slate-600">Nenhuma contribuição vinculada a estes dados.</p>}
        {profile.nextPage && <button disabled={busy} type="button" onClick={() => void loadMore()} className={`${secondary} mt-4`}>Ver mais contribuições</button>}
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-slate-600">Os destinos acima preservam o registro da sua contribuição. Realocações posteriores dos recursos são registradas pela equipe na prestação de contas. O extrato não substitui um recibo emitido pelo Instituto.</p>
      </section>}
      <div className="mt-8 flex flex-wrap gap-4 text-sm"><button type="button" onClick={onOpenTransparency} className="min-h-11 font-semibold text-emerald-800 hover:underline">Conhecer a transparência do Instituto</button><a href="https://wa.me/5521987428647" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-emerald-800 hover:underline">Preciso de ajuda com meu acesso</a></div>
    </div>
  </div>;
}

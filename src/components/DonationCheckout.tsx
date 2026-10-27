import React, { useId, useState } from 'react';
import { PROJECTS } from '../data/mockData';
import { parseAmount, validDocument } from '../../shared/checkout';
import type { PaymentMethod } from '../../shared/checkout';
import { useDonationCheckout } from '../hooks/useDonationCheckout';

interface Props {projectId?: string; initialProject?: string; allowProjectSelection?: boolean}
const currency = (cents: number) => (cents / 100).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
const fieldClass = 'min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30';
const secondaryClass = 'min-h-11 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60';

export function DonationCheckout({projectId, initialProject, allowProjectSelection = false}: Props) {
  const selected = PROJECTS.find(p => p.id === initialProject || p.title === initialProject)?.id;
  const [destination, setDestination] = useState(projectId || selected || 'geral');
  const [amount, setAmount] = useState('50');
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [validation, setValidation] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const {payment, busy, checking, error, create, refresh, reset} = useDonationCheckout(projectId || selected || 'geral');
  const id = useId();
  const label = (suffix: string) => `${id}-${suffix}`;
  const amountCents = parseAmount(amount);

  async function copy(value: string, key: string) {
    try { await navigator.clipboard.writeText(value); setCopied(key); setCopyError(false); }
    catch { setCopyError(true); }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setValidation(null);
    if (!Number.isSafeInteger(amountCents) || amountCents < 500 || amountCents > 5000000) {setValidation('Informe um valor entre R$ 5,00 e R$ 50.000,00.'); return;}
    if (!validDocument(document)) {setValidation('Informe um CPF ou CNPJ válido.'); return;}
    await create({amountCents, method, frequency: 'single', projectId: destination, customer: {name: name.trim().replace(/\s+/g, ' '), email: email.trim(), document: document.replace(/[.\-/\s]/g, '')}});
  }

  if (payment) {
    const cancelled = payment.status === 'CANCELLED';
    const dueDate = new Date(`${payment.dueDate}T12:00:00-03:00`).toLocaleDateString('pt-BR');
    return <div className="space-y-4 pt-5" aria-live="polite" aria-busy={checking}>
      <div className={`rounded-xl p-4 ${payment.paid ? 'bg-emerald-50 text-emerald-950' : 'bg-slate-50 text-slate-900'}`}>
        <h3 className="font-serif text-xl font-bold">{payment.paid ? 'Pagamento confirmado' : cancelled ? 'Cobrança cancelada' : 'Sua doação está quase pronta'}</h3>
        <p className="mt-2 text-sm leading-relaxed">{payment.paid ? 'Obrigado por apoiar o Instituto Caminho e Forma!' : cancelled ? 'Esta cobrança não pode mais ser paga.' : 'Conclua o pagamento no aplicativo do seu banco. A confirmação aparecerá aqui após a consulta à Cora.'}</p>
        <p className="mt-3 text-2xl font-bold">{currency(payment.amountCents)}</p>
        <p className="mt-1 text-xs">{payment.projectTitle} • Doação única</p>
      </div>
      {!payment.paid && !cancelled && <>
        <p className="text-sm text-slate-700">Vencimento: <strong>{dueDate}</strong>. {payment.status === 'LATE' ? 'Esta cobrança está vencida; confira a disponibilidade de pagamento no seu banco.' : payment.status === 'IN_PAYMENT' ? 'O banco está processando o pagamento.' : 'Aguardando pagamento.'}</p>
        {payment.pixCode && <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900">Pagar com Pix</h4>
          {payment.qrCodeDataUrl && <img src={payment.qrCodeDataUrl} alt="QR Code Pix desta doação" width={240} height={240} className="mx-auto h-60 w-60 max-w-full rounded-xl border border-slate-200 bg-white" />}
          <label htmlFor={label('pix')} className="block text-xs font-semibold text-slate-700">Pix Copia e Cola</label>
          <textarea id={label('pix')} readOnly value={payment.pixCode} rows={3} className={`${fieldClass} break-all font-mono text-xs`} onFocus={e => e.target.select()} />
          <button type="button" onClick={() => copy(payment.pixCode!, 'pix')} className="min-h-11 w-full rounded-xl bg-[#b45309] px-4 py-3 text-sm font-bold text-white hover:bg-[#92400e]">{copied === 'pix' ? 'Código Pix copiado' : 'Copiar código Pix'}</button>
        </div>}
        {payment.method === 'pix' && !payment.pixCode && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">A cobrança foi criada e o banco ainda não disponibilizou o Pix. Use “Verificar pagamento” para consultar novamente. Se continuar indisponível, fale com o Instituto.</p>}
        {payment.method === 'boleto' && <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900">Pagar com boleto</h4>
          {payment.boletoUrl ? <a href={payment.boletoUrl} target="_blank" rel="noopener noreferrer" className={`${secondaryClass} flex items-center justify-center`}>Abrir boleto em PDF</a> : <p className="text-sm text-slate-700">O banco está registrando o boleto. Consulte novamente em instantes.</p>}
          {payment.boletoLine && <>
            <label htmlFor={label('boleto')} className="block text-xs font-semibold text-slate-700">Linha digitável</label>
            <textarea id={label('boleto')} readOnly rows={2} value={payment.boletoLine} className={`${fieldClass} break-all font-mono text-xs`} onFocus={e => e.target.select()} />
            <button type="button" onClick={() => copy(payment.boletoLine!, 'boleto')} className={secondaryClass}>{copied === 'boleto' ? 'Linha digitável copiada' : 'Copiar linha digitável'}</button>
          </>}
        </div>}
        <button type="button" disabled={checking} onClick={() => void refresh()} className="min-h-11 w-full rounded-xl bg-[#166534] px-4 py-3 text-sm font-bold text-white hover:bg-[#14532d] disabled:cursor-wait disabled:opacity-60">{checking ? 'Consultando pagamento…' : 'Já paguei, verificar pagamento'}</button>
        <p className="text-xs leading-relaxed text-slate-600">Pix e boleto pertencem à mesma cobrança. Pague apenas uma vez. A confirmação do boleto pode levar mais tempo que a do Pix.</p>
      </>}
      {payment.paid && <p className="text-sm leading-relaxed text-slate-700">Você pode guardar o comprovante no aplicativo do seu banco. Para solicitar um recibo ao Instituto, informe a referência abaixo.</p>}
      {copyError && <p role="alert" className="text-sm text-red-800">Não foi possível copiar automaticamente. Selecione o código acima e copie manualmente.</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-900">{error}</p>}
      <p className="break-all text-xs text-slate-600">Referência: {payment.id}</p>
      <button type="button" disabled={checking} onClick={reset} className={secondaryClass}>Fazer outra doação</button>
      {!payment.paid && !cancelled && <p className="text-xs text-slate-600">A cobrança acima continua válida. Gere outra somente se quiser fazer uma nova doação.</p>}
    </div>;
  }

  return <form onSubmit={submit} className="space-y-4 pt-5" aria-busy={busy}>
    <fieldset disabled={busy} className="space-y-4 disabled:opacity-70">
      <legend className="mb-2 text-sm font-semibold text-slate-900">Doação única por Pix ou boleto</legend>
      <div>
        <label htmlFor={label('amount')} className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Valor da doação</label>
        <div className="mb-2 grid grid-cols-4 gap-2">
          {[30, 50, 100, 250].map(value => <button key={value} type="button" onClick={() => setAmount(String(value))} aria-pressed={amountCents === value * 100} className={`min-h-11 rounded-xl border px-1 py-2 text-sm font-bold ${amountCents === value * 100 ? 'border-[#b45309] bg-[#b45309] text-white' : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'}`}>R$ {value}</button>)}
        </div>
        <input id={label('amount')} inputMode="decimal" autoComplete="off" required maxLength={9} value={amount} onChange={e => setAmount(e.target.value)} placeholder="Outro valor em reais" className={fieldClass} aria-describedby={label('minimum')} />
        <p id={label('minimum')} className="mt-1 text-xs text-slate-600">Valor em reais. Mínimo de R$ 5,00.</p>
      </div>
      {allowProjectSelection && <div>
        <label htmlFor={label('project')} className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Destinar para</label>
        <select id={label('project')} value={destination} onChange={e => setDestination(e.target.value)} className={fieldClass}>
          <option value="geral">Fundo Geral de Acolhimento Comunitário</option>
          {PROJECTS.map(project => <option key={project.id} value={project.id}>{project.title}</option>)}
        </select>
      </div>}
      <div>
        <label htmlFor={label('name')} className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Nome completo</label>
        <input id={label('name')} autoComplete="name" required minLength={3} maxLength={60} value={name} onChange={e => setName(e.target.value)} className={fieldClass} />
      </div>
      <div>
        <label htmlFor={label('email')} className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">E-mail</label>
        <input id={label('email')} type="email" autoComplete="email" required maxLength={60} value={email} onChange={e => setEmail(e.target.value)} className={fieldClass} />
      </div>
      <div>
        <label htmlFor={label('document')} className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">CPF ou CNPJ</label>
        <input id={label('document')} inputMode="numeric" autoComplete="off" required maxLength={18} value={document} onChange={e => setDocument(e.target.value)} className={fieldClass} aria-describedby={label('document-help')} />
        <p id={label('document-help')} className="mt-1 text-xs text-slate-600">Necessário para registrar a cobrança no banco.</p>
      </div>
      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">Forma de pagamento</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['pix', 'boleto'] as const).map(option => <label key={option} className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold ${method === option ? 'border-[#166534] bg-emerald-50 text-emerald-950' : 'border-slate-300 text-slate-900'}`}>
            <input type="radio" name={label('method')} value={option} checked={method === option} onChange={() => setMethod(option)} className="accent-[#166534]" />
            {option === 'pix' ? 'Pix' : 'Boleto'}
          </label>)}
        </div>
      </fieldset>
    </fieldset>
    {(validation || error) && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm leading-relaxed text-red-900">{validation || error}</p>}
    {error && <div className="space-y-2">
      <button type="button" disabled={busy} onClick={() => {reset(); setValidation(null);}} className={secondaryClass}>Descartar tentativa e começar outra doação</button>
      <p className="text-xs text-slate-600">Se o banco já emitiu uma cobrança, ela continua válida. Para recuperar a mesma cobrança, mantenha os dados e tente novamente no botão abaixo.</p>
    </div>}
    <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#b45309] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#92400e] disabled:cursor-wait disabled:opacity-60">{busy ? 'Gerando cobrança…' : `Gerar ${method === 'pix' ? 'Pix' : 'boleto'}${Number.isSafeInteger(amountCents) && amountCents >= 500 ? ` de ${currency(amountCents)}` : ''}`}</button>
    <p className="text-center text-xs leading-relaxed text-slate-600">O pagamento é feito no seu banco. Gerar a cobrança ainda não confirma a doação.</p>
  </form>;
}

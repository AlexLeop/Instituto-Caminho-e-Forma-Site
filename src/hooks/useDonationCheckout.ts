import { useCallback, useEffect, useRef, useState } from 'react';
import type { CheckoutInput, CheckoutPayment } from '../../shared/checkout';

type Attempt = {fingerprint: string; idempotencyKey: string; issuedAt: string};
const readStorage = (key: string) => { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; } };
const saveStorage = (key: string, value: unknown) => { try { value === null ? sessionStorage.removeItem(key) : sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* Retain in-memory state if storage is unavailable. */ } };

async function callCheckout(body: unknown): Promise<CheckoutPayment> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55000);
  try {
    const response = await fetch('/api/checkout', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body), signal: controller.signal, cache: 'no-store'});
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.payment) throw new Error(json?.error?.message || 'Não foi possível acessar o pagamento. Tente novamente com os mesmos dados.');
    return json.payment;
  } catch (error) {
    if (error instanceof TypeError || (error instanceof Error && error.name === 'AbortError')) throw new Error('A conexão foi interrompida. Tente novamente com os mesmos dados para recuperar a cobrança.');
    throw error;
  } finally { clearTimeout(timeout); }
}

export function useDonationCheckout(scope: string) {
  const storageKey = `icf:checkout:v1:${scope}`;
  const [payment, setPayment] = useState<CheckoutPayment | null>(() => {
    const stored = readStorage(storageKey + ':payment');
    if (!stored || typeof stored.checkoutToken !== 'string' || typeof stored.id !== 'string' || !Number.isFinite(stored.expiresAt) || stored.expiresAt <= Date.now() || !Number.isSafeInteger(stored.amountCents) || !['pix', 'boleto'].includes(stored.method)) return null;
    // Client storage is not proof of payment: consult the bank before confirming.
    return {...stored, paid: false, status: 'DRAFT'};
  });
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentRef = useRef(payment);
  const attemptRef = useRef<Attempt | null>(readStorage(storageKey + ':attempt'));
  const requestInFlight = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => {mounted.current = false;}; }, []);
  const accept = useCallback((next: CheckoutPayment) => {
    paymentRef.current = next;
    saveStorage(storageKey + ':payment', next);
    if (mounted.current) setPayment(next);
  }, [storageKey]);
  const refresh = useCallback(async () => {
    const current = paymentRef.current;
    if (!current || requestInFlight.current) return;
    requestInFlight.current = true;
    if (mounted.current) {setChecking(true); setError(null);}
    try { accept(await callCheckout({action: 'status', checkoutToken: current.checkoutToken})); }
    catch (err) { if (mounted.current) setError(err instanceof Error ? err.message : 'Não foi possível consultar o pagamento.'); }
    finally {requestInFlight.current = false; if (mounted.current) setChecking(false);}
  }, [accept]);
  useEffect(() => {
    if (!payment?.id || payment.paid || payment.status === 'CANCELLED') return;
    const started = Date.now();
    void refresh();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - started < 20 * 60000 && (paymentRef.current?.expiresAt || 0) > Date.now()) void refresh();
    }, 10000);
    return () => clearInterval(timer);
  }, [payment?.id, payment?.paid, payment?.status === 'CANCELLED', refresh]);
  const create = async (input: Omit<CheckoutInput, 'idempotencyKey' | 'issuedAt'>) => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setBusy(true); setError(null);
    try {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(input)));
      const fingerprint = [...new Uint8Array(digest)].map(n => n.toString(16).padStart(2, '0')).join('');
      if (!attemptRef.current || attemptRef.current.fingerprint !== fingerprint) {
        attemptRef.current = {fingerprint, idempotencyKey: crypto.randomUUID(), issuedAt: new Date().toISOString()};
        saveStorage(storageKey + ':attempt', attemptRef.current);
      }
      const {idempotencyKey, issuedAt} = attemptRef.current;
      accept(await callCheckout({action: 'create', checkout: {...input, idempotencyKey, issuedAt}}));
    } catch (err) { if (mounted.current) setError(err instanceof Error ? err.message : 'Não foi possível gerar a cobrança.'); }
    finally {requestInFlight.current = false; if (mounted.current) setBusy(false);}
  };
  const reset = () => {
    paymentRef.current = null; attemptRef.current = null;
    saveStorage(storageKey + ':payment', null); saveStorage(storageKey + ':attempt', null);
    setPayment(null); setError(null);
  };
  return {payment, busy, checking, error, create, refresh, reset};
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SupporterDashboard } from '../src/components/SupporterDashboard.tsx';
import { Header } from '../src/components/Header.tsx';
import { Footer } from '../src/components/Footer.tsx';
import type { SupporterProfile } from '../shared/supporter.ts';

const nothing = () => {};
const supporter = (ead: boolean): SupporterProfile => ({
  authenticationMethod: 'email_document', name: ead ? 'Apoiadora A' : 'Apoiador B', email: ead ? 'a@example.com' : 'b@example.com', documentSuffix: ead ? '1111' : '2222',
  expiresAt: '2026-12-31T12:00:00Z', firstPaidOn: '2026-10-29', lastPaidOn: '2026-10-29', totalCents: ead ? 55000 : 10000, donationCount: 1,
  destinations: [{destinationId: ead ? 'cursos-ead' : 'futebol', title: ead ? 'Cursos EAD' : 'Futebol', paidCents: ead ? 55000 : 10000, donationCount: 1}],
  donations: [{id: ead ? 'only-A' : 'only-B', createdAt: '2026-10-29T12:00:00Z', paidOn: '2026-10-29', status: 'PAID', amountCents: ead ? 55000 : 10000, paidCents: ead ? 55000 : 10000, destinationTitle: ead ? 'Cursos EAD' : 'Futebol', method: 'PIX'}], nextPage: null,
});
const dashboard = (profile: SupporterProfile) => renderToStaticMarkup(createElement(SupporterDashboard, {
  profile, busy: false, error: '', onOpenDonation: nothing, onNavigateHome: nothing, onLogout: nothing, onRefresh: nothing, onDownload: nothing, onDownloadRecord: nothing, onLoadMore: nothing,
}));

test('the supporter dashboard renders only personal destinations and hides unlinked sections', () => {
  const a = dashboard(supporter(true)), b = dashboard(supporter(false));
  assert.ok(a.includes('Seu apoio aos cursos EAD')); assert.ok(a.includes('only-A')); assert.ok(!a.includes('only-B'));
  assert.ok(b.includes('Futebol')); assert.ok(b.includes('only-B')); assert.ok(!b.includes('only-A'));
  assert.ok(!b.includes('Seu apoio aos cursos EAD')); assert.ok(!b.includes('Cursos EAD')); assert.ok(!b.includes('a@example.com'));
  for (const html of [a,b]) for (const generic of ['Meus Cursos em Andamento','Agenda de Encontros Exclusivos','Clube de Benefícios','Ainda não disponível no seu portal']) assert.ok(!html.includes(generic), generic);
});

test('portal access links are absent inside the portal and remain available on public pages', () => {
  const portal = renderToStaticMarkup(createElement(Header, {currentPage: 'portal-do-apoiador', onNavigate: nothing, onOpenDonation: nothing, onOpenTransparency: nothing}));
  const home = renderToStaticMarkup(createElement(Header, {currentPage: 'inicio', onNavigate: nothing, onOpenDonation: nothing, onOpenTransparency: nothing}));
  assert.ok(!portal.includes('href="/portal-do-apoiador"')); assert.ok(home.includes('href="/portal-do-apoiador"'));
  const footer = (hide: boolean) => renderToStaticMarkup(createElement(Footer, {hideSupporterPortal: hide, onNavigate: nothing, onOpenTransparency: nothing}));
  assert.ok(!footer(true).includes('href="/portal-do-apoiador"')); assert.ok(footer(false).includes('href="/portal-do-apoiador"'));
});

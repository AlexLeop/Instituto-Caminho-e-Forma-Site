import test from 'node:test';
import assert from 'node:assert/strict';
import {assembleCatalog, assembleStoreCatalog, CatalogError, createCatalogService, readCatalogConfig, validateStoreProducts, type StoreOffer, type StoreProduct} from '../server/cgd/catalog.ts';
import {createCoursesHandler} from '../api/courses.ts';
import {filterCatalog, formatCoursePrice} from '../shared/courseCatalog.ts';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {CatalogProductCard} from '../src/components/CoursesView.tsx';

// Fictional, test-only offers. Never used as a production catalog or real prices.
const shop = new URL('https://school.example.com/');
const env = {CGD_API_KEY: 'private-server-token', CGD_URL_LOJA: shop.href};
const offer: StoreOffer = {type: 'cgd', courseId: 1, priceCents: 12345, detailsUrl: `${shop}curso/administracao`};
const row = {id: 1, titulo: 'Administração', descricao_geral: 'Gestão de negócios', carga_horaria: 24,
  imagem_url: 'https://images.example.com/course.jpg', private_field: 'must-not-be-public'};
const catalogs = [{type: 'cgd' as const, payload: {data: [row, {...row, id: 2, titulo: 'Não publicado'}]}},
  {type: 'autoria' as const, payload: {data: [{...row, titulo: 'Autoria com mesmo ID'}]}}];
const product: StoreProduct = {id: 'cgd:1', kind: 'course', title: row.titulo, category: 'Administrativos', hours: 24, priceCents: offer.priceCents,
  catalogRef: {type: 'cgd', courseId: 1}, detailsUrl: offer.detailsUrl};

test('only confirmed shop offers are exposed; catalog types and public fields stay separate', () => {
  const result = assembleCatalog(catalogs, [offer], shop);
  assert.equal(result.length, 1); assert.equal(result[0].title, row.titulo);
  assert.equal(result[0].hours, 24); assert.equal(result[0].priceCents, 12345);
  assert.equal(result[0].detailsUrl, offer.detailsUrl);
  assert.ok(!JSON.stringify(result).includes('must-not-be-public'));
  assert.equal(assembleCatalog(catalogs, [{...offer, type: 'autoria'}], shop)[0].title, 'Autoria com mesmo ID');
});

test('missing or invalid prices never become free courses and missing metadata never becomes a guessed listing', () => {
  for (const priceCents of [undefined, 0, -1, 1.2, NaN, Infinity]) {
    assert.throws(() => assembleCatalog(catalogs, [{...offer, priceCents} as StoreOffer], shop), CatalogError);
  }
  assert.throws(() => assembleCatalog(catalogs, [{...offer, courseId: 999}], shop), /incomplete_course_metadata/);
  assert.throws(() => assembleCatalog([{type: 'cgd', payload: {data: [{...row, carga_horaria: null}]}}], [offer], shop), /incomplete_course_metadata/);
  assert.throws(() => assembleCatalog(catalogs, [offer, offer], shop), /duplicate_store_offer/);
});

test('course links must be explicit HTTPS detail pages within the configured shop', () => {
  for (const detailsUrl of [shop.href, `${shop}?course=1`, 'javascript:alert(1)', 'http://school.example.com/curso/a',
    'https://other.example.com/curso/a', 'https://secret@school.example.com/curso/a', '/curso/guessed']) {
    assert.throws(() => assembleCatalog(catalogs, [{...offer, detailsUrl}], shop), CatalogError);
  }
  assert.throws(() => assembleCatalog(catalogs, [offer], new URL(`${shop}school/`)), /invalid_course_url/);
});

test('catalog search ignores accents, combines words and keeps alphabetical order', () => {
  const course = assembleCatalog(catalogs, [offer], shop)[0];
  const list = [course, {...course, id: 'cgd:2', title: 'Excel'}];
  assert.equal(filterCatalog(list, 'administracao')[0].id, 'cgd:1');
  assert.equal(filterCatalog(list, 'negocios gestao').length, 2);
  assert.equal(filterCatalog(list, 'inexistente').length, 0);
  assert.deepEqual(filterCatalog(list.reverse(), '').map(c => c.title), ['Administração', 'Excel']);
  assert.match(formatCoursePrice(12345), /123,45/);
});

test('provider access is GET only, server-authenticated, deduplicated and cached', async () => {
  const calls: {url: string; options?: RequestInit}[] = [];
  const fetcher: typeof fetch = async (url, options) => {
    calls.push({url: String(url), options});
    await Promise.resolve();
    return Response.json(String(url).endsWith('tipo=cgd') ? catalogs[0].payload : {data: []});
  };
  const read = createCatalogService(env, fetcher, [product]);
  const [a, b] = await Promise.all([read(), read()]);
  assert.deepEqual(a, b); await read(); assert.equal(calls.length, 2);
  for (const call of calls) {
    assert.equal(call.options?.method, 'GET');
    assert.equal(new Headers(call.options?.headers).get('Authorization'), `Bearer ${env.CGD_API_KEY}`);
    assert.equal(new URL(call.url).origin, 'https://api.cursoo.com.br');
    assert.equal(call.options?.redirect, 'error');
  }
  assert.ok(!JSON.stringify(a).includes(env.CGD_API_KEY));
});

test('configuration and provider errors cannot leak the credential or fabricate courses', async () => {
  assert.throws(() => readCatalogConfig({...env, CGD_API_KEY: ''}), /catalog_not_configured/);
  assert.throws(() => readCatalogConfig({...env, CGD_URL_LOJA: 'http://school.example.com'}), /catalog_not_configured/);
  let called = false;
  const missing = createCatalogService(env, async () => {called = true; throw new Error();}, []);
  await assert.rejects(missing, /store_offers_required/); assert.equal(called, false);
  const unavailable = createCatalogService(env, async () => new Response(env.CGD_API_KEY, {status: 401}), [product]);
  await assert.rejects(unavailable, error => error instanceof CatalogError && error.message === 'catalog_provider_unavailable');
  const invalid = createCatalogService(env, async () => Response.json({unexpected: env.CGD_API_KEY}), [product]);
  await assert.rejects(invalid, /invalid_catalog_response/);
});

test('promotional combos are separate products, without course hours or an invented API course', () => {
  const combo: StoreProduct = {id: 'combo:adm', kind: 'combo', title: 'Combo ADM', category: 'Administrativos', hours: null, priceCents: 6000, catalogRef: null, detailsUrl: `${shop}produto/promocao`};
  const result = assembleStoreCatalog(catalogs, [product, combo], shop);
  const promotion = result.find(course => course.kind === 'combo')!;
  assert.equal(promotion.hours, null); assert.equal(promotion.priceCents, 6000);
  assert.equal(promotion.imageUrl, null); assert.match(promotion.description, /segundo curso/);
  const html = renderToStaticMarkup(createElement(CatalogProductCard, {course: promotion}));
  assert.ok(html.includes('Combo promocional')); assert.ok(html.includes('Ver detalhes do combo'));
  assert.ok(html.includes('60,00')); assert.ok(!html.includes('Carga horária')); assert.ok(!html.includes('1 hora'));
  assert.equal(result.find(course => course.kind === 'course')?.hours, 24);
  assert.throws(() => validateStoreProducts([{...combo, hours: 1}], shop), /invalid_store_product/);
  assert.throws(() => validateStoreProducts([{...combo, detailsUrl: null}], shop), /store_product_links_required/);
  assert.throws(() => assembleStoreCatalog(catalogs, [{...product, hours: 1}], shop), /store_catalog_mismatch/);
});

test('public endpoint rejects writes and returns no upstream detail on failures', async () => {
  let reads = 0;
  const handler = createCoursesHandler(async () => {reads++; throw new Error(env.CGD_API_KEY);});
  const invoke = async (method: string) => {
    const headers: Record<string, unknown> = {}; let status = 0, body = '';
    const response = {setHeader: (name: string, value: unknown) => {headers[name] = value;},
      set statusCode(value: number) {status = value;}, end: (value?: string) => {body = value ?? '';}};
    await handler({method} as any, response as any);
    return {headers, status, body};
  };
  assert.equal((await invoke('POST')).status, 405); assert.equal(reads, 0);
  const failure = await invoke('GET'); assert.equal(failure.status, 503);
  assert.equal(failure.headers['Cache-Control'], 'no-store'); assert.ok(!failure.body.includes(env.CGD_API_KEY));
  assert.equal((await invoke('HEAD')).body, '');
});

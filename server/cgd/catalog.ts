import {createHash} from 'node:crypto';
import configuredProducts from './store-products.json' with {type: 'json'};
import type {CatalogCourse, CourseCatalog} from '../../shared/courseCatalog.ts';

export interface StoreOffer {
  type: 'cgd' | 'autoria';
  courseId: number;
  priceCents: number;
  detailsUrl: string;
}

export interface StoreProduct {
  id: string;
  kind: 'course' | 'combo';
  title: string;
  category: string;
  hours: number | null;
  priceCents: number;
  catalogRef: {type: 'cgd' | 'autoria'; courseId: number} | null;
  detailsUrl: string | null;
  description?: string;
  imageUrl?: string | null;
}

export class CatalogError extends Error {
  constructor(public code: string, public status = 503) {super(code);}
}

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

export function readCatalogConfig(env: NodeJS.ProcessEnv) {
  const token = env.CGD_API_KEY?.trim();
  let shop: URL;
  try {shop = new URL(env.CGD_URL_LOJA?.trim() ?? '');} catch {throw new CatalogError('catalog_not_configured');}
  if (!token || shop.protocol !== 'https:' || shop.username || shop.password || shop.search || shop.hash) throw new CatalogError('catalog_not_configured');
  return {token, shop, fingerprint: createHash('sha256').update(`${token}\n${shop.href}`).digest('hex')};
}

// The documented catalog contains educational metadata, but no store prices or
// product URLs. Publish only offers explicitly confirmed for this school's shop.
// Never derive a slug from the course title or treat a missing price as zero.
export function assembleCatalog(catalogs: {type: 'cgd' | 'autoria'; payload: unknown}[], offers: StoreOffer[], shop: URL): CatalogCourse[] {
  const courses = new Map<string, Record<string, unknown>>();
  for (const {type, payload} of catalogs) {
    if (!record(payload) || !Array.isArray(payload.data)) throw new CatalogError('invalid_catalog_response');
    for (const row of payload.data) {
      if (!record(row) || !Number.isSafeInteger(row.id) || Number(row.id) <= 0) throw new CatalogError('invalid_catalog_response');
      const key = `${type}:${row.id}`;
      if (courses.has(key)) throw new CatalogError('duplicate_catalog_course');
      courses.set(key, row);
    }
  }
  const seen = new Set<string>();
  return offers.map(offer => {
    if (!['cgd', 'autoria'].includes(offer.type) || !Number.isSafeInteger(offer.courseId) || offer.courseId <= 0 ||
        !Number.isSafeInteger(offer.priceCents) || offer.priceCents <= 0) throw new CatalogError('invalid_store_offer');
    const id = `${offer.type}:${offer.courseId}`;
    if (seen.has(id)) throw new CatalogError('duplicate_store_offer');
    seen.add(id);
    const row = courses.get(id);
    if (!row || typeof row.titulo !== 'string' || !row.titulo.trim() ||
        typeof row.carga_horaria !== 'number' || !Number.isFinite(row.carga_horaria) || row.carga_horaria <= 0) throw new CatalogError('incomplete_course_metadata');
    let url: URL;
    try {url = new URL(offer.detailsUrl);} catch {throw new CatalogError('invalid_course_url');}
    const basePath = shop.pathname.replace(/\/$/, '');
    if (url.protocol !== 'https:' || url.origin !== shop.origin || url.username || url.password || url.hash ||
        !url.pathname.startsWith(`${basePath}/`) || url.pathname.replace(/\/$/, '') === basePath) throw new CatalogError('invalid_course_url');
    let imageUrl: string | null = null;
    try {
      const image = new URL(String(row.imagem_url));
      if (image.protocol === 'https:' && !image.username && !image.password) imageUrl = image.href;
    } catch { /* An absent image does not invalidate an otherwise verified offer. */ }
    return {id, kind: 'course' as const, category: 'Cursos EAD', title: row.titulo.trim(), description: typeof row.descricao_geral === 'string' ? row.descricao_geral : '',
      hours: row.carga_horaria, imageUrl, priceCents: offer.priceCents, detailsUrl: url.href};
  }).sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', {sensitivity: 'base', numeric: true}));
}

export function validateStoreProducts(products: StoreProduct[], shop: URL) {
  const ids = new Set<string>();
  for (const product of products) {
    if (!product.id || ids.has(product.id) || !['course', 'combo'].includes(product.kind) ||
        !product.title?.trim() || !product.category?.trim() || !Number.isSafeInteger(product.priceCents) || product.priceCents <= 0 ||
        (product.kind === 'combo' ? product.hours !== null || product.catalogRef !== null : typeof product.hours !== 'number' || !Number.isFinite(product.hours) || product.hours <= 0)) throw new CatalogError('invalid_store_product');
    ids.add(product.id);
    if (!product.detailsUrl) throw new CatalogError('store_product_links_required');
    let url: URL;
    try {url = new URL(product.detailsUrl);} catch {throw new CatalogError('invalid_course_url');}
    const basePath = shop.pathname.replace(/\/$/, '');
    if (url.protocol !== 'https:' || url.origin !== shop.origin || url.username || url.password || url.hash ||
        !url.pathname.startsWith(`${basePath}/`) || url.pathname.replace(/\/$/, '') === basePath) throw new CatalogError('invalid_course_url');
  }
}

export function assembleStoreCatalog(catalogs: {type: 'cgd' | 'autoria'; payload: unknown}[], products: StoreProduct[], shop: URL): CatalogCourse[] {
  validateStoreProducts(products, shop);
  const references = products.filter(product => product.catalogRef).map(product => ({...product.catalogRef!, priceCents: product.priceCents, detailsUrl: product.detailsUrl!}));
  const metadata = new Map(assembleCatalog(catalogs, references, shop).map(course => [course.id, course]));
  return products.map(product => {
    const reference = product.catalogRef;
    const course = reference ? metadata.get(`${reference.type}:${reference.courseId}`) : undefined;
    if (course && (course.title !== product.title || course.hours !== product.hours)) throw new CatalogError('store_catalog_mismatch');
    return {id: product.id, kind: product.kind, category: product.category, title: product.title,
      hours: product.hours, priceCents: product.priceCents, detailsUrl: product.detailsUrl!,
      description: product.kind === 'combo' ? 'Escolha cursos desta categoria e confira na plataforma o desconto no segundo curso.' : course?.description ?? product.description ?? '',
      imageUrl: product.imageUrl ?? course?.imageUrl ?? null};
  }).sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', {sensitivity: 'base', numeric: true}));
}

// Verified public data for static rendering. This contains no API credentials.
export function storeCatalogSnapshot(products: StoreProduct[], shop: URL): CatalogCourse[] {
  validateStoreProducts(products, shop);
  return products.map(product => ({id: product.id, kind: product.kind, title: product.title, category: product.category,
    description: product.description ?? '', hours: product.hours, priceCents: product.priceCents,
    imageUrl: product.imageUrl ?? null, detailsUrl: product.detailsUrl!}))
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', {sensitivity: 'base', numeric: true}));
}

export function createCatalogService(env: NodeJS.ProcessEnv = process.env, fetcher: typeof fetch = fetch, products = configuredProducts as StoreProduct[]) {
  let cache: {fingerprint: string; expires: number; data: CourseCatalog} | undefined;
  let pending: {fingerprint: string; promise: Promise<CourseCatalog>} | undefined;
  return async (): Promise<CourseCatalog> => {
    const config = readCatalogConfig(env);
    if (!products.length) throw new CatalogError('store_offers_required');
    validateStoreProducts(products, config.shop);
    if (cache?.fingerprint === config.fingerprint && cache.expires > Date.now()) return cache.data;
    if (pending?.fingerprint === config.fingerprint) return pending.promise;
    const task = (async () => {
      const catalogs = await Promise.all((['cgd', 'autoria'] as const).map(async type => {
        let response: Response;
        try {
          response = await fetcher(`https://api.cursoo.com.br/api/escola/cursos?tipo=${type}`, {
            method: 'GET', headers: {Authorization: `Bearer ${config.token}`, Accept: 'application/json'},
            signal: AbortSignal.timeout(15000), redirect: 'error',
          });
        } catch {throw new CatalogError('catalog_provider_unavailable');}
        if (!response.ok) throw new CatalogError('catalog_provider_unavailable');
        let payload: unknown;
        try {payload = await response.json();} catch {throw new CatalogError('invalid_catalog_response');}
        return {type, payload};
      }));
      const data = {courses: assembleStoreCatalog(catalogs, products, config.shop), updatedAt: new Date().toISOString()};
      cache = {fingerprint: config.fingerprint, expires: Date.now() + 300000, data};
      return data;
    })();
    const current = {fingerprint: config.fingerprint, promise: task};
    pending = current;
    try {return await task;} finally {if (pending === current) pending = undefined;}
  };
}

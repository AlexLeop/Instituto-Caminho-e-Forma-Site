import type {IncomingMessage, ServerResponse} from 'node:http';
import {CatalogError, createCatalogService} from '../server/cgd/catalog.ts';

export function createCoursesHandler(readCatalog = createCatalogService()) {
  return async (request: IncomingMessage, response: ServerResponse) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.setHeader('Allow', 'GET, HEAD'); response.statusCode = 405;
      response.end(JSON.stringify({error: {code: 'method_not_allowed', message: 'Método não permitido.'}})); return;
    }
    try {
      const catalog = await readCatalog();
      response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
      response.statusCode = 200;
      response.end(request.method === 'HEAD' ? undefined : JSON.stringify(catalog));
    } catch (error) {
      const safe = error instanceof CatalogError ? error : new CatalogError('catalog_unavailable');
      console.error('course_catalog_error', {code: safe.code});
      response.statusCode = safe.status;
      response.end(request.method === 'HEAD' ? undefined : JSON.stringify({error: {
        code: 'catalog_unavailable', message: 'O catálogo está temporariamente indisponível. Tente novamente em instantes.',
      }}));
    }
  };
}

export default createCoursesHandler();

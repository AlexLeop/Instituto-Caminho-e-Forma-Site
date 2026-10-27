import type { Plugin } from 'vite';
import dotenv from 'dotenv';
import handler from '../api/checkout.ts';

export function coraDevApi(): Plugin {
  return {name: 'cora-local-api', apply: 'serve', configureServer(server) {
    // Server-only values: never use VITE_ prefixes or inject these into client code.
    dotenv.config({quiet: true});
    server.middlewares.use((request, response, next) => {
      if (request.url?.split('?')[0] === '/api/checkout') { void handler(request, response); return; }
      if (request.url?.startsWith('/api/')) {response.statusCode = 404; response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify({error: {message: 'Rota não encontrada.'}})); return;}
      next();
    });
  }};
}

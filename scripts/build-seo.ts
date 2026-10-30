import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { Resvg } from '@resvg/resvg-js';
import { pageMetadata, PUBLIC_PATHS, SITE_URL } from '../src/seo';

const escape = (value: string) => value.replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]!));
const template = await readFile('dist/index.html', 'utf8');
// Render the same React components as the browser. No database credentials or donor data are used.
const server = await createServer({configFile: false, plugins: [], server: {middlewareMode: true}, appType: 'custom'});
try {
  const {render} = await server.ssrLoadModule('/src/entry-server.tsx');
  for (const route of PUBLIC_PATHS) {
    const meta = pageMetadata(route);
    const organization = route === '/' ? `<script type="application/ld+json">${JSON.stringify({'@context': 'https://schema.org', '@type': 'NGO', name: 'Instituto Caminho e Forma', url: SITE_URL, logo: `${SITE_URL}/logo-emblema.svg`, email: 'institutocaminhoeforma@gmail.com', address: {'@type': 'PostalAddress', streetAddress: 'Rua Otilia Borges, s/n, lote 25, quadra 25, Brisamar', addressLocality: 'Itaguaí', addressRegion: 'RJ', postalCode: '23823-390', addressCountry: 'BR'}})}</script>` : '';
    const head = `<meta name="robots" content="index, follow" /><link rel="canonical" href="${escape(meta.canonical)}" /><meta property="og:url" content="${escape(meta.canonical)}" />${organization}`;
    const html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace(/(<meta name="description"\s+content=")[^"]*("\s*\/>)/, `$1${escape(meta.description)}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*("\s*\/>)/, `$1${escape(meta.title)}$2`)
      .replace(/(<meta property="og:description"\s+content=")[^"]*("\s*\/>)/, `$1${escape(meta.description)}$2`)
      .replace('</head>', `${head}</head>`).replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);
    const file = route === '/' ? 'dist/index.html' : `dist${route}.html`;
    await mkdir(path.dirname(file), {recursive: true}); await writeFile(file, html);
  }
  // Private pages use an empty shell: never bake authenticated views into public HTML.
  const privateHtml = template.replace('</head>', '<meta name="robots" content="noindex, nofollow" /></head>');
  for (const route of ['/portal-do-apoiador', '/gestao/doacoes']) {
    await mkdir(path.dirname(`dist${route}.html`), {recursive: true}); await writeFile(`dist${route}.html`, privateHtml);
  }
} finally {await server.close();}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PUBLIC_PATHS.map(route => `  <url><loc>${SITE_URL}${route}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// The emblem is taller than it is wide: square its canvas without stretching it.
const emblem = (await readFile('public/logo-emblema.svg', 'utf8')).replace('viewBox="0 0 1159 1241"', 'viewBox="-41 0 1241 1241"');
await writeFile('dist/favicon.svg', emblem);
const icons: Buffer[] = [];
for (const size of [16, 32, 48, 96, 180, 192, 512]) {
  const png = new Resvg(emblem, {fitTo: {mode: 'width', value: size}}).render().asPng();
  await writeFile(`dist/icon-${size}.png`, png);
  if (size === 180) await writeFile('dist/apple-touch-icon.png', png);
  if (size <= 48) icons.push(png);
}
// ICO directories can contain PNG images, preserving the official emblem exactly.
const header = Buffer.alloc(6 + icons.length * 16); header.writeUInt16LE(1, 2); header.writeUInt16LE(icons.length, 4);
let offset = header.length;
icons.forEach((png, index) => {const at = 6 + index * 16; const size = [16,32,48][index]; header[at] = size; header[at+1] = size; header.writeUInt16LE(1, at+4); header.writeUInt16LE(32, at+6); header.writeUInt32LE(png.length, at+8); header.writeUInt32LE(offset, at+12); offset += png.length;});
await writeFile('dist/favicon.ico', Buffer.concat([header, ...icons]));
await writeFile('dist/site.webmanifest', JSON.stringify({name: 'Instituto Caminho e Forma', short_name: 'Caminho e Forma', lang: 'pt-BR', start_url: '/', display: 'browser', background_color: '#ffffff', theme_color: '#166534', icons: [192,512].map(size => ({src: `/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png'}))}));
console.log(`SEO: ${PUBLIC_PATHS.length} páginas renderizadas, sitemap, robots e ícones gerados.`);

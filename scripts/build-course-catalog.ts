import {readFile, writeFile} from 'node:fs/promises';
import {storeCatalogSnapshot, type StoreProduct} from '../server/cgd/catalog.ts';
const products: StoreProduct[] = JSON.parse(await readFile('server/cgd/store-products.json', 'utf8'));
const shop = new URL(process.env.CGD_URL_LOJA ?? new URL(products[0].detailsUrl!).origin);
const courses = storeCatalogSnapshot(products, shop);
await writeFile('src/data/courseCatalog.generated.json', JSON.stringify({courses, updatedAt: new Date().toISOString()}, null, 2) + '\n');
console.log(`Catálogo público: ${courses.filter(course => course.kind === 'course').length} cursos e ${courses.filter(course => course.kind === 'combo').length} combos verificados.`);

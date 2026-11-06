// Descarga las imágenes que hoy viven en el CDN de Horizons y las guarda en public/img,
// reescribiendo las direcciones del código. Así el sitio deja de depender de ese CDN.
// Uso (Node 18+, con internet):  node scripts/descargar-imagenes.mjs
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const URL_PATTERN = /https:\/\/(?:horizons-cdn|images)\.hostinger\.com\/[^"'`)\s]+/g;
const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public', 'img');
await mkdir(outDir, { recursive: true });

async function* walk(dir) {
	for (const entry of await readdir(dir)) {
		const full = path.join(dir, entry);
		if ((await stat(full)).isDirectory()) yield* walk(full);
		else if (/\.(ts|tsx|css)$/.test(entry)) yield full;
	}
}

const downloaded = new Map();
for await (const file of walk(path.join(root, 'src'))) {
	let text = await readFile(file, 'utf8');
	const urls = [...new Set(text.match(URL_PATTERN) ?? [])];
	if (!urls.length) continue;
	for (const url of urls) {
		if (!downloaded.has(url)) {
			const name = decodeURIComponent(url.split('/').pop().split('?')[0]).replace(/[^\w.-]/g, '_');
			const response = await fetch(url);
			if (!response.ok) {
				console.warn(`No se pudo descargar ${url} (${response.status})`);
				continue;
			}
			await writeFile(path.join(outDir, name), Buffer.from(await response.arrayBuffer()));
			downloaded.set(url, `/img/${name}`);
			console.log(`ok  ${name}`);
		}
		text = text.split(url).join(downloaded.get(url));
	}
	await writeFile(file, text);
}
console.log(`Listo: ${downloaded.size} imágenes en public/img`);

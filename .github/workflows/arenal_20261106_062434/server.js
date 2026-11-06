// Arranque para Hostinger (modo servidor de React Router).
// Hostinger ejecuta este archivo como "Entry file" y entrega el puerto en PORT.

// NODE_ENV debe definirse ANTES de cargar React; por eso los imports son dinámicos.
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { createRequestHandler } = await import('@react-router/express');
const { default: express } = await import('express');

const app = express();
app.disable('x-powered-by');

// Archivos compilados (caché larga) y carpeta public (fotos, favicon).
app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }));
app.use(express.static('build/client', { maxAge: '1h' }));

app.all(
	'*',
	createRequestHandler({
		build: await import('./build/server/index.js'),
		mode: process.env.NODE_ENV,
	}),
);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Arenal Holístico escuchando en el puerto ${port}`));

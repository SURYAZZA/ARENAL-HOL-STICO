import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),
	route('servicios', 'routes/servicios.tsx'),
	route('retiros', 'routes/retiros.tsx'),
	route('entrar', 'routes/entrar.tsx'),
	route('admin', 'routes/admin.tsx'),
	route('sitemap.xml', 'routes/sitemap.xml.ts'),
	route('robots.txt', 'routes/robots.txt.ts'),
	route('media/:id', 'routes/media.$id.ts'),
	route('api/health', 'routes/api.health.ts'),
	route('api/reviews', 'routes/api.reviews.ts'),
	route('api/contact', 'routes/api.contact.ts'),
	route('api/admin', 'routes/api.admin.ts'),
	route('api/*', 'routes/api.$.ts'),
] satisfies RouteConfig;

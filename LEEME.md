# Arenal Holístico — versión nativa (sin Horizons, sin PocketBase)

React Router (SSR) + MySQL de Hostinger. Todo el contenido y las funciones viven en este código.

## Qué hace cada parte
- Blog, reseñas, planes de retiro y texto de Retiros: tablas MySQL (se crean y rellenan solas al primer arranque).
- Formulario de contacto -> POST /api/contact -> tabla `contacts` (+ correo opcional por SMTP).
- Reseñas -> POST /api/reviews -> entran SIN aprobar; se publican desde /admin.
- Panel: /entrar -> /admin. Sesión por cookie firmada. Credenciales en variables de entorno.
- Idiomas ES/EN/FR y "Sobre Nosotros": ya incluidos.

## Despliegue en Hostinger (Node.js)
- Sube el código como ZIP (sin node_modules ni build). Hostinger instala y compila.
- Build: `npm run build`  |  Archivo de entrada (Entry file): `server.js`  |  Inicio: `npm start`  |  Node 22.
- Variables: ver `.env.example`. Mínimo: DB_*, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET.

## Imágenes
Las fotos del sitio siguen en el CDN de Horizons. Para independizarte de él, antes de subir:
`node scripts/descargar-imagenes.mjs` (las baja a public/img y corrige las direcciones).

## Trabajar en local
`npm install`, copia `.env.example` a `.env`, rellénalo y `npm run dev`.

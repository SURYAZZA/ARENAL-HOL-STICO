// Imágenes que antes vivían en el CDN de Horizons y ahora están en public/img.
// nombre original -> archivo local. Lo usa db.server.ts para corregir direcciones ya guardadas.
export const LOCAL_IMAGES: Record<string, string> = {
	"12444ddd-6b8f-41ba-90e7-18a3a9081a34.png": "12444ddd-6b8f-41ba-90e7-18a3a9081a34.webp",
	"41a854fa-ebe7-4ab2-ad93-afbcd4260dc3.png": "41a854fa-ebe7-4ab2-ad93-afbcd4260dc3.webp",
	"62149e454e7ac9970869d8e535adda77.jpg": "62149e454e7ac9970869d8e535adda77.jpg",
	"65430928_2430213013913657_5091023769028263936_n-TsDBp.jpg": "65430928_2430213013913657_5091023769028263936_n-TsDBp.jpg",
	"67ae89fb-4262-4b09-b339-eac9a269ac91.png": "67ae89fb-4262-4b09-b339-eac9a269ac91.webp",
	"71e6e2cc-2a96-4749-aa1d-f5a46154cda4.png": "71e6e2cc-2a96-4749-aa1d-f5a46154cda4.webp",
	"74ceba4d-a7dd-4fc7-a655-30197ff8d944.png": "74ceba4d-a7dd-4fc7-a655-30197ff8d944.webp",
	"9ea222f8-f5fd-4365-8bfd-58b5c33eaa85.png": "9ea222f8-f5fd-4365-8bfd-58b5c33eaa85.webp",
	"acb574ad-a472-4973-915d-16d9a4b5fbbe.png": "acb574ad-a472-4973-915d-16d9a4b5fbbe.webp",
	"c2d5cd835377916f63583a25d2b0bf4f.png": "c2d5cd835377916f63583a25d2b0bf4f.png",
	"c8ba3005e6abe46ff7cb7d3805a899b6.png": "c8ba3005e6abe46ff7cb7d3805a899b6.png",
	"captura-de-pantalla-2026-08-23-233327-5c1TD.jpg": "captura-de-pantalla-2026-08-23-233327-5c1TD.jpg",
	"captura-de-pantalla-2026-11-02-190924-39D5D.png": "captura-de-pantalla-2026-11-02-190924-39D5D.webp",
	"ceremonia-de-cacao-frente-FsGUd.png": "ceremonia-de-cacao-frente-FsGUd.webp",
	"dkailash-yoga-retreat-bali-scaled-B3XNf.webp": "dkailash-yoga-retreat-bali-scaled-B3XNf.webp",
	"flores-de-bach-of0Ke.png": "flores-de-bach-of0Ke.webp",
	"forest-yoga-session-stockcake-KACnS.jpg": "forest-yoga-session-stockcake-KACnS.jpg",
	"infografaa-frente-0GAlU.png": "infografaa-frente-0GAlU.webp",
	"r-UUGln.png": "r-UUGln.webp",
	"whatsapp-image-2026-11-02-at-4.38.38-pm-cCfzB.jpeg": "whatsapp-image-2026-11-02-at-4.38.38-pm-cCfzB.jpeg"
};

// Medidas (ancho, alto) de cada archivo: el blog las usa para saber si una foto es horizontal o vertical.
export const IMAGE_SIZES: Record<string, [number, number]> = {
	"12444ddd-6b8f-41ba-90e7-18a3a9081a34.webp": [
		1344,
		768
	],
	"41a854fa-ebe7-4ab2-ad93-afbcd4260dc3.webp": [
		1280,
		832
	],
	"62149e454e7ac9970869d8e535adda77.jpg": [
		1023,
		681
	],
	"65430928_2430213013913657_5091023769028263936_n-TsDBp.jpg": [
		960,
		640
	],
	"67ae89fb-4262-4b09-b339-eac9a269ac91.webp": [
		1280,
		832
	],
	"71e6e2cc-2a96-4749-aa1d-f5a46154cda4.webp": [
		1280,
		832
	],
	"74ceba4d-a7dd-4fc7-a655-30197ff8d944.webp": [
		1280,
		832
	],
	"9ea222f8-f5fd-4365-8bfd-58b5c33eaa85.webp": [
		1344,
		768
	],
	"acb574ad-a472-4973-915d-16d9a4b5fbbe.webp": [
		1280,
		832
	],
	"c2d5cd835377916f63583a25d2b0bf4f.png": [
		737,
		842
	],
	"c8ba3005e6abe46ff7cb7d3805a899b6.png": [
		737,
		842
	],
	"captura-de-pantalla-2026-08-23-233327-5c1TD.jpg": [
		877,
		617
	],
	"captura-de-pantalla-2026-11-02-190924-39D5D.webp": [
		811,
		579
	],
	"ceremonia-de-cacao-frente-FsGUd.webp": [
		1080,
		1151
	],
	"dkailash-yoga-retreat-bali-scaled-B3XNf.webp": [
		1024,
		682
	],
	"flores-de-bach-of0Ke.webp": [
		1600,
		1131
	],
	"forest-yoga-session-stockcake-KACnS.jpg": [
		728,
		408
	],
	"infografaa-frente-0GAlU.webp": [
		898,
		842
	],
	"r-UUGln.webp": [
		1080,
		639
	],
	"whatsapp-image-2026-11-02-at-4.38.38-pm-cCfzB.jpeg": [
		1600,
		1047
	]
};

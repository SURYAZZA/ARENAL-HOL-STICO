import type { RowDataPacket } from 'mysql2/promise';
import { query } from '@/lib/db.server';

/** Sirve las fotos subidas desde el panel. Viven en la base de datos para sobrevivir a cada despliegue. */
export async function loader({ params }: { params: { id?: string } }) {
	const id = String(params.id ?? '').slice(0, 15);
	if (!/^[a-z0-9]{15}$/.test(id)) return new Response('No encontrado', { status: 404 });
	let row: RowDataPacket | undefined;
	try {
		[row] = await query<RowDataPacket>('SELECT mime, data FROM uploads WHERE id = ? LIMIT 1', [id]);
	} catch {
		return new Response('No disponible', { status: 503 });
	}
	if (!row) return new Response('No encontrado', { status: 404 });
	return new Response(new Uint8Array(row.data as Buffer), {
		headers: {
			'Content-Type': String(row.mime),
			'Cache-Control': 'public, max-age=31536000, immutable',
			'X-Content-Type-Options': 'nosniff',
			'Content-Security-Policy': "default-src 'none'",
		},
	});
}

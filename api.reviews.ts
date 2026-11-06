import { apiError, json, readJsonBody, withApi } from '@/lib/api.server';
import { newId, run } from '@/lib/db.server';

const clean = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);

/** Recibe una reseña. Siempre entra sin aprobar y sin fijar: se publica desde /admin. */
export const action = withApi(async ({ request }) => {
	if (request.method !== 'POST') return apiError(405, 'Method not allowed');

	const data = await readJsonBody<Record<string, unknown>>(request);
	const author = clean(data.author, 120);
	const organization = clean(data.organization, 160);
	const body = clean(data.body, 1200);
	const rating = Number(data.rating);

	if (!author || !body) return apiError(400, 'Faltan datos');
	if (!Number.isInteger(rating) || rating < 1 || rating > 5) return apiError(400, 'Valoración inválida');

	await run('INSERT INTO reviews (id, author, organization, body, rating, pinned, approved) VALUES (?,?,?,?,?,0,0)', [
		newId(), author, organization, body, rating,
	]);
	return json({ ok: true }, { status: 201 });
});

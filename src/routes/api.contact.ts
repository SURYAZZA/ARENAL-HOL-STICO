import { apiError, json, readJsonBody, withApi } from '@/lib/api.server';
import { newId, query, run } from '@/lib/db.server';
import { sendContactNotice } from '@/lib/mail.server';

const clean = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Guarda un mensaje del formulario y, si hay correo y SMTP configurados, avisa. */
export const action = withApi(async ({ request }) => {
	if (request.method !== 'POST') return apiError(405, 'Method not allowed');

	const data = await readJsonBody<Record<string, unknown>>(request);
	const contact = {
		name: clean(data.name, 120),
		email: clean(data.email, 190),
		organization: clean(data.organization, 160),
		interest: clean(data.interest || 'general', 80),
		message: clean(data.message, 4000),
	};

	if (!contact.name || !contact.message || !EMAIL.test(contact.email)) return apiError(400, 'Faltan datos');

	await run('INSERT INTO contacts (id, name, email, organization, interest, message) VALUES (?,?,?,?,?,?)', [
		newId(), contact.name, contact.email, contact.organization, contact.interest, contact.message,
	]);

	const settings = await query<any>('SELECT notify_email FROM site_settings LIMIT 1');
	void sendContactNotice(String(settings[0]?.notify_email ?? ''), contact);

	return json({ ok: true }, { status: 201 });
});

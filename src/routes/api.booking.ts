import { apiError, json, readJsonBody, withApi } from '@/lib/api.server';
import { bookingChoices } from '@/data/retreat';
import { newId, query, run } from '@/lib/db.server';
import { sendBookingNotice } from '@/lib/mail.server';
import { clientIdentifier, createRateLimiter } from '@/lib/rate-limit.server';

const clean = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 6 reservas por hora por visitante: suficiente para una persona, poco para un robot. */
const allow = createRateLimiter({ maxRequests: 6, windowSeconds: 60 * 60 });

const values = (list: readonly { value: string }[]) => list.map(item => item.value);
/** Una opción solo vale si está en la lista del formulario. */
const pick = (value: unknown, list: readonly { value: string }[]) => (values(list).includes(String(value)) ? String(value) : '');
const pickMany = (value: unknown, list: readonly { value: string }[]) =>
	Array.isArray(value) ? value.map(String).filter(item => values(list).includes(item)) : [];

/** Recibe el formulario de reserva del retiro. Queda en /admin, pestaña Reservas. */
export const action = withApi(async ({ request }) => {
	if (request.method !== 'POST') return apiError(405, 'Method not allowed');
	if (!(await allow(clientIdentifier(request)))) return apiError(429, 'Demasiados envíos. Inténtalo más tarde.');

	const data = await readJsonBody<Record<string, unknown>>(request);
	const name = clean(data.name, 160);
	const email = clean(data.email, 190);
	const guests = Number(pick(data.guests, bookingChoices.guests)) || 0;
	const days = Number(pick(data.days, bookingChoices.days)) || 0;
	const arrival = /^\d{4}-\d{2}-\d{2}$/.test(String(data.arrival ?? '')) ? String(data.arrival) : '';
	if (!name || !EMAIL.test(email) || !guests || !days || data.consent !== true) return apiError(400, 'Faltan datos');

	const lang = ['es', 'en', 'fr'].includes(String(data.lang)) ? String(data.lang) : 'es';
	const details = {
		phone: clean(data.phone, 60),
		country: clean(data.country, 80),
		language: pick(data.language, bookingChoices.language),
		companions: clean(data.companions, 600),
		flexible: pick(data.flexible, bookingChoices.flexible),
		transport: pick(data.transport, bookingChoices.transport),
		focus: pickMany(data.focus, bookingChoices.focus),
		focusOther: clean(data.focusOther, 300),
		activities: pickMany(data.activities, bookingChoices.activities),
		mealPlan: pick(data.mealPlan, bookingChoices.mealPlan),
		diet: pickMany(data.diet, bookingChoices.diet),
		allergies: clean(data.allergies, 800),
		yogaLevel: pick(data.yogaLevel, bookingChoices.yogaLevel),
		health: clean(data.health, 1500),
		petAllergy: data.petAllergy === true,
		budget: clean(data.budget, 80),
		expectations: clean(data.expectations, 2000),
		source: clean(data.source, 200),
	};

	await run('INSERT INTO retreat_bookings (id, name, email, guests, days, arrival, lang, data, created) VALUES (?,?,?,?,?,?,?,?,?)', [
		newId(), name, email, guests, days, arrival, lang, JSON.stringify(details), new Date(),
	]);

	const settings = await query<any>('SELECT notify_email FROM site_settings LIMIT 1');
	void sendBookingNotice(String(settings[0]?.notify_email ?? ''), {
		name, email,
		summary: `Nombre: ${name}\nCorreo: ${email}\nPersonas: ${guests}\nDías: ${days}\nLlegada ideal: ${arrival || 'sin definir'}`,
	});

	return json({ ok: true }, { status: 201 });
});

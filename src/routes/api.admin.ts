import type { RowDataPacket } from 'mysql2/promise';
import { apiError, json, readJsonBody, withApi } from '@/lib/api.server';
import { adminSnapshot } from '@/lib/content.server';
import { newId, query, run } from '@/lib/db.server';
import logger from '@/lib/logger.server';
import { clientIdentifier, createRateLimiter } from '@/lib/rate-limit.server';
import {
	OWNER_ID, adminConfigured, authenticate, clearedCookie, currentAdmin, hashPassword, passwordMatches, sessionCookie,
	type AdminUser,
} from '@/lib/session.server';

type Payload = { op?: string } & Record<string, unknown>;

const text = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);
const flag = (value: unknown) => (value ? 1 : 0);
const size = (value: unknown) => Math.min(20000, Math.max(0, Math.round(Number(value) || 0)));
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MIN_PASSWORD = 10;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 10 intentos de entrada cada 15 minutos por visitante. */
const allowLogin = createRateLimiter({ maxRequests: 10, windowSeconds: 15 * 60 });

/** Apunta en el historial quién hizo qué. Si falla, la acción ya hecha no se pierde. */
async function record(user: AdminUser, action: string): Promise<void> {
	try {
		await run('INSERT INTO admin_log (actor_id, actor_name, actor_email, action, created) VALUES (?,?,?,?,?)', [
			user.id, user.name, user.email, action.slice(0, 400), new Date(),
		]);
	} catch (error) {
		logger.error('No se pudo escribir el historial:', error instanceof Error ? error.message : error);
	}
}

const one = async (sql: string, id: string) => (await query<RowDataPacket>(sql, [id]))[0];
const quoted = (value: unknown) => `«${String(value ?? '').slice(0, 120)}»`;

/** JPEG, PNG o WebP reconocidos por sus primeros bytes, no por lo que diga el navegador. */
function imageMime(bytes: Buffer): string | null {
	if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
	if (bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
	if (bytes.length > 12 && bytes.toString('latin1', 0, 4) === 'RIFF' && bytes.toString('latin1', 8, 12) === 'WEBP') return 'image/webp';
	return null;
}

/**
 * Un solo endpoint POST para el panel interno. Todo menos `login`, `logout` y `session`
 * exige la cookie de sesión. Cada cambio queda apuntado en el historial.
 */
export const action = withApi(async ({ request }) => {
	if (request.method !== 'POST') return apiError(405, 'Method not allowed');
	const data = await readJsonBody<Payload>(request);

	if (data.op === 'login') {
		if (!adminConfigured()) return apiError(503, 'El acceso interno aún no está configurado');
		if (!(await allowLogin(clientIdentifier(request)))) return apiError(429, 'Demasiados intentos. Espera unos minutos.');
		const user = await authenticate(text(data.email, 190), String(data.password ?? ''));
		if (!user) {
			await sleep(700);
			return apiError(401, 'Credenciales inválidas');
		}
		await record(user, 'Entró al panel');
		return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie(user.id) } });
	}

	if (data.op === 'logout') {
		return json({ ok: true }, { headers: { 'Set-Cookie': clearedCookie() } });
	}

	const user = await currentAdmin(request);

	if (data.op === 'session') {
		return json({ authed: Boolean(user), user });
	}

	if (!user) return apiError(401, 'No autorizado');

	switch (data.op) {
		case 'load':
			return json({ ...(await adminSnapshot()), me: user });

		case 'savePost': {
			const id = text(data.id, 15);
			const title = text(data.title, 180);
			const fields = [
				title, text(data.excerpt, 400), String(data.body ?? '').slice(0, 8000),
				text(data.cover, 500), size(data.cover_w), size(data.cover_h), flag(data.pinned), flag(data.published),
			];
			if (!fields[0] || !fields[1] || !fields[2]) return apiError(400, 'Faltan datos');
			if (data.pinned) await run('UPDATE blog_posts SET pinned = 0 WHERE id <> ?', [id]);
			if (id) {
				// Editar no cambia la fecha: la publicación conserva su lugar en el blog.
				await run('UPDATE blog_posts SET title=?, excerpt=?, body=?, cover=?, cover_w=?, cover_h=?, pinned=?, published=? WHERE id=?', [...fields, id]);
				await record(user, `Editó la publicación ${quoted(title)}`);
			} else {
				await run('INSERT INTO blog_posts (id, title, excerpt, body, cover, cover_w, cover_h, pinned, published, published_at) VALUES (?,?,?,?,?,?,?,?,?,?)', [newId(), ...fields, new Date()]);
				await record(user, `Creó la publicación ${quoted(title)}`);
			}
			return json({ ok: true });
		}

		case 'deletePost': {
			const id = text(data.id, 15);
			const post = await one('SELECT title FROM blog_posts WHERE id = ?', id);
			await run('DELETE FROM blog_posts WHERE id = ?', [id]);
			if (post) await record(user, `Eliminó la publicación ${quoted(post.title)}`);
			return json({ ok: true });
		}

		case 'updateReview': {
			const id = text(data.id, 15);
			const review = await one('SELECT author FROM reviews WHERE id = ?', id);
			if (!review) return apiError(404, 'Esa reseña ya no existe');
			if ('approved' in data) {
				await run('UPDATE reviews SET approved = ? WHERE id = ?', [flag(data.approved), id]);
				await record(user, `${data.approved ? 'Publicó' : 'Ocultó'} la reseña de ${quoted(review.author)}`);
			}
			if ('pinned' in data) {
				await run('UPDATE reviews SET pinned = ? WHERE id = ?', [flag(data.pinned), id]);
				await record(user, `${data.pinned ? 'Fijó' : 'Quitó el fijado de'} la reseña de ${quoted(review.author)}`);
			}
			return json({ ok: true });
		}

		case 'deleteReview': {
			const id = text(data.id, 15);
			const review = await one('SELECT author FROM reviews WHERE id = ?', id);
			await run('DELETE FROM reviews WHERE id = ?', [id]);
			if (review) await record(user, `Eliminó la reseña de ${quoted(review.author)}`);
			return json({ ok: true });
		}

		case 'saveCopy':
			await run('UPDATE page_copy SET eyebrow=?, title=?, body=?, image=? WHERE id=?', [
				text(data.eyebrow, 80), text(data.title, 200), String(data.body ?? '').slice(0, 4000), text(data.image, 500), text(data.id, 15),
			]);
			await record(user, 'Editó la presentación de retiros');
			return json({ ok: true });

		case 'savePlan': {
			const days = Math.min(30, Math.max(1, Number(data.days) || 3));
			await run('UPDATE retreat_plans SET title=?, days=?, location=?, group_size=?, focus=?, summary=?, image=? WHERE id=?', [
				text(data.title, 160), days, text(data.location, 160), text(data.group_size, 120),
				text(data.focus, 200), String(data.summary ?? '').slice(0, 800), text(data.image, 500), text(data.id, 15),
			]);
			await record(user, `Editó el plan de retiro ${quoted(data.title)}`);
			return json({ ok: true });
		}

		case 'saveSettings': {
			const email = text(data.email, 190);
			const updated = await run('UPDATE site_settings SET notify_email = ?', [email]);
			if (updated.affectedRows === 0) await run('INSERT INTO site_settings (id, notify_email) VALUES (?,?)', [newId(), email]);
			await record(user, `Cambió el correo de avisos a ${email}`);
			return json({ ok: true });
		}

		/** Foto subida desde el computador: llega en base64 y se guarda en la base de datos. */
		case 'upload': {
			const bytes = Buffer.from(String(data.data ?? ''), 'base64');
			if (bytes.length === 0 || bytes.length > MAX_UPLOAD_BYTES) return apiError(400, 'La imagen está vacía o pesa demasiado');
			const mime = imageMime(bytes);
			if (!mime) return apiError(400, 'Solo se aceptan fotos JPG, PNG o WebP');
			const id = newId();
			await run('INSERT INTO uploads (id, mime, width, height, data, uploaded_by) VALUES (?,?,?,?,?,?)', [
				id, mime, size(data.width), size(data.height), bytes, user.email,
			]);
			await record(user, `Subió una foto (${Math.round(bytes.length / 1024)} KB)`);
			return json({ url: `/media/${id}`, width: size(data.width), height: size(data.height) });
		}

		/** Cada quien puede cambiar el nombre con el que aparece en el historial. */
		case 'saveMyName': {
			const name = text(data.name, 120);
			if (!name) return apiError(400, 'Escribe un nombre');
			if (user.owner) {
				const updated = await run('UPDATE site_settings SET owner_name = ?', [name]);
				if (updated.affectedRows === 0) {
					const existing = await query<RowDataPacket>('SELECT id FROM site_settings LIMIT 1');
					if (existing.length === 0) await run("INSERT INTO site_settings (id, notify_email, owner_name) VALUES (?, '', ?)", [newId(), name]);
				}
			} else {
				await run('UPDATE admins SET name = ? WHERE id = ?', [name, user.id]);
			}
			await record({ ...user, name }, 'Cambió su nombre visible');
			return json({ ok: true });
		}

		case 'changeMyPassword': {
			if (user.owner) return apiError(400, 'La contraseña de la cuenta principal se cambia en hPanel (variable ADMIN_PASSWORD)');
			const next = String(data.next ?? '');
			if (next.length < MIN_PASSWORD) return apiError(400, `La contraseña necesita al menos ${MIN_PASSWORD} caracteres`);
			const row = await one('SELECT password_hash FROM admins WHERE id = ?', user.id);
			if (!row || !passwordMatches(String(data.current ?? ''), String(row.password_hash))) {
				await sleep(700);
				return apiError(403, 'La contraseña actual no coincide');
			}
			await run('UPDATE admins SET password_hash = ? WHERE id = ?', [hashPassword(next), user.id]);
			await record(user, 'Cambió su contraseña');
			return json({ ok: true });
		}

		/** Solo la cuenta principal crea integrantes o les pone una contraseña nueva. */
		case 'saveAdmin': {
			if (!user.owner) return apiError(403, 'Solo la cuenta principal administra integrantes');
			const id = text(data.id, 15);
			const password = String(data.password ?? '');
			if (id) {
				const target = await one('SELECT name FROM admins WHERE id = ?', id);
				if (!target) return apiError(404, 'Ese integrante ya no existe');
				if (password.length < MIN_PASSWORD) return apiError(400, `La contraseña necesita al menos ${MIN_PASSWORD} caracteres`);
				await run('UPDATE admins SET password_hash = ? WHERE id = ?', [hashPassword(password), id]);
				await record(user, `Puso una contraseña nueva a ${quoted(target.name)}`);
				return json({ ok: true });
			}
			const name = text(data.name, 120);
			const email = text(data.email, 190).toLowerCase();
			if (!name || !EMAIL.test(email)) return apiError(400, 'Faltan el nombre o un correo válido');
			if (password.length < MIN_PASSWORD) return apiError(400, `La contraseña necesita al menos ${MIN_PASSWORD} caracteres`);
			if (email === user.email || (await one('SELECT id FROM admins WHERE email = ?', email))) {
				return apiError(409, 'Ya hay una cuenta con ese correo');
			}
			await run('INSERT INTO admins (id, name, email, password_hash) VALUES (?,?,?,?)', [newId(), name, email, hashPassword(password)]);
			await record(user, `Agregó como integrante a ${quoted(name)} (${email})`);
			return json({ ok: true });
		}

		case 'deleteAdmin': {
			if (!user.owner) return apiError(403, 'Solo la cuenta principal administra integrantes');
			const id = text(data.id, 15);
			if (id === OWNER_ID) return apiError(400, 'La cuenta principal no se puede quitar');
			const target = await one('SELECT name, email FROM admins WHERE id = ?', id);
			await run('DELETE FROM admins WHERE id = ?', [id]);
			if (target) await record(user, `Quitó como integrante a ${quoted(target.name)} (${target.email})`);
			return json({ ok: true });
		}

		default:
			return apiError(400, 'Operación desconocida');
	}
});

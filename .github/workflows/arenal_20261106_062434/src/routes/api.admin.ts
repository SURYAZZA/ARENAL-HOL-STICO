import { apiError, json, readJsonBody, withApi } from '@/lib/api.server';
import { adminSnapshot } from '@/lib/content.server';
import { newId, run } from '@/lib/db.server';
import { adminConfigured, clearedCookie, credentialsMatch, isAdmin, sessionCookie } from '@/lib/session.server';

type Payload = { op?: string } & Record<string, unknown>;

const text = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);
const flag = (value: unknown) => (value ? 1 : 0);
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Un solo endpoint POST para el panel interno. Todo menos `login` y `session`
 * exige la cookie de sesión.
 */
export const action = withApi(async ({ request }) => {
	if (request.method !== 'POST') return apiError(405, 'Method not allowed');
	const data = await readJsonBody<Payload>(request);

	if (data.op === 'login') {
		if (!adminConfigured()) return apiError(503, 'El acceso interno aún no está configurado');
		if (!credentialsMatch(text(data.email, 190), String(data.password ?? ''))) {
			await sleep(700);
			return apiError(401, 'Credenciales inválidas');
		}
		return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie() } });
	}

	if (data.op === 'logout') {
		return json({ ok: true }, { headers: { 'Set-Cookie': clearedCookie() } });
	}

	if (data.op === 'session') {
		return json({ authed: isAdmin(request) });
	}

	if (!isAdmin(request)) return apiError(401, 'No autorizado');

	switch (data.op) {
		case 'load':
			return json(await adminSnapshot());

		case 'savePost': {
			const id = text(data.id, 15);
			const fields = [
				text(data.title, 180), text(data.excerpt, 400), String(data.body ?? '').slice(0, 8000),
				text(data.cover, 500), flag(data.pinned), flag(data.published),
			];
			if (!fields[0] || !fields[1] || !fields[2]) return apiError(400, 'Faltan datos');
			if (data.pinned) await run('UPDATE blog_posts SET pinned = 0 WHERE id <> ?', [id]);
			if (id) {
				await run('UPDATE blog_posts SET title=?, excerpt=?, body=?, cover=?, pinned=?, published=?, published_at=NOW() WHERE id=?', [...fields, id]);
			} else {
				await run('INSERT INTO blog_posts (id, title, excerpt, body, cover, pinned, published, published_at) VALUES (?,?,?,?,?,?,?,NOW())', [newId(), ...fields]);
			}
			return json({ ok: true });
		}

		case 'deletePost':
			await run('DELETE FROM blog_posts WHERE id = ?', [text(data.id, 15)]);
			return json({ ok: true });

		case 'updateReview': {
			const id = text(data.id, 15);
			if ('approved' in data) await run('UPDATE reviews SET approved = ? WHERE id = ?', [flag(data.approved), id]);
			if ('pinned' in data) await run('UPDATE reviews SET pinned = ? WHERE id = ?', [flag(data.pinned), id]);
			return json({ ok: true });
		}

		case 'deleteReview':
			await run('DELETE FROM reviews WHERE id = ?', [text(data.id, 15)]);
			return json({ ok: true });

		case 'saveCopy':
			await run('UPDATE page_copy SET eyebrow=?, title=?, body=?, image=? WHERE id=?', [
				text(data.eyebrow, 80), text(data.title, 200), String(data.body ?? '').slice(0, 4000), text(data.image, 500), text(data.id, 15),
			]);
			return json({ ok: true });

		case 'savePlan': {
			const days = Math.min(30, Math.max(1, Number(data.days) || 3));
			await run('UPDATE retreat_plans SET title=?, days=?, location=?, group_size=?, focus=?, summary=?, image=? WHERE id=?', [
				text(data.title, 160), days, text(data.location, 160), text(data.group_size, 120),
				text(data.focus, 200), String(data.summary ?? '').slice(0, 800), text(data.image, 500), text(data.id, 15),
			]);
			return json({ ok: true });
		}

		case 'saveSettings': {
			const email = text(data.email, 190);
			const updated = await run('UPDATE site_settings SET notify_email = ?', [email]);
			if (updated.affectedRows === 0) await run('INSERT INTO site_settings (id, notify_email) VALUES (?,?)', [newId(), email]);
			return json({ ok: true });
		}

		default:
			return apiError(400, 'Operación desconocida');
	}
});

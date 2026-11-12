/**
 * Sesión del panel /admin: cookie firmada (HMAC) que guarda quién entró.
 *
 * Hay dos tipos de cuenta:
 *  - La cuenta principal: ADMIN_EMAIL + ADMIN_PASSWORD (variables de entorno). Siempre existe
 *    y es la única que puede crear o quitar a los demás.
 *  - Los integrantes: tabla `admins`, con contraseña guardada como hash (scrypt).
 *
 * Variables de entorno obligatorias:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET (texto largo y aleatorio)
 */
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { RowDataPacket } from 'mysql2/promise';
import { query } from '@/lib/db.server';

const COOKIE = 'arenal_session';
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
export const OWNER_ID = 'principal';

export type AdminUser = { id: string; name: string; email: string; owner: boolean };

const secret = () => process.env.SESSION_SECRET || '';

const sign = (value: string) => createHmac('sha256', secret()).update(value).digest('hex');

const same = (a: string, b: string) => {
	const x = Buffer.from(a);
	const y = Buffer.from(b);
	return x.length === y.length && timingSafeEqual(x, y);
};

export const adminConfigured = () =>
	Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && secret().length >= 16);

const ownerEmail = () => String(process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();

export function hashPassword(password: string): string {
	const salt = randomBytes(16);
	return `scrypt$${salt.toString('hex')}$${scryptSync(password, salt, 64).toString('hex')}`;
}

export function passwordMatches(password: string, stored: string): boolean {
	const [scheme, salt, hash] = stored.split('$');
	if (scheme !== 'scrypt' || !salt || !hash) return false;
	return same(scryptSync(password, Buffer.from(salt, 'hex'), 64).toString('hex'), hash);
}

async function ownerUser(): Promise<AdminUser> {
	let name = '';
	try {
		const rows = await query<RowDataPacket>('SELECT owner_name FROM site_settings LIMIT 1');
		name = String(rows[0]?.owner_name ?? '');
	} catch {
		// Sin base de datos la cuenta principal sigue pudiendo entrar.
	}
	return { id: OWNER_ID, name: name || 'Cuenta principal', email: ownerEmail(), owner: true };
}

/** Devuelve quién es si el correo y la contraseña son correctos; si no, null. */
export async function authenticate(email: string, password: string): Promise<AdminUser | null> {
	if (!adminConfigured()) return null;
	const clean = email.trim().toLowerCase();
	if (same(clean, ownerEmail())) {
		return same(password, String(process.env.ADMIN_PASSWORD)) ? ownerUser() : null;
	}
	const rows = await query<RowDataPacket>('SELECT id, name, email, password_hash FROM admins WHERE email = ? LIMIT 1', [clean]);
	const row = rows[0];
	if (!row || !passwordMatches(password, String(row.password_hash))) return null;
	return { id: row.id, name: row.name, email: row.email, owner: false };
}

export function sessionCookie(userId: string): string {
	const expires = Date.now() + MAX_AGE_SECONDS * 1000;
	const payload = `${userId}.${expires}`;
	return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`;
}

export const clearedCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

/** Quién está usando el panel. Un integrante eliminado pierde el acceso al instante. */
export async function currentAdmin(request: Request): Promise<AdminUser | null> {
	if (!adminConfigured()) return null;
	const header = request.headers.get('cookie') ?? '';
	const raw = header.split(/;\s*/).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
	if (!raw) return null;
	const [userId, expires, signature] = raw.split('.');
	if (!userId || !expires || !signature) return null;
	if (!same(signature, sign(`${userId}.${expires}`))) return null;
	if (!(Number(expires) > Date.now())) return null;
	if (userId === OWNER_ID) return ownerUser();
	const rows = await query<RowDataPacket>('SELECT id, name, email FROM admins WHERE id = ? LIMIT 1', [userId]);
	return rows[0] ? { id: rows[0].id, name: rows[0].name, email: rows[0].email, owner: false } : null;
}

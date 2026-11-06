/**
 * Sesión del panel /admin: cookie firmada (HMAC), sin base de datos.
 *
 * Variables de entorno obligatorias:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET (texto largo y aleatorio)
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'arenal_session';
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const secret = () => process.env.SESSION_SECRET || '';

const sign = (value: string) => createHmac('sha256', secret()).update(value).digest('hex');

const same = (a: string, b: string) => {
	const x = Buffer.from(a);
	const y = Buffer.from(b);
	return x.length === y.length && timingSafeEqual(x, y);
};

export const adminConfigured = () =>
	Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && secret().length >= 16);

export function credentialsMatch(email: string, password: string): boolean {
	if (!adminConfigured()) return false;
	const okEmail = same(email.trim().toLowerCase(), String(process.env.ADMIN_EMAIL).trim().toLowerCase());
	const okPassword = same(password, String(process.env.ADMIN_PASSWORD));
	return okEmail && okPassword;
}

export function sessionCookie(): string {
	const expires = Date.now() + MAX_AGE_SECONDS * 1000;
	const value = `${expires}.${sign(String(expires))}`;
	return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`;
}

export const clearedCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

export function isAdmin(request: Request): boolean {
	if (!adminConfigured()) return false;
	const header = request.headers.get('cookie') ?? '';
	const raw = header.split(/;\s*/).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
	if (!raw) return false;
	const [expires, signature] = raw.split('.');
	if (!expires || !signature) return false;
	if (!same(signature, sign(expires))) return false;
	return Number(expires) > Date.now();
}

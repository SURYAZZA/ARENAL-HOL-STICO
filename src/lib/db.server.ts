/**
 * MySQL de Hostinger. Sustituye a PocketBase.
 *
 * Las tablas se crean solas la primera vez que el servidor las necesita y se
 * rellenan con el contenido inicial si están vacías: no hay migraciones manuales.
 *
 * Variables de entorno (Node.js; el host se fuerza a 127.0.0.1):
 *   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
 */
import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';
import { randomBytes } from 'node:crypto';
import logger from '@/lib/logger.server';
import { SEED } from '@/lib/seed.server';

let pool: Pool | null = null;
let ready: Promise<void> | null = null;

function getPool(): Pool {
	if (pool) return pool;

	const base = {
		waitForConnections: true,
		connectionLimit: 5,
		charset: 'utf8mb4',
		timezone: 'Z',
		dateStrings: false,
	} as const;

	// En Node.js "localhost" puede resolverse a IPv6 y la base de Hostinger no lo acepta.
	const host = !process.env.DB_HOST || process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST;

	pool = mysql.createPool({
		host,
		port: Number(process.env.DB_PORT || 3306),
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		...base,
	});

	return pool;
}

export const newId = () => randomBytes(8).toString('hex').slice(0, 15);

export async function query<T extends RowDataPacket>(sql: string, params: unknown[] = []): Promise<T[]> {
	await ensureReady();
	const [rows] = await getPool().query<T[]>(sql, params as never[]);
	return rows;
}

export async function run(sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
	await ensureReady();
	const [result] = await getPool().query<ResultSetHeader>(sql, params as never[]);
	return result;
}

const TABLES = [
	`CREATE TABLE IF NOT EXISTS blog_posts (
		id CHAR(15) PRIMARY KEY,
		title VARCHAR(180) NOT NULL,
		excerpt VARCHAR(400) NOT NULL,
		body TEXT NOT NULL,
		cover VARCHAR(500) NOT NULL DEFAULT '',
		pinned TINYINT(1) NOT NULL DEFAULT 0,
		published TINYINT(1) NOT NULL DEFAULT 1,
		published_at DATETIME NULL,
		created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	) CHARACTER SET utf8mb4`,
	`CREATE TABLE IF NOT EXISTS reviews (
		id CHAR(15) PRIMARY KEY,
		author VARCHAR(120) NOT NULL,
		organization VARCHAR(160) NOT NULL DEFAULT '',
		body VARCHAR(1200) NOT NULL,
		rating TINYINT NOT NULL,
		pinned TINYINT(1) NOT NULL DEFAULT 0,
		approved TINYINT(1) NOT NULL DEFAULT 0,
		created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	) CHARACTER SET utf8mb4`,
	`CREATE TABLE IF NOT EXISTS contacts (
		id CHAR(15) PRIMARY KEY,
		name VARCHAR(120) NOT NULL,
		email VARCHAR(190) NOT NULL,
		organization VARCHAR(160) NOT NULL DEFAULT '',
		interest VARCHAR(80) NOT NULL DEFAULT 'general',
		message TEXT NOT NULL,
		created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	) CHARACTER SET utf8mb4`,
	`CREATE TABLE IF NOT EXISTS retreat_plans (
		id CHAR(15) PRIMARY KEY,
		slug VARCHAR(80) NOT NULL UNIQUE,
		title VARCHAR(160) NOT NULL,
		days INT NOT NULL,
		location VARCHAR(160) NOT NULL,
		group_size VARCHAR(120) NOT NULL,
		focus VARCHAR(200) NOT NULL,
		summary TEXT NOT NULL,
		image VARCHAR(500) NOT NULL DEFAULT '',
		sort_order INT NOT NULL DEFAULT 0
	) CHARACTER SET utf8mb4`,
	`CREATE TABLE IF NOT EXISTS page_copy (
		id CHAR(15) PRIMARY KEY,
		page_key VARCHAR(40) NOT NULL UNIQUE,
		eyebrow VARCHAR(80) NOT NULL DEFAULT '',
		title VARCHAR(200) NOT NULL,
		body TEXT NOT NULL,
		image VARCHAR(500) NOT NULL DEFAULT ''
	) CHARACTER SET utf8mb4`,
	`CREATE TABLE IF NOT EXISTS site_settings (
		id CHAR(15) PRIMARY KEY,
		notify_email VARCHAR(190) NOT NULL DEFAULT ''
	) CHARACTER SET utf8mb4`,
];

async function count(table: string): Promise<number> {
	const [rows] = await getPool().query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM ${table}`);
	return Number(rows[0]?.n ?? 0);
}

async function setup(): Promise<void> {
	const db = getPool();
	for (const statement of TABLES) await db.query(statement);

	if ((await count('blog_posts')) === 0) {
		for (const post of SEED.blog_posts) {
			await db.query(
				'INSERT INTO blog_posts (id, title, excerpt, body, cover, pinned, published, published_at) VALUES (?,?,?,?,?,?,?,?)',
				[newId(), post.title, post.excerpt, post.body, post.cover, post.pinned ? 1 : 0, post.published ? 1 : 0, post.published_at.replace(' ', 'T')],
			);
		}
	}
	if ((await count('retreat_plans')) === 0) {
		for (const plan of SEED.retreat_plans) {
			await db.query(
				'INSERT INTO retreat_plans (id, slug, title, days, location, group_size, focus, summary, image, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)',
				[newId(), plan.slug, plan.title, plan.days, plan.location, plan.group_size, plan.focus, plan.summary, plan.image, plan.sort],
			);
		}
	}
	if ((await count('page_copy')) === 0) {
		for (const copy of SEED.page_copy) {
			await db.query('INSERT INTO page_copy (id, page_key, eyebrow, title, body, image) VALUES (?,?,?,?,?,?)', [
				newId(), copy.key, copy.eyebrow, copy.title, copy.body, copy.image,
			]);
		}
	}
	logger.info('Base de datos lista');
}

/** Crea tablas y contenido inicial una sola vez; si falla, el próximo pedido lo reintenta. */
export function ensureReady(): Promise<void> {
	if (!ready) {
		ready = setup().catch(error => {
			ready = null;
			throw error;
		});
	}
	return ready;
}

export const iso = (value: unknown): string =>
	value instanceof Date ? value.toISOString() : value ? String(value) : '';

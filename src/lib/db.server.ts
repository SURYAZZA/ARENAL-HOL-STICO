/**
 * MySQL de Hostinger. Sustituye a PocketBase.
 *
 * Las tablas se crean solas la primera vez que el servidor las necesita y se
 * rellenan con el contenido inicial si están vacías: no hay migraciones manuales.
 *
 * Variables de entorno (Node.js; el host se fuerza a 127.0.0.1):
 *   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
 */
import { IMAGE_SIZES, LOCAL_IMAGES } from './local-images.server';
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
	// Todas las fechas se guardan en UTC, sin depender de la zona horaria del servidor.
	pool.pool.on('connection', connection => connection.query("SET time_zone = '+00:00'"));

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
	`CREATE TABLE IF NOT EXISTS retreat_bookings (
		id CHAR(15) PRIMARY KEY,
		name VARCHAR(160) NOT NULL,
		email VARCHAR(190) NOT NULL,
		guests INT NOT NULL DEFAULT 1,
		days INT NOT NULL DEFAULT 0,
		arrival VARCHAR(20) NOT NULL DEFAULT '',
		lang VARCHAR(5) NOT NULL DEFAULT 'es',
		status VARCHAR(20) NOT NULL DEFAULT 'nueva',
		data MEDIUMTEXT NOT NULL,
		created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	) CHARACTER SET utf8mb4`,
	`CREATE TABLE IF NOT EXISTS retreat_affiliates (
		email VARCHAR(190) PRIMARY KEY,
		name VARCHAR(160) NOT NULL DEFAULT '',
		created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	) CHARACTER SET utf8mb4`,
	`CREATE TABLE IF NOT EXISTS admins (
		id CHAR(15) PRIMARY KEY,
		name VARCHAR(120) NOT NULL,
		email VARCHAR(190) NOT NULL UNIQUE,
		password_hash VARCHAR(255) NOT NULL,
		created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	) CHARACTER SET utf8mb4`,
	`CREATE TABLE IF NOT EXISTS admin_log (
		id BIGINT AUTO_INCREMENT PRIMARY KEY,
		actor_id CHAR(15) NOT NULL,
		actor_name VARCHAR(120) NOT NULL,
		actor_email VARCHAR(190) NOT NULL,
		action VARCHAR(400) NOT NULL,
		created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		INDEX admin_log_created (created)
	) CHARACTER SET utf8mb4`,
	`CREATE TABLE IF NOT EXISTS uploads (
		id CHAR(15) PRIMARY KEY,
		mime VARCHAR(40) NOT NULL,
		width INT NOT NULL DEFAULT 0,
		height INT NOT NULL DEFAULT 0,
		data MEDIUMBLOB NOT NULL,
		uploaded_by VARCHAR(190) NOT NULL DEFAULT '',
		created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	) CHARACTER SET utf8mb4`,
];

/** Columnas añadidas después de la primera versión: [tabla, columna, definición]. */
const COLUMNS: [string, string, string][] = [
	['blog_posts', 'cover_w', 'INT NOT NULL DEFAULT 0'],
	['blog_posts', 'cover_h', 'INT NOT NULL DEFAULT 0'],
	['site_settings', 'owner_name', "VARCHAR(120) NOT NULL DEFAULT ''"],
];

async function addMissingColumns(): Promise<void> {
	const db = getPool();
	for (const [table, column, definition] of COLUMNS) {
		const [rows] = await db.query<RowDataPacket[]>(
			'SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
			[table, column],
		);
		if (rows.length === 0) await db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
	}
}

/** Rellena las medidas de portada que falten cuando la foto es una de las guardadas en public/img. */
async function measureCovers(): Promise<void> {
	const db = getPool();
	const [rows] = await db.query<RowDataPacket[]>("SELECT id, cover FROM blog_posts WHERE cover_w = 0 AND cover LIKE '/img/%'");
	for (const row of rows) {
		const size = IMAGE_SIZES[String(row.cover).slice('/img/'.length)];
		if (size) await db.query('UPDATE blog_posts SET cover_w = ?, cover_h = ? WHERE id = ?', [size[0], size[1], row.id]);
	}
}

async function count(table: string): Promise<number> {
	const [rows] = await getPool().query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM ${table}`);
	return Number(rows[0]?.n ?? 0);
}

async function setup(): Promise<void> {
	const db = getPool();
	for (const statement of TABLES) await db.query(statement);
	await addMissingColumns();

	if ((await count('blog_posts')) === 0) {
		for (const post of SEED.blog_posts) {
			await db.query(
				'INSERT INTO blog_posts (id, title, excerpt, body, cover, pinned, published, published_at) VALUES (?,?,?,?,?,?,?,?)',
				[newId(), post.title, post.excerpt, post.body, post.cover, post.pinned ? 1 : 0, post.published ? 1 : 0, new Date(post.published_at.replace(' ', 'T'))],
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
	await localizeImages();
	await measureCovers();
	logger.info('Base de datos lista');
}

const CDN_URL = /https:\/\/(?:horizons-cdn|images)\.hostinger\.com\/[^"'`)\s<]+/g;

const toLocal = (text: string): string =>
	text.replace(CDN_URL, url => {
		const name = decodeURIComponent(url.split('/').pop()!.split('?')[0]).replace(/[^\w.-]/g, '_');
		return LOCAL_IMAGES[name] ? `/img/${LOCAL_IMAGES[name]}` : url;
	});

/** Corrige direcciones ya guardadas que apuntaban al CDN de Horizons. Solo toca filas que aún las tengan. */
async function localizeImages(): Promise<void> {
	const db = getPool();
	const targets: [string, string[]][] = [
		['blog_posts', ['cover', 'body']],
		['retreat_plans', ['image']],
		['page_copy', ['image', 'body']],
	];
	for (const [table, columns] of targets) {
		const where = columns.map(column => `${column} LIKE '%.hostinger.com/%'`).join(' OR ');
		const [rows] = await db.query<RowDataPacket[]>(`SELECT id, ${columns.join(', ')} FROM ${table} WHERE ${where}`);
		for (const row of rows) {
			const next = columns.map(column => toLocal(String(row[column] ?? '')));
			if (next.every((value, i) => value === String(row[columns[i]] ?? ''))) continue;
			await db.query(`UPDATE ${table} SET ${columns.map(column => `${column} = ?`).join(', ')} WHERE id = ?`, [...next, row.id]);
		}
	}
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

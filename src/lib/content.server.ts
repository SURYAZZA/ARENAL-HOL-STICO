import type { RowDataPacket } from 'mysql2/promise';
import { iso, query } from '@/lib/db.server';
import logger from '@/lib/logger.server';
import type { AdminAccount, Affiliate, BlogPost, Booking, LogEntry, ContactNote, PageCopy, RetreatPlan, Review } from '@/lib/content';

type Row = RowDataPacket & Record<string, any>;

const toPost = (r: Row): BlogPost => ({
	id: r.id, title: r.title, excerpt: r.excerpt, body: r.body, cover: r.cover,
	cover_w: Number(r.cover_w ?? 0), cover_h: Number(r.cover_h ?? 0),
	pinned: !!r.pinned, published: !!r.published, published_at: iso(r.published_at), created: iso(r.created),
});
const toReview = (r: Row): Review => ({
	id: r.id, author: r.author, organization: r.organization, body: r.body, rating: Number(r.rating),
	pinned: !!r.pinned, approved: !!r.approved, created: iso(r.created),
});
const toPlan = (r: Row): RetreatPlan => ({
	id: r.id, slug: r.slug, title: r.title, days: Number(r.days), location: r.location,
	group_size: r.group_size, focus: r.focus, summary: r.summary, image: r.image, sort: Number(r.sort_order),
});
const toCopy = (r: Row): PageCopy => ({
	id: r.id, key: r.page_key, eyebrow: r.eyebrow, title: r.title, body: r.body, image: r.image,
});
const toNote = (r: Row): ContactNote => ({
	id: r.id, name: r.name, email: r.email, organization: r.organization, interest: r.interest,
	message: r.message, created: iso(r.created),
});

/** Si la base falla, la página pública se muestra vacía en vez de romperse. */
async function safe<T>(fallback: T, job: () => Promise<T>): Promise<T> {
	try {
		return await job();
	} catch (error) {
		logger.error('Consulta fallida:', error instanceof Error ? error.message : error);
		return fallback;
	}
}

export const publicPosts = () =>
	safe<BlogPost[]>([], async () =>
		(await query<Row>('SELECT * FROM blog_posts WHERE published = 1 ORDER BY published_at DESC, created DESC LIMIT 80')).map(toPost));

export const publicReviews = () =>
	safe<Review[]>([], async () =>
		(await query<Row>('SELECT * FROM reviews WHERE approved = 1 ORDER BY created DESC LIMIT 80')).map(toReview));

export const publicPlans = () =>
	safe<RetreatPlan[]>([], async () =>
		(await query<Row>('SELECT * FROM retreat_plans ORDER BY sort_order ASC')).map(toPlan));

export const retreatCopy = () =>
	safe<PageCopy | null>(null, async () => {
		const rows = await query<Row>("SELECT * FROM page_copy WHERE page_key = 'retiros' LIMIT 1");
		return rows[0] ? toCopy(rows[0]) : null;
	});

function parseData(raw: unknown): Record<string, unknown> {
	try {
		const value = JSON.parse(String(raw ?? '{}'));
		return value && typeof value === 'object' ? value : {};
	} catch {
		return {};
	}
}

export async function adminSnapshot() {
	const [posts, reviews, plans, copy, notes, settings, admins, log, bookings, affiliates] = await Promise.all([
		query<Row>('SELECT * FROM blog_posts ORDER BY published_at DESC'),
		query<Row>('SELECT * FROM reviews ORDER BY created DESC'),
		query<Row>('SELECT * FROM retreat_plans ORDER BY sort_order ASC'),
		query<Row>("SELECT * FROM page_copy WHERE page_key = 'retiros' LIMIT 1"),
		query<Row>('SELECT * FROM contacts ORDER BY created DESC LIMIT 200'),
		query<Row>('SELECT * FROM site_settings LIMIT 1'),
		query<Row>('SELECT id, name, email, created FROM admins ORDER BY created ASC'),
		query<Row>('SELECT id, actor_name, actor_email, action, created FROM admin_log ORDER BY id DESC LIMIT 500'),
		query<Row>('SELECT * FROM retreat_bookings ORDER BY created DESC LIMIT 300'),
		query<Row>('SELECT email, name, created FROM retreat_affiliates ORDER BY created DESC'),
	]);
	return {
		posts: posts.map(toPost),
		reviews: reviews.map(toReview),
		plans: plans.map(toPlan),
		copy: copy[0] ? toCopy(copy[0]) : null,
		notes: notes.map(toNote),
		notifyEmail: String(settings[0]?.notify_email ?? ''),
		bookings: bookings.map((r): Booking => ({
			id: r.id, name: r.name, email: r.email, guests: Number(r.guests), days: Number(r.days), arrival: r.arrival,
			lang: r.lang, status: r.status, data: parseData(r.data), created: iso(r.created),
		})),
		affiliates: affiliates.map((r): Affiliate => ({ email: r.email, name: r.name, created: iso(r.created) })),
		admins: admins.map((r): AdminAccount => ({ id: r.id, name: r.name, email: r.email, owner: false, created: iso(r.created) })),
		log: log.map((r): LogEntry => ({ id: Number(r.id), name: r.actor_name, email: r.actor_email, action: r.action, created: iso(r.created) })),
	};
}

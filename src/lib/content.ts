export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  /** Medidas de la portada en píxeles; 0 si no se conocen. */
  cover_w: number;
  cover_h: number;
  pinned: boolean;
  published: boolean;
  published_at: string;
  created: string;
};

export type Review = {
  id: string;
  author: string;
  organization: string;
  body: string;
  rating: number;
  pinned: boolean;
  approved: boolean;
  created: string;
};

export type RetreatPlan = {
  id: string;
  slug: string;
  title: string;
  days: number;
  location: string;
  group_size: string;
  focus: string;
  summary: string;
  image: string;
  sort: number;
};

export type PageCopy = {
  id: string;
  key: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
};

export type ContactNote = {
  id: string;
  name: string;
  email: string;
  organization: string;
  interest: string;
  message: string;
  created: string;
};

export type AdminAccount = { id: string; name: string; email: string; owner: boolean; created?: string };

export type LogEntry = { id: number; name: string; email: string; action: string; created: string };

/**
 * Proporción (ancho / alto) que admite la foto de una publicación en el blog.
 * Entre estos límites la foto se muestra completa. Fuera de ellos hay que recortarla:
 * el panel abre un editor para elegir qué parte queda.
 */
export const COVER_RATIO = { min: 0.62, max: 1.6 } as const;

export const clampCoverRatio = (ratio: number) => Math.min(COVER_RATIO.max, Math.max(COVER_RATIO.min, ratio));

export function splitJournal(posts: BlogPost[]) {
  const published = posts.filter(post => post.published !== false);
  const pinned = published.find(post => post.pinned) ?? null;
  const rest = published.filter(post => post.id !== pinned?.id);
  return {
    pinned,
    recent: rest.slice(0, 4),
    archive: rest.slice(4),
  };
}

export function rankReviews(reviews: Review[]) {
  return [...reviews].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.created.localeCompare(a.created);
  });
}

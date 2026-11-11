import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { BlogPost } from '@/lib/content';
import { splitJournal } from '@/lib/content';
import { formatLongDate, useLang } from '@/lib/i18n';

function Card({ post, featured }: { post: BlogPost; featured?: boolean }) {
  const { t, tx, lang } = useLang();
  return (
    <article className={featured ? 'post featured' : 'post'}>
      {post.cover ? (
        <div className="post-media">
          <img src={post.cover} alt="" loading="lazy" />
        </div>
      ) : null}
      <div>
        {featured ? <p className="eyebrow">{t('journal.pinned')}</p> : null}
        <p className="post-date">{formatLongDate(post.published_at, lang)}</p>
        <h3>{tx(post.title)}</h3>
        <p>{tx(post.excerpt)}</p>
        <p className="post-body">{tx(post.body)}</p>
      </div>
    </article>
  );
}

export function Journal({ posts }: { posts: BlogPost[] }) {
  const { t } = useLang();
  const [params] = useSearchParams();
  const openByLink = params.get('blog') === 'abierto';
  const [open, setOpen] = useState(openByLink);
  const expanded = open || openByLink;
  const { pinned, recent, archive } = splitJournal(posts);
  const visible = pinned ? [pinned, ...recent] : recent;

  return (
    <section className="band journal" id="diario">
      <div className="section-head">
        <p className="eyebrow">{t('journal.eyebrow')}</p>
        <h2>{t('journal.title')}</h2>
        <p>{t('journal.intro')}&nbsp;</p>
      </div>
      <div className="journal-masonry">
        {visible.map((post, index) => (
          <Card key={post.id} post={post} featured={index === 0 && Boolean(pinned)} />
        ))}
        {visible.length === 0 ? <p className="empty">{t('journal.empty')}</p> : null}
      </div>
      {expanded && archive.length > 0 ? (
        <div className="journal-masonry archive">
          {archive.map(post => (
            <Card key={post.id} post={post} />
          ))}
        </div>
      ) : null}
      {archive.length > 0 ? (
        <button type="button" className="btn ghost" onClick={() => setOpen(value => !value)} aria-expanded={expanded}>
          {expanded ? t('journal.hide') : t('journal.more')}
        </button>
      ) : (
        <p className="quiet">{t('journal.quiet')}</p>
      )}
    </section>
  );
}

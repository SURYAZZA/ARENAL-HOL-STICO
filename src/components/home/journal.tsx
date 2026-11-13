import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { BlogPost } from '@/lib/content';
import { clampCoverRatio, splitJournal } from '@/lib/content';
import { formatLongDate, useLang } from '@/lib/i18n';

/**
 * Una publicación del blog: foto a la izquierda y fecha, título y texto a la derecha.
 * El ancho de la foto sale de su proporción, hasta un máximo de la mitad de la tarjeta.
 */
function Card({ post, featured, isNew }: { post: BlogPost; featured?: boolean; isNew?: boolean }) {
  const { t, tx, lang } = useLang();
  const [open, setOpen] = useState(false);
  // Publicaciones antiguas pueden no traer medidas: se leen al cargar la foto.
  const [size, setSize] = useState<[number, number]>([post.cover_w, post.cover_h]);
  // Proporción ancho/alto de la foto, acotada: una foto fuera de los límites se muestra recortada al centro.
  const ratio = clampCoverRatio(size[0] && size[1] ? size[0] / size[1] : 1.4);
  const body = tx(post.body).trim();

  const head = (
    <header className="post-head">
      {isNew ? <span className="post-tag">{t('journal.new')}</span> : null}
      <p className="post-date">{formatLongDate(post.published_at, lang)}</p>
      <h3>{tx(post.title)}</h3>
    </header>
  );
  const media = post.cover ? (
    <div className="post-media">
      <img
        src={post.cover}
        alt=""
        loading="lazy"
        width={size[0] || undefined}
        height={size[1] || undefined}
        onLoad={event => {
          const image = event.currentTarget;
          if (!size[0] && image.naturalWidth) setSize([image.naturalWidth, image.naturalHeight]);
        }}
      />
    </div>
  ) : null;
  const text = (
    <div className="post-text">
      <p className="post-excerpt">{tx(post.excerpt)}</p>
      {open && body ? <p className="post-body">{body}</p> : null}
      {body ? (
        <button type="button" className="post-more" onClick={() => setOpen(value => !value)} aria-expanded={open}>
          {open ? t('journal.less') : t('journal.read')}
        </button>
      ) : null}
    </div>
  );

  // Todas las publicaciones comparten forma: foto a la izquierda, texto a la derecha.
  const className = ['post', post.cover ? 'side' : '', featured ? 'featured' : ''].filter(Boolean).join(' ');
  return (
    <article className={className} style={{ '--ratio': ratio.toFixed(4) } as React.CSSProperties}>
      {media}
      <div className="post-side">
        {head}
        {text}
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
  const shown = expanded ? [...recent, ...archive] : recent;

  return (
    <section className="band journal" id="diario">
      <div className="section-head">
        <p className="eyebrow">{t('journal.eyebrow')}</p>
        <h2>{t('journal.title')}</h2>
        <p>{t('journal.intro')}&nbsp;</p>
      </div>
      {pinned ? <Card post={pinned} featured /> : null}
      <div className="journal-grid">
        {shown.map((post, index) => (
          <Card key={post.id} post={post} isNew={index === 0} />
        ))}
      </div>
      {!pinned && shown.length === 0 ? <p className="empty">{t('journal.empty')}</p> : null}
      {archive.length > 0 ? (
        <button type="button" className="btn ghost" onClick={() => setOpen(value => !value)} aria-expanded={expanded}>
          {expanded ? t('journal.hide') : t('journal.more')}
        </button>
      ) : null}
    </section>
  );
}

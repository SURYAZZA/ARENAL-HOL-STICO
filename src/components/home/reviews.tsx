import { useState } from 'react';
import { postJson } from '@/lib/admin-api';
import type { Review } from '@/lib/content';
import { rankReviews } from '@/lib/content';
import { useLang } from '@/lib/i18n';
export function Reviews({
  reviews
}: {
  reviews: Review[];
}) {
  const { t, lang } = useLang();
  const ranked = rankReviews(reviews.filter(review => review.approved !== false));
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'' | 'sending' | 'ok' | 'error'>('');
  const [rating, setRating] = useState(5);
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    try {
      await postJson('/api/reviews', {
        author: String(data.get('author') || '').trim(),
        organization: String(data.get('organization') || '').trim(),
        body: String(data.get('body') || '').trim(),
        rating,
      });
      form.reset();
      setStatus('ok');
      setOpen(false);
    } catch {
      setStatus('error');
    }
  }
  return <section className="reviews" id="resenas">
      <div className="section-head">
        <p className="eyebrow">{t('reviews.eyebrow')}</p>
        <h2>{t('reviews.title')}</h2>
        <p></p>
      </div>
      {ranked.length === 0 ? <p className="empty wide"></p> : <ol className="review-list">
          {ranked.map(review => <li key={review.id}>
              <div className="stars" aria-label={lang === 'en' ? `${review.rating} out of 5` : lang === 'fr' ? `${review.rating} sur 5` : `${review.rating} de 5`}>
                {'★★★★★'.slice(0, review.rating)}
                <span>{'★★★★★'.slice(review.rating)}</span>
              </div>
              {review.pinned ? <em className="pin">{t('reviews.pinned')}</em> : null}
              <blockquote>{review.body}</blockquote>
              <cite>
                {review.author}
                {review.organization ? ` · ${review.organization}` : ''}
              </cite>
            </li>)}
        </ol>}
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        {t('reviews.leave')}
      </button>
      {status ? <p className="status">{status === 'sending' ? t('reviews.sending') : status === 'ok' ? t('reviews.ok') : t('reviews.error')}</p> : null}
      {open ? <form className="review-form" onSubmit={onSubmit}>
          <label>
            {t('reviews.name')}
            <input name="author" required maxLength={120} />
          </label>
          <label>
            {t('reviews.org')}
            <input name="organization" maxLength={160} placeholder={t('reviews.orgPlaceholder')} />
          </label>
          <fieldset>
            <legend>{t('reviews.rating')}</legend>
            {[1, 2, 3, 4, 5].map(value => <button key={value} type="button" className={value <= rating ? 'star on' : 'star'} onClick={() => setRating(value)} aria-label={lang === 'en' ? `${value} stars` : lang === 'fr' ? `${value} étoiles` : `${value} estrellas`}>
                ★
              </button>)}
          </fieldset>
          <label>
            {t('reviews.review')}
            <textarea name="body" required minLength={12} maxLength={1200} rows={4} />
          </label>
          <div className="row">
            <button type="submit" className="btn">
              {t('reviews.submit')}
            </button>
            <button type="button" className="btn ghost" onClick={() => setOpen(false)}>
              {t('reviews.cancel')}
            </button>
          </div>
        </form> : null}
    </section>;
}
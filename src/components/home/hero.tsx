import { HERO_IMAGE } from '@/constants/brand';
import { useLang } from '@/lib/i18n';

export function Hero() {
  const { t } = useLang();
  return (
    <section className="hero" id="inicio">
      <img src={HERO_IMAGE} alt={t('hero.alt')} />
      <div className="hero-shade" />
      <div className="hero-copy hero-copy--bare">
        <p className="eyebrow">{t('hero.eyebrow')}</p>
        <h1>
          {t('hero.title1')}
          <i>{t('hero.title2')}</i>
        </h1>
        <a className="btn hero-cta" href="/servicios">
          {t('hero.cta')}
        </a>
      </div>
    </section>
  );
}

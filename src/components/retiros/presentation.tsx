import type { PageCopy, RetreatPlan } from '@/lib/content';
import { useLang } from '@/lib/i18n';

const fallback: PageCopy = {
  id: 'fallback',
  key: 'retiros',
  eyebrow: 'Un viaje hacia dentro',
  title: 'Desconecta del ruido. Reconecta contigo.',
  body: 'Los retiros de Arenal Holístico se arman con la naturaleza como sala principal. No vendemos un paquete cerrado: acompañamos a hoteles, agencias y organizadores a diseñar una estancia de 3 a 10 días, con grupo, locación y enfoque a la medida. También organizamos retiros propios en función de interesados, si quieres formar parte, afiliate a retiros y te tomaremos en cuenta para nuestras próximas fechas.',
  image: '/img/forest-yoga-session-stockcake-KACnS.jpg',
};

export function RetreatPresentation({ copy, plans }: { copy: PageCopy | null; plans: RetreatPlan[] }) {
  const { t, tx } = useLang();
  const page = copy ?? fallback;
  const href = `/?interes=afiliado&mensaje=${encodeURIComponent(t('retreats.affiliateMessage'))}#contacto`;

  return (
    <main className="retreats-page">
      <section className="retreat-hero">
        <img src={page.image || fallback.image} alt="" sizes="100vw" />
        <div>
          <p className="eyebrow light">{tx(page.eyebrow)}</p>
          <h1>{tx(page.title)}</h1>
          <p>{tx(page.body)}</p>
        </div>
      </section>
      <section className="plans">
        <p className="eyebrow">{t('retreats.eyebrow2')}</p>
        <h2>{t('retreats.title2')}</h2>
        <ol>
          {plans.map(plan => (
            <li key={plan.id}>
              <img src={plan.image} alt="" sizes="(min-width: 900px) 42vw, 100vw" />
              <div>
                <p className="meta">
                  {plan.days} {t('retreats.days')} · {tx(plan.location)}
                </p>
                <h3>{tx(plan.title)}</h3>
                <p>{tx(plan.summary)}</p>
                <dl>
                  <div>
                    <dt>{t('retreats.group')}</dt>
                    <dd>{tx(plan.group_size)}</dd>
                  </div>
                  <div>
                    <dt>{t('retreats.focus')}</dt>
                    <dd>{tx(plan.focus)}</dd>
                  </div>
                  <div>
                    <dt>{t('retreats.price')}</dt>
                    <dd>{t('retreats.onRequest')}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>
        <a className="btn" href={href}>
          {t('retreats.affiliate')}
        </a>
      </section>
    </main>
  );
}

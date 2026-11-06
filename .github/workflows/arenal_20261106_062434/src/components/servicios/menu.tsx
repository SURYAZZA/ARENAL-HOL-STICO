import { Link } from 'react-router';
import { services } from '@/data/services';
import { inquiryMessageFor, serviceCopy, useLang } from '@/lib/i18n';

export function ServiceMenu() {
  const { t, lang } = useLang();
  return (
    <main className="services-page">
      <header className="page-intro">
        <p className="eyebrow">{t('services.eyebrow')}</p>
        <h1>{t('services.title')}</h1>
        <p>{t('services.intro')}</p>
      </header>
      <ol>
        {services.map((service, index) => {
          const copy = serviceCopy[service.slug];
          const name = copy ? copy.name[lang] : service.name;
          const summary = copy ? copy.summary[lang] : service.summary;
          return (
            <li key={service.slug}>
              <img src={service.image} srcSet={service.srcSet} sizes="(min-width: 800px) 38vw, 100vw" alt="" />
              <div>
                <span>0{index + 1}</span>
                <h2>{name}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{summary}</p>
                {service.retreat ? (
                  <Link className="btn" to="/retiros">
                    {t('services.seeRetreats')}
                  </Link>
                ) : (
                  <a
                    className="btn"
                    href={`/?interes=${service.slug}&mensaje=${encodeURIComponent(inquiryMessageFor(lang, name))}#contacto`}
                  >
                    {t('services.inquire')} {name}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

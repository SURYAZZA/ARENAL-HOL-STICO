import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { postJson } from '@/lib/admin-api';
import { services } from '@/data/services';
import { inquiryMessageFor, serviceCopy, useLang } from '@/lib/i18n';

export function Contact() {
  const [params] = useSearchParams();
  const { t, lang } = useLang();
  const interest = params.get('interes') ?? 'general';
  const preset =
    params.get('mensaje') ||
    (interest === 'afiliado'
      ? t('retreats.affiliateMessage')
      : services.find(service => service.slug === interest)
        ? inquiryMessageFor(lang, serviceCopy[interest]?.name[lang] ?? services.find(service => service.slug === interest)!.name)
        : '');
  const [status, setStatus] = useState<'' | 'sending' | 'error'>('');
  const [sent, setSent] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    try {
      await postJson('/api/contact', {
        name: String(data.get('name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        organization: String(data.get('organization') || '').trim(),
        interest: String(data.get('interest') || 'general'),
        message: String(data.get('message') || '').trim(),
      });
      setSent(true);
      setStatus('');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="contact" id="contacto">
      <div>
        <p className="eyebrow light">{t('contact.eyebrow')}</p>
        <h2>{t('contact.title')}</h2>
        <p>{t('contact.intro')}</p>
      </div>
      {sent ? (
        <p className="status light">{t('contact.ok')}</p>
      ) : (
        <form onSubmit={onSubmit} key={interest + preset}>
          <label>
            {t('contact.name')}
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            {t('contact.email')}
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            {t('contact.org')}
            <input name="organization" autoComplete="organization" placeholder={t('contact.orgPlaceholder')} />
          </label>
          <label>
            {t('contact.interest')}
            <select name="interest" defaultValue={interest}>
              <option value="general">{t('contact.general')}</option>
              {services.filter(service => !service.retreat).map(service => (
                <option key={service.slug} value={service.slug}>
                  {serviceCopy[service.slug]?.name[lang] ?? service.name}
                </option>
              ))}
              <option value="afiliado">{t('contact.affiliate')}</option>
              <option value="evento">{t('contact.event')}</option>
            </select>
          </label>
          <label>
            {t('contact.message')}
            <textarea name="message" required rows={5} defaultValue={preset} />
          </label>
          <button className="btn light" type="submit">
            {t('contact.submit')}
          </button>
          {status ? <p className="status light">{status === 'sending' ? t('contact.sending') : t('contact.error')}</p> : null}
        </form>
      )}
    </section>
  );
}

import { useEffect, useState } from 'react';
import {
  acceptAllCookies,
  CookieConsentCategory,
  hasConsentDecision,
  isConsentGranted,
  onCookiePreferencesRequested,
  rejectOptionalCookies,
  saveConsent,
} from '@/lib/cookie-consent';
import { useLang } from '@/lib/i18n';

type Choices = { analytics: boolean; marketing: boolean; platformAnalytics: boolean };

export function CookieBanner() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [choices, setChoices] = useState<Choices>({
    analytics: false,
    marketing: false,
    platformAnalytics: false,
  });

  useEffect(() => {
    setOpen(!hasConsentDecision());
    return onCookiePreferencesRequested(() => {
      setChoices({
        analytics: isConsentGranted(CookieConsentCategory.Analytics),
        marketing: isConsentGranted(CookieConsentCategory.Marketing),
        platformAnalytics: isConsentGranted(CookieConsentCategory.PlatformAnalytics),
      });
      setCustom(true);
      setOpen(true);
    });
  }, []);

  if (!open) return null;

  return (
    <section className="cookie-banner" role="dialog" aria-label={t('cookies.aria')}>
      <p>{t('cookies.text')}</p>
      {custom ? (
        <fieldset>
          <label>
            <input
              type="checkbox"
              checked={choices.analytics}
              onChange={event => setChoices(current => ({ ...current, analytics: event.target.checked }))}
            />
            {t('cookies.analytics')}
          </label>
          <label>
            <input
              type="checkbox"
              checked={choices.marketing}
              onChange={event => setChoices(current => ({ ...current, marketing: event.target.checked }))}
            />
            {t('cookies.marketing')}
          </label>
          <label>
            <input
              type="checkbox"
              checked={choices.platformAnalytics}
              onChange={event =>
                setChoices(current => ({ ...current, platformAnalytics: event.target.checked }))
              }
            />
            {t('cookies.platform')}
          </label>
        </fieldset>
      ) : null}
      <div className="cookie-actions">
        <button type="button" onClick={() => { rejectOptionalCookies(); setOpen(false); }}>
          {t('cookies.reject')}
        </button>
        {custom ? (
          <button
            type="button"
            onClick={() => {
              saveConsent(choices);
              setOpen(false);
            }}
          >
            {t('cookies.save')}
          </button>
        ) : (
          <button type="button" onClick={() => setCustom(true)}>
            {t('cookies.customize')}
          </button>
        )}
        <button type="button" className="solid" onClick={() => { acceptAllCookies(); setOpen(false); }}>
          {t('cookies.acceptAll')}
        </button>
      </div>
    </section>
  );
}

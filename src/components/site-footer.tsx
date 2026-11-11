import { useLocation } from 'react-router';
import { Instagram, Facebook } from 'lucide-react';
import { openCookiePreferences } from '@/lib/cookie-consent';
import { LOGO_LIGHT } from '@/constants/brand';
import { useLang } from '@/lib/i18n';

export function SiteFooter() {
  const { pathname } = useLocation();
  const { t } = useLang();
  if (pathname === '/entrar' || pathname === '/admin') return null;

  return (
    <footer className="site-footer">
      <img src={LOGO_LIGHT} alt="" width={64} height={72} />
      <div>
        <strong>Arenal Holístico</strong>
        <p>{t('footer.tagline')}</p>
      </div>
      <nav>
        <a href="/">{t('nav.home')}</a>
        <a href="/servicios">{t('nav.services')}</a>
        <a href="/retiros">{t('nav.retreats')}</a>
        <a href="/?blog=abierto#diario">{t('nav.blog')}</a>
        <a href="/#contacto">{t('nav.contact')}</a>
        <button type="button" onClick={() => openCookiePreferences()}>
          {t('footer.cookies')}
        </button>
      </nav>
      <div className="footer-social">
        <a href="https://www.instagram.com/arenal_holistico/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <Instagram size={20} />
        </a>
        <a href="https://www.facebook.com/Arenalholistico/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <Facebook size={20} />
        </a>
      </div>
      <p className="quiet">© 2026 Arenal Holístico</p>
    </footer>
  );
}

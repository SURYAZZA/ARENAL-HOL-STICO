import { NavLink, useLocation } from 'react-router';
import { Instagram, Facebook } from 'lucide-react';
import { LOGO } from '@/constants/brand';
import { useLang, type UiKey } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/language-switcher';

const links: { to: string; label: UiKey; end?: boolean; hash?: boolean }[] = [
  { to: '/', label: 'nav.home', end: true },
  { to: '/servicios', label: 'nav.services' },
  { to: '/retiros', label: 'nav.retreats' },
  { to: '/?blog=abierto#diario', label: 'nav.blog', hash: true },
  { to: '/#contacto', label: 'nav.contact', hash: true },
];

export function SiteHeader() {
  const { pathname } = useLocation();
  const { t } = useLang();
  if (pathname === '/entrar' || pathname === '/admin') return null;

  return (
    <header className="site-header">
      <a href="/" className="brand">
        <img src={LOGO} alt="Arenal Holístico" width={72} height={82} />
        <span>
          Arenal
          <em>Holístico</em>
        </span>
      </a>
      <nav aria-label={t('nav.aria')}>
        {links.map(link =>
          link.hash ? (
            <a key={link.label} href={link.to}>
              {t(link.label)}
            </a>
          ) : (
            <NavLink key={link.label} to={link.to} end={link.end}>
              {t(link.label)}
            </NavLink>
          ),
        )}
      </nav>
      <div className="header-social">
        <a href="https://www.instagram.com/arenal_holistico/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <Instagram size={20} />
        </a>
        <a href="https://www.facebook.com/Arenalholistico/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <Facebook size={20} />
        </a>
      </div>
      <LanguageSwitcher />
    </header>
  );
}

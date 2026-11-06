import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { LANGUAGES, useLang } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find(item => item.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        type="button"
        className="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('lang.change')}: ${current.label}`}
        onClick={() => setOpen(value => !value)}
      >
        <Globe size={18} aria-hidden="true" />
        <span>{current.short}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open ? (
        <ul className="lang-menu" role="listbox" aria-label={t('lang.change')}>
          {LANGUAGES.map(item => (
            <li key={item.code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={item.code === lang}
                lang={item.code}
                onClick={() => {
                  setLang(item.code);
                  setOpen(false);
                }}
              >
                <span>{item.label}</span>
                {item.code === lang ? <Check size={16} aria-hidden="true" /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { X } from 'lucide-react';
import { overview, ui, type Block } from '@/data/retreat';
import { useLang } from '@/lib/i18n';

const CONTACT_EMAIL = 'oropendolaretreats@gmail.com';
const CONTACT_INSTAGRAM = 'oropendolaretreats';

/** Dibuja un bloque del overview con la misma forma que tiene en el PDF. */
function BlockView({ block }: { block: Block }) {
  const { lang } = useLang();
  switch (block.kind) {
    case 'p':
      return <p>{block.text[lang]}</p>;
    case 'note':
      return <p className="ov-note">{block.text[lang]}</p>;
    case 'sub':
      return <h4>{block.text[lang]}</h4>;
    case 'list':
      return <ul className="ov-list">{block.items.map(item => <li key={item.es}>{item[lang]}</li>)}</ul>;
    case 'pills':
      return <ul className="ov-pills">{block.items.map(item => <li key={item.es}>{item[lang]}</li>)}</ul>;
    case 'chips':
      return <ul className="ov-chips">{block.items.map(item => <li key={item.es}>{item[lang]}</li>)}</ul>;
    case 'quotes':
      return <ul className="ov-quotes">{block.items.map(item => <li key={item.es}>{item[lang]}</li>)}</ul>;
    case 'option':
      return (
        <p className="ov-option">
          <strong>{block.title[lang]}:</strong> {block.text[lang]}
        </p>
      );
    case 'days':
      return (
        <div className="ov-days">
          {block.days.map(day => (
            <div key={day.title.es}>
              <h4>{day.title[lang]}</h4>
              <ul className="ov-list">{day.items.map(item => <li key={item.es}>{item[lang]}</li>)}</ul>
            </div>
          ))}
        </div>
      );
    case 'steps':
      return (
        <ol className="ov-steps">
          {block.steps.map((step, index) => (
            <li key={step.title.es}>
              <h4>{index + 1}. {step.title[lang]}</h4>
              <p>{step.text[lang]}</p>
            </li>
          ))}
        </ol>
      );
    case 'contact':
      return (
        <p className="ov-contact">
          <span><strong>Email</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></span>
          <span><strong>Instagram</strong> <a href={`https://www.instagram.com/${CONTACT_INSTAGRAM}`} target="_blank" rel="noreferrer">@{CONTACT_INSTAGRAM}</a></span>
        </p>
      );
  }
}

/** Ventana con el overview completo del retiro, con el formato visual del PDF. */
export function OverviewDialog({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const panel = useRef<HTMLDivElement>(null);
  const affiliateHref = `/?interes=afiliado&mensaje=${encodeURIComponent(ui.affiliateMessage[lang])}#contacto`;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="ov-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="ov-panel" role="dialog" aria-modal="true" aria-label="Oropéndola One to One" tabIndex={-1} ref={panel}>
        <button type="button" className="ov-close" onClick={onClose} aria-label={ui.close[lang]}>
          <X size={20} aria-hidden="true" />
        </button>

        <header className="ov-cover">
          <p className="ov-kicker">{ui.coverKicker[lang]}</p>
          <img className="ov-symbol" src="/img/oropendola-simbolo.png" alt="" width={56} height={56} />
          <img className="ov-wordmark" src="/img/oropendola-wordmark.svg" alt="Oropéndola Retreats" />
          <p className="ov-tagline">{ui.coverTagline[lang]}</p>
        </header>

        {overview.map(section => (
          <section key={section.id} className={`ov-section ${section.tone}`}>
            {section.image ? <img className="ov-photo" src={section.image} alt="" loading="lazy" /> : null}
            <h3>{section.title[lang]}</h3>
            {section.blocks.map((block, index) => <BlockView key={index} block={block} />)}
            {section.hills ? <img className="ov-hills" src="/img/retiro-colinas.webp" alt="" loading="lazy" /> : null}
          </section>
        ))}

        <footer className="ov-actions">
          <div>
            <a className="btn ov-affiliate" href={affiliateHref}>{ui.affiliate[lang]}</a>
            <p>{ui.affiliateNote[lang]}</p>
          </div>
          <div>
            <Link className="btn ov-book" to="/retiros/reserva">{ui.book[lang]}</Link>
            <p>{ui.bookNote[lang]}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

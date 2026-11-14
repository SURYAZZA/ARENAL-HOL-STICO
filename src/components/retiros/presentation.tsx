import { useCallback, useState } from 'react';
import { RETREAT_NAME, retreatAbout, retreatFacts, ui } from '@/data/retreat';
import { useLang } from '@/lib/i18n';
import { OverviewDialog } from '@/components/retiros/overview-dialog';

/**
 * Página Retiros: portada (réplica de la portada del Master Document) y, debajo,
 * el único retiro disponible por ahora: Oropéndola One to One.
 */
export function RetreatPresentation() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <main className="retreats-page">
      {/* Los textos de la portada se dejan en inglés, igual que en el documento original. */}
      <section className="retreat-cover" aria-label="Oropéndola Retreats">
        <p className="rc-corner rc-tl">The Breathing Blueprint</p>
        <p className="rc-corner rc-tr">Hosted by Casa Oropéndola</p>
        <div className="rc-center">
          <h1>
            <img src="/img/oropendola-wordmark.svg" alt="Oropéndola Retreats" />
          </h1>
          <p className="rc-sub">An Arenal Holístico Experience</p>
        </div>
        <p className="rc-corner rc-bl">The Breathing Blueprint</p>
        <p className="rc-corner rc-br">Hosted by Casa Oropéndola</p>
      </section>

      <section className="retreat-one">
        <img src="/img/retiro-meditacion.webp" alt="" loading="lazy" />
        <div>
          <p className="eyebrow">{ui.sectionEyebrow[lang]}</p>
          <h2>{RETREAT_NAME}</h2>
          <ul className="retreat-facts">
            {retreatFacts.map(fact => <li key={fact.es}>{fact[lang]}</li>)}
          </ul>
          {retreatAbout.map(paragraph => <p key={paragraph.es}>{paragraph[lang]}</p>)}
          <button type="button" className="btn" onClick={() => setOpen(true)}>
            {ui.deepen[lang]}
          </button>
        </div>
      </section>

      {open ? <OverviewDialog onClose={close} /> : null}
    </main>
  );
}

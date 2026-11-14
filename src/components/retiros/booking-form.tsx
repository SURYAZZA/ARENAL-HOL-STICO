import { useState } from 'react';
import { Link } from 'react-router';
import { postJson } from '@/lib/admin-api';
import { RETREAT_NAME, bookingChoices, bookingLabels as labels, bookingUi as text, type Choice } from '@/data/retreat';
import { useLang } from '@/lib/i18n';

/** Formulario de reserva del retiro. Lo recibe /api/booking y se revisa en /admin. */
export function BookingForm() {
  const { lang } = useLang();
  const [status, setStatus] = useState<'' | 'sending' | 'error'>('');
  const [sent, setSent] = useState(false);
  const [guests, setGuests] = useState('1');
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const one = (key: string) => String(data.get(key) ?? '').trim();
    setStatus('sending');
    try {
      await postJson('/api/booking', {
        lang,
        name: one('name'), email: one('email'), phone: one('phone'), country: one('country'), language: one('language'),
        guests: one('guests'), companions: one('companions'), arrival: one('arrival'), days: one('days'),
        flexible: one('flexible'), transport: one('transport'),
        focus: data.getAll('focus').map(String), focusOther: one('focusOther'),
        activities: data.getAll('activities').map(String),
        mealPlan: one('mealPlan'), diet: data.getAll('diet').map(String), allergies: one('allergies'),
        yogaLevel: one('yogaLevel'), health: one('health'), petAllergy: data.get('petAllergy') === 'on',
        budget: one('budget'), expectations: one('expectations'), source: one('source'),
        consent: data.get('consent') === 'on',
      });
      setSent(true);
      setStatus('');
      window.scrollTo({ top: 0 });
    } catch {
      setStatus('error');
    }
  }

  const select = (name: keyof typeof bookingChoices, required = false) => (
    <select name={name} required={required} defaultValue="">
      <option value="" disabled={required}>{text.choose[lang]}</option>
      {(bookingChoices[name] as readonly Choice[]).map(option => (
        <option key={option.value} value={option.value}>{option.label[lang]}</option>
      ))}
    </select>
  );
  const checks = (name: 'focus' | 'activities' | 'diet') => (
    <div className="bk-checks">
      {bookingChoices[name].map(option => (
        <label key={option.value} className="bk-check">
          <input type="checkbox" name={name} value={option.value} /> {option.label[lang]}
        </label>
      ))}
    </div>
  );

  if (sent) {
    return (
      <main className="booking-page">
        <div className="bk-done" role="status">
          <p className="eyebrow">{RETREAT_NAME}</p>
          <h1>{text.doneTitle[lang]}</h1>
          <p>{text.done[lang]}</p>
          <Link className="btn" to="/retiros">{text.back[lang]}</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <header className="bk-head">
        <Link className="bk-back" to="/retiros">← {text.back[lang]}</Link>
        <p className="eyebrow">{text.eyebrow[lang]} · {RETREAT_NAME}</p>
        <h1>{text.title[lang]}</h1>
        <p>{text.intro[lang]}</p>
      </header>

      <form className="bk-form" onSubmit={onSubmit}>
        <fieldset>
          <legend>1. {text.s1[lang]}</legend>
          <label>{labels.name[lang]} *<input name="name" required maxLength={160} autoComplete="name" /></label>
          <label>{labels.email[lang]} *<input name="email" type="email" required maxLength={190} autoComplete="email" /></label>
          <label>{labels.phone[lang]}<input name="phone" type="tel" maxLength={60} autoComplete="tel" /></label>
          <label>{labels.country[lang]}<input name="country" maxLength={80} autoComplete="country-name" /></label>
          <label>{labels.language[lang]}{select('language')}</label>
        </fieldset>

        <fieldset>
          <legend>2. {text.s2[lang]}</legend>
          <label>
            {labels.guests[lang]} *
            <select name="guests" required value={guests} onChange={event => setGuests(event.target.value)}>
              {bookingChoices.guests.map(option => <option key={option.value} value={option.value}>{option.label[lang]}</option>)}
            </select>
          </label>
          {guests !== '1' ? (
            <label className="bk-wide">{labels.companions[lang]}<textarea name="companions" rows={2} maxLength={600} /></label>
          ) : null}
          <label>{labels.days[lang]} *{select('days', true)}</label>
          <label>{labels.arrival[lang]}<input name="arrival" type="date" min={today} /></label>
          <label>{labels.flexible[lang]}{select('flexible')}</label>
          <label>{labels.transport[lang]}{select('transport')}</label>
        </fieldset>

        <fieldset>
          <legend>3. {text.s3[lang]}</legend>
          <div className="bk-wide">
            <p className="bk-label">{labels.focus[lang]}</p>
            {checks('focus')}
          </div>
          <label className="bk-wide">{labels.focusOther[lang]}<input name="focusOther" maxLength={300} /></label>
          <div className="bk-wide">
            <p className="bk-label">{labels.activities[lang]}</p>
            {checks('activities')}
          </div>
        </fieldset>

        <fieldset>
          <legend>4. {text.s4[lang]}</legend>
          <label>{labels.mealPlan[lang]}{select('mealPlan')}</label>
          <div>
            <p className="bk-label">{labels.diet[lang]}</p>
            {checks('diet')}
          </div>
          <label className="bk-wide">{labels.allergies[lang]}<textarea name="allergies" rows={2} maxLength={800} /></label>
        </fieldset>

        <fieldset>
          <legend>5. {text.s5[lang]}</legend>
          <label>{labels.yogaLevel[lang]}{select('yogaLevel')}</label>
          <div>
            <label className="bk-check"><input type="checkbox" name="petAllergy" /> {labels.petAllergy[lang]}</label>
            <p className="bk-hint">{text.petNote[lang]}</p>
          </div>
          <label className="bk-wide">{labels.health[lang]}<textarea name="health" rows={3} maxLength={1500} /></label>
        </fieldset>

        <fieldset>
          <legend>6. {text.s6[lang]}</legend>
          <label>
            {labels.budget[lang]}
            <input name="budget" maxLength={80} inputMode="numeric" />
            <span className="bk-hint">{text.budgetNote[lang]}</span>
          </label>
          <label>{labels.source[lang]}<input name="source" maxLength={200} /></label>
          <label className="bk-wide">{labels.expectations[lang]}<textarea name="expectations" rows={4} maxLength={2000} /></label>
          <label className="bk-check bk-wide"><input type="checkbox" name="consent" required /> {text.consent[lang]} *</label>
        </fieldset>

        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? text.sending[lang] : text.submit[lang]}
        </button>
        {status === 'error' ? <p className="status" role="alert">{text.error[lang]}</p> : null}
      </form>
    </main>
  );
}

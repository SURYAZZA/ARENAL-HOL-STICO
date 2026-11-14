import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { adminApi } from '@/lib/admin-api';
import { useAuth } from '@/hooks/use-auth';
import { ImageField, measureImage } from '@/components/admin/image-field';
import type { AdminAccount, Affiliate, BlogPost, Booking, ContactNote, LogEntry, Review } from '@/lib/content';
import { RETREAT_NAME, bookingChoices, bookingLabels, type BookingField, type Choice } from '@/data/retreat';

type Snapshot = {
  posts: BlogPost[]; reviews: Review[]; notes: ContactNote[]; bookings: Booking[]; affiliates: Affiliate[];
  notifyEmail: string; admins: AdminAccount[]; log: LogEntry[]; me: AdminAccount;
};

const TABS = [
  ['diario', 'Blog'],
  ['resenas', 'Reseñas'],
  ['retiros', 'Reservas'],
  ['avisos', 'Avisos'],
  ['equipo', 'Equipo'],
  ['historial', 'Historial'],
] as const;
type Tab = (typeof TABS)[number][0];

const STATUS: Record<string, string> = { nueva: 'Nueva', 'en-proceso': 'En proceso', confirmada: 'Confirmada', cerrada: 'Cerrada' };

const FIELD_ORDER: BookingField[] = [
  'phone', 'country', 'language', 'companions', 'flexible', 'transport', 'focus', 'focusOther', 'activities',
  'mealPlan', 'diet', 'allergies', 'yogaLevel', 'health', 'petAllergy', 'budget', 'expectations', 'source',
];

/** Convierte las respuestas guardadas en filas legibles (etiqueta en español + respuesta). */
function bookingRows(data: Record<string, unknown>): [string, string][] {
  const choices = bookingChoices as unknown as Record<string, readonly Choice[]>;
  const label = (field: string, value: string) => choices[field]?.find(option => option.value === value)?.label.es ?? value;
  const rows: [string, string][] = [];
  for (const field of FIELD_ORDER) {
    const raw = data[field];
    const value = Array.isArray(raw)
      ? raw.map(item => label(field, String(item))).join(', ')
      : typeof raw === 'boolean' ? (raw ? 'Sí' : '') : label(field, String(raw ?? ''));
    if (value) rows.push([bookingLabels[field].es, value]);
  }
  return rows;
}

const when = (iso: string) =>
  iso ? new Date(iso).toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' }) : '';

const reason = (error: unknown, fallback: string) =>
  error instanceof Error && !error.message.startsWith('admin:') ? error.message : fallback;

export function AdminPanel() {
  const { logout, isLoading } = useAuth();
  const [data, setData] = useState<Snapshot | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<Tab>('diario');
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [resetFor, setResetFor] = useState('');
  const [who, setWho] = useState('');
  const [openBooking, setOpenBooking] = useState('');

  async function load() {
    const snapshot = await adminApi<Snapshot>('load');
    setData(snapshot);
    setEmail(snapshot.notifyEmail);
  }

  useEffect(() => {
    load().catch(() => setMessage('No se pudo cargar el panel.'));
  }, []);

  /** Ejecuta una acción del panel, avisa el resultado y refresca los datos. */
  async function act(op: string, payload: Record<string, unknown>, done: string) {
    try {
      await adminApi(op, payload);
      setMessage(done);
      await load();
      return true;
    } catch (error) {
      setMessage(reason(error, 'No se pudo guardar. Vuelve a entrar e inténtalo otra vez.'));
      return false;
    }
  }

  function startEdit(post: BlogPost | null) {
    setEditing(post);
    setFormKey(value => value + 1);
    if (post) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function savePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const cover = String(form.get('cover') || '').trim();
    const [cover_w, cover_h] = await measureImage(cover);
    const saved = await act('savePost', {
      id: editing?.id ?? '',
      title: String(form.get('title') || ''),
      excerpt: String(form.get('excerpt') || ''),
      body: String(form.get('body') || ''),
      cover, cover_w, cover_h,
      published: form.get('published') === 'on',
      pinned: form.get('pinned') === 'on',
    }, editing ? 'Cambios guardados.' : 'Publicación creada.');
    if (saved) startEdit(null);
  }

  if (isLoading || !data) {
    return <main className="admin"><p>{message || 'Cargando…'}</p></main>;
  }

  const { posts, reviews, notes, bookings, affiliates, admins, log, me } = data;
  const people = [...new Set(log.map(entry => entry.name))];
  const shownLog = who ? log.filter(entry => entry.name === who) : log;

  return (
    <main className="admin">
      <header>
        <h1>Panel de Arenal</h1>
        <div className="row">
          <span className="hint">Sesión: {me.name}</span>
          <Link to="/">Ver sitio</Link>
          <button type="button" onClick={() => void logout()}>Salir</button>
        </div>
      </header>
      <div className="tabs" role="tablist">
        {TABS.map(([key, label]) => (
          <button key={key} type="button" className={tab === key ? 'on' : ''} onClick={() => { setTab(key); setMessage(''); }}>
            {label}
          </button>
        ))}
      </div>
      {message ? <p className="status" role="status">{message}</p> : null}

      {tab === 'diario' ? (
        <section>
          <h2>{editing ? `Editando: ${editing.title}` : 'Nueva publicación'}</h2>
          <form key={formKey} className="stack" onSubmit={savePost}>
            <label>Título<input name="title" required maxLength={180} defaultValue={editing?.title ?? ''} /></label>
            <label>Extracto (una o dos frases)<input name="excerpt" required maxLength={400} defaultValue={editing?.excerpt ?? ''} /></label>
            <label>Texto<textarea name="body" required rows={6} defaultValue={editing?.body ?? ''} /></label>
            <ImageField name="cover" label="Foto de la publicación" fitBlog defaultValue={editing?.cover ?? ''} />
            <label className="check"><input type="checkbox" name="published" defaultChecked={editing ? editing.published : true} /> Visible en el sitio</label>
            <label className="check"><input type="checkbox" name="pinned" defaultChecked={editing?.pinned ?? false} /> Fijar arriba del blog (reemplaza a la fijada actual)</label>
            <div className="row">
              <button className="btn" type="submit">{editing ? 'Guardar cambios' : 'Publicar'}</button>
              {editing ? <button className="btn ghost" type="button" onClick={() => startEdit(null)}>Cancelar edición</button> : null}
            </div>
          </form>
          <h2>Publicaciones</h2>
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <strong>{post.title}</strong>
                <span className="hint"> · {when(post.published_at)}{post.pinned ? ' · fijada' : ''}{post.published ? '' : ' · oculta'}</span>
                <div className="row">
                  <button type="button" onClick={() => startEdit(post)}>Editar</button>
                  <button type="button" onClick={() => {
                    if (confirm('¿Eliminar esta publicación?')) void act('deletePost', { id: post.id }, 'Publicación eliminada.');
                  }}>Eliminar</button>
                </div>
              </li>
            ))}
            {posts.length === 0 ? <li>Aún no hay publicaciones.</li> : null}
          </ul>
        </section>
      ) : null}

      {tab === 'resenas' ? (
        <ul>
          {reviews.map(review => (
            <li key={review.id}>
              <strong>{review.author}</strong> · {review.rating}/5 {review.approved ? '· visible' : '· pendiente'}{review.pinned ? ' · fijada' : ''}
              <p>{review.body}</p>
              <div className="row">
                <button type="button" onClick={() => void act('updateReview', { id: review.id, approved: !review.approved }, review.approved ? 'Reseña oculta.' : 'Reseña publicada.')}>
                  {review.approved ? 'Ocultar' : 'Publicar'}
                </button>
                <button type="button" onClick={() => void act('updateReview', { id: review.id, pinned: !review.pinned }, 'Reseña actualizada.')}>
                  {review.pinned ? 'Quitar fijado' : 'Fijar'}
                </button>
                <button type="button" onClick={() => {
                  if (confirm('¿Eliminar esta reseña? No se puede deshacer.')) void act('deleteReview', { id: review.id }, 'Reseña eliminada.');
                }}>Eliminar</button>
              </div>
            </li>
          ))}
          {reviews.length === 0 ? <li>Sin reseñas todavía.</li> : null}
        </ul>
      ) : null}

      {tab === 'retiros' ? (
        <section>
          <h2>Reservas del retiro {RETREAT_NAME}</h2>
          <ul>
            {bookings.map(booking => (
              <li key={booking.id}>
                <strong>{booking.name}</strong> · {booking.email}
                <span className="hint"> · {when(booking.created)} · {STATUS[booking.status] ?? booking.status}</span>
                <p>
                  {booking.guests} {booking.guests === 1 ? 'persona' : 'personas'} · {booking.days} días · llegada ideal: {booking.arrival || 'sin definir'}
                </p>
                <div className="row">
                  <button type="button" onClick={() => setOpenBooking(openBooking === booking.id ? '' : booking.id)}>
                    {openBooking === booking.id ? 'Ocultar formulario' : 'Ver formulario completo'}
                  </button>
                  <select
                    aria-label="Estado de la reserva"
                    value={booking.status}
                    onChange={event => void act('updateBooking', { id: booking.id, status: event.target.value }, 'Estado actualizado.')}
                  >
                    {Object.entries(STATUS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <button type="button" onClick={() => {
                    if (confirm('¿Eliminar esta reserva? No se puede deshacer.')) void act('deleteBooking', { id: booking.id }, 'Reserva eliminada.');
                  }}>Eliminar</button>
                </div>
                {openBooking === booking.id ? (
                  <dl className="booking-detail">
                    {bookingRows(booking.data).map(([label, value]) => (
                      <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                    ))}
                  </dl>
                ) : null}
              </li>
            ))}
            {bookings.length === 0 ? <li>Aún no hay reservas.</li> : null}
          </ul>

          <h2>Afiliados a retiros</h2>
          <p className="hint">Personas que pidieron afiliarse desde el formulario de contacto. Esta lista no se muestra en el sitio.</p>
          {affiliates.length > 0 ? (
            <button type="button" className="btn ghost" onClick={() => {
              void navigator.clipboard.writeText(affiliates.map(person => person.email).join(', ')).then(
                () => setMessage('Correos copiados.'),
                () => setMessage('No se pudieron copiar los correos.'),
              );
            }}>Copiar todos los correos</button>
          ) : null}
          <ul>
            {affiliates.map(person => (
              <li key={person.email}>
                <strong>{person.name || 'Sin nombre'}</strong> · {person.email}
                <span className="hint"> · {when(person.created)}</span>
                <div className="row">
                  <button type="button" onClick={() => {
                    if (confirm(`¿Quitar a ${person.email} de los afiliados?`)) void act('deleteAffiliate', { email: person.email }, 'Afiliado quitado.');
                  }}>Quitar</button>
                </div>
              </li>
            ))}
            {affiliates.length === 0 ? <li>Aún no hay afiliados.</li> : null}
          </ul>
        </section>
      ) : null}

      {tab === 'avisos' ? (
        <section>
          <form className="stack" onSubmit={event => {
            event.preventDefault();
            void act('saveSettings', { email }, 'Correo de avisos guardado.');
          }}>
            <label>
              Correo que recibe cada formulario
              <input type="email" value={email} onChange={event => setEmail(event.target.value)} required />
            </label>
            <button className="btn" type="submit">Guardar correo</button>
          </form>
          <ul>
            {notes.map(note => (
              <li key={note.id}>
                <strong>{note.name}</strong> · {note.interest} · {note.email}
                <span className="hint"> · {when(note.created)}</span>
                <p>{note.organization}</p>
                <p>{note.message}</p>
              </li>
            ))}
            {notes.length === 0 ? <li>Aún no hay mensajes.</li> : null}
          </ul>
        </section>
      ) : null}

      {tab === 'equipo' ? (
        <section>
          <h2>Mi cuenta</h2>
          <form className="stack" onSubmit={event => {
            event.preventDefault();
            void act('saveMyName', { name: String(new FormData(event.currentTarget).get('name')) }, 'Nombre guardado.');
          }}>
            <label>Nombre con el que apareces en el historial<input name="name" required maxLength={120} defaultValue={me.name} /></label>
            <button className="btn ghost" type="submit">Guardar nombre</button>
          </form>
          {me.owner ? (
            <p className="hint">Esta es la cuenta principal ({me.email}). Su contraseña se cambia en hPanel, en la variable ADMIN_PASSWORD.</p>
          ) : (
            <form className="stack" onSubmit={async event => {
              event.preventDefault();
              const form = event.currentTarget;
              const fields = new FormData(form);
              if (await act('changeMyPassword', { current: String(fields.get('current')), next: String(fields.get('next')) }, 'Contraseña cambiada.')) form.reset();
            }}>
              <label>Contraseña actual<input name="current" type="password" required autoComplete="current-password" /></label>
              <label>Contraseña nueva (mínimo 10 caracteres)<input name="next" type="password" required minLength={10} autoComplete="new-password" /></label>
              <button className="btn ghost" type="submit">Cambiar mi contraseña</button>
            </form>
          )}

          <h2>Integrantes con acceso</h2>
          <ul>
            {admins.map(admin => (
              <li key={admin.id}>
                <strong>{admin.name}</strong> · {admin.email}
                <span className="hint"> · desde {when(admin.created ?? '')}</span>
                {me.owner ? (
                  <div className="row">
                    <button type="button" onClick={() => setResetFor(resetFor === admin.id ? '' : admin.id)}>Poner contraseña nueva</button>
                    <button type="button" onClick={() => {
                      if (confirm(`¿Quitar el acceso de ${admin.name}?`)) void act('deleteAdmin', { id: admin.id }, 'Integrante quitado.');
                    }}>Quitar acceso</button>
                  </div>
                ) : null}
                {me.owner && resetFor === admin.id ? (
                  <form className="stack" onSubmit={async event => {
                    event.preventDefault();
                    const password = String(new FormData(event.currentTarget).get('password'));
                    if (await act('saveAdmin', { id: admin.id, password }, `Contraseña nueva guardada para ${admin.name}.`)) setResetFor('');
                  }}>
                    <label>Contraseña nueva (mínimo 10 caracteres)<input name="password" type="text" required minLength={10} autoComplete="off" /></label>
                    <button className="btn ghost" type="submit">Guardar contraseña</button>
                  </form>
                ) : null}
              </li>
            ))}
            {admins.length === 0 ? <li>Solo la cuenta principal tiene acceso por ahora.</li> : null}
          </ul>

          {me.owner ? (
            <>
              <h2>Agregar integrante</h2>
              <form className="stack" onSubmit={async event => {
                event.preventDefault();
                const form = event.currentTarget;
                const fields = new FormData(form);
                const added = await act('saveAdmin', {
                  name: String(fields.get('name')), email: String(fields.get('email')), password: String(fields.get('password')),
                }, 'Integrante agregado. Pásale su correo y contraseña; puede cambiarla al entrar.');
                if (added) form.reset();
              }}>
                <label>Nombre<input name="name" required maxLength={120} /></label>
                <label>Correo<input name="email" type="email" required maxLength={190} autoComplete="off" /></label>
                <label>Contraseña inicial (mínimo 10 caracteres)<input name="password" type="text" required minLength={10} autoComplete="off" /></label>
                <button className="btn" type="submit">Agregar integrante</button>
              </form>
            </>
          ) : (
            <p className="hint">Solo la cuenta principal puede agregar o quitar integrantes.</p>
          )}
        </section>
      ) : null}

      {tab === 'historial' ? (
        <section>
          <label className="filter">
            Ver acciones de
            <select value={who} onChange={event => setWho(event.target.value)}>
              <option value="">Todo el equipo</option>
              {people.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <div className="log-wrap">
            <table className="log">
              <thead><tr><th>Fecha</th><th>Quién</th><th>Acción</th></tr></thead>
              <tbody>
                {shownLog.map(entry => (
                  <tr key={entry.id}>
                    <td>{when(entry.created)}</td>
                    <td title={entry.email}>{entry.name}</td>
                    <td>{entry.action}</td>
                  </tr>
                ))}
                {shownLog.length === 0 ? <tr><td colSpan={3}>Aún no hay acciones registradas.</td></tr> : null}
              </tbody>
            </table>
          </div>
          <p className="hint">Se muestran las últimas 500 acciones. La hora es la de tu dispositivo.</p>
        </section>
      ) : null}
    </main>
  );
}

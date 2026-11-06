import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { adminApi } from '@/lib/admin-api';
import { useAuth } from '@/hooks/use-auth';
import type { BlogPost, ContactNote, PageCopy, RetreatPlan, Review } from '@/lib/content';

export function AdminPanel() {
  const { logout, isLoading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [plans, setPlans] = useState<RetreatPlan[]>([]);
  const [copy, setCopy] = useState<PageCopy | null>(null);
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<'diario' | 'resenas' | 'retiros' | 'avisos'>('diario');

  async function load() {
    const snapshot = await adminApi<{
      posts: BlogPost[]; reviews: Review[]; plans: RetreatPlan[]; copy: PageCopy | null; notes: ContactNote[]; notifyEmail: string;
    }>('load');
    setPosts(snapshot.posts);
    setReviews(snapshot.reviews);
    setPlans(snapshot.plans);
    setCopy(snapshot.copy);
    setNotes(snapshot.notes);
    setEmail(snapshot.notifyEmail);
  }

  useEffect(() => {
    load().catch(() => setMessage('No se pudo cargar el panel.'));
  }, []);

  async function savePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const id = String(data.get('id') || '');
    const payload = {
      title: String(data.get('title') || ''),
      excerpt: String(data.get('excerpt') || ''),
      body: String(data.get('body') || ''),
      cover: String(data.get('cover') || ''),
      published: data.get('published') === 'on',
      pinned: data.get('pinned') === 'on',
    };
    try {
      await adminApi('savePost', { id, ...payload });
      form.reset();
      setMessage('Publicación guardada. Las dos más recientes ocupan las plantillas del inicio.');
      await load();
    } catch {
      setMessage('No se pudo guardar. Vuelve a entrar e inténtalo otra vez.');
    }
  }

  if (isLoading) return <main className="admin"><p>Cargando…</p></main>;

  return (
    <main className="admin">
      <header>
        <h1>Panel de Arenal</h1>
        <div className="row">
          <Link to="/">Ver sitio</Link>
          <button type="button" onClick={() => void logout()}>Salir</button>
        </div>
      </header>
      <div className="tabs" role="tablist">
        {(['diario', 'resenas', 'retiros', 'avisos'] as const).map(item => (
          <button key={item} type="button" className={tab === item ? 'on' : ''} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>
      {message ? <p className="status">{message}</p> : null}

      {tab === 'diario' ? (
        <section>
          <h2>Nueva o sustitución de publicación</h2>
          <form className="stack" onSubmit={savePost}>
            <input name="title" required placeholder="Título" />
            <input name="excerpt" required placeholder="Extracto" />
            <textarea name="body" required placeholder="Texto" rows={4} />
            <input name="cover" placeholder="URL de imagen" />
            <label><input type="checkbox" name="published" defaultChecked /> Publicada</label>
            <label><input type="checkbox" name="pinned" /> Fijar (reemplaza la fijada actual)</label>
            <button className="btn" type="submit">Publicar</button>
          </form>
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <strong>{post.pinned ? 'Fijada · ' : ''}{post.title}</strong>
                <button type="button" onClick={async () => {
                  if (confirm('¿Eliminar esta publicación?')) {
                    await adminApi('deletePost', { id: post.id });
                    await load();
                  }
                }}>Eliminar</button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === 'resenas' ? (
        <ul>
          {reviews.map(review => (
            <li key={review.id}>
              <strong>{review.author}</strong> · {review.rating}/5 {review.approved ? '· visible' : '· pendiente'}
              <p>{review.body}</p>
              <button type="button" onClick={async () => {
                await adminApi('updateReview', { id: review.id, approved: !review.approved });
                await load();
              }}>{review.approved ? 'Ocultar' : 'Publicar'}</button>
              <button type="button" onClick={async () => {
                await adminApi('updateReview', { id: review.id, pinned: !review.pinned });
                await load();
              }}>{review.pinned ? 'Quitar fijado' : 'Fijar'}</button>
            </li>
          ))}
          {reviews.length === 0 ? <li>Sin reseñas todavía.</li> : null}
        </ul>
      ) : null}

      {tab === 'retiros' && copy ? (
        <section>
          <form className="stack" onSubmit={async event => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            await adminApi('saveCopy', {
              id: copy.id,
              eyebrow: String(data.get('eyebrow')),
              title: String(data.get('title')),
              body: String(data.get('body')),
              image: String(data.get('image')),
            });
            setMessage('Texto de retiros actualizado.');
            await load();
          }}>
            <input name="eyebrow" defaultValue={copy.eyebrow} />
            <input name="title" defaultValue={copy.title} />
            <textarea name="body" defaultValue={copy.body} rows={5} />
            <input name="image" defaultValue={copy.image} />
            <button className="btn" type="submit">Guardar presentación</button>
          </form>
          {plans.map(plan => (
            <form key={plan.id} className="stack plan-edit" onSubmit={async event => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              await adminApi('savePlan', {
                id: plan.id,
                title: String(data.get('title')),
                days: Number(data.get('days')),
                location: String(data.get('location')),
                group_size: String(data.get('group_size')),
                focus: String(data.get('focus')),
                summary: String(data.get('summary')),
                image: String(data.get('image')),
              });
              setMessage('Plan actualizado.');
              await load();
            }}>
              <h3>{plan.title}</h3>
              <input name="title" defaultValue={plan.title} />
              <input name="days" type="number" min={3} max={10} defaultValue={plan.days} />
              <input name="location" defaultValue={plan.location} />
              <input name="group_size" defaultValue={plan.group_size} />
              <input name="focus" defaultValue={plan.focus} />
              <textarea name="summary" defaultValue={plan.summary} rows={3} />
              <input name="image" defaultValue={plan.image} />
              <button className="btn ghost" type="submit">Guardar plan</button>
            </form>
          ))}
        </section>
      ) : null}

      {tab === 'avisos' ? (
        <section>
          <form className="stack" onSubmit={async event => {
            event.preventDefault();
            await adminApi('saveSettings', { email });
            setMessage('Correo de avisos guardado.');
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
                <p>{note.organization}</p>
                <p>{note.message}</p>
              </li>
            ))}
            {notes.length === 0 ? <li>Aún no hay mensajes.</li> : null}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

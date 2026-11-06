import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Route } from './+types/entrar';
import { seo } from '@/lib/seo';
import { useAuth } from '@/hooks/use-auth';
import { LOGO } from '@/constants/brand';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Entrar · Arenal Holístico',
    description: 'Acceso interno para editar el diario, las reseñas y los textos de retiros.',
    noindex: true,
  });
}

export default function EntrarPage() {
  const { login, isLoading, isAuthed } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError('');
    try {
      await login(String(data.get('email')), String(data.get('password')));
      navigate('/admin');
    } catch {
      setError('No reconocemos ese correo o esa contraseña.');
      setPending(false);
    }
  }

  return (
    <main className="auth-page">
      <img src={LOGO} alt="" width={88} height={100} />
      <h1>Edición interna</h1>
      <p>Desde aquí se actualizan publicaciones, reseñas y el texto de retiros.</p>
      {isLoading ? <p>Comprobando sesión…</p> : null}
      {isAuthed ? <Link to="/admin">Ir al panel</Link> : null}
      <form onSubmit={onSubmit}>
        <label>
          Correo
          <input name="email" type="email" required autoComplete="username" />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        {error ? <p className="status">{error}</p> : null}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <Link to="/">Volver al sitio</Link>
    </main>
  );
}

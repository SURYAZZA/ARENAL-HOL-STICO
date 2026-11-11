import type { Route } from './+types/admin';
import { seo } from '@/lib/seo';
import { redirect } from 'react-router';
import { adminApi } from '@/lib/admin-api';
import { AdminPanel } from '@/components/admin/panel';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Panel · Arenal Holístico',
    description: 'Edición interna del diario, reseñas y retiros.',
    noindex: true,
  });
}

export async function clientLoader() {
  const result = await adminApi<{ authed: boolean }>('session').catch(() => ({ authed: false }));
  if (!result.authed) throw redirect('/entrar');
  return null;
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <main className="admin"><p>Abriendo el panel…</p></main>;
}

export default function AdminRoute() {
  return <AdminPanel />;
}

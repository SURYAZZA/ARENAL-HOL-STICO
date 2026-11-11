import type { Route } from './+types/retiros';
import { seo } from '@/lib/seo';
import { OG_IMAGE } from '@/constants/brand';
import { RetreatPresentation } from '@/components/retiros/presentation';
import { publicPlans, retreatCopy } from '@/lib/content.server';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Retiros · Arenal Holístico',
    description:
      'Cuatro planes de retiro de 3 a 10 días en bosque, finca, montaña y río. Precio por consultar. Afíliate para enterarte de cada nueva fecha.',
    image: OG_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Retiros Arenal Holístico',
      serviceType: 'Retiro espiritual y de bienestar',
      areaServed: 'Costa Rica',
      provider: { '@type': 'Organization', name: 'Arenal Holístico' },
    },
  });
}

export async function loader() {
  const [copy, plans] = await Promise.all([retreatCopy(), publicPlans()]);
  return { copy, plans };
}

export default function RetirosPage({ loaderData }: Route.ComponentProps) {
  return <RetreatPresentation copy={loaderData.copy} plans={loaderData.plans} />;
}

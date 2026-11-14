import type { Route } from './+types/retiros';
import { seo } from '@/lib/seo';
import { OG_IMAGE } from '@/constants/brand';
import { RetreatPresentation } from '@/components/retiros/presentation';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Retiros · Arenal Holístico',
    description:
      'Oropéndola One to One: retiro personalizado en La Fortuna para 1 a 4 personas, de 3 a 9 días. Actividades, alimentación y enfoque a elección; precio según tu selección.',
    image: OG_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Oropéndola One to One',
      serviceType: 'Retiro de bienestar personalizado',
      areaServed: 'Costa Rica',
      provider: { '@type': 'Organization', name: 'Arenal Holístico' },
    },
  });
}

export default function RetirosPage() {
  return <RetreatPresentation />;
}

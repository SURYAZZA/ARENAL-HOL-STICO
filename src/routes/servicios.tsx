import type { Route } from './+types/servicios';
import { seo } from '@/lib/seo';
import { OG_IMAGE } from '@/constants/brand';
import { ServiceMenu } from '@/components/servicios/menu';
import { services } from '@/data/services';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Servicios · Arenal Holístico',
    description:
      'Yoga, meditaciones, sonoterapias, cacao, baños de bosque y talleres para hoteles, agencias y organizadores de experiencias.',
    image: OG_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Servicios de Arenal Holístico',
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: service.name,
        description: service.summary,
      })),
    },
  });
}

export default function ServiciosPage() {
  return <ServiceMenu />;
}

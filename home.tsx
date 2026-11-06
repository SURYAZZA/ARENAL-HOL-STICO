import type { Route } from './+types/home';
import { seo } from '@/lib/seo';
import { LOGO, OG_IMAGE } from '@/constants/brand';
import { Hero } from '@/components/home/hero';
import { Journal } from '@/components/home/journal';
import { About } from '@/components/home/about';
import { Reviews } from '@/components/home/reviews';
import { Contact } from '@/components/home/contact';
import { publicPosts, publicReviews } from '@/lib/content.server';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Arenal Holístico · Bienestar en la naturaleza',
    description:
      'Yoga, meditación, sonoterapia, cacao y retiros en el bosque de Arenal. Experiencias de salud emocional para hoteles, agencias y equipos.',
    image: OG_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Arenal Holístico',
      description: 'Servicios holísticos y retiros espirituales en contacto con la naturaleza.',
      logo: LOGO,
      image: OG_IMAGE,
    },
  });
}

export async function loader() {
  const [posts, reviews] = await Promise.all([publicPosts(), publicReviews()]);
  return { posts, reviews };
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <Hero />
      <Journal posts={loaderData.posts} />
      <About />
      <Reviews reviews={loaderData.reviews} />
      <Contact />
    </main>
  );
}

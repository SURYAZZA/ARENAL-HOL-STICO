import type { Route } from './+types/retiros.reserva';
import { seo } from '@/lib/seo';
import { OG_IMAGE } from '@/constants/brand';
import { BookingForm } from '@/components/retiros/booking-form';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Reserva tu retiro · Arenal Holístico',
    description: 'Formulario de reserva del retiro Oropéndola One to One: fechas, grupo, actividades y alimentación a tu medida.',
    image: OG_IMAGE,
  });
}

export default function ReservaPage() {
  return <BookingForm />;
}

export type Service = {
  slug: string;
  name: string;
  summary: string;
  image: string;
  srcSet?: string;
  retreat?: boolean;
};

export const services: Service[] = [
  {
    slug: 'yoga',
    name: 'Clases de Yoga',
    summary:
      'Práctica consciente de Yoga para la carta, prácticas matutinas y diurnas, con enfoque en la reconexión con el cuerpo. Movimiento suave, horario fijo y un cierre que deja al huésped listo para el día.\n\nEl yoga no es solo un deporte y lejos de ser competitivo, busca traer tranquilidad y equilibrio entre el cuerpo y la mente, puede combinarse con meditaciones, sonoterapias y demás. Puede ofrecerse en privado y grupal.',
    image: '/img/dkailash-yoga-retreat-bali-scaled-B3XNf.webp',
  },
  {
    slug: 'meditacion',
    name: 'Meditaciones',
    summary:
      'Pausas guiadas sin mística forzada. Claridad, presencia y un silencio que se sostiene aunque el grupo sea nuevo.\nUna guía seria que busca traer a las personas a un espacio de silencio y paz real, lejos del estrés y las responsabilidades del mundo real, un verdadero descanso de la mente.',
    image: '/img/captura-de-pantalla-2026-11-02-190924-39D5D.webp',
  },
  {
    slug: 'sono',
    name: 'Sono Terapias',
    summary:
      'Una meditación ancestral, que más allá de encontrar la relajación por medio del silencio, la busca por medio del sonido, utilizando las vibraciones de cuencos tibetanos, gongs, palos de lluvia y otros instrumentos para llevar la frecuencia de tu cuerpo a un estado de completa relajación.',
    image: '/img/captura-de-pantalla-2026-08-23-233327-5c1TD.jpg',
  },
  {
    slug: 'cacao',
    name: 'Ceremonias de Cacao',
    summary:
      'Un ritual de conexión para inauguraciones, llegadas y círculos de equipo. Breve, cuidado y fácil de explicar a huéspedes que buscan significado, no espectáculo.\n\nEl objetivo es llevarlos atravéz del tiempo a una ceremonia ancestral, a un momento dónde los Mayas utilizaban el cacao como un medio para conectar con lo sagrado y profundizar en la introspección y sanación emocional.',
    image: '/img/whatsapp-image-2026-11-02-at-4.38.38-pm-cCfzB.jpeg',
  },
  {
    slug: 'bosque',
    name: 'Baños de bosque',
    summary:
      'Inmersión lenta entre árboles y niebla. La experiencia que diferencia un lodge de Arenal: el bienestar sale de la sala y entra al sendero.\n\nUn espacio para respirar el aire fresco, sentir tu piel en contacto con la tierra, la madera y el viento, para sentir nuevamente esa conexión con lo natural y lo auténtico que tanto cuesta encontrar hoy en día.',
    image: '/img/r-UUGln.webp',
  },
  {
    slug: 'talleres',
    name: 'Talleres',
    summary:
      'Encuentros participativos de autocuidado y salud emocional para equipos, agencias y staff de hotel. Contenido claro, duración acordada, sin jerga vacía.\n\nAlejado de promesas vacías, soluciones mágicas o sanaciones, estos talleres buscan traer a las personas nuevos métodos y puntos de vista, para mejorar su desempeño tanto en el ámbito vocacional, como en el personal y el social, basado en la bioenergética y la neurociencia.',
    image: '/img/65430928_2430213013913657_5091023769028263936_n-TsDBp.jpg',
  },
  {
    slug: 'retiros',
    name: 'Retiros',
    summary:
      'Estancias de 3 a 10 días que unen varios de estos servicios en un solo viaje. Para quién organiza y para los viajeros sin rutina, un camino guiado por el estilo de vida holístico para entender su verdadero significado y el propósito que tiene en tu vida, para quienes buscan más que solo una experiencia un verdadero aprendizaje.',
    image: '/img/12444ddd-6b8f-41ba-90e7-18a3a9081a34.webp',
    retreat: true,
  },
];

export function inquiryMessage(name: string) {
  return `Hola, represento una organización y me interesa integrar ${name} en nuestra oferta. Quisiera conversar sobre formato, grupo y disponibilidad.`;
}

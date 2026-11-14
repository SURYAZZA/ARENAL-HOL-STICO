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
    name: "Clases de Yoga",
    summary:
      "Práctica consciente de yoga para tu carta de servicios, en sesiones matutinas y diurnas, con enfoque en la reconexión con el cuerpo. Movimiento suave, horario fijo y un cierre que deja a tus clientes listos para el día.\n\nEl yoga no es solo un deporte. Lejos de ser competitivo, busca traer tranquilidad y equilibrio entre el cuerpo y la mente. Puede combinarse con meditaciones, sonoterapias y otras disciplinas, y ofrecerse en formato privado o grupal.",
    image: '/img/servicio-yoga.webp',
  },
  {
    slug: 'meditacion',
    name: "Meditaciones",
    summary:
      "Pausas guiadas sin mística forzada. Claridad, presencia y un silencio que se sostiene aunque el grupo sea nuevo.\n\nUna guía seria que lleva a las personas a un espacio de silencio y paz real, lejos del estrés y de las responsabilidades diarias: un verdadero descanso para la mente.",
    image: '/img/captura-de-pantalla-2026-11-02-190924-39D5D.webp',
  },
  {
    slug: 'sono',
    name: "Sonoterapias",
    summary:
      "Una meditación ancestral que, más allá de buscar la relajación por medio del silencio, la encuentra por medio del sonido. Utiliza las vibraciones de cuencos tibetanos, gongs, palos de lluvia y otros instrumentos para llevar la frecuencia de tu cuerpo a un estado de completa relajación.",
    image: '/img/servicio-sonoterapia.webp',
  },
  {
    slug: 'cacao',
    name: "Ceremonias de Cacao",
    summary:
      "Un ritual de conexión para inauguraciones, bienvenidas y círculos de equipo. Breve, cuidado y fácil de explicar a clientes que buscan significado, no espectáculo.\n\nEl objetivo es llevarlos a través del tiempo hasta una ceremonia ancestral, a un momento en el que los mayas utilizaban el cacao como medio para conectar con lo sagrado y profundizar en la introspección y la sanación emocional.",
    image: '/img/whatsapp-image-2026-11-02-at-4.38.38-pm-cCfzB.jpeg',
  },
  {
    slug: 'bosque',
    name: "Baños de bosque",
    summary:
      "Inmersión lenta entre árboles y niebla. La experiencia que distingue una propuesta en Arenal: el bienestar sale de la sala y entra al sendero.\n\nUn espacio para respirar aire fresco y sentir la piel en contacto con la tierra, la madera y el viento; para recuperar esa conexión con lo natural y lo auténtico que tanto cuesta encontrar hoy en día.",
    image: '/img/r-UUGln.webp',
  },
  {
    slug: 'talleres',
    name: "Talleres",
    summary:
      "Encuentros participativos de autocuidado y salud emocional para equipos y organizaciones. Contenido claro, duración acordada y sin jerga vacía.\n\nLejos de promesas vacías, soluciones mágicas o sanaciones, estos talleres acercan a las personas nuevos métodos y puntos de vista para mejorar su desempeño en los ámbitos profesional, personal y social, con base en la bioenergética y la neurociencia.",
    image: '/img/65430928_2430213013913657_5091023769028263936_n-TsDBp.jpg',
  },
  {
    slug: 'retiros',
    name: "Retiros",
    summary:
      "Estancias de 3 a 10 días que unen varios de estos servicios en un solo viaje. Para quien organiza y para quienes viajan sin rutina: un camino guiado por el estilo de vida holístico para entender su verdadero significado y el propósito que tiene en tu vida. Para quienes buscan, más que una experiencia, un verdadero aprendizaje.",
    image: '/img/servicio-retiros.webp',
    retreat: true,
  },
];

export function inquiryMessage(name: string) {
  return `Hola, represento una organización y me interesa integrar ${name} en nuestra oferta. Quisiera conversar sobre formato, grupo y disponibilidad.`;
}

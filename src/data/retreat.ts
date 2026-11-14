/**
 * Contenido del retiro Oropéndola One to One (página Retiros, ventana "Profundizar"
 * y formulario de reserva). Viene de los documentos "Master Document" y
 * "The Full Experience Overview", actualizado: grupos de 1 a 4 personas, 3 a 9 días,
 * actividades, alimentación, enfoque, transporte y fecha a elección, precio según la selección.
 */
import type { Lang } from '@/lib/i18n';

export type L = Record<Lang, string>;
const l = (es: string, en: string, fr: string): L => ({ es, en, fr });

export const RETREAT_NAME = 'Oropéndola One to One';

/* ------------------------------------------------------------------ */
/* Página Retiros                                                       */
/* ------------------------------------------------------------------ */

export const retreatFacts: L[] = [
  l('1 a 4 personas', '1 to 4 guests', '1 à 4 personnes'),
  l('3 a 9 días', '3 to 9 days', '3 à 9 jours'),
  l('La Fortuna, Costa Rica', 'La Fortuna, Costa Rica', 'La Fortuna, Costa Rica'),
  l('Precio según tu selección', 'Price based on your selection', 'Prix selon ta sélection'),
];

export const retreatAbout: L[] = [
  l(
    'Este retiro ofrece una experiencia personalizada en un entorno tranquilo y rodeado de naturaleza. Está pensado para quienes viajan solos o en grupos muy pequeños —parejas, amistades o familia— y buscan un verdadero escape de la rutina: una oportunidad para desconectarse del ruido de la vida diaria y reconectar con su mundo interior y con el mundo natural.',
    'This retreat offers a personalized experience in a tranquil, nature-filled setting. It is designed for solo travelers or very small groups (couples, friends or family) seeking a true escape from the daily grind: a chance to disconnect from the noise of everyday life and reconnect with their inner selves and the natural world.',
    'Cette retraite propose une expérience personnalisée dans un cadre paisible, entouré de nature. Elle est pensée pour les personnes qui voyagent seules ou en très petits groupes (couples, amis ou famille) et qui cherchent une véritable échappée du quotidien : l’occasion de se déconnecter du bruit de tous les jours et de se reconnecter à leur monde intérieur et au monde naturel.',
  ),
  l(
    'Ubicado en una zona turística y rica en naturaleza, el retiro crea un ambiente apacible e intencional para la relajación, la renovación y el descubrimiento. No es un taller corporativo ni un seminario intensivo: es un espacio acogedor para el descanso, la reflexión y el bienestar holístico.',
    'Set in a touristic and nature-rich area, the retreat creates a peaceful, intentional environment for relaxation, rejuvenation and discovery. It is not a corporate workshop or an intensive seminar: it is an inviting space for rest, reflection and holistic wellness.',
    'Située dans une région touristique et riche en nature, la retraite crée un environnement paisible et intentionnel pour la détente, le ressourcement et la découverte. Ce n’est ni un atelier d’entreprise ni un séminaire intensif : c’est un espace accueillant pour le repos, la réflexion et le bien-être holistique.',
  ),
  l(
    'La experiencia se diseña por completo a la medida de cada persona o grupo, con atención a sus necesidades, preferencias y objetivos. Cada aspecto —las actividades, las comidas, las clases de yoga, los tours, las prácticas de bienestar y el tiempo libre— se define específicamente para cada huésped, lo que garantiza una experiencia a la medida y profundamente personal.',
    'The experience is entirely tailored to each person or group, with a focus on their unique needs, preferences and goals. Every aspect, from the activities, meals and yoga classes to the tours, wellness practices and downtime, is designed specifically for each guest, ensuring a customized and deeply personal experience.',
    'L’expérience est entièrement conçue sur mesure pour chaque personne ou groupe, en tenant compte de ses besoins, de ses préférences et de ses objectifs. Chaque aspect (activités, repas, cours de yoga, excursions, pratiques de bien-être et temps libre) est défini spécifiquement pour chaque hôte, ce qui garantit une expérience sur mesure et profondément personnelle.',
  ),
];

export const ui = {
  sectionEyebrow: l('Retiro personalizado', 'Personalized retreat', 'Retraite personnalisée'),
  deepen: l('Profundizar', 'Go deeper', 'Approfondir'),
  close: l('Cerrar', 'Close', 'Fermer'),
  coverKicker: l('Resumen y reserva', 'Overview & Booking', 'Aperçu et réservation'),
  coverTagline: l(
    'Un retiro de bienestar personalizado, diseñado para el descanso profundo y la reconexión.',
    'A personalized wellness retreat, designed for deep rest and reconnection.',
    'Une retraite de bien-être personnalisée, conçue pour le repos profond et la reconnexion.',
  ),
  affiliate: l('Afíliate a retiros', 'Join the retreats list', 'Rejoins la liste des retraites'),
  affiliateNote: l(
    'Recibe actualizaciones de retiros o eventos y repórtate como interesado para formar parte de la familia.',
    'Get updates on retreats and events, and let us know you are interested in becoming part of the family.',
    'Reçois les nouvelles des retraites et des événements, et signale ton intérêt pour faire partie de la famille.',
  ),
  affiliateMessage: l(
    'Hola, quiero afiliarme a Retiros para recibir actualizaciones de retiros y eventos de Arenal Holístico.',
    'Hello, I would like to join the Retreats list to receive updates on Arenal Holístico retreats and events.',
    'Bonjour, je souhaite rejoindre la liste Retraites pour recevoir les nouvelles des retraites et des événements d’Arenal Holístico.',
  ),
  book: l('Reserva', 'Book', 'Réserver'),
  bookNote: l(
    'Completa el formulario del retiro con tus fechas y preferencias.',
    'Fill out the retreat form with your dates and preferences.',
    'Remplis le formulaire de la retraite avec tes dates et tes préférences.',
  ),
};

/* ------------------------------------------------------------------ */
/* Ventana "Profundizar": overview completo                             */
/* ------------------------------------------------------------------ */

export type Block =
  | { kind: 'p'; text: L }
  | { kind: 'note'; text: L }
  | { kind: 'list'; items: L[] }
  | { kind: 'pills'; items: L[] }
  | { kind: 'chips'; items: L[] }
  | { kind: 'quotes'; items: L[] }
  | { kind: 'option'; title: L; text: L }
  | { kind: 'sub'; text: L }
  | { kind: 'days'; days: { title: L; items: L[] }[] }
  | { kind: 'steps'; steps: { title: L; text: L }[] }
  | { kind: 'contact' };

export type Section = { id: string; title: L; tone: 'paper' | 'olive'; image?: string; hills?: boolean; blocks: Block[] };

export const overview: Section[] = [
  {
    id: 'intro',
    title: l('Sobre la experiencia', 'About the experience', 'À propos de l’expérience'),
    tone: 'paper',
    image: '/img/retiro-meditacion.webp',
    blocks: [
      { kind: 'p', text: l(
        'A diferencia de los retiros grupales o de los resorts, Oropéndola Retreats son experiencias privadas y personalizadas para grupos de 1 a 4 personas, pensadas para quienes buscan presencia, sencillez y un cuidado intencional, que te recibe tal como llegas.',
        'Unlike group retreats or resorts, Oropéndola Retreats are private, personalized experiences for groups of 1 to 4 guests, designed for those seeking presence, simplicity and intentional care, meeting you where you are.',
        'Contrairement aux retraites de groupe ou aux resorts, Oropéndola Retreats sont des expériences privées et personnalisées pour des groupes de 1 à 4 personnes, pensées pour celles et ceux qui cherchent présence, simplicité et une attention intentionnelle, qui t’accueille là où tu en es.',
      ) },
      { kind: 'p', text: l(
        'Este retiro te invita a hacer una pausa, alejarte de la prisa diaria y reconectar con un ritmo natural y arraigado. En el paisaje apacible de La Fortuna, Costa Rica, ofrece espacio para descansar, reflexionar y encontrar calma.',
        'This retreat invites you to pause, step away from the daily rush and reconnect with a natural, grounded rhythm. Set in the peaceful landscape of La Fortuna, Costa Rica, it offers space to rest, reflect and find calm.',
        'Cette retraite t’invite à faire une pause, à t’éloigner de la course quotidienne et à retrouver un rythme naturel et ancré. Dans le paysage paisible de La Fortuna, au Costa Rica, elle offre de l’espace pour se reposer, réfléchir et trouver le calme.',
      ) },
      { kind: 'sub', text: l('El ritmo es lento y nutritivo, con espacio para:', 'The pace is slow and nourishing, with room for:', 'Le rythme est lent et nourrissant, avec de la place pour :') },
      { kind: 'list', items: [
        l('Reconexión con la naturaleza', 'Reconnection with nature', 'La reconnexion avec la nature'),
        l('Descanso y quietud interior', 'Rest and inner stillness', 'Le repos et le calme intérieur'),
        l('Prácticas suaves para el cuerpo y la mente', 'Gentle practices for body and mind', 'Des pratiques douces pour le corps et l’esprit'),
        l('Reflexión silenciosa y presencia', 'Quiet reflection and presence', 'La réflexion silencieuse et la présence'),
        l('Ritmos personalizados según tus necesidades', 'Personalized rhythms based on your needs', 'Des rythmes personnalisés selon tes besoins'),
      ] },
      { kind: 'p', text: l(
        'Cada detalle se cuida para acompañar tu proceso, con flexibilidad en todo momento. A continuación encontrarás un resumen de lo que ofrece cada retiro.',
        'Every detail is curated to support your process, with flexibility throughout. Below you will find an overview of what each retreat offers.',
        'Chaque détail est soigné pour accompagner ton processus, avec de la flexibilité à chaque instant. Tu trouveras ci-dessous un aperçu de ce que propose chaque retraite.',
      ) },
    ],
  },
  {
    id: 'medida',
    title: l('Un retiro a tu medida', 'A retreat made to measure', 'Une retraite sur mesure'),
    tone: 'olive',
    blocks: [
      { kind: 'p', text: l(
        'Aunque se llama One to One, no es exclusivo para una sola persona: su enfoque son quienes viajan solos o en grupos muy pequeños. Tú eliges cada parte del retiro:',
        'Although it is called One to One, it is not only for a single guest: its focus is solo travelers and very small groups. You choose every part of the retreat:',
        'Même si elle s’appelle One to One, elle n’est pas réservée à une seule personne : elle s’adresse à celles et ceux qui voyagent seuls ou en très petits groupes. Tu choisis chaque partie de la retraite :',
      ) },
      { kind: 'option', title: l('Grupo', 'Group', 'Groupe'), text: l('De 1 a 4 personas.', '1 to 4 guests.', 'De 1 à 4 personnes.') },
      { kind: 'option', title: l('Duración', 'Length', 'Durée'), text: l('Entre 3 y 9 días, a tu elección.', 'Between 3 and 9 days, your choice.', 'Entre 3 et 9 jours, selon ton choix.') },
      { kind: 'option', title: l('Fecha', 'Date', 'Date'), text: l('La fecha del retiro la propones tú.', 'You propose the dates of the retreat.', 'C’est toi qui proposes la date de la retraite.') },
      { kind: 'option', title: l('Actividades', 'Activities', 'Activités'), text: l(
        'Todas las disciplinas de nuestra página Servicios están entre las opciones: yoga, meditaciones, sonoterapias, ceremonias de cacao, baños de bosque y talleres.',
        'Every discipline on our Services page is among the options: yoga, meditations, sound therapies, cacao ceremonies, forest baths and workshops.',
        'Toutes les disciplines de notre page Services font partie des options : yoga, méditations, sonothérapies, cérémonies de cacao, bains de forêt et ateliers.',
      ) },
      { kind: 'option', title: l('Alimentación', 'Food', 'Alimentation'), text: l(
        'Elige el enfoque de tu dieta: keto, ayuno, vegana, vegetariana, entre otros.',
        'Choose your dietary approach: keto, fasting, vegan, vegetarian, among others.',
        'Choisis l’approche de ton alimentation : keto, jeûne, végane, végétarienne, entre autres.',
      ) },
      { kind: 'option', title: l('Enfoque general', 'Overall focus', 'Orientation générale'), text: l(
        'Espiritual, detox, terapéutico o el que mejor acompañe tu momento.',
        'Spiritual, detox, therapeutic, or whichever best supports where you are.',
        'Spirituelle, détox, thérapeutique, ou celle qui accompagne le mieux ton moment.',
      ) },
      { kind: 'option', title: l('Transporte', 'Transport', 'Transport'), text: l(
        'El traslado desde el aeropuerto es opcional y se agrega a petición.',
        'Airport transfer is optional and added on request.',
        'Le transfert depuis l’aéroport est optionnel et s’ajoute sur demande.',
      ) },
      { kind: 'p', text: l(
        'Una vez completada tu selección, creamos el itinerario final y el precio se ajusta a lo que elegiste. Por eso el retiro también puede adaptarse a presupuestos ajustados, con una selección más modesta de servicios.',
        'Once your selection is complete, we create the final schedule and the price adjusts to what you chose. That is why the retreat can also fit tighter budgets, with a more modest selection of services.',
        'Une fois ta sélection terminée, nous créons le programme final et le prix s’ajuste à ce que tu as choisi. C’est pourquoi la retraite peut aussi s’adapter à des budgets serrés, avec une sélection de services plus modeste.',
      ) },
    ],
  },
  {
    id: 'incluye',
    title: l('Qué puede incluir', 'What it can include', 'Ce qu’elle peut inclure'),
    tone: 'paper',
    blocks: [
      { kind: 'p', text: l(
        'Según tu selección, vivirás una combinación de elementos nutritivos que crean un viaje holístico y reparador:',
        'Depending on your selection, you will experience a blend of nourishing elements that create a holistic and restorative journey:',
        'Selon ta sélection, tu vivras un ensemble d’éléments nourrissants qui créent un voyage holistique et réparateur :',
      ) },
      { kind: 'pills', items: [
        l('Estancia privada de 3 a 9 días en Casa Oropéndola', 'Private stay of 3 to 9 days at Casa Oropéndola', 'Séjour privé de 3 à 9 jours à Casa Oropéndola'),
        l('Sesiones de yoga y meditación', 'Yoga and meditation sessions', 'Séances de yoga et de méditation'),
        l('Brunch nutritivo y cena casera, según tu plan de alimentación', 'Nourishing brunch and homemade dinner, according to your meal plan', 'Brunch nourrissant et dîner maison, selon ton plan alimentaire'),
        l('Caminata guiada en la naturaleza y tratamiento holístico a tu elección', 'Guided nature walk and a holistic treatment of your choice', 'Marche guidée en nature et soin holistique de ton choix'),
        l('Visita a aguas termales naturales', 'Visit to natural hot springs', 'Visite de sources chaudes naturelles'),
        l('Sesión de sonoterapia', 'Sonotherapy (sound therapy) session', 'Séance de sonothérapie'),
        l('Espacios de reflexión de apertura y de cierre', 'Opening and closing reflection spaces', 'Espaces de réflexion d’ouverture et de clôture'),
        l('Transporte terrestre desde y hacia el aeropuerto SJO y dentro de La Fortuna (opcional)', 'Ground transportation to and from SJO Airport and around La Fortuna (optional)', 'Transport terrestre depuis et vers l’aéroport SJO et dans La Fortuna (optionnel)'),
        l('Planificación previa a tu llegada y un ritmo diario personalizado', 'Pre-arrival planning and a personalized daily rhythm', 'Préparation avant ton arrivée et un rythme quotidien personnalisé'),
      ] },
      { kind: 'p', text: l(
        'Cada retiro ofrece una base cuidadosamente diseñada para acompañar tu descanso, tu renovación y tu conexión.',
        'Every retreat provides a carefully designed foundation to support your rest, renewal and connection.',
        'Chaque retraite offre une base soigneusement conçue pour accompagner ton repos, ton renouveau et ta connexion.',
      ) },
    ],
  },
  {
    id: 'itinerario',
    title: l('Flujo e itinerario del retiro', 'Retreat flow & itinerary', 'Déroulement et itinéraire'),
    tone: 'olive',
    blocks: [
      { kind: 'p', text: l(
        'Aunque tu retiro es totalmente personalizado, el ritmo de los días suele seguir un flujo suave y arraigado. Este es un ejemplo para una estancia de 5 días:',
        'While your retreat is fully personalized, the rhythm of the days usually follows a gentle, grounding flow. This is an example for a 5-day stay:',
        'Même si ta retraite est entièrement personnalisée, le rythme des journées suit en général un déroulement doux et ancré. Voici un exemple pour un séjour de 5 jours :',
      ) },
      { kind: 'days', days: [
        { title: l('Día 1 – Llegada y arraigo', 'Day 1 – Arrival & Grounding', 'Jour 1 – Arrivée et ancrage'), items: [
          l('Llegada por la tarde y registro', 'Afternoon arrival and check-in', 'Arrivée dans l’après-midi et installation'),
          l('Cena de bienvenida en la casa principal', 'Welcome dinner in the main house', 'Dîner de bienvenue dans la maison principale'),
          l('Meditación suave de arraigo', 'Gentle grounding meditation', 'Méditation douce d’ancrage'),
        ] },
        { title: l('Día 2', 'Day 2', 'Jour 2'), items: [
          l('Yoga o práctica de movimiento por la mañana', 'Morning yoga or movement practice', 'Yoga ou pratique de mouvement le matin'),
          l('Brunch nutritivo compartido en la terraza', 'Nourishing brunch shared on the deck', 'Brunch nourrissant partagé sur la terrasse'),
          l('Caminata guiada en la naturaleza', 'Guided nature walk', 'Marche guidée en nature'),
          l('Tarde libre para descansar o reflexionar', 'Afternoon free time to rest or reflect', 'Après-midi libre pour se reposer ou réfléchir'),
          l('Cena casera al atardecer, seguida de una práctica nocturna opcional', 'Homemade dinner at dusk, followed by an optional evening practice', 'Dîner maison au crépuscule, suivi d’une pratique du soir optionnelle'),
        ] },
        { title: l('Día 3', 'Day 3', 'Jour 3'), items: [
          l('Yoga o práctica de movimiento por la mañana', 'Morning yoga or movement practice', 'Yoga ou pratique de mouvement le matin'),
          l('Brunch nutritivo', 'Nourishing brunch', 'Brunch nourrissant'),
          l('Sesión de bienestar personalizada (masaje o reiki)', 'Personalized wellness session (massage or reiki)', 'Séance de bien-être personnalisée (massage ou reiki)'),
          l('Sonoterapia por la tarde', 'Sound healing in the afternoon', 'Sonothérapie dans l’après-midi'),
          l('Cena casera y reflexión nocturna opcional', 'Homemade dinner and optional evening reflection', 'Dîner maison et réflexion du soir optionnelle'),
        ] },
        { title: l('Día 4', 'Day 4', 'Jour 4'), items: [
          l('Yoga o práctica de movimiento por la mañana', 'Morning yoga or movement practice', 'Yoga ou pratique de mouvement le matin'),
          l('Brunch nutritivo', 'Nourishing brunch', 'Brunch nourrissant'),
          l('Visita a las aguas termales (con tiempo opcional en el pueblo)', 'Visit to the hot springs (with optional time in town)', 'Visite des sources chaudes (avec du temps en ville en option)'),
          l('Cena en un restaurante local', 'Dinner out at a local restaurant', 'Dîner dans un restaurant local'),
          l('Práctica nocturna y ritual de cierre de regreso en Casa Oropéndola', 'Evening practice and closing ritual back at Casa Oropéndola', 'Pratique du soir et rituel de clôture de retour à Casa Oropéndola'),
        ] },
        { title: l('Día 5 – Cierre y salida', 'Day 5 – Closing & Departure', 'Jour 5 – Clôture et départ'), items: [
          l('Práctica de cierre por la mañana', 'Closing morning practice', 'Pratique de clôture le matin'),
          l('Brunch final', 'Final brunch', 'Dernier brunch'),
          l('Salida al mediodía', 'Departure by midday', 'Départ à la mi-journée'),
        ] },
      ] },
      { kind: 'note', text: l(
        'Las actividades y los horarios pueden cambiar según el clima, la duración elegida o tu ritmo personal. Tu comodidad, tu bienestar y tu conexión con la naturaleza siempre son lo primero.',
        'Activities and timing may shift depending on the weather, the length you choose or your personal rhythm. Your comfort, well-being and connection with nature always come first.',
        'Les activités et les horaires peuvent changer selon la météo, la durée choisie ou ton rythme personnel. Ton confort, ton bien-être et ta connexion avec la nature passent toujours en premier.',
      ) },
    ],
  },
  {
    id: 'personalizacion',
    title: l('Personalización', 'Personalization', 'Personnalisation'),
    tone: 'paper',
    hills: true,
    blocks: [
      { kind: 'p', text: l(
        'Tu retiro está diseñado para honrar tu ritmo y tus preferencias. Desde las caminatas hasta las sesiones de bienestar y las comidas, cada elemento puede personalizarse para acompañar cómo te sientes cada día. Puedes elegir entre las siguientes opciones:',
        'Your retreat is designed to honor your individual rhythm and preferences. From nature walks to wellness sessions and nourishing meals, each element can be personalized to support how you feel each day. You can choose from the following options:',
        'Ta retraite est conçue pour honorer ton rythme et tes préférences. Des marches en nature aux séances de bien-être et aux repas, chaque élément peut être personnalisé pour accompagner ce que tu ressens chaque jour. Tu peux choisir parmi les options suivantes :',
      ) },
      { kind: 'sub', text: l('Caminata en la naturaleza', 'Nature Walk', 'Marche en nature') },
      { kind: 'option', title: l('Mirador El Silencio', 'Mirador El Silencio', 'Mirador El Silencio'), text: l(
        'Un sistema de senderos tranquilo entre bosque frondoso, con vistas cercanas a una antigua colada de roca volcánica del Volcán Arenal. Cuatro rutas permiten una caminata suave y flexible, ideal para días de detox ligero o para un tiempo lento y consciente en la naturaleza.',
        'A quiet trail system through lush forest with close views of an ancient volcanic rock flow from Arenal Volcano. Four route options allow for a gentle, flexible walk, ideal for lighter detox days or slow, mindful nature time.',
        'Un réseau de sentiers tranquille à travers une forêt luxuriante, avec des vues proches sur une ancienne coulée de roche volcanique du volcan Arenal. Quatre parcours permettent une marche douce et flexible, idéale pour les jours de détox légère ou pour un moment lent et conscient en nature.',
      ) },
      { kind: 'option', title: l('Parque Ecológico Arenal', 'Arenal Ecological Park', 'Parc écologique Arenal'), text: l(
        'Un sendero más exigente hasta una colada de roca volcánica, con tramos más empinados y caminatas más largas. Ofrece vistas amplias, abundante vida silvestre y paddleboard opcional en la laguna; ideal para quienes tienen más energía o buscan una conexión más profunda con la naturaleza.',
        'A more challenging trail to a volcanic rock flow, with steeper paths and longer walks. It offers wide views, rich wildlife and optional paddleboarding on the lagoon, great for those with more energy or seeking deeper nature connection.',
        'Un sentier plus exigeant jusqu’à une coulée de roche volcanique, avec des passages plus raides et des marches plus longues. Il offre de larges vues, une faune abondante et du paddle en option sur la lagune ; idéal pour celles et ceux qui ont plus d’énergie ou cherchent une connexion plus profonde avec la nature.',
      ) },
      { kind: 'sub', text: l('Tratamiento de bienestar', 'Wellness Treatment', 'Soin de bien-être') },
      { kind: 'option', title: l('Masaje de relajación profunda', 'Deep Relaxation Massage', 'Massage de relaxation profonde'), text: l(
        'Un masaje terapéutico de cuerpo completo diseñado para liberar la tensión física, calmar el sistema nervioso y ayudarte a reconectar con tu cuerpo en un estado de quietud profunda. Ideal para arraigarte y recuperarte después del viaje o de una etapa emocionalmente intensa.',
        'A full-body therapeutic massage designed to release physical tension, calm the nervous system and help you reconnect with your body in a state of deep stillness. Ideal for grounding and restoring after travel or emotional intensity.',
        'Un massage thérapeutique du corps entier conçu pour libérer les tensions physiques, calmer le système nerveux et t’aider à te reconnecter à ton corps dans un état de calme profond. Idéal pour s’ancrer et récupérer après le voyage ou une période émotionnellement intense.',
      ) },
      { kind: 'option', title: l('Reiki, equilibrio energético', 'Reiki Energy Balance', 'Reiki, équilibre énergétique'), text: l(
        'Una práctica suave de sanación energética con las manos que acompaña el flujo natural de la energía en tu cuerpo. Esta sesión, sutil pero poderosa, favorece el equilibrio emocional, la calma interior y una conexión más profunda contigo.',
        'A gentle, hands-on energy healing practice that supports the natural flow of energy throughout your body. This subtle yet powerful session encourages emotional balance, inner calm and a deeper sense of connection to yourself.',
        'Une pratique douce de soin énergétique par les mains qui accompagne la circulation naturelle de l’énergie dans ton corps. Cette séance, subtile mais puissante, favorise l’équilibre émotionnel, le calme intérieur et une connexion plus profonde avec toi-même.',
      ) },
      { kind: 'sub', text: l('Disciplinas de Arenal Holístico', 'Arenal Holístico disciplines', 'Disciplines d’Arenal Holístico') },
      { kind: 'chips', items: [
        l('Clases de yoga', 'Yoga classes', 'Cours de yoga'),
        l('Meditaciones', 'Meditations', 'Méditations'),
        l('Sonoterapias', 'Sound therapies', 'Sonothérapies'),
        l('Ceremonias de cacao', 'Cacao ceremonies', 'Cérémonies de cacao'),
        l('Baños de bosque', 'Forest baths', 'Bains de forêt'),
        l('Talleres', 'Workshops', 'Ateliers'),
      ] },
      { kind: 'note', text: l(
        'Puedes combinar varias opciones; el precio final se ajusta a tu selección. Este retiro se adapta a la mayoría de los niveles de movilidad: cuéntanos cualquier necesidad física en el formulario de reserva para asegurar tu comodidad.',
        'You can combine several options; the final price adjusts to your selection. This retreat accommodates most mobility levels: please share any physical needs in your booking form so we can ensure your comfort.',
        'Tu peux combiner plusieurs options ; le prix final s’ajuste à ta sélection. Cette retraite convient à la plupart des niveaux de mobilité : indique tout besoin physique dans le formulaire de réservation pour que nous assurions ton confort.',
      ) },
    ],
  },
  {
    id: 'comidas',
    title: l('Comidas', 'Meals', 'Repas'),
    tone: 'paper',
    blocks: [
      { kind: 'p', text: l(
        'Ofrecemos distintos planes de alimentación para acompañar tu proceso, ya sea que busques nutrirte, depurarte o simplemente seguir tu intuición. Todas las comidas se preparan con cariño, con ingredientes locales y en su mayoría orgánicos, en sintonía con la energía de tu retiro.',
        'We offer different meal plans to support your process, whether you are nourishing, cleansing or simply following your intuition. All meals are lovingly prepared with local, mostly organic ingredients to align with the energy of your retreat.',
        'Nous proposons différents plans alimentaires pour accompagner ton processus, que tu cherches à te nourrir, à te purifier ou simplement à suivre ton intuition. Tous les repas sont préparés avec amour, avec des ingrédients locaux et en majorité biologiques, en accord avec l’énergie de ta retraite.',
      ) },
      { kind: 'option', title: l('Comidas nutritivas de inspiración costarricense', 'Nourishing Costa Rican–Inspired Meals', 'Repas nourrissants d’inspiration costaricienne'), text: l(
        'Platos caseros y completos con suaves influencias costarricenses: un equilibrio de arroz, frijoles, vegetales frescos, frutas tropicales y proteínas ligeras como pollo o pescado. Comidas satisfactorias, que arraigan y sostienen tu vitalidad durante la estancia.',
        'Wholesome, home-style dishes with gentle Costa Rican influences: a balance of rice, beans, fresh vegetables, tropical fruits and light proteins like chicken or fish. Meals are satisfying, grounding and designed to support vitality throughout your stay.',
        'Des plats maison et complets aux douces influences costariciennes : un équilibre de riz, de haricots, de légumes frais, de fruits tropicaux et de protéines légères comme le poulet ou le poisson. Des repas rassasiants, qui ancrent et soutiennent ta vitalité pendant le séjour.',
      ) },
      { kind: 'option', title: l('Plan detox ligero', 'Light Detox Plan', 'Plan détox léger'), text: l(
        'Un enfoque más liviano y depurativo centrado en jugos orgánicos de frutas y vegetales, comidas a base de plantas y alimentos sencillos y fáciles de digerir. Excluye proteína animal, lácteos, alimentos procesados y almidones pesados; ideal para quienes buscan un reinicio suave o profundizar en el descanso.',
        'A lighter, cleansing approach centered around organic fruit and vegetable juices, plant-based meals and simple, easily digestible foods. It excludes animal protein, dairy, processed foods and heavy starches, ideal for those looking to gently reset or go deeper into rest.',
        'Une approche plus légère et purifiante centrée sur des jus biologiques de fruits et de légumes, des repas à base de plantes et des aliments simples et faciles à digérer. Elle exclut les protéines animales, les produits laitiers, les aliments transformés et les féculents lourds ; idéale pour une remise à zéro en douceur ou un repos plus profond.',
      ) },
      { kind: 'option', title: l('Otros enfoques', 'Other approaches', 'Autres approches'), text: l(
        'También puedes orientar tu alimentación hacia un plan keto, de ayuno, vegano o vegetariano.',
        'You can also orient your meals toward a keto, fasting, vegan or vegetarian plan.',
        'Tu peux aussi orienter ton alimentation vers un plan keto, de jeûne, végane ou végétarien.',
      ) },
      { kind: 'sub', text: l('Preferencias y restricciones alimentarias', 'Dietary Preferences & Restrictions', 'Préférences et restrictions alimentaires') },
      { kind: 'p', text: l(
        'Con gusto adaptamos las comidas a tus necesidades. En el formulario de reserva podrás indicar cualquier restricción, alergia o preferencia.',
        'We are happy to accommodate your dietary needs. In the booking form you will be able to share any restrictions, allergies or preferences.',
        'Nous adaptons volontiers les repas à tes besoins. Dans le formulaire de réservation, tu pourras indiquer toute restriction, allergie ou préférence.',
      ) },
      { kind: 'chips', items: [
        l('Vegana', 'Vegan', 'Végane'), l('Vegetariana', 'Vegetarian', 'Végétarienne'), l('Pescetariana', 'Pescatarian', 'Pescétarienne'),
        l('Sin gluten', 'Gluten-free', 'Sans gluten'), l('Sin lácteos', 'Dairy-free', 'Sans lactose'), l('Keto', 'Keto', 'Keto'),
        l('Ayuno', 'Fasting', 'Jeûne'), l('Otras', 'Any others', 'Autres'),
      ] },
      { kind: 'note', text: l('El plan de alimentación que elijas se refleja en el precio final.', 'The meal plan you choose is reflected in the final price.', 'Le plan alimentaire que tu choisis se reflète dans le prix final.') },
    ],
  },
  {
    id: 'alojamiento',
    title: l('Alojamiento', 'Accommodation', 'Hébergement'),
    tone: 'paper',
    hills: true,
    blocks: [
      { kind: 'p', text: l(
        'Casa Oropéndola es un hogar y espacio de retiro pequeño e intencional, basado en la sencillez, el cuidado y la conexión con la naturaleza. Ubicada en el tranquilo entorno rural de Jauuri, a solo 10 minutos de La Fortuna, se siente escondida en el bosque y a la vez cerca de todo lo que puedas necesitar.',
        'Casa Oropéndola is a small, intentional home and retreat space rooted in simplicity, care and connection to nature. Located in the quiet rural setting of Jauuri, just 10 minutes from La Fortuna, it feels tucked away in the forest, yet close to everything you might need.',
        'Casa Oropéndola est une petite maison et un espace de retraite intentionnel, fondé sur la simplicité, le soin et la connexion avec la nature. Située dans le cadre rural et calme de Jauuri, à seulement 10 minutes de La Fortuna, elle semble nichée dans la forêt tout en restant proche de tout ce dont tu pourrais avoir besoin.',
      ) },
      { kind: 'p', text: l(
        'Tu habitación privada se conecta con la casa principal por un sendero exterior. Ofrece comodidad, privacidad y un lugar suave donde llegar durante toda tu estancia.',
        'Your private retreat room is connected to the main house by an outdoor path. It offers comfort, privacy and a soft place to land throughout your stay.',
        'Ta chambre privée est reliée à la maison principale par un sentier extérieur. Elle offre confort, intimité et un lieu doux où te poser pendant tout ton séjour.',
      ) },
      { kind: 'sub', text: l('Qué incluye:', 'What’s included:', 'Ce qui est inclus :') },
      { kind: 'list', items: [
        l('Cama cómoda con ropa de cama de calidad y mosquitero', 'Comfortable bed with quality bedding and mosquito netting', 'Lit confortable avec une literie de qualité et une moustiquaire'),
        l('Baño privado con agua caliente y artículos de aseo naturales', 'Private bathroom with hot water and natural toiletries', 'Salle de bain privée avec eau chaude et produits de toilette naturels'),
        l('Ventiladores de piso y buena circulación de aire (sin aire acondicionado ni TV)', 'Floor fans and plenty of airflow (no A/C or TV)', 'Ventilateurs sur pied et bonne circulation d’air (sans climatisation ni télévision)'),
        l('Terraza privada con vista al jardín y un pequeño espacio para sentarse', 'A private terrace with garden views and a small sitting area', 'Terrasse privée avec vue sur le jardin et un petit coin pour s’asseoir'),
        l('Diseño cuidado, con colores serenos y materiales naturales', 'Thoughtful design with calming colors and natural materials', 'Un design soigné, aux couleurs apaisantes et aux matériaux naturels'),
      ] },
      { kind: 'p', text: l(
        'Estarás rodeado por la vida silvestre de la zona: perezosos, tucanes, oropéndolas, ranas e incontables aves e insectos suelen estar cerca. Aunque se siente escondida en el rústico poblado de Jauuri, la animada ciudad de La Fortuna está a menos de 10 minutos en carro.',
        'You will be surrounded by the wildlife of the area: sloths, toucans, oropéndolas, frogs and countless birds and insects are often nearby. While it feels tucked away in the rustic village of Jauuri, the vibrant town of La Fortuna is less than 10 minutes away by car.',
        'Tu seras entouré par la faune de la région : paresseux, toucans, oropéndolas, grenouilles et d’innombrables oiseaux et insectes sont souvent tout près. Même si elle semble cachée dans le village rustique de Jauuri, la ville animée de La Fortuna est à moins de 10 minutes en voiture.',
      ) },
      { kind: 'note', text: l(
        'Ten en cuenta: en Casa Oropéndola también viven perros y gatos amigables, así que las personas con alergia a las mascotas deben considerarlo.',
        'Please note: Casa Oropéndola is also home to friendly dogs and cats, so guests with pet allergies should take this into consideration.',
        'À noter : Casa Oropéndola est aussi la maison de chiens et de chats affectueux ; les personnes allergiques aux animaux doivent en tenir compte.',
      ) },
    ],
  },
  {
    id: 'equipo',
    title: l('Anfitriona y equipo', 'Retreat Host & Team', 'Hôte et équipe'),
    tone: 'olive',
    blocks: [
      { kind: 'p', text: l(
        'Tu retiro es acogido con cariño por Ana Carballo, el corazón detrás de Casa Oropéndola. Con más de 10 años de experiencia en yoga y prácticas de bienestar, Ana aporta un toque cercano y arraigado a cada parte de la experiencia: desde preparar comidas caseras hasta guiar prácticas y ritmos que te reciben tal como llegas.',
        'Your retreat is lovingly hosted by Ana Carballo, the heart behind Casa Oropéndola. With more than 10 years of experience in yoga and wellness practices, Ana brings a grounded, personal touch to every part of the experience: from preparing homemade meals to guiding practices and rhythms that meet you where you are.',
        'Ta retraite est accueillie avec affection par Ana Carballo, le cœur de Casa Oropéndola. Avec plus de 10 ans d’expérience dans le yoga et les pratiques de bien-être, Ana apporte une touche personnelle et ancrée à chaque partie de l’expérience : de la préparation de repas maison à l’accompagnement de pratiques et de rythmes qui t’accueillent là où tu en es.',
      ) },
      { kind: 'p', text: l(
        'Casa Oropéndola no es un gran centro ni un resort. Es un hogar. Y cada retiro es una experiencia personalizada basada en el cuidado, la sencillez y la presencia.',
        'Casa Oropéndola isn’t a large center or resort. It’s a home. And each retreat is a personalized experience rooted in care, simplicity and presence.',
        'Casa Oropéndola n’est ni un grand centre ni un resort. C’est une maison. Et chaque retraite est une expérience personnalisée fondée sur le soin, la simplicité et la présence.',
      ) },
      { kind: 'sub', text: l('También podrás conocer a:', 'You may also meet:', 'Tu pourras aussi rencontrer :') },
      { kind: 'list', items: [
        l('Guías naturalistas locales que dirigen caminatas suaves por senderos de bosque y paisajes volcánicos', 'Local nature guides who lead gentle walks through forest trails and volcanic landscapes', 'Des guides naturalistes locaux qui mènent des marches douces sur des sentiers de forêt et dans des paysages volcaniques'),
        l('Masajistas certificados y terapeutas de bienestar formados en modalidades terapéuticas y energéticas', 'Licensed massage therapists and wellness practitioners trained in therapeutic and energetic modalities', 'Des massothérapeutes diplômés et des praticiens du bien-être formés aux approches thérapeutiques et énergétiques'),
        l('Colaboradores de confianza que apoyan la sonoterapia, el transporte o las sesiones especiales según se necesite', 'Trusted collaborators who support sound healing, transportation or special sessions as needed', 'Des collaborateurs de confiance qui accompagnent la sonothérapie, le transport ou les séances spéciales selon les besoins'),
      ] },
      { kind: 'p', text: l(
        'Es un equipo pequeño e intencional. Cada persona aporta toda su presencia y calidez para que te sientas acompañado, seguro y a gusto durante tu estancia.',
        'This is a small, intentional team. Each person brings their full presence and warmth to help you feel supported, safe and at ease throughout your stay.',
        'C’est une petite équipe intentionnelle. Chaque personne apporte toute sa présence et sa chaleur pour que tu te sentes accompagné, en sécurité et à l’aise pendant ton séjour.',
      ) },
    ],
  },
  {
    id: 'no-incluye',
    title: l('Qué no incluye', 'What’s Not Included', 'Ce qui n’est pas inclus'),
    tone: 'paper',
    hills: true,
    blocks: [
      { kind: 'list', items: [
        l('Vuelos o viajes internacionales', 'Flights or international travel', 'Vols ou voyages internationaux'),
        l('Tours o actividades adicionales que no formen parte de tu selección', 'Extra tours or activities that are not part of your selection', 'Excursions ou activités supplémentaires qui ne font pas partie de ta sélection'),
        l('Alcohol o snacks procesados (en línea con nuestra intención de bienestar)', 'Alcohol or processed snacks (aligned with our wellness intention)', 'Alcool ou snacks transformés (en accord avec notre intention de bien-être)'),
        l('Recuerdos, tratamientos de spa o solicitudes especiales', 'Souvenirs, spa treatments or special requests', 'Souvenirs, soins de spa ou demandes spéciales'),
        l('Seguro de viaje personal', 'Personal travel insurance', 'Assurance voyage personnelle'),
      ] },
      { kind: 'note', text: l(
        'Pueden agregarse actividades adicionales con un costo extra, siempre que se confirmen con anticipación.',
        'Extra activities may be added at an additional cost and must be confirmed in advance.',
        'Des activités supplémentaires peuvent être ajoutées moyennant un coût additionnel et doivent être confirmées à l’avance.',
      ) },
      { kind: 'note', text: l(
        'Los vuelos llegan al aeropuerto SJO; si eliges traslado, opera de 8:00 a. m. a 6:00 p. m. ¿Necesitas consejos de visa o detalles de llegada? Pide nuestra Guía de Logística de Viaje al reservar.',
        'Flights arrive at SJO Airport; if you choose a transfer, it runs 8AM–6PM. Need visa tips or arrival details? Request our Travel Logistics Guide when booking.',
        'Les vols arrivent à l’aéroport SJO ; si tu choisis un transfert, il fonctionne de 8 h à 18 h. Besoin de conseils pour le visa ou de détails d’arrivée ? Demande notre Guide de logistique de voyage lors de la réservation.',
      ) },
    ],
  },
  {
    id: 'inversion',
    title: l('Inversión del retiro', 'Retreat Investment', 'Investissement'),
    tone: 'paper',
    blocks: [
      { kind: 'sub', text: l('Precio según tu selección', 'Price based on your selection', 'Prix selon ta sélection') },
      { kind: 'p', text: l(
        'No hay una tarifa única. El precio se define a partir de lo que elijas: número de personas, duración, actividades, plan de alimentación y transporte. Una selección más modesta permite ajustar el retiro a presupuestos más reducidos.',
        'There is no single rate. The price is set by what you choose: number of guests, length, activities, meal plan and transport. A more modest selection lets the retreat fit smaller budgets.',
        'Il n’y a pas de tarif unique. Le prix se définit à partir de ce que tu choisis : nombre de personnes, durée, activités, plan alimentaire et transport. Une sélection plus modeste permet d’adapter la retraite à des budgets plus réduits.',
      ) },
      { kind: 'sub', text: l('Métodos de pago aceptados', 'Payment Methods Accepted', 'Moyens de paiement acceptés') },
      { kind: 'chips', items: [
        l('SINPE Móvil (Costa Rica)', 'SINPE Móvil (Costa Rica)', 'SINPE Móvil (Costa Rica)'),
        l('Transferencia bancaria (EE. UU. y Costa Rica)', 'Bank transfer (US & Costa Rica)', 'Virement bancaire (États-Unis et Costa Rica)'),
        l('PayPal', 'PayPal', 'PayPal'),
        l('Tarjetas de crédito o débito (vía Stripe)', 'Major credit/debit cards (via Stripe)', 'Cartes de crédit ou de débit (via Stripe)'),
      ] },
      { kind: 'sub', text: l('Reembolsos', 'Refunds', 'Remboursements') },
      { kind: 'list', items: [
        l('Un depósito del 50 % asegura tu retiro y no es reembolsable', 'A 50% deposit secures your retreat and is non-refundable', 'Un acompte de 50 % garantit ta retraite et n’est pas remboursable'),
        l('El 50 % restante se paga al menos 15 días antes de la llegada', 'The remaining 50% is due at least 15 days before arrival', 'Les 50 % restants sont dus au moins 15 jours avant l’arrivée'),
        l('Si cancelas con más de 72 horas de anticipación, se reembolsa tu segundo pago', 'If you cancel more than 72 hours before the retreat, your second payment will be refunded', 'Si tu annules plus de 72 heures avant la retraite, ton second paiement est remboursé'),
        l('No hay reembolsos por cancelaciones dentro de las 72 horas previas al inicio del retiro', 'No refunds are available for cancellations within 72 hours of the retreat start time', 'Aucun remboursement pour les annulations dans les 72 heures précédant le début de la retraite'),
      ] },
      { kind: 'note', text: l(
        'Todos los precios se indican en USD. Tu total final reflejará las opciones seleccionadas y se confirmará antes de solicitar el pago.',
        'All prices are in USD. Your final total will reflect your selected options and will be confirmed before payment is requested.',
        'Tous les prix sont indiqués en USD. Ton total final reflétera les options choisies et sera confirmé avant toute demande de paiement.',
      ) },
    ],
  },
  {
    id: 'para-ti',
    title: l('¿Es para ti?', 'Is This For You?', 'Est-ce pour toi ?'),
    tone: 'olive',
    blocks: [
      { kind: 'p', text: l('Este retiro está diseñado para quienes anhelan:', 'This retreat is designed for those who are craving:', 'Cette retraite est conçue pour celles et ceux qui aspirent à :') },
      { kind: 'quotes', items: [
        l('Quietud, soledad o una pausa significativa con alguien cercano', 'Stillness, solitude, or a meaningful pause with someone close', 'Du calme, de la solitude ou une pause qui a du sens avec un proche'),
        l('Un descanso de las pantallas, del ruido y del hacer constante', 'A break from screens, noise and constant doing', 'Une coupure des écrans, du bruit et du faire permanent'),
        l('Descanso profundo, movimiento suave y una reconexión tranquila', 'Deep rest, gentle movement and quiet reconnection', 'Un repos profond, un mouvement doux et une reconnexion tranquille'),
        l('Comodidades sencillas y belleza natural', 'Simple comforts and natural beauty', 'Des conforts simples et la beauté naturelle'),
        l('Una experiencia flexible, no un horario rígido', 'A flexible experience, not a rigid schedule', 'Une expérience flexible, pas un horaire rigide'),
      ] },
      { kind: 'p', text: l(
        'Si buscas presencia en lugar de presión, calma en lugar de caos y naturaleza en lugar de ruido, esto puede ser justo lo que necesitas. Vengas solo o con tus seres queridos, serás bienvenido tal como eres.',
        'If you are looking for presence over pressure, calm over chaos and nature over noise, this might be exactly what you need. Whether solo or with your loved ones, you will be welcomed just as you are.',
        'Si tu cherches la présence plutôt que la pression, le calme plutôt que le chaos et la nature plutôt que le bruit, c’est peut-être exactement ce qu’il te faut. Que tu viennes seul ou avec tes proches, tu seras accueilli tel que tu es.',
      ) },
    ],
  },
  {
    id: 'reserva',
    title: l('Cómo reservar tu retiro', 'Booking Your Retreat', 'Réserver ta retraite'),
    tone: 'paper',
    hills: true,
    blocks: [
      { kind: 'steps', steps: [
        { title: l('Comparte tus fechas ideales', 'Share Your Ideal Dates', 'Partage tes dates idéales'), text: l('Cuéntanos cuándo te gustaría venir.', 'Let us know when you are hoping to come.', 'Dis-nous quand tu aimerais venir.') },
        { title: l('Completa el formulario de reserva', 'Fill Out the Retreat Booking Form', 'Remplis le formulaire de réservation'), text: l('Llénalo con tus preferencias y datos.', 'Complete the form with your preferences and details.', 'Complète-le avec tes préférences et tes informations.') },
        { title: l('Recibe la confirmación y tu resumen personalizado', 'Receive Confirmation & Personalized Summary', 'Reçois la confirmation et ton résumé personnalisé'), text: l('Revisamos tu información, confirmamos disponibilidad y te enviamos el itinerario y la cotización final según tu selección.', 'We review your info, confirm availability and send you the schedule and a final quote tailored to your choices.', 'Nous examinons tes informations, confirmons la disponibilité et t’envoyons le programme et le devis final selon tes choix.') },
        { title: l('Asegura tu lugar', 'Secure Your Spot', 'Garantis ta place'), text: l('Paga el depósito del 50 % para reservar. El saldo se paga 15 días antes de la llegada.', 'Pay your 50% deposit to reserve. Balance due 15 days before arrival.', 'Verse l’acompte de 50 % pour réserver. Le solde est dû 15 jours avant l’arrivée.') },
        { title: l('Recibe tu paquete de bienvenida', 'Receive Your Welcome Pack', 'Reçois ton dossier de bienvenue'), text: l('Una vez reservado, recibirás el resumen personalizado de tu retiro, una guía de equipaje y tu itinerario preliminar.', 'Once booked, you will receive your personalized retreat overview, packing guidance and your preliminary itinerary.', 'Une fois la réservation faite, tu recevras le résumé personnalisé de ta retraite, des conseils pour ta valise et ton itinéraire préliminaire.') },
      ] },
      { kind: 'note', text: l(
        'Nota: este retiro se adapta a la mayoría de los niveles de movilidad; por favor comparte cualquier necesidad física o médica en el formulario para asegurar tu comodidad.',
        'Note: this retreat accommodates most mobility levels, but please share any physical or medical needs in your form so we can ensure your comfort.',
        'Note : cette retraite convient à la plupart des niveaux de mobilité ; indique tout besoin physique ou médical dans le formulaire pour que nous assurions ton confort.',
      ) },
    ],
  },
  {
    id: 'preguntas',
    title: l('¿Preguntas o solicitudes?', 'Questions or Requests?', 'Questions ou demandes ?'),
    tone: 'paper',
    blocks: [
      { kind: 'p', text: l('Escríbenos cuando quieras; con gusto te ayudamos.', 'Reach out anytime — we’re happy to help.', 'Écris-nous quand tu veux ; nous serons ravis de t’aider.') },
      { kind: 'contact' },
      { kind: 'note', text: l(
        '¿Quieres consejos sobre equipaje, clima o qué esperar? Pide la Guía de Preparación del Huésped al reservar.',
        'Want tips on packing, weather or what to expect? Ask for the Guest Prep Guide when you book.',
        'Tu veux des conseils sur la valise, la météo ou ce qui t’attend ? Demande le Guide de préparation de l’hôte lors de la réservation.',
      ) },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Formulario de reserva                                                */
/* ------------------------------------------------------------------ */

export type Choice = { value: string; label: L };
const c = (value: string, es: string, en: string, fr: string): Choice => ({ value, label: l(es, en, fr) });

export const bookingChoices = {
  language: [c('es', 'Español', 'Spanish', 'Espagnol'), c('en', 'Inglés', 'English', 'Anglais'), c('fr', 'Francés', 'French', 'Français')],
  guests: ['1', '2', '3', '4'].map(n => c(n, n, n, n)),
  days: ['3', '4', '5', '6', '7', '8', '9'].map(n => c(n, `${n} días`, `${n} days`, `${n} jours`)),
  flexible: [
    c('fijas', 'Mis fechas son fijas', 'My dates are fixed', 'Mes dates sont fixes'),
    c('flexibles', 'Tengo algunos días de flexibilidad', 'I have a few days of flexibility', 'J’ai quelques jours de flexibilité'),
    c('abiertas', 'Aún no tengo fecha definida', 'I don’t have a set date yet', 'Je n’ai pas encore de date définie'),
  ],
  transport: [
    c('si', 'Sí, quiero traslado desde el aeropuerto SJO', 'Yes, I want a transfer from SJO Airport', 'Oui, je veux un transfert depuis l’aéroport SJO'),
    c('no', 'No, llego por mi cuenta', 'No, I will arrive on my own', 'Non, j’arrive par mes propres moyens'),
    c('duda', 'Aún no lo sé', 'I’m not sure yet', 'Je ne sais pas encore'),
  ],
  focus: [
    c('espiritual', 'Espiritual', 'Spiritual', 'Spirituelle'),
    c('detox', 'Detox', 'Detox', 'Détox'),
    c('terapeutico', 'Terapéutico', 'Therapeutic', 'Thérapeutique'),
    c('descanso', 'Descanso y desconexión', 'Rest and disconnection', 'Repos et déconnexion'),
    c('naturaleza', 'Naturaleza y aventura suave', 'Nature and gentle adventure', 'Nature et aventure douce'),
    c('reconexion', 'Reconexión con alguien cercano', 'Reconnecting with someone close', 'Reconnexion avec un proche'),
  ],
  activities: [
    c('yoga', 'Clases de yoga', 'Yoga classes', 'Cours de yoga'),
    c('meditacion', 'Meditaciones', 'Meditations', 'Méditations'),
    c('sono', 'Sonoterapias', 'Sound therapies', 'Sonothérapies'),
    c('cacao', 'Ceremonia de cacao', 'Cacao ceremony', 'Cérémonie de cacao'),
    c('bosque', 'Baños de bosque', 'Forest baths', 'Bains de forêt'),
    c('talleres', 'Talleres', 'Workshops', 'Ateliers'),
    c('silencio', 'Caminata: Mirador El Silencio (suave)', 'Walk: Mirador El Silencio (gentle)', 'Marche : Mirador El Silencio (douce)'),
    c('parque', 'Caminata: Parque Ecológico Arenal (exigente)', 'Walk: Arenal Ecological Park (challenging)', 'Marche : Parc écologique Arenal (exigeante)'),
    c('masaje', 'Masaje de relajación profunda', 'Deep relaxation massage', 'Massage de relaxation profonde'),
    c('reiki', 'Reiki, equilibrio energético', 'Reiki energy balance', 'Reiki, équilibre énergétique'),
    c('termales', 'Aguas termales naturales', 'Natural hot springs', 'Sources chaudes naturelles'),
  ],
  mealPlan: [
    c('costarricense', 'Comidas nutritivas de inspiración costarricense', 'Nourishing Costa Rican–inspired meals', 'Repas nourrissants d’inspiration costaricienne'),
    c('detox', 'Plan detox ligero', 'Light detox plan', 'Plan détox léger'),
    c('keto', 'Keto', 'Keto', 'Keto'),
    c('ayuno', 'Ayuno', 'Fasting', 'Jeûne'),
    c('vegana', 'Vegana', 'Vegan', 'Végane'),
    c('vegetariana', 'Vegetariana', 'Vegetarian', 'Végétarienne'),
    c('asesoria', 'Prefiero que me orienten', 'I’d like guidance', 'Je préfère être conseillé'),
  ],
  diet: [
    c('pescetariana', 'Pescetariana', 'Pescatarian', 'Pescétarienne'),
    c('sin-gluten', 'Sin gluten', 'Gluten-free', 'Sans gluten'),
    c('sin-lacteos', 'Sin lácteos', 'Dairy-free', 'Sans lactose'),
  ],
  yogaLevel: [
    c('ninguna', 'Ninguna', 'None', 'Aucune'),
    c('principiante', 'Principiante', 'Beginner', 'Débutant'),
    c('intermedia', 'Intermedia', 'Intermediate', 'Intermédiaire'),
    c('avanzada', 'Avanzada', 'Advanced', 'Avancé'),
  ],
} as const;

export type BookingField =
  | 'name' | 'email' | 'phone' | 'country' | 'language' | 'guests' | 'companions' | 'arrival' | 'days' | 'flexible' | 'transport'
  | 'focus' | 'focusOther' | 'activities' | 'mealPlan' | 'diet' | 'allergies' | 'yogaLevel' | 'health' | 'petAllergy' | 'budget' | 'expectations' | 'source';

/** Etiquetas de cada campo: las usa el formulario y también el panel para mostrar la reserva. */
export const bookingLabels: Record<BookingField, L> = {
  name: l('Nombre completo', 'Full name', 'Nom complet'),
  email: l('Correo electrónico', 'Email', 'E-mail'),
  phone: l('Teléfono o WhatsApp (con código de país)', 'Phone or WhatsApp (with country code)', 'Téléphone ou WhatsApp (avec indicatif)'),
  country: l('País de residencia', 'Country of residence', 'Pays de résidence'),
  language: l('Idioma en el que prefieres que te atendamos', 'Language you prefer us to use', 'Langue dans laquelle tu préfères échanger'),
  guests: l('¿Cuántas personas vienen?', 'How many guests are coming?', 'Combien de personnes viennent ?'),
  companions: l('Si vienes acompañado: nombres y relación (pareja, amistad, familia)', 'If you are not coming alone: names and relationship (partner, friend, family)', 'Si tu viens accompagné : prénoms et lien (couple, ami, famille)'),
  arrival: l('Fecha ideal de llegada', 'Ideal arrival date', 'Date d’arrivée idéale'),
  days: l('Duración del retiro', 'Length of the retreat', 'Durée de la retraite'),
  flexible: l('¿Qué tan flexibles son tus fechas?', 'How flexible are your dates?', 'Quelle est la flexibilité de tes dates ?'),
  transport: l('Traslado desde el aeropuerto', 'Airport transfer', 'Transfert depuis l’aéroport'),
  focus: l('Enfoque general del retiro (puedes marcar varios)', 'Overall focus of the retreat (you can choose several)', 'Orientation générale de la retraite (plusieurs choix possibles)'),
  focusOther: l('Otro enfoque o intención', 'Another focus or intention', 'Autre orientation ou intention'),
  activities: l('Actividades que te gustaría incluir', 'Activities you would like to include', 'Activités que tu aimerais inclure'),
  mealPlan: l('Enfoque de alimentación', 'Meal plan', 'Plan alimentaire'),
  diet: l('Otras preferencias', 'Other preferences', 'Autres préférences'),
  allergies: l('Alergias, restricciones o alimentos que evitas', 'Allergies, restrictions or foods you avoid', 'Allergies, restrictions ou aliments que tu évites'),
  yogaLevel: l('Experiencia en yoga', 'Yoga experience', 'Expérience en yoga'),
  health: l('Necesidades físicas o médicas que debamos conocer', 'Physical or medical needs we should know about', 'Besoins physiques ou médicaux que nous devrions connaître'),
  petAllergy: l('Tengo alergia a perros o gatos', 'I am allergic to dogs or cats', 'Je suis allergique aux chiens ou aux chats'),
  budget: l('Presupuesto aproximado en USD (opcional)', 'Approximate budget in USD (optional)', 'Budget approximatif en USD (optionnel)'),
  expectations: l('¿Qué esperas de este retiro?', 'What are you hoping for from this retreat?', 'Qu’attends-tu de cette retraite ?'),
  source: l('¿Cómo nos conociste?', 'How did you hear about us?', 'Comment nous as-tu connus ?'),
};

export const bookingUi = {
  eyebrow: l('Formulario de reserva', 'Booking form', 'Formulaire de réservation'),
  title: l('Reserva tu retiro', 'Book your retreat', 'Réserve ta retraite'),
  intro: l(
    'Cuéntanos tus fechas y preferencias. Con tu selección creamos el itinerario final y la cotización. Completar este formulario no te compromete a pagar.',
    'Tell us your dates and preferences. With your selection we create the final schedule and the quote. Completing this form does not commit you to pay.',
    'Indique-nous tes dates et tes préférences. Avec ta sélection, nous créons le programme final et le devis. Remplir ce formulaire ne t’engage à aucun paiement.',
  ),
  back: l('Volver a Retiros', 'Back to Retreats', 'Retour aux retraites'),
  s1: l('Tus datos', 'Your details', 'Tes informations'),
  s2: l('Grupo y fechas', 'Group and dates', 'Groupe et dates'),
  s3: l('Enfoque y actividades', 'Focus and activities', 'Orientation et activités'),
  s4: l('Alimentación', 'Food', 'Alimentation'),
  s5: l('Salud y comodidad', 'Health and comfort', 'Santé et confort'),
  s6: l('Para terminar', 'To finish', 'Pour terminer'),
  petNote: l('En Casa Oropéndola viven perros y gatos amigables.', 'Friendly dogs and cats live at Casa Oropéndola.', 'Des chiens et des chats affectueux vivent à Casa Oropéndola.'),
  budgetNote: l('Nos ayuda a proponerte una selección que se ajuste a tu presupuesto.', 'It helps us propose a selection that fits your budget.', 'Cela nous aide à te proposer une sélection adaptée à ton budget.'),
  consent: l(
    'Acepto que Arenal Holístico use estos datos para contactarme y preparar mi retiro.',
    'I agree that Arenal Holístico may use this information to contact me and prepare my retreat.',
    'J’accepte qu’Arenal Holístico utilise ces informations pour me contacter et préparer ma retraite.',
  ),
  choose: l('Elige una opción', 'Choose an option', 'Choisis une option'),
  submit: l('Enviar reserva', 'Send booking', 'Envoyer la réservation'),
  sending: l('Enviando…', 'Sending…', 'Envoi…'),
  error: l('No pudimos enviar el formulario. Revisa los datos e inténtalo de nuevo.', 'We could not send the form. Check the details and try again.', 'Nous n’avons pas pu envoyer le formulaire. Vérifie les informations et réessaie.'),
  done: l('Para completar tu reservación nos pondremos en contacto contigo.', 'To complete your booking, we will get in touch with you.', 'Pour finaliser ta réservation, nous prendrons contact avec toi.'),
  doneTitle: l('Recibimos tu formulario', 'We received your form', 'Nous avons bien reçu ton formulaire'),
};

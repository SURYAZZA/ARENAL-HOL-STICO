import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'es' | 'en' | 'fr';

export const LANGUAGES: { code: Lang; short: string; label: string }[] = [
  { code: 'es', short: 'ES', label: 'Español' },
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'fr', short: 'FR', label: 'Français' },
];

const STORAGE_KEY = 'arenal-lang';

type Entry = { es: string; en: string; fr: string };

/** Textos fijos de la interfaz. La clave describe dónde se usa. */
const ui = {
  'lang.change': { es: 'Cambiar idioma', en: 'Change language', fr: 'Changer de langue' },

  'nav.aria': { es: 'Principal', en: 'Main', fr: 'Principal' },
  'nav.home': { es: 'Inicio', en: 'Home', fr: 'Accueil' },
  'nav.services': { es: 'Servicios', en: 'Services', fr: 'Services' },
  'nav.retreats': { es: 'Retiros', en: 'Retreats', fr: 'Retraites' },
  'nav.blog': { es: 'Blog', en: 'Blog', fr: 'Blog' },
  'nav.contact': { es: 'Contacto', en: 'Contact', fr: 'Contact' },

  'footer.tagline': {
    es: 'Experiencias de bienestar y salud emocional en contacto con la naturaleza.',
    en: 'Wellness and emotional health experiences in contact with nature.',
    fr: 'Expériences de bien-être et de santé émotionnelle au contact de la nature.',
  },
  'footer.cookies': { es: 'Configuración de cookies', en: 'Cookie settings', fr: 'Paramètres des cookies' },

  'hero.alt': {
    es: 'Momoto de cabeza rufa posado en una rama cubierta de musgo, en el bosque de Arenal',
    en: 'Rufous-headed motmot perched on a moss-covered branch in the Arenal forest',
    fr: "Motmot à tête rousse perché sur une branche couverte de mousse, dans la forêt d'Arenal",
  },
  'hero.eyebrow': {
    es: 'Naturaleza · presencia · bienestar',
    en: 'Nature · presence · wellbeing',
    fr: 'Nature · présence · bien-être',
  },
  'hero.title1': { es: 'Vuelve a tu esencia.', en: 'Return to your essence.', fr: 'Reviens à ton essence.' },
  'hero.title2': { es: ' Encuentra tu equilibrio.', en: ' Find your balance.', fr: ' Trouve ton équilibre.' },
  'hero.lede': {
    es: 'Un espacio para respirar, reconectar y cultivar la salud emocional. Experiencias holísticas que unen el cuidado interior con la fuerza del bosque de Arenal — pensadas para personas, y también para quien organiza el viaje.',
    en: 'A space to breathe, reconnect and nurture emotional health. Holistic experiences that join inner care with the strength of the Arenal forest — designed for individuals, and also for those who organize the trip.',
    fr: "Un espace pour respirer, se reconnecter et cultiver la santé émotionnelle. Des expériences holistiques qui unissent le soin intérieur à la force de la forêt d'Arenal — pensées pour les personnes, et aussi pour celles et ceux qui organisent le voyage.",
  },
  'hero.cta': {
    es: 'Descubre nuestras experiencias',
    en: 'Discover our experiences',
    fr: 'Découvre nos expériences',
  },

  'journal.eyebrow': { es: 'El diario de Arenal', en: 'The Arenal Journal', fr: "Le journal d'Arenal" },
  'journal.title': {
    es: 'Inspiración para vivir en equilibrio.',
    en: 'Inspiration to live in balance.',
    fr: "De l'inspiration pour vivre en équilibre.",
  },
  'journal.intro': {
    es: 'Síguenos en nuestras redes sociales para seguir de cerca nuestras inspiraciones, objetivos y espacios de armonía.',
    en: 'Follow us on social media to keep up with our inspirations, goals and spaces of harmony.',
    fr: "Suis-nous sur les réseaux sociaux pour suivre de près nos inspirations, nos objectifs et nos espaces d'harmonie.",
  },
  'journal.read': { es: 'Leer más', en: 'Read more', fr: 'Lire la suite' },
  'journal.less': { es: 'Leer menos', en: 'Read less', fr: 'Réduire' },
  'journal.new': { es: 'Novedades', en: 'New', fr: 'Nouveautés' },
  'journal.empty': {
    es: 'Las próximas publicaciones aparecerán aquí.',
    en: 'Upcoming posts will appear here.',
    fr: 'Les prochaines publications apparaîtront ici.',
  },
  'journal.hide': {
    es: 'Ocultar publicaciones anteriores',
    en: 'Hide previous posts',
    fr: 'Masquer les publications précédentes',
  },
  'journal.more': { es: 'Ver más', en: 'See more', fr: 'Voir plus' },
  'journal.quiet': {
    es: 'Cuando haya más notas, este botón desplegará las más antiguas.',
    en: 'When there are more posts, this button will expand the older ones.',
    fr: "Quand il y aura plus d'articles, ce bouton affichera les plus anciens.",
  },

  'about.eyebrow': { es: 'Quiénes somos', en: 'Who we are', fr: 'Qui sommes-nous' },
  'about.title': { es: 'Sobre Nosotros', en: 'About Us', fr: 'À propos de nous' },
  'about.intro': {
    es: 'Un equipo unido por la naturaleza, la paz interior y el bienestar.',
    en: 'A team united by nature, inner peace and wellbeing.',
    fr: 'Une équipe unie par la nature, la paix intérieure et le bien-être.',
  },
  'about.bio1': {
    es: 'Catorce años de experiencia impartiendo clases de yoga, meditaciones y sonoterapias como profesora certificada, guía ceremonial y experta en rituales de Cacao e inmersiones profundas en la naturaleza y el bosque, experta en aromaterapia y flores de Bach.',
    en: 'Fourteen years of experience teaching yoga classes, meditations and sound therapies as a certified teacher, ceremonial guide and expert in Cacao rituals and deep immersions in nature and the forest, with expertise in aromatherapy and Bach flowers.',
    fr: "Quatorze ans d'expérience dans l'enseignement du yoga, des méditations et des sonothérapies en tant que professeure certifiée, guide cérémonielle et experte des rituels de cacao et des immersions profondes dans la nature et la forêt, experte en aromathérapie et en fleurs de Bach.",
  },
  'about.bio2': {
    es: 'Profesor certificado de Yoga, meditaciones y sonoterapias, con una década de experiencia, trece años impartiendo talleres de inteligencia emocional y soluciones humanas, entrenado en diagnósticos con resonancia electromagnética.',
    en: 'Certified teacher of Yoga, meditations and sound therapies with a decade of experience, thirteen years leading workshops on emotional intelligence and human solutions, trained in diagnostics using electromagnetic resonance.',
    fr: "Professeur certifié de yoga, de méditations et de sonothérapies, avec dix ans d'expérience, treize ans d'animation d'ateliers d'intelligence émotionnelle et de solutions humaines, formé aux diagnostics par résonance électromagnétique.",
  },
  'about.bio3': {
    es: 'Once años de experiencia como profesora de Yoga, e impartiendo meditaciones y sonoterapias guiadas, certificada desde hace seis años para terapias Reiki, y profesora de Pilates, administradora y guía de retiros espirituales, en el corazón del Arenal.',
    en: 'Eleven years of experience as a Yoga teacher, leading guided meditations and sound therapies, certified for Reiki therapies for six years, and a Pilates teacher, administrator and guide of spiritual retreats, in the heart of Arenal.',
    fr: "Onze ans d'expérience comme professeure de yoga, animant des méditations et des sonothérapies guidées, certifiée en thérapies Reiki depuis six ans, professeure de Pilates, administratrice et guide de retraites spirituelles, au cœur d'Arenal.",
  },

  'reviews.eyebrow': { es: 'Voces', en: 'Voices', fr: 'Voix' },
  'reviews.title': {
    es: 'Experiencias que dejan huella.',
    en: 'Experiences that leave a mark.',
    fr: 'Des expériences qui laissent leur empreinte.',
  },
  'reviews.pinned': { es: 'Fijada', en: 'Pinned', fr: 'Épinglée' },
  'reviews.leave': { es: 'Dejar reseña', en: 'Leave a review', fr: 'Laisser un avis' },
  'reviews.name': { es: 'Nombre', en: 'Name', fr: 'Nom' },
  'reviews.org': { es: 'Organización', en: 'Organization', fr: 'Organisation' },
  'reviews.orgPlaceholder': {
    es: 'Hotel, agencia o equipo',
    en: 'Hotel, agency or team',
    fr: 'Hôtel, agence ou équipe',
  },
  'reviews.rating': { es: 'Valoración', en: 'Rating', fr: 'Évaluation' },
  'reviews.review': { es: 'Reseña', en: 'Review', fr: 'Avis' },
  'reviews.submit': { es: 'Enviar reseña', en: 'Submit review', fr: "Envoyer l'avis" },
  'reviews.cancel': { es: 'Cancelar', en: 'Cancel', fr: 'Annuler' },
  'reviews.sending': { es: 'Enviando…', en: 'Sending…', fr: 'Envoi…' },
  'reviews.ok': {
    es: 'Gracias. Tu reseña quedó recibida y se publicará cuando la revisemos.',
    en: 'Thank you. Your review has been received and will be published once we review it.',
    fr: 'Merci. Ton avis a bien été reçu et sera publié après vérification.',
  },
  'reviews.error': {
    es: 'No pudimos guardar la reseña. Inténtalo de nuevo.',
    en: "We couldn't save the review. Please try again.",
    fr: "Nous n'avons pas pu enregistrer l'avis. Réessaie.",
  },

  'contact.eyebrow': {
    es: 'Construyamos una experiencia juntos',
    en: "Let's build an experience together",
    fr: 'Construisons une expérience ensemble',
  },
  'contact.title': {
    es: 'Tu próximo paso empieza aquí.',
    en: 'Your next step starts here.',
    fr: 'Ton prochain pas commence ici.',
  },
  'contact.intro': {
    es: 'Cuéntanos si buscas un servicio para tu hotel, una agencia o un retiro. Si dejas un correo de aviso en el panel interno, también llega una notificación.',
    en: 'Tell us if you are looking for a service for your hotel, an agency or a retreat. If you leave a notice email in the internal panel, a notification also arrives.',
    fr: "Dis-nous si tu cherches un service pour ton hôtel, une agence ou une retraite. Si tu laisses un e-mail d'avis dans le panneau interne, une notification arrive aussi.",
  },
  'contact.name': { es: 'Nombre', en: 'Name', fr: 'Nom' },
  'contact.email': { es: 'Correo', en: 'Email', fr: 'E-mail' },
  'contact.org': { es: 'Organización', en: 'Organization', fr: 'Organisation' },
  'contact.orgPlaceholder': { es: 'Hotel, agencia, equipo', en: 'Hotel, agency, team', fr: 'Hôtel, agence, équipe' },
  'contact.interest': { es: 'Interés', en: 'Interest', fr: 'Intérêt' },
  'contact.general': { es: 'Consulta general', en: 'General inquiry', fr: 'Demande générale' },
  'contact.affiliate': { es: 'Afiliado de retiros', en: 'Retreat affiliate', fr: 'Affilié des retraites' },
  'contact.event': { es: 'Evento', en: 'Event', fr: 'Événement' },
  'contact.message': { es: 'Mensaje', en: 'Message', fr: 'Message' },
  'contact.submit': { es: 'Enviar aviso', en: 'Send notice', fr: "Envoyer l'avis" },
  'contact.sending': { es: 'Enviando…', en: 'Sending…', fr: 'Envoi…' },
  'contact.ok': {
    es: 'Recibimos tu mensaje. Te escribiremos para continuar la conversación.',
    en: 'We received your message. We will write to you to continue the conversation.',
    fr: 'Nous avons reçu ton message. Nous t’écrirons pour poursuivre la conversation.',
  },
  'contact.error': {
    es: 'No pudimos enviar el formulario. Revisa los datos e inténtalo otra vez.',
    en: "We couldn't send the form. Check the details and try again.",
    fr: "Nous n'avons pas pu envoyer le formulaire. Vérifie les données et réessaie.",
  },

  'services.eyebrow': { es: 'Para quien organiza', en: 'For those who organize', fr: 'Pour celles et ceux qui organisent' },
  'services.title': {
    es: 'Bienestar que transforma tu propuesta.',
    en: 'Wellbeing that transforms your offer.',
    fr: 'Un bien-être qui transforme ta proposition.',
  },
  'services.intro': {
    es: 'Hoteles, agencias de viajes y equipos que arman experiencias con propósito. Cada servicio se adapta a tu operación; el de retiros abre su propia página.',
    en: 'Hotels, travel agencies and teams that build experiences with purpose. Each service adapts to your operation; the retreats one opens its own page.',
    fr: "Hôtels, agences de voyages et équipes qui conçoivent des expériences porteuses de sens. Chaque service s'adapte à ton activité ; celui des retraites ouvre sa propre page.",
  },
  'services.seeRetreats': { es: 'Ver retiros', en: 'See retreats', fr: 'Voir les retraites' },
  'services.inquire': { es: 'Consultar', en: 'Inquire about', fr: 'Demander des informations :' },

  'retreats.eyebrow2': {
    es: 'Cuatro maneras de ir más adentro',
    en: 'Four ways to go deeper',
    fr: "Quatre façons d'aller plus profondément",
  },
  'retreats.title2': {
    es: 'Planes de 3 a 10 días. Precio por consultar.',
    en: '3 to 10-day plans. Price on request.',
    fr: 'Programmes de 3 à 10 jours. Prix sur demande.',
  },
  'retreats.days': { es: 'días', en: 'days', fr: 'jours' },
  'retreats.group': { es: 'Grupo', en: 'Group', fr: 'Groupe' },
  'retreats.focus': { es: 'Enfoque', en: 'Focus', fr: 'Orientation' },
  'retreats.price': { es: 'Precio', en: 'Price', fr: 'Prix' },
  'retreats.onRequest': { es: 'Por consultar', en: 'On request', fr: 'Sur demande' },
  'retreats.affiliate': {
    es: 'Quiero ser afiliado de retiros',
    en: 'I want to be a retreat affiliate',
    fr: 'Je veux devenir affilié des retraites',
  },
  'retreats.affiliateMessage': {
    es: 'Quiero suscribirme como afiliado de retiros y recibir un aviso cada vez que se organice uno nuevo.',
    en: 'I would like to subscribe as a retreat affiliate and receive a notice every time a new one is organized.',
    fr: 'Je souhaite m’inscrire comme affilié des retraites et recevoir un avis chaque fois qu’une nouvelle est organisée.',
  },
  'retreats.fallbackEyebrow': {
    es: 'Un viaje hacia dentro',
    en: 'A journey inward',
    fr: 'Un voyage vers l’intérieur',
  },
  'retreats.fallbackTitle': {
    es: 'Desconecta del ruido. Reconecta contigo.',
    en: 'Disconnect from the noise. Reconnect with yourself.',
    fr: 'Déconnecte-toi du bruit. Reconnecte-toi à toi-même.',
  },

  'cookies.aria': { es: 'Cookies', en: 'Cookies', fr: 'Cookies' },
  'cookies.text': {
    es: 'Usamos cookies necesarias para que el sitio funcione y, solo si lo permites, para medir visitas y anuncios.',
    en: 'We use cookies necessary for the site to work and, only if you allow it, to measure visits and ads.',
    fr: 'Nous utilisons des cookies nécessaires au fonctionnement du site et, uniquement si tu l’autorises, pour mesurer les visites et les annonces.',
  },
  'cookies.analytics': {
    es: 'Analítica — estadísticas propias de visitas.',
    en: 'Analytics — our own visit statistics.',
    fr: 'Analytique — statistiques de visites propres.',
  },
  'cookies.marketing': {
    es: 'Marketing — medición de anuncios.',
    en: 'Marketing — ad measurement.',
    fr: 'Marketing — mesure des annonces.',
  },
  'cookies.platform': {
    es: 'Analítica de la plataforma — Hostinger mejora la tienda sin identificarte.',
    en: 'Platform analytics — Hostinger improves the store without identifying you.',
    fr: 'Analytique de la plateforme — Hostinger améliore la boutique sans t’identifier.',
  },
  'cookies.reject': { es: 'Rechazar opcionales', en: 'Reject optional', fr: 'Refuser les optionnels' },
  'cookies.save': { es: 'Guardar elección', en: 'Save choice', fr: 'Enregistrer le choix' },
  'cookies.customize': { es: 'Personalizar', en: 'Customize', fr: 'Personnaliser' },
  'cookies.acceptAll': { es: 'Aceptar todas', en: 'Accept all', fr: 'Tout accepter' },
} satisfies Record<string, Entry>;

export type UiKey = keyof typeof ui;

const MONTHS: Record<Lang, string[]> = {
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
};

export function formatLongDate(iso: string | undefined, lang: Lang) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.getUTCDate();
  const month = MONTHS[lang][d.getUTCMonth()];
  const year = d.getUTCFullYear();
  if (lang === 'en') return `${month} ${day}, ${year}`;
  if (lang === 'fr') return `${day === 1 ? '1er' : day} ${month} ${year}`;
  return `${day} de ${month} de ${year}`;
}

/* ------------------------------------------------------------------ */
/* Servicios (data/services.ts)                                         */
/* ------------------------------------------------------------------ */

type ServiceCopy = { name: Entry; summary: Entry };

export const serviceCopy: Record<string, ServiceCopy> = {
  yoga: {
    name: { es: 'Clases de Yoga', en: 'Yoga Classes', fr: 'Cours de yoga' },
    summary: {
      es: 'Práctica consciente de Yoga para la carta, prácticas matutinas y diurnas, con enfoque en la reconexión con el cuerpo. Movimiento suave, horario fijo y un cierre que deja al huésped listo para el día.\n\nEl yoga no es solo un deporte y lejos de ser competitivo, busca traer tranquilidad y equilibrio entre el cuerpo y la mente, puede combinarse con meditaciones, sonoterapias y demás. Puede ofrecerse en privado y grupal.',
      en: 'Mindful Yoga practice for the menu of services, with morning and daytime sessions focused on reconnecting with the body. Gentle movement, a fixed schedule and a closing that leaves the guest ready for the day.\n\nYoga is not just a sport and, far from being competitive, it seeks to bring calm and balance between body and mind; it can be combined with meditations, sound therapies and more. It can be offered privately or in groups.',
      fr: "Pratique consciente du yoga pour la carte de services, avec des séances matinales et diurnes centrées sur la reconnexion avec le corps. Mouvement doux, horaire fixe et une clôture qui laisse l'hôte prêt pour la journée.\n\nLe yoga n'est pas seulement un sport et, loin d'être compétitif, il cherche à apporter calme et équilibre entre le corps et l'esprit ; il peut se combiner avec des méditations, des sonothérapies et plus encore. Il peut être proposé en privé ou en groupe.",
    },
  },
  meditacion: {
    name: { es: 'Meditaciones', en: 'Meditations', fr: 'Méditations' },
    summary: {
      es: 'Pausas guiadas sin mística forzada. Claridad, presencia y un silencio que se sostiene aunque el grupo sea nuevo.\nUna guía seria que busca traer a las personas a un espacio de silencio y paz real, lejos del estrés y las responsabilidades del mundo real, un verdadero descanso de la mente.',
      en: 'Guided pauses without forced mysticism. Clarity, presence and a silence that holds even when the group is new.\nA serious guide that seeks to bring people into a space of real silence and peace, far from the stress and responsibilities of the real world, a true rest for the mind.',
      fr: "Des pauses guidées sans mystique forcée. Clarté, présence et un silence qui se maintient même quand le groupe est nouveau.\nUn accompagnement sérieux qui cherche à conduire les personnes vers un espace de silence et de paix réels, loin du stress et des responsabilités du monde réel, un véritable repos de l'esprit.",
    },
  },
  sono: {
    name: { es: 'Sono Terapias', en: 'Sound Therapies', fr: 'Sonothérapies' },
    summary: {
      es: 'Una meditación ancestral, que más allá de encontrar la relajación por medio del silencio, la busca por medio del sonido, utilizando las vibraciones de cuencos tibetanos, gongs, palos de lluvia y otros instrumentos para llevar la frecuencia de tu cuerpo a un estado de completa relajación.',
      en: "An ancestral meditation that, beyond seeking relaxation through silence, seeks it through sound, using the vibrations of Tibetan bowls, gongs, rain sticks and other instruments to bring your body's frequency to a state of complete relaxation.",
      fr: "Une méditation ancestrale qui, au-delà de chercher la détente par le silence, la cherche par le son, en utilisant les vibrations de bols tibétains, de gongs, de bâtons de pluie et d'autres instruments pour amener la fréquence de ton corps à un état de relaxation complète.",
    },
  },
  cacao: {
    name: { es: 'Ceremonias de Cacao', en: 'Cacao Ceremonies', fr: 'Cérémonies de cacao' },
    summary: {
      es: 'Un ritual de conexión para inauguraciones, llegadas y círculos de equipo. Breve, cuidado y fácil de explicar a huéspedes que buscan significado, no espectáculo.\n\nEl objetivo es llevarlos atravéz del tiempo a una ceremonia ancestral, a un momento dónde los Mayas utilizaban el cacao como un medio para conectar con lo sagrado y profundizar en la introspección y sanación emocional.',
      en: 'A connection ritual for openings, arrivals and team circles. Brief, carefully crafted and easy to explain to guests who seek meaning, not spectacle.\n\nThe goal is to take them through time to an ancestral ceremony, to a moment when the Maya used cacao as a means to connect with the sacred and deepen introspection and emotional healing.',
      fr: "Un rituel de connexion pour les inaugurations, les arrivées et les cercles d'équipe. Bref, soigné et facile à expliquer à des hôtes qui cherchent du sens, pas du spectacle.\n\nL'objectif est de les emmener à travers le temps vers une cérémonie ancestrale, à un moment où les Mayas utilisaient le cacao comme moyen de se connecter au sacré et d'approfondir l'introspection et la guérison émotionnelle.",
    },
  },
  bosque: {
    name: { es: 'Baños de bosque', en: 'Forest Baths', fr: 'Bains de forêt' },
    summary: {
      es: 'Inmersión lenta entre árboles y niebla. La experiencia que diferencia un lodge de Arenal: el bienestar sale de la sala y entra al sendero.\n\nUn espacio para respirar el aire fresco, sentir tu piel en contacto con la tierra, la madera y el viento, para sentir nuevamente esa conexión con lo natural y lo auténtico que tanto cuesta encontrar hoy en día.',
      en: 'Slow immersion among trees and mist. The experience that sets an Arenal lodge apart: wellbeing leaves the room and enters the trail.\n\nA space to breathe fresh air, feel your skin in contact with the earth, the wood and the wind, to feel once again that connection with the natural and the authentic that is so hard to find these days.',
      fr: "Immersion lente parmi les arbres et la brume. L'expérience qui distingue un lodge d'Arenal : le bien-être quitte la salle et s'engage sur le sentier.\n\nUn espace pour respirer l'air frais, sentir ta peau en contact avec la terre, le bois et le vent, pour retrouver ce lien avec le naturel et l'authentique, si difficile à trouver aujourd'hui.",
    },
  },
  talleres: {
    name: { es: 'Talleres', en: 'Workshops', fr: 'Ateliers' },
    summary: {
      es: 'Encuentros participativos de autocuidado y salud emocional para equipos, agencias y staff de hotel. Contenido claro, duración acordada, sin jerga vacía.\n\nAlejado de promesas vacías, soluciones mágicas o sanaciones, estos talleres buscan traer a las personas nuevos métodos y puntos de vista, para mejorar su desempeño tanto en el ámbito vocacional, como en el personal y el social, basado en la bioenergética y la neurociencia.',
      en: 'Participatory sessions on self-care and emotional health for teams, agencies and hotel staff. Clear content, agreed duration, no empty jargon.\n\nFar from empty promises, magic solutions or healings, these workshops seek to bring people new methods and points of view to improve their performance in the vocational, personal and social spheres, based on bioenergetics and neuroscience.',
      fr: "Rencontres participatives d'auto-soin et de santé émotionnelle pour les équipes, les agences et le personnel hôtelier. Contenu clair, durée convenue, sans jargon creux.\n\nÀ l'écart des promesses vides, des solutions magiques ou des guérisons, ces ateliers cherchent à apporter aux personnes de nouvelles méthodes et de nouveaux points de vue pour améliorer leur performance dans les sphères professionnelle, personnelle et sociale, sur la base de la bioénergétique et des neurosciences.",
    },
  },
  retiros: {
    name: { es: 'Retiros', en: 'Retreats', fr: 'Retraites' },
    summary: {
      es: 'Estancias de 3 a 10 días que unen varios de estos servicios en un solo viaje. Para quién organiza y para los viajeros sin rutina, un camino guiado por el estilo de vida holístico para entender su verdadero significado y el propósito que tiene en tu vida, para quienes buscan más que solo una experiencia un verdadero aprendizaje.',
      en: 'Stays of 3 to 10 days that bring several of these services together in a single trip. For those who organize and for travelers without routine, a path guided by the holistic lifestyle to understand its true meaning and the purpose it holds in your life, for those who seek more than just an experience: real learning.',
      fr: "Séjours de 3 à 10 jours qui réunissent plusieurs de ces services en un seul voyage. Pour celles et ceux qui organisent et pour les voyageurs sans routine, un chemin guidé par le mode de vie holistique pour comprendre sa véritable signification et le sens qu'il a dans ta vie, pour ceux qui cherchent plus qu'une simple expérience : un véritable apprentissage.",
    },
  },
};

export function inquiryMessageFor(lang: Lang, name: string) {
  if (lang === 'en')
    return `Hello, I represent an organization and I'm interested in integrating ${name} into our offering. I would like to discuss format, group and availability.`;
  if (lang === 'fr')
    return `Bonjour, je représente une organisation et je souhaite intégrer ${name} à notre offre. J'aimerais discuter du format, du groupe et des disponibilités.`;
  return `Hola, represento una organización y me interesa integrar ${name} en nuestra oferta. Quisiera conversar sobre formato, grupo y disponibilidad.`;
}

/* ------------------------------------------------------------------ */
/* Contenido que viene de la base de datos (blog, retiros, textos)      */
/* ------------------------------------------------------------------ */
/**
 * Se traduce por coincidencia exacta con el texto en español. Si alguien edita
 * un texto desde el panel y ya no coincide, se muestra tal cual (en español)
 * en vez de mostrar una traducción desactualizada.
 */
const dynamic: Entry[] = [
  // Blog
  { es: 'Aromaterapia Floral', en: 'Floral Aromatherapy', fr: 'Aromathérapie florale' },
  {
    es: 'Una combinación de esencias y aromas única para cada caso, fórmulas creadas a la medida.',
    en: 'A unique combination of essences and aromas for each case, custom-made formulas.',
    fr: 'Une combinaison unique d’essences et d’arômes pour chaque cas, des formules créées sur mesure.',
  },
  {
    es: 'Creadas por el médico Edward Bach, las Flores de Bach son un sistema de 38 remedios naturales elaborados a partir de infusiones solares de flores silvestres. Operan a un nivel vibratorio o energético para reequilibrar estados emocionales negativos —como el miedo o la apatía— y estimular la capacidad de autocuración del cuerpo.',
    en: 'Created by the physician Edward Bach, Bach Flower Remedies are a system of 38 natural remedies made from solar infusions of wild flowers. They work on a vibrational or energetic level to rebalance negative emotional states —such as fear or apathy— and stimulate the body’s capacity for self-healing.',
    fr: 'Créées par le médecin Edward Bach, les fleurs de Bach forment un système de 38 remèdes naturels élaborés à partir d’infusions solaires de fleurs sauvages. Elles agissent à un niveau vibratoire ou énergétique pour rééquilibrer les états émotionnels négatifs —comme la peur ou l’apathie— et stimuler la capacité d’autoguérison du corps.',
  },
  { es: 'Taller de Soluciones Humanas', en: 'Human Solutions Workshop', fr: 'Atelier de Solutions Humaines' },
  {
    es: 'Arenal Holístico comparte sus secretos para el equilibrio y la excelencia.',
    en: 'Arenal Holístico shares its secrets for balance and excellence.',
    fr: 'Arenal Holístico partage ses secrets pour l’équilibre et l’excellence.',
  },
  {
    es: 'Un taller de 16 horas que ha ayudado a guiar a las personas a sentirse cómodas con sus relaciones sociales y laborales, para entender cómo pueden exprimir su máximo potencial de manera sana y dar lo mejor de sí incluso en los detalles más pequeños, y como esto impacta positivamente tanto en el área vocacional, como en el área personal.',
    en: 'A 16-hour workshop that has helped guide people to feel comfortable in their social and work relationships, to understand how they can draw out their full potential in a healthy way and give their best even in the smallest details, and how this positively impacts both the vocational and the personal spheres.',
    fr: 'Un atelier de 16 heures qui a aidé à guider les personnes à se sentir à l’aise dans leurs relations sociales et professionnelles, à comprendre comment elles peuvent exploiter leur plein potentiel de manière saine et donner le meilleur d’elles-mêmes jusque dans les plus petits détails, et comment cela a un impact positif tant sur le plan professionnel que personnel.',
  },
  { es: 'Cacao para la conexión', en: 'Cacao for Connection', fr: 'Cacao pour la connexion' },
  { es: 'Cacao para grupos que aún no se conocen', en: 'Cacao for groups who don’t know each other yet', fr: 'Cacao pour des groupes qui ne se connaissent pas encore' },
  {
    es: 'Un ritual breve, sobrio y compartido, pensado para inauguraciones y llegadas.',
    en: 'A brief, sober, shared ritual designed for openings and arrivals.',
    fr: 'Un rituel bref, sobre et partagé, pensé pour les inaugurations et les arrivées.',
  },
  {
    es: 'La ceremonia de cacao que ofrecemos pide creencias. Pide presencia. Una taza, una intención y un círculo pequeño bastan para que un equipo de viaje empiece el día en el mismo ritmo. Unir y conectar a las personas por medio de un espacio para detenerse y compartir.',
    en: 'The cacao ceremony we offer asks for beliefs. It asks for presence. A cup, an intention and a small circle are enough for a travel team to start the day at the same rhythm. To unite and connect people through a space to pause and share.',
    fr: 'La cérémonie de cacao que nous proposons demande des croyances. Elle demande de la présence. Une tasse, une intention et un petit cercle suffisent pour qu’une équipe de voyage commence la journée au même rythme. Unir et relier les personnes à travers un espace pour s’arrêter et partager.',
  },
  {
    es: 'La ceremonia de cacao que ofrecemos a organizaciones no pide creencias. Pide presencia. Una taza, una intención y un círculo pequeño bastan para que un equipo de viaje empiece el día en el mismo ritmo.',
    en: 'The cacao ceremony we offer to organizations does not ask for beliefs. It asks for presence. A cup, an intention and a small circle are enough for a travel team to start the day at the same rhythm.',
    fr: 'La cérémonie de cacao que nous proposons aux organisations ne demande pas de croyances. Elle demande de la présence. Une tasse, une intention et un petit cercle suffisent pour qu’une équipe de voyage commence la journée au même rythme.',
  },
  { es: 'Yoga al amanecer, sin complicar el desayuno', en: 'Sunrise yoga, without complicating breakfast', fr: 'Yoga à l’aube, sans compliquer le petit-déjeuner' },
  {
    es: 'Una clase de 50 minutos que los hoteles pueden ofrecer antes del primer café.',
    en: 'A 50-minute class that hotels can offer before the first coffee.',
    fr: 'Un cours de 50 minutes que les hôtels peuvent proposer avant le premier café.',
  },
  {
    es: 'Horario fijo, grupo abierto a huéspedes y un instructor que conoce el clima de La Fortuna. Si llueve, la práctica se mueve bajo techo. Si sale el volcán, el silencio hace el resto.',
    en: 'A fixed schedule, a group open to guests and an instructor who knows the climate of La Fortuna. If it rains, the practice moves indoors. If the volcano shows itself, silence does the rest.',
    fr: 'Horaire fixe, groupe ouvert aux hôtes et un instructeur qui connaît le climat de La Fortuna. S’il pleut, la pratique se déplace à l’intérieur. Si le volcan se dévoile, le silence fait le reste.',
  },

  // Retiros: textos de página
  { es: 'Un viaje hacia dentro', en: 'A journey inward', fr: 'Un voyage vers l’intérieur' },
  {
    es: 'Desconecta del ruido. Reconecta contigo.',
    en: 'Disconnect from the noise. Reconnect with yourself.',
    fr: 'Déconnecte-toi du bruit. Reconnecte-toi à toi-même.',
  },
  {
    es: 'Los retiros de Arenal Holístico se arman con la naturaleza como sala principal. No vendemos un paquete cerrado: acompañamos a hoteles, agencias y organizadores a diseñar una estancia de 3 a 10 días, con grupo, locación y enfoque a la medida. También organizamos retiros propios en función de interesados, si quieres formar parte, afiliate a retiros y te tomaremos en cuenta para nuestras próximas fechas.',
    en: 'Arenal Holístico retreats are built with nature as the main room. We don’t sell a closed package: we work with hotels, agencies and organizers to design a stay of 3 to 10 days, with the group, location and focus tailored to measure. We also organize our own retreats based on interest; if you want to be part of one, join the retreat affiliates and we will take you into account for our upcoming dates.',
    fr: 'Les retraites d’Arenal Holístico se construisent avec la nature comme salle principale. Nous ne vendons pas un forfait fermé : nous accompagnons les hôtels, les agences et les organisateurs pour concevoir un séjour de 3 à 10 jours, avec un groupe, un lieu et une orientation sur mesure. Nous organisons aussi nos propres retraites en fonction des personnes intéressées ; si tu veux en faire partie, inscris-toi comme affilié des retraites et nous te prendrons en compte pour nos prochaines dates.',
  },
  {
    es: 'Los retiros de Arenal Holístico se arman con la naturaleza como sala principal. No vendemos un paquete cerrado: acompañamos a hoteles, agencias y organizadores a diseñar una estancia de 3 a 10 días, con grupo, locación y enfoque a la medida. El precio se consulta según fechas y tamaño.',
    en: 'Arenal Holístico retreats are built with nature as the main room. We don’t sell a closed package: we work with hotels, agencies and organizers to design a stay of 3 to 10 days, with the group, location and focus tailored to measure. Price is quoted according to dates and size.',
    fr: 'Les retraites d’Arenal Holístico se construisent avec la nature comme salle principale. Nous ne vendons pas un forfait fermé : nous accompagnons les hôtels, les agences et les organisateurs pour concevoir un séjour de 3 à 10 jours, avec un groupe, un lieu et une orientation sur mesure. Le prix se détermine selon les dates et la taille.',
  },

  // Retiros: planes
  { es: 'Pausa consciente', en: 'Mindful Pause', fr: 'Pause consciente' },
  { es: 'Bosque de La Fortuna', en: 'La Fortuna Forest', fr: 'Forêt de La Fortuna' },
  { es: 'Grupo íntimo, hasta 8 personas', en: 'Intimate group, up to 8 people', fr: 'Groupe intime, jusqu’à 8 personnes' },
  {
    es: 'Clases de Yoga, meditaciones y baños de bosque.',
    en: 'Yoga classes, meditations and forest baths.',
    fr: 'Cours de yoga, méditations et bains de forêt.',
  },
  { es: 'Yoga y meditación', en: 'Yoga and meditation', fr: 'Yoga et méditation' },
  {
    es: 'Tres amaneceres para soltar el ritmo de la ciudad. Práctica suave, silencio guiado y una caminata corta entre la niebla, sin internet ni .',
    en: 'Three sunrises to let go of the city’s pace. Gentle practice, guided silence and a short walk through the mist.',
    fr: 'Trois levers de soleil pour lâcher le rythme de la ville. Pratique douce, silence guidé et une courte marche dans la brume.',
  },
  {
    es: 'Tres amaneceres para soltar el ritmo de la ciudad. Práctica suave, silencio guiado y una caminata corta entre la niebla.',
    en: 'Three sunrises to let go of the city’s pace. Gentle practice, guided silence and a short walk through the mist.',
    fr: 'Trois levers de soleil pour lâcher le rythme de la ville. Pratique douce, silence guidé et une courte marche dans la brume.',
  },
  {
    es: 'Tres amaneceres para soltar el ritmo de la ciudad. Práctica suave, silencio guiado y una caminata corta entre la niebla. Ideal como escapada que un hotel o una agencia puede armar con poca logística.',
    en: 'Three sunrises to let go of the city’s pace. Gentle practice, guided silence and a short walk through the mist. Ideal as a getaway that a hotel or an agency can put together with little logistics.',
    fr: 'Trois levers de soleil pour lâcher le rythme de la ville. Pratique douce, silence guidé et une courte marche dans la brume. Idéal comme escapade qu’un hôtel ou une agence peut monter avec peu de logistique.',
  },
  { es: 'Raíces y conexión', en: 'Roots and Connection', fr: 'Racines et connexion' },
  { es: 'Finca rural cerca de Arenal', en: 'Rural farm near Arenal', fr: 'Ferme rurale près d’Arenal' },
  { es: 'Grupo pequeño, 8 a 12 personas', en: 'Small group, 8 to 12 people', fr: 'Petit groupe, de 8 à 12 personnes' },
  {
    es: 'Ceremonias de Cacao de apertura y cierre, Yoga y meditaciones.',
    en: 'Opening and closing Cacao Ceremonies, Yoga and meditations.',
    fr: 'Cérémonies de cacao d’ouverture et de clôture, yoga et méditations.',
  },
  { es: 'Cacao y baños de bosque', en: 'Cacao and forest baths', fr: 'Cacao et bains de forêt' },
  {
    es: 'Cinco días entre cafetales y shala de madera. El cacao abre el círculo; el bosque lo sostiene. Pensado para equipos que quieren una experiencia con sentido, no un incentivo genérico.',
    en: 'Five days among coffee plantations and a wooden shala. Cacao opens the circle; the forest holds it. Designed for teams who want a meaningful experience, not a generic incentive.',
    fr: 'Cinq jours entre plantations de café et shala en bois. Le cacao ouvre le cercle ; la forêt le soutient. Pensé pour les équipes qui veulent une expérience porteuse de sens, pas un incentive générique.',
  },
  { es: 'Armonía interior', en: 'Inner Harmony', fr: 'Harmonie intérieure' },
  { es: 'Lodge en la cordillera de Tilarán', en: 'Lodge in the Tilarán mountain range', fr: 'Lodge dans la cordillère de Tilarán' },
  { es: 'Grupo mediano, 12 a 18 personas', en: 'Medium group, 12 to 18 people', fr: 'Groupe moyen, de 12 à 18 personnes' },
  {
    es: 'Clases de Yoga, Sonoterapia y talleres',
    en: 'Yoga classes, Sound Therapy and workshops',
    fr: 'Cours de yoga, sonothérapie et ateliers',
  },
  { es: 'Sonoterapia y talleres', en: 'Sound Therapy and workshops', fr: 'Sonothérapie et ateliers' },
  {
    es: 'Una semana en el bosque nuboso. Las tardes son de cuencos y talleres de autocuidado; las mañanas, de práctica y escritura. Precio por consultar según temporada y tamaño del grupo.',
    en: 'One week in the cloud forest. Afternoons are for bowls and self-care workshops; mornings, for practice and writing. Price on request, depending on season and group size.',
    fr: 'Une semaine dans la forêt de nuages. Les après-midi sont consacrés aux bols et aux ateliers d’auto-soin ; les matins, à la pratique et à l’écriture. Prix sur demande selon la saison et la taille du groupe.',
  },
  { es: 'Renacer natural', en: 'Natural Rebirth', fr: 'Renaissance naturelle' },
  { es: 'Eco-lodge privado junto al río', en: 'Private eco-lodge by the river', fr: 'Éco-lodge privé au bord de la rivière' },
  { es: 'Grupo privado, hasta 14 personas', en: 'Private group, up to 14 people', fr: 'Groupe privé, jusqu’à 14 personnes' },
  { es: 'Experiencia holística integral', en: 'Complete holistic experience', fr: 'Expérience holistique intégrale' },
  {
    es: 'Diez días para quienes organizan un retiro completo: yoga, meditación, sonido, cacao, bosque y talleres en un solo hilo. Locación reservada, ritmo lento y acompañamiento de principio a fin.',
    en: 'Ten days for those organizing a full retreat: yoga, meditation, sound, cacao, forest and workshops woven into a single thread. Reserved location, slow pace and accompaniment from start to finish.',
    fr: 'Dix jours pour celles et ceux qui organisent une retraite complète : yoga, méditation, son, cacao, forêt et ateliers, d’un seul fil. Lieu réservé, rythme lent et accompagnement du début à la fin.',
  },
];

const dynamicIndex = new Map(dynamic.map(entry => [entry.es.trim(), entry]));

/* ------------------------------------------------------------------ */
/* Contexto                                                             */
/* ------------------------------------------------------------------ */

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: UiKey) => string;
  /** Traduce un texto en español que viene de la base de datos, si se conoce. */
  tx: (text: string | undefined) => string;
};

const LangContext = createContext<LangContextValue>({
  lang: 'es',
  setLang: () => {},
  t: key => ui[key].es,
  tx: text => text ?? '',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // El servidor y la primera pintura del cliente usan español (idioma original);
  // la preferencia guardada se aplica justo después de hidratar.
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en' || saved === 'fr') setLangState(saved);
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      t: key => ui[key][lang],
      tx: text => {
        if (!text) return '';
        if (lang === 'es') return text;
        const hit = dynamicIndex.get(text.trim());
        return hit ? hit[lang] : text;
      },
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

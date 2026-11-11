import { useLang, type UiKey } from '@/lib/i18n';

// Direcciones de las 3 fotos, en este orden. Si subes las fotos como imágenes
// del sitio, reemplaza cada dirección por la URL de la foto correspondiente.
const PHOTOS = ['/team/equipo-1.jpg', '/team/equipo-2.jpg', '/team/equipo-3.jpg'];

const team: { name: string; bio: UiKey }[] = [
  { name: 'Griselda Flores Gris', bio: 'about.bio1' },
  { name: 'Rafael Goldblatt Novoa', bio: 'about.bio2' },
  { name: 'Ana Carballo Vargas', bio: 'about.bio3' },
];

export function About() {
  const { t } = useLang();
  return (
    <section className="about" id="nosotros">
      <div className="about-head">
        <p className="eyebrow">{t('about.eyebrow')}</p>
        <h2>{t('about.title')}</h2>
        <p>{t('about.intro')}</p>
      </div>
      <ul className="about-team">
        {team.map((member, index) => (
          <li key={member.name} tabIndex={0}>
            <img src={PHOTOS[index]} alt={member.name} width={600} height={600} loading="lazy" />
            <h3>{member.name}</h3>
            <p className="about-bio">{t(member.bio)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

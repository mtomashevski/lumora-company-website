import { company } from '../../data/company';
import { useLanguage } from '../../i18n/LanguageContext';
import { Image } from '../common/Image';
import { ExternalLink } from '../common/ExternalLink';
export function Directors() {
  const { t, l } = useLanguage();
  return (
    <section className="container directors-section">
      <span className="eyebrow">{t('team.eye')}</span>
      <h2>{t('team.title')}</h2>
      <div className="directors-grid">
        {company.directors.map((person) => (
          <article key={person.id} className="director-card">
            {person.photo && <Image src={person.photo.src} alt={l(person.photo.alt)} />}
            <div>
              <h3>{person.name}</h3>
              <p>{l(person.role)}</p>
              {person.biography && <p>{l(person.biography)}</p>}
              {person.profileUrl && <ExternalLink href={person.profileUrl} label={person.name} />}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

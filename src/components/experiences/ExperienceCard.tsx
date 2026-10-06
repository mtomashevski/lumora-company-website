import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import type { Experience } from '../../types/experience';
import { destinationName } from '../../data/experiences';
import { useLanguage } from '../../i18n/LanguageContext';
import { Image } from '../common/Image';
export function ExperienceCard({
  experience: e,
  headingLevel = 3,
  routePrefix = '',
}: {
  experience: Experience;
  headingLevel?: 2 | 3;
  routePrefix?: string;
}) {
  const { t, l } = useLanguage();
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="experience-card">
      <Link
        to={routePrefix + '/experiences/' + e.slug}
        className="card-image"
        aria-label={l(e.title)}
      >
        <Image src={e.heroImage.src} alt={l(e.heroImage.alt)} position={e.heroImage.position} />
        <span className="image-tag">{t(`category.${e.category}`)}</span>
        <span className="card-arrow">
          <ArrowUpRight size={21} />
        </span>
      </Link>
      <div className="card-body">
        <div className="meta">
          <span>
            <MapPin size={14} />
            {l(destinationName(e.destination))}
          </span>
          <span>
            <Clock size={14} />
            {l(e.duration)}
          </span>
        </div>
        <Heading className="card-title">
          <Link to={routePrefix + '/experiences/' + e.slug}>{l(e.title)}</Link>
        </Heading>
        <p>{l(e.shortDescription)}</p>
        <div className="card-bottom">
          <span>
            {e.priceFrom !== undefined
              ? t('common.from', { price: e.priceFrom })
              : e.priceLabel
                ? l(e.priceLabel)
                : t('common.priceRequest')}
          </span>
          <Link to={routePrefix + '/experiences/' + e.slug} className="card-details">
            {t('detail.eye')}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

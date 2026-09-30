import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { destinations } from '../data/experiences';
import { Image } from '../components/common/Image';
import { InquiryCTA } from '../components/common/InquiryCTA';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../i18n/LanguageContext';
export default function Destinations() {
  const { t, l } = useLanguage();
  usePageMeta(t('destinations.metaTitle'), t('destinations.metaDescription'));
  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">{t('destinations.eye')}</span>
        <h1>{t('destinations.title')}</h1>
        <p>{t('destinations.intro')}</p>
      </section>
      <section className="container destinations-page">
        <div className="destination-grid">
          {destinations.map((d) => (
            <Link className="destination-tile" key={d.id} to={'/experiences?destination=' + d.id}>
              <Image src={d.image.src} alt={l(d.image.alt)} position={d.image.position} />
              <div>
                <span>
                  {t(d.count === 1 ? 'common.countOne' : 'common.countMany', { count: d.count })}
                </span>
                <h2>{l(d.name)}</h2>
              </div>
              <ArrowUpRight className="destination-arrow" />
            </Link>
          ))}
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}

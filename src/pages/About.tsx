import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { photos } from '../data/experiences';
import { Image } from '../components/common/Image';
import { InquiryCTA } from '../components/common/InquiryCTA';
import { Directors } from '../components/about/Directors';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../i18n/LanguageContext';
export default function About() {
  const { t } = useLanguage();
  usePageMeta(t('about.metaTitle'), t('about.metaDescription'));
  return (
    <>
      <section className="container about-lead">
        <div>
          <span className="eyebrow">{t('about.eye')}</span>
          <h1>{t('about.title')}</h1>
          <p>{t('about.intro')}</p>
          <p>{t('about.purpose')}</p>
          <Link className="button" to="/contact">
            {t('about.conversation')}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="about-photo">
          <Image src={photos.about.src} alt={t('alt.about')} eager />
          <span>{t('about.photoCaption')}</span>
        </div>
      </section>
      <section className="section container about-story">
        <span className="eyebrow">{t('about.storyEye')}</span>
        <h2>{t('about.storyTitle')}</h2>
        <p>{t('about.storyText')}</p>
        <p>{t('about.storySecond')}</p>
      </section>
      <Directors />
      <InquiryCTA />
    </>
  );
}

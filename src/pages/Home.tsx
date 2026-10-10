import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Compass, Heart, Route, MapPin } from 'lucide-react';
import { experiences, destinations, photos } from '../data/experiences';
import { useLanguage } from '../i18n/LanguageContext';
import { Image } from '../components/common/Image';
import { SectionHeading } from '../components/common/SectionHeading';
import { ExperienceCard } from '../components/experiences/ExperienceCard';
import { InquiryCTA } from '../components/common/InquiryCTA';
import { usePageMeta } from '../hooks/usePageMeta';
export default function Home() {
  const { t, l } = useLanguage();
  usePageMeta(t('home.metaTitle'), t('home.metaDescription'));
  return (
    <>
      <section className="hero">
        <Image src={photos.hero.src} alt={t('alt.hero')} eager />
        <div className="hero-shade" />
        <div className="container hero-content">
          <span className="eyebrow hero-eyebrow">
            <span />
            {t('home.eyebrow')}
          </span>
          <h1>
            {t('home.titleFirst')}
            <br />
            {t('home.titleSecond')} <em>Lumora.</em>
          </h1>
          <p>
            {t('home.intro')}
            <br className="desktop-break" /> {t('home.introSecond')}
          </p>
          <div className="hero-actions">
            <Link to="/experiences" className="button button-light">
              {t('common.explore')}
              <ArrowUpRight aria-hidden="true" size={19} />
            </Link>
            <Link to="/about" className="hero-story">
              {t('common.meet')}
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
        <div className="container hero-bottom">
          <span>
            <MapPin aria-hidden="true" size={16} />
            {t('home.location')}
          </span>
          <a href="#featured" aria-label={`${t('home.scroll')} — ${t('home.scrollLabel')}`}>
            {t('home.scroll')}
            <ArrowDown aria-hidden="true" size={17} />
          </a>
        </div>
      </section>
      <div className="intro-strip container">
        <span>
          {t('home.stripFirst')} <em>{t('home.stripEm')}</em>
        </span>
        <p>{t('home.stripText')}</p>
      </div>
      <section id="featured" className="section container">
        <SectionHeading
          eyebrow={t('home.featuredEye')}
          title={t('home.featuredTitle')}
          text={t('home.featuredText')}
          link={{ to: '/experiences', label: t('common.all') }}
        />
        <div className="cards-grid">
          {experiences
            .filter((e) => e.featured)
            .map((e) => (
              <ExperienceCard key={e.id} experience={e} />
            ))}
        </div>
      </section>
      <section className="destinations-section">
        <div className="container section">
          <SectionHeading
            eyebrow={t('home.destinationEye')}
            title={t('home.destinationTitle')}
            text={t('home.destinationText')}
            link={{ to: '/destinations', label: t('home.destinationsLink') }}
          />
          <div className="destination-grid">
            {['ohrid', 'matka', 'skopje']
              .map((id) => destinations.find((d) => d.id === id)!)
              .map((d, i) => (
                <Link
                  key={d.id}
                  className={'destination-tile tile-' + i}
                  to={'/experiences?destination=' + d.id}
                >
                  <Image src={d.image.src} alt={l(d.image.alt)} position={d.image.position} />
                  <div>
                    <span>{t('home.destinationTag')}</span>
                    <h3>{l(d.name)}</h3>
                  </div>
                  <ArrowUpRight aria-hidden="true" className="destination-arrow" />
                </Link>
              ))}
          </div>
        </div>
      </section>
      <section className="section container why-section">
        <div>
          <span className="eyebrow">{t('home.whyEye')}</span>
          <h2>{t('home.whyTitle')}</h2>
          <p>{t('home.whyText')}</p>
          <Link to="/about" className="text-link">
            {t('common.learn')}
            <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="values">
          {[
            { Icon: Compass, title: t('home.value1Title'), text: t('home.value1Text') },
            { Icon: Heart, title: t('home.value2Title'), text: t('home.value2Text') },
            { Icon: Route, title: t('home.value3Title'), text: t('home.value3Text') },
          ].map(({ Icon, title, text }) => (
            <div className="value" key={title}>
              <span className="value-icon">
                <Icon aria-hidden="true" size={23} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="inspiration">
        <Image src={photos.inspiration.src} alt={t('alt.inspiration')} sizes="100vw" />
        <div className="container">
          <span className="eyebrow">{t('home.inspirationEye')}</span>
          <h2>{t('home.inspirationTitle')}</h2>
          <p>{t('home.inspirationText')}</p>
          <Link className="button button-light" to="/experiences?category=nature-adventure">
            {t('home.outdoor')}
            <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
      <section className="section container">
        <SectionHeading eyebrow={t('home.stepsEye')} title={t('home.stepsTitle')} />
        <div className="steps">
          {([1, 2, 3] as const).map((n) => (
            <div key={n}>
              <span>0{n}</span>
              <h3>{t(`home.step${n}Title`)}</h3>
              <p>{t(`home.step${n}Text`)}</p>
            </div>
          ))}
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}

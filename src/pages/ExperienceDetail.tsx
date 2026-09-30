import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Languages, Footprints, Check, MapPin } from 'lucide-react';
import { experiences, destinationName } from '../data/experiences';
import { company } from '../data/company';
import { Image } from '../components/common/Image';
import { ExternalLink } from '../components/common/ExternalLink';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../i18n/LanguageContext';
import NotFound from './NotFound';
export default function ExperienceDetail() {
  const { t, l } = useLanguage();
  const { slug } = useParams();
  const e = experiences.find((e) => e.slug === slug);
  usePageMeta(
    e ? l(e.title) : t('notFound.metaTitle'),
    e ? l(e.shortDescription) : t('notFound.metaDescription'),
    !e,
  );
  if (!e) return <NotFound />;
  const meta = [
    { Icon: Clock, label: t('detail.duration'), value: l(e.duration) },
    {
      Icon: MapPin,
      label: t('detail.locations'),
      value: e.locations.map((id) => l(destinationName(id))).join(' · '),
    },
    ...(e.languages
      ? [{ Icon: Languages, label: t('detail.languages'), value: l(e.languages) }]
      : []),
    ...(e.groupSize ? [{ Icon: Users, label: t('detail.group'), value: l(e.groupSize) }] : []),
    ...(e.activityLevel
      ? [{ Icon: Footprints, label: t('detail.activity'), value: l(e.activityLevel) }]
      : []),
  ];
  return (
    <>
      <section className="container detail-header">
        <Link className="text-link" to="/experiences">
          <ArrowLeft size={16} />
          {t('common.all')}
        </Link>
        <div className="detail-title">
          <div>
            <span className="eyebrow">
              {l(destinationName(e.destination))} · {t(`category.${e.category}`)}
            </span>
            <h1>{l(e.title)}</h1>
          </div>
        </div>
        <Image
          key={e.heroImage.src}
          className="detail-hero"
          src={e.heroImage.src}
          alt={l(e.heroImage.alt)}
          position={e.heroImage.position}
          eager
        />
        <div className="detail-meta">
          {meta.map(({ Icon, label, value }) => (
            <div key={label}>
              <Icon size={20} />
              <div>
                <span>{label}</span>
                <p>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="container detail-layout">
        <div>
          <section>
            <span className="eyebrow">{t('detail.eye')}</span>
            <h2>{t('detail.title')}</h2>
            <p>{l(e.description)}</p>
          </section>
          {e.highlights.length > 0 && (
            <section>
              <h2>{t('detail.highlights')}</h2>
              <ul className="highlights">
                {e.highlights.map((h) => (
                  <li key={h.en}>
                    <Check size={18} />
                    {l(h)}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {e.itinerary?.length && (
            <section>
              <h2>{t('detail.itinerary')}</h2>
              <div className="itinerary">
                {e.itinerary.map((item, i) => (
                  <div key={item.title.en}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{l(item.title)}</h3>
                      <p>{l(item.description)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="availability-note">{t('detail.itineraryNote')}</p>
            </section>
          )}
          {(e.included?.length || e.notIncluded?.length) && (
            <section className="included-grid">
              {e.included?.length && (
                <div>
                  <h2>{t('detail.included')}</h2>
                  <ul>
                    {e.included.map((item) => (
                      <li key={item.en}>{l(item)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {e.notIncluded?.length && (
                <div>
                  <h2>{t('detail.notIncluded')}</h2>
                  <ul>
                    {e.notIncluded.map((item) => (
                      <li key={item.en}>{l(item)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
          {e.meetingPoint && (
            <section>
              <h2>{t('detail.meeting')}</h2>
              <p>
                <MapPin size={18} className="inline-icon" />
                {l(e.meetingPoint)}
              </p>
            </section>
          )}
          {e.gallery.length > 0 && (
            <section>
              <h2>{t('detail.gallery')}</h2>
              <div className="gallery">
                {e.gallery.map((p) => (
                  <Image key={p.src} src={p.src} alt={l(p.alt)} position={p.position} />
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="inquiry-panel">
          <span className="eyebrow">{t('detail.panelEye')}</span>
          <h2>{t('detail.panelTitle')}</h2>
          <p>{t('detail.panelText')}</p>
          <strong>
            {e.priceFrom !== undefined
              ? t('common.from', { price: e.priceFrom })
              : e.priceLabel
                ? l(e.priceLabel)
                : t('common.priceRequest')}
          </strong>
          <ExternalLink
            href={e.getYourGuideUrl || company.getYourGuideUrl}
            className="button"
            label={t(e.getYourGuideUrl ? 'common.booking' : 'common.provider')}
          />
          <Link className="text-link inquiry-secondary" to={'/contact?experience=' + e.slug}>
            {t('common.ask')}
          </Link>
          <p className="availability-note">{t('common.availability')}</p>
          <small>{t('detail.panelNote')}</small>
        </aside>
      </div>
    </>
  );
}

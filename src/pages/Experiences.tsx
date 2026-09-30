import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { experiences, destinations, categories } from '../data/experiences';
import { useLanguage } from '../i18n/LanguageContext';
import { ExperienceCard } from '../components/experiences/ExperienceCard';
import { InquiryCTA } from '../components/common/InquiryCTA';
import { usePageMeta } from '../hooks/usePageMeta';
export default function Experiences() {
  const { t, l } = useLanguage();
  const [params, setParams] = useSearchParams();
  usePageMeta(t('catalog.metaTitle'), t('catalog.metaDescription'));
  const destination = params.get('destination') || '';
  const category = params.get('category') || '';
  // Stable location/category IDs allow sharing filters and switching language without losing selection.
  const filtered = experiences.filter(
    (e) =>
      (!destination || e.locations.some((id) => id === destination)) &&
      (!category || e.categories.some((id) => id === category)),
  );
  function filter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }
  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">{t('catalog.eye')}</span>
        <h1>{t('catalog.title')}</h1>
        <p>{t('catalog.intro')}</p>
      </section>
      <section className="container catalog">
        <div className="filter-bar">
          <span>
            <SlidersHorizontal size={18} />
            {t('catalog.find')}
          </span>
          <div>
            <label>
              <span id="destination-filter-label">{t('catalog.destination')}</span>
              <select
                aria-labelledby="destination-filter-label"
                value={destination}
                onChange={(e) => filter('destination', e.target.value)}
              >
                <option value="">{t('catalog.allDestinations')}</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {l(d.name)}
                  </option>
                ))}
                {destination && !destinations.some((d) => d.id === destination) && (
                  <option value={destination}>{destination}</option>
                )}
              </select>
            </label>
            <label>
              <span id="category-filter-label">{t('catalog.style')}</span>
              <select
                aria-labelledby="category-filter-label"
                value={category}
                onChange={(e) => filter('category', e.target.value)}
              >
                <option value="">{t('catalog.allStyles')}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {t(`category.${c}`)}
                  </option>
                ))}
                {category && !categories.some((c) => c === category) && (
                  <option value={category}>{category}</option>
                )}
              </select>
            </label>
          </div>
        </div>
        <div className="catalog-caption">
          <p>{t('catalog.note')}</p>
          <span aria-live="polite">
            {t(filtered.length === 1 ? 'common.countOne' : 'common.countMany', {
              count: filtered.length,
            })}
          </span>
        </div>
        {filtered.length ? (
          <div className="cards-grid">
            {filtered.map((e) => (
              <ExperienceCard key={e.id} experience={e} headingLevel={2} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>{t('catalog.emptyTitle')}</h2>
            <p>{t('catalog.emptyText')}</p>
            <button className="button" onClick={() => setParams({})}>
              {t('catalog.clear')}
              <ArrowUpRight size={17} />
            </button>
          </div>
        )}
      </section>
      <InquiryCTA />
    </>
  );
}

import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../i18n/LanguageContext';
export default function NotFound() {
  const { t } = useLanguage();
  usePageMeta(t('notFound.metaTitle'), t('notFound.metaDescription'), true);
  return (
    <section className="container not-found">
      <Compass aria-hidden="true" size={56} />
      <span className="eyebrow">{t('notFound.eye')}</span>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.text')}</p>
      <div>
        <Link className="button" to="/experiences">
          {t('common.explore')}
          <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
        <Link className="text-link" to="/">
          {t('common.backHome')}
        </Link>
      </div>
    </section>
  );
}

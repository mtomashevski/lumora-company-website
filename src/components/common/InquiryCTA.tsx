import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
export function InquiryCTA() {
  const { t } = useLanguage();
  return (
    <section className="container inquiry-cta">
      <div>
        <span className="eyebrow">{t('cta.eye')}</span>
        <h2>{t('cta.title')}</h2>
        <p>{t('cta.text')}</p>
      </div>
      <Link to="/contact" className="button button-light">
        {t('cta.button')}
        <ArrowUpRight size={18} />
      </Link>
    </section>
  );
}

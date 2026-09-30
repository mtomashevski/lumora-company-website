import { useLanguage } from '../../i18n/LanguageContext';
export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="language-selector" role="group" aria-label={t('nav.language')}>
      <button
        type="button"
        lang="en"
        aria-label="English"
        aria-pressed={language === 'en'}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        lang="mk"
        aria-label="Македонски"
        aria-pressed={language === 'mk'}
        onClick={() => setLanguage('mk')}
      >
        MK
      </button>
    </div>
  );
}

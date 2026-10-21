import { company, website } from '../data/company';
import { CompanyInformation } from '../components/common/CompanyInformation';
import { ExternalLink } from '../components/common/ExternalLink';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../i18n/LanguageContext';
import { CookieSettingsButton } from '../components/privacy/PrivacyControls';
export default function Privacy() {
  const { t } = useLanguage();
  usePageMeta(t('privacy.metaTitle'), t('privacy.metaDescription'));
  return (
    <article className="container legal-page">
      <span className="eyebrow">{t('privacy.eye')}</span>
      <h1>{t('privacy.title')}</h1>
      <p className="lead">{t('privacy.intro')}</p>
      <h2>{t('privacy.inquiryTitle')}</h2>
      <p>{t(website.inquiryEndpoint ? 'privacy.inquiryLive' : 'privacy.inquiryLocal')}</p>
      <h2>{t('privacy.languageTitle')}</h2>
      <p>{t('privacy.languageText')}</p>
      <h2>{t('privacy.cookiesTitle')}</h2>
      <p>{t('privacy.cookiesText')}</p>
      <h2>{t('privacy.preferencesTitle')}</h2>
      <p>{t('privacy.preferencesText')}</p>
      <CookieSettingsButton />
      <h2>{t('privacy.externalTitle')}</h2>
      <p>{t('privacy.externalText')}</p>
      <h2>{t('privacy.questionsTitle')}</h2>
      <p>{t('privacy.questionsText')}</p>
      <ExternalLink href={company.instagramUrl} label={company.instagramHandle} />
      {company.email && (
        <p>
          <a href={'mailto:' + company.email}>{company.email}</a>
        </p>
      )}
      <CompanyInformation />
    </article>
  );
}

import { Mail, Phone, MapPin } from 'lucide-react';
import { company } from '../data/company';
import { InquiryForm } from '../components/contact/InquiryForm';
import { ExternalLink } from '../components/common/ExternalLink';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../i18n/LanguageContext';
export default function Contact() {
  const { t } = useLanguage();
  usePageMeta(t('contact.metaTitle'), t('contact.metaDescription'));
  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">{t('contact.eye')}</span>
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.intro')}</p>
      </section>
      <div className="container contact-layout">
        <aside>
          <h2>{t('contact.asideTitle')}</h2>
          <p>{t('contact.asideText')}</p>
          <div className="contact-details">
            <span>
              <MapPin aria-hidden="true" size={19} />
              {t('common.country')}
            </span>
            {company.email && (
              <a href={'mailto:' + company.email}>
                <Mail aria-hidden="true" size={19} />
                {company.email}
              </a>
            )}
            {company.phone && (
              <a href={'tel:' + company.phone}>
                <Phone aria-hidden="true" size={19} />
                {company.phone}
              </a>
            )}
            {company.whatsapp && (
              <ExternalLink
                href={'https://wa.me/' + company.whatsapp.replace(/\D/g, '')}
                label="WhatsApp"
              />
            )}
            <ExternalLink href={company.instagramUrl} label={company.instagramHandle} />
            <ExternalLink href={company.getYourGuideUrl} label={t('common.provider')} />
          </div>
          <div className="contact-process">
            <span className="eyebrow">{t('contact.next')}</span>
            <p>{t('contact.nextText')}</p>
          </div>
        </aside>
        <div className="form-panel">
          <InquiryForm />
        </div>
      </div>
    </>
  );
}

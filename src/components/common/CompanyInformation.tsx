import { company } from '../../data/company';
import { useLanguage } from '../../i18n/LanguageContext';
export function CompanyInformation() {
  const { t } = useLanguage();
  const address = company.registeredAddress;
  return (
    <section id="company-information" className="company-information">
      <h2>{t('legal.title')}</h2>
      <dl>
        <div>
          <dt>{t('legal.name')}</dt>
          <dd>{company.companyName}</dd>
        </div>
        <div>
          <dt>{t('legal.address')}</dt>
          <dd>
            <address>
              {address.street}
              <br />
              {address.postalCode} {address.city}
              <br />
              {address.region}
              <br />
              {address.country}
            </address>
          </dd>
        </div>
        <div>
          <dt>{t('legal.directors')}</dt>
          <dd>
            {company.directors.map((person) => (
              <span key={person.id}>
                {person.name}
                <br />
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt>{t('legal.registration')}</dt>
          <dd>{company.registrationNumber}</dd>
        </div>
      </dl>
    </section>
  );
}

import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { experiences } from '../../../src/data/experiences';
import { Image } from '../../../src/components/common/Image';
import { isLocale, contentLocale } from '../locales';
import { readServerConfig } from '../server/config.server';

export function loader({ params }: LoaderFunctionArgs) {
  const experience = experiences.find((tour) => tour.slug === params.slug);
  if (!experience || !isLocale(params.locale)) throw new Response('Not found', { status: 404 });
  const config = readServerConfig(process.env);
  return {
    locale: params.locale,
    contentLocale: contentLocale(params.locale),
    experience,
    canonical: `${config.siteOrigin}/${params.locale}/experiences/${experience.slug}`,
  };
}
export const meta: MetaFunction<typeof loader> = ({ data }) =>
  data
    ? [
        { title: `${data.experience.title[data.contentLocale]} | Lumora Company` },
        { name: 'description', content: data.experience.shortDescription[data.contentLocale] },
        { tagName: 'link', rel: 'canonical', href: data.canonical },
        // Only actual EN/MK content has alternate metadata. IT/TR are not translated pages yet.
        ...(['en', 'mk'] as const).map((locale) => ({
          tagName: 'link',
          rel: 'alternate',
          hrefLang: locale,
          href: data.canonical.replace(/\/(en|mk|it|tr)\//, `/${locale}/`),
        })),
      ]
    : [];
export default function Tour() {
  const { experience, locale, contentLocale: language } = useLoaderData<typeof loader>();
  return (
    <section className="container detail-header">
      <Link to={`/${locale}/`} className="text-link">
        All experiences
      </Link>
      {(locale === 'it' || locale === 'tr') && (
        <p role="note">English content fallback; translation review pending.</p>
      )}
      <div className="detail-title">
        <h1>{experience.title[language]}</h1>
      </div>
      <Image
        className="detail-hero"
        src={experience.heroImage.src}
        alt={experience.heroImage.alt[language]}
        eager
      />
      <p>{experience.description[language]}</p>
    </section>
  );
}

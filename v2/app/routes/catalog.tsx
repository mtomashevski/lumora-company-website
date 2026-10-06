import { useState } from 'react';
import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { experiences } from '../../../src/data/experiences';
import { ExperienceCard } from '../../../src/components/experiences/ExperienceCard';
import { isLocale, contentLocale } from '../locales';
import { readServerConfig } from '../server/config.server';
import { serverProof } from '../server/proof.server';

export function loader({ params }: LoaderFunctionArgs) {
  if (!isLocale(params.locale)) throw new Response('Not found', { status: 404 });
  const config = readServerConfig(process.env);
  return {
    locale: params.locale,
    contentLocale: contentLocale(params.locale),
    experience: experiences[0],
    canonical: `${config.siteOrigin}/${params.locale}/`,
    proof: serverProof(),
  };
}
export const meta: MetaFunction<typeof loader> = ({ data }) =>
  data
    ? [
        { title: `${data.experience.title[data.contentLocale]} | Lumora Company` },
        { name: 'description', content: data.experience.shortDescription[data.contentLocale] },
        { tagName: 'link', rel: 'canonical', href: data.canonical },
      ]
    : [];

export default function Catalog() {
  const { experience, locale, proof } = useLoaderData<typeof loader>();
  const [clicks, setClicks] = useState(0);
  return (
    <section className="section container">
      <p>Phase 1 isolated architecture validation. No booking services are connected.</p>
      {(locale === 'it' || locale === 'tr') && (
        <p role="note">
          English content fallback. Italian/Turkish translations require human review.
        </p>
      )}
      <h1>{experience.title[contentLocale(locale)]}</h1>
      <div className="cards-grid">
        <ExperienceCard experience={experience} headingLevel={2} routePrefix={`/${locale}`} />
      </div>
      <button type="button" className="button" onClick={() => setClicks((value) => value + 1)}>
        Hydration check: {clicks}
      </button>
      <output
        style={{ display: 'block', overflowWrap: 'anywhere' }}
        aria-label="Server execution proof"
      >
        {proof}
      </output>
    </section>
  );
}

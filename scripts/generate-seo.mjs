import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { loadEnv } from 'vite';
import { experiences, photos } from '../src/data/experiences.ts';
import { company } from '../src/data/company.ts';
import { en } from '../src/i18n/en.ts';
import { normalizeBasePath } from '../src/utils/deployment.ts';
const env = loadEnv('production', process.cwd(), 'VITE_');
const domain = (env.VITE_SITE_URL || '').replace(/\/$/, '');
const base = normalizeBasePath(env.VITE_BASE_PATH || '/');
if (domain) {
  const parsed = new URL(domain);
  if (
    !['http:', 'https:'].includes(parsed.protocol) ||
    parsed.origin !== domain ||
    parsed.username ||
    parsed.password
  )
    throw new Error('VITE_SITE_URL must be an absolute HTTP(S) origin.');
}
// English is the default crawlable language. React updates metadata when visitors switch to Macedonian.
const routes = [
  ['', en['home.metaTitle'], en['home.metaDescription']],
  ['experiences', en['catalog.metaTitle'], en['catalog.metaDescription']],
  ['destinations', en['destinations.metaTitle'], en['destinations.metaDescription']],
  ['about', en['about.metaTitle'], en['about.metaDescription']],
  ['contact', en['contact.metaTitle'], en['contact.metaDescription']],
  ['privacy', en['privacy.metaTitle'], en['privacy.metaDescription']],
  ...experiences.map((e) => ['experiences/' + e.slug, e.title.en, e.shortDescription.en]),
];
const source = await readFile('dist/index.html', 'utf8');
const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
for (const [route, title, description] of routes) {
  let html = source
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)} | ${company.companyName}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*/, `$1${escape(description)}`)
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*/,
      `$1${escape(title)} | ${company.companyName}`,
    )
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*/, `$1${escape(description)}`);
  if (domain) {
    const url = domain + base + route;
    const address = company.registeredAddress;
    const structured = {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: company.companyName,
      url: domain + base,
      sameAs: [company.instagramUrl, company.getYourGuideUrl],
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        postalCode: address.postalCode,
        addressLocality: address.city,
        addressRegion: address.region,
        addressCountry: 'MK',
      },
      identifier: {
        '@type': 'PropertyValue',
        name: 'Company registration number',
        value: company.registrationNumber,
      },
    };
    html = html.replace(
      '</head>',
      `<link rel="canonical" href="${escape(url)}"/><meta property="og:url" content="${escape(url)}"/><meta property="og:image" content="${domain}${base}${photos.hero.src.slice(1)}"/><script type="application/ld+json">${JSON.stringify(structured).replaceAll('<', '\\u003c')}</script></head>`,
    );
  }
  await mkdir('dist/' + route, { recursive: true });
  await writeFile('dist/' + (route ? route + '/' : '') + 'index.html', html);
}
if (domain) {
  await writeFile(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([route]) => `<url><loc>${escape(domain + base + route)}</loc></url>`).join('')}</urlset>`,
  );
  await writeFile(
    'dist/robots.txt',
    `User-agent: *\nAllow: /\nSitemap: ${domain}${base}sitemap.xml\n`,
  );
}
console.log(
  `Generated metadata HTML for ${routes.length} routes. ${domain ? 'Sitemap and canonical URLs generated.' : 'Set VITE_SITE_URL to generate sitemap and canonical URLs.'}`,
);

import type { LocalizedText } from '../i18n/types';
export interface Director {
  id: string;
  name: string;
  role: LocalizedText;
  photo?: { src: string; alt: LocalizedText };
  biography?: LocalizedText;
  profileUrl?: string;
}
// Only verified public business details belong here. Missing channels are simply hidden.
export const company = {
  companyName: 'Lumora Company',
  instagramHandle: '@lumoraadventures',
  instagramUrl: 'https://www.instagram.com/lumoraadventures/',
  getYourGuideUrl: 'https://www.getyourguide.com/lumora-company-s800323/',
  email: '',
  phone: '',
  whatsapp: '',
  registeredAddress: {
    street: '26 Boris Trajkovski 3',
    postalCode: '1000',
    city: 'Skopje',
    region: 'Greater Skopje',
    country: 'North Macedonia',
  },
  registrationNumber: '4058026555925',
  directors: [
    {
      id: 'stefanija',
      name: 'Stefanija Dimeska',
      role: { en: 'Managing director', mk: 'Управителка' },
    },
    { id: 'iva', name: 'Iva Arsova', role: { en: 'Managing director', mk: 'Управителка' } },
  ] as Director[],
  logo: '/images/brand/lumora-logo.png',
};
// Public build settings are separate so SEO generation can import the verified config in Node.
export const website = {
  siteUrl: import.meta.env?.VITE_SITE_URL || '',
  inquiryEndpoint: import.meta.env?.VITE_INQUIRY_ENDPOINT || '',
};

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { company, website } from '../data/company';
import { useLanguage } from '../i18n/LanguageContext';
import { publicAsset } from '../utils/deployment';
export function usePageMeta(title: string, description: string, noIndex = false) {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  useEffect(() => {
    document.title = `${title} | ${company.companyName}`;
    for (const [key, value] of Object.entries({
      description,
      'og:title': document.title,
      'og:description': description,
      'og:type': 'website',
      'og:locale': language === 'mk' ? 'mk_MK' : 'en_GB',
      robots: noIndex ? 'noindex, follow' : 'index, follow',
      ...(website.siteUrl
        ? {
            'og:url': website.siteUrl.replace(/\/$/, '') + publicAsset(pathname.replace(/\/+$/, '') + '/'),
            'og:image':
              website.siteUrl.replace(/\/$/, '') +
              publicAsset('/images/experiences/macedonian-heritage/image2.avif'),
          }
        : {}),
    })) {
      const attr = key.startsWith('og:') ? 'property' : 'name';
      let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.append(tag);
      }
      tag.content = value;
    }
    document.querySelector('link[rel="canonical"]')?.remove();
    if (website.siteUrl && !noIndex) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = website.siteUrl.replace(/\/$/, '') + publicAsset(pathname.replace(/\/+$/, '') + '/');
      document.head.append(link);
    }
  }, [title, description, pathname, noIndex, language]);
}

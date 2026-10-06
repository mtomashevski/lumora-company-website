export const locales = ['en', 'mk', 'it', 'tr'] as const;
export type Locale = (typeof locales)[number];
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.some((locale) => locale === value);
}
export function contentLocale(locale: Locale): 'en' | 'mk' {
  // IT/TR route support is proved here; translations are deliberately not invented.
  return locale === 'mk' ? 'mk' : 'en';
}

export type Language = 'en' | 'mk';
export type LocalizedText = Record<Language, string>;
export const localized = (en: string, mk: string): LocalizedText => ({ en, mk });

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { en, type TranslationKey } from './en';
import { mk } from './mk';
import type { Language, LocalizedText } from './types';
const storageKey = 'lumora-language';
function restoredLanguage(): Language {
  // Blocked storage must not prevent the website from loading.
  try {
    return localStorage.getItem(storageKey) === 'mk' ? 'mk' : 'en';
  } catch {
    return 'en';
  }
}
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (value: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  l: (text: LocalizedText) => string;
} | null>(null);
export function LanguageProvider({
  children,
  initialLanguage,
  persistPreference = true,
}: {
  children: ReactNode;
  initialLanguage?: Language;
  persistPreference?: boolean;
}) {
  const [language, setLanguage] = useState<Language>(() => initialLanguage ?? restoredLanguage());
  useEffect(() => {
    // An SSR route can own document language and persistence (including content fallbacks).
    if (!persistPreference) return;
    document.documentElement.lang = language;
    try {
      localStorage.setItem(storageKey, language);
    } catch {
      /* Switching still works when storage is disabled. */
    }
  }, [language, persistPreference]);
  const t = (key: TranslationKey, params: Record<string, string | number> = {}) =>
    Object.entries(params).reduce(
      (copy, [name, value]) => copy.replaceAll(`{${name}}`, String(value)),
      (language === 'mk' ? mk : en)[key],
    );
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, l: (text) => text[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageProvider is required');
  return context;
}

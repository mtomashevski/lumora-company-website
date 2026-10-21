export const privacyStorageKey = 'lumora-cookie-preferences';
export const privacyVersion = 1;
export interface PrivacyPreferences {
  version: 1;
  necessary: true;
  rememberLanguage: boolean;
  savedAt: string;
}

export function parsePrivacyPreferences(raw: string | null): PrivacyPreferences | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value !== 'object' ||
      value === null ||
      !('version' in value) ||
      value.version !== privacyVersion ||
      !('necessary' in value) ||
      value.necessary !== true ||
      !('rememberLanguage' in value) ||
      typeof value.rememberLanguage !== 'boolean' ||
      !('savedAt' in value) ||
      typeof value.savedAt !== 'string' ||
      !Number.isFinite(Date.parse(value.savedAt))
    )
      return null;
    return {
      version: privacyVersion,
      necessary: true,
      rememberLanguage: value.rememberLanguage,
      savedAt: value.savedAt,
    };
  } catch {
    return null;
  }
}

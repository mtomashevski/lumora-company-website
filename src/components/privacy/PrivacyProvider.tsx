import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import {
  parsePrivacyPreferences,
  privacyStorageKey,
  privacyVersion,
} from '../../utils/privacyPreferences';
import type { PrivacyPreferences } from '../../utils/privacyPreferences';

function restoredPreferences() {
  try {
    return parsePrivacyPreferences(localStorage.getItem(privacyStorageKey));
  } catch {
    return null;
  }
}
const PrivacyContext = createContext<{
  acknowledged: boolean;
  rememberLanguage: boolean;
  settingsOpen: boolean;
  storageUnavailable: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  savePreferences: (rememberLanguage: boolean) => void;
} | null>(null);

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(restoredPreferences);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  function savePreferences(rememberLanguage: boolean) {
    const next: PrivacyPreferences = {
      version: privacyVersion,
      necessary: true,
      rememberLanguage,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(privacyStorageKey, JSON.stringify(next));
      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }
    setPreferences(next);
  }
  return (
    <PrivacyContext.Provider
      value={{
        acknowledged: preferences !== null,
        rememberLanguage: preferences?.rememberLanguage ?? true,
        settingsOpen,
        storageUnavailable,
        openSettings: () => setSettingsOpen(true),
        closeSettings: () => setSettingsOpen(false),
        savePreferences,
      }}
    >
      {children}
    </PrivacyContext.Provider>
  );
}
export function usePrivacyPreferences() {
  const context = useContext(PrivacyContext);
  if (!context) throw new Error('PrivacyProvider is required');
  return context;
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { usePrivacyPreferences } from './PrivacyProvider';

export function CookieSettingsButton() {
  const { t } = useLanguage();
  const { openSettings, storageUnavailable } = usePrivacyPreferences();
  return (
    <>
      <button type="button" className="cookie-settings-button" onClick={openSettings}>
        {t('cookies.settings')}
      </button>
      {storageUnavailable && (
        <p className="privacy-save-status" role="status">
          {t('cookies.unavailable')}
        </p>
      )}
    </>
  );
}

export function PrivacyControls() {
  const { t } = useLanguage();
  const {
    acknowledged,
    rememberLanguage,
    settingsOpen,
    openSettings,
    closeSettings,
    savePreferences,
  } = usePrivacyPreferences();
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [draft, setDraft] = useState(rememberLanguage);
  useEffect(() => {
    if (settingsOpen) {
      setDraft(rememberLanguage);
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.current?.showModal();
    } else if (dialog.current?.open) {
      dialog.current.close();
      if (returnFocus.current?.isConnected) returnFocus.current.focus();
      else document.querySelector<HTMLButtonElement>('footer .cookie-settings-button')?.focus();
    }
  }, [settingsOpen, rememberLanguage]);
  return (
    <>
      {!acknowledged && (
        <section className="privacy-notice" aria-labelledby="privacy-notice-title">
          <h2 id="privacy-notice-title">{t('cookies.title')}</h2>
          <p>{t('cookies.notice')}</p>
          <div className="privacy-notice-actions">
            <button
              type="button"
              className="button"
              onClick={() => savePreferences(rememberLanguage)}
            >
              {t('cookies.acknowledge')}
            </button>
            <button type="button" className="button button-outline" onClick={openSettings}>
              {t('cookies.customize')}
            </button>
            <Link to="/privacy">{t('cookies.readPrivacy')}</Link>
          </div>
        </section>
      )}
      <dialog
        ref={dialog}
        className="privacy-dialog"
        aria-labelledby="privacy-settings-title"
        aria-describedby="privacy-settings-description"
        onCancel={(event) => {
          event.preventDefault();
          closeSettings();
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not([disabled]), input:not([disabled]), a[href]',
            ),
          );
          const first = controls[0],
            last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <div className="privacy-dialog-heading">
          <h2 id="privacy-settings-title">{t('cookies.settings')}</h2>
          <button
            type="button"
            className="privacy-close"
            aria-label={t('cookies.close')}
            onClick={closeSettings}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <p id="privacy-settings-description">{t('cookies.explanation')}</p>
        <div className="privacy-storage-detail">
          <h3>{t('cookies.necessaryTitle')}</h3>
          <p>{t('cookies.necessaryText')}</p>
        </div>
        <label className="privacy-language-choice">
          <input
            type="checkbox"
            checked={draft}
            onChange={(event) => setDraft(event.target.checked)}
          />
          <span>
            <strong>{t('cookies.rememberLanguage')}</strong>
            <small>{t('cookies.languageHelp')}</small>
          </span>
        </label>
        <p>{t('cookies.noTracking')}</p>
        <div className="privacy-dialog-actions">
          <button
            type="button"
            className="button"
            onClick={() => {
              savePreferences(draft);
              closeSettings();
            }}
          >
            {t('cookies.save')}
          </button>
          <Link to="/privacy" onClick={closeSettings}>
            {t('cookies.readPrivacy')}
          </Link>
        </div>
      </dialog>
    </>
  );
}

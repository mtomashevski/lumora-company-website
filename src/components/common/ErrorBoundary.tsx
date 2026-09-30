import { Component } from 'react';
import type { ReactNode } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
function ErrorFallback() {
  const { t } = useLanguage();
  return (
    <main className="container not-found">
      <h1>{t('error.title')}</h1>
      <p>{t('error.text')}</p>
      <a className="button" href="/">
        {t('error.return')}
      </a>
    </main>
  );
}
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <ErrorFallback /> : this.props.children;
  }
}

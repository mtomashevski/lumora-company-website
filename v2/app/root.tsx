import { useEffect } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLoaderData,
  useLocation,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { LanguageProvider } from '../../src/i18n/LanguageContext';
import { Brand } from '../../src/components/layout/Layout';
import { isLocale, locales, contentLocale } from './locales';
import '../../src/index.css';

export function loader({ params }: LoaderFunctionArgs) {
  return { locale: isLocale(params.locale) ? params.locale : ('en' as const) };
}

export default function Root() {
  const { locale } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.lang = locale;
    if (!isLocale(pathname.split('/')[1])) return;
    try {
      localStorage.setItem('lumora-language', locale);
    } catch {
      /* Preference is optional. */
    }
  }, [locale, pathname]);
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/images/brand/lumora-logo.png" />
        <Meta />
        <Links />
      </head>
      <body>
        <LanguageProvider
          key={locale}
          initialLanguage={contentLocale(locale)}
          persistPreference={false}
        >
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <header className="site-header">
            <div className="container nav-inner">
              <Link to={`/${locale}/`} aria-label="Lumora Company">
                <Brand />
              </Link>
              <nav aria-label="Language" className="language-selector" style={{ gap: '1rem' }}>
                {locales.map((language) => (
                  <Link
                    key={language}
                    lang={language}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      minHeight: 44,
                      fontSize: 14,
                    }}
                    aria-current={language === locale ? 'page' : undefined}
                    to={`/${language}${pathname.replace(/^\/(en|mk|it|tr)(?=\/|$)/, '') || '/'}`}
                  >
                    {language.toUpperCase()}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main id="main" lang={contentLocale(locale)} tabIndex={-1}>
            <Outlet />
          </main>
        </LanguageProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <title>{`${missing ? 'Page not found' : 'Unable to load page'} | Lumora Company`}</title>
        <Links />
      </head>
      <body>
        <main className="container not-found">
          <h1>{missing ? 'Page not found' : 'Unable to load this page'}</h1>
          <Link to="/en/">Return to Lumora</Link>
        </main>
        <Scripts />
      </body>
    </html>
  );
}

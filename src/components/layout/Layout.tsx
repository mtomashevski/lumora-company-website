import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { company } from '../../data/company';
import { useLanguage } from '../../i18n/LanguageContext';
import type { TranslationKey } from '../../i18n/en';
import { ExternalLink } from '../common/ExternalLink';
import { Image } from '../common/Image';
import { LanguageSelector } from './LanguageSelector';
export function Brand() {
  return (
    <span className="brand">
      <Image className="official-logo" src={company.logo} alt={company.companyName} eager />
    </span>
  );
}
const links: [string, TranslationKey][] = [
  ['/', 'nav.home'],
  ['/experiences', 'nav.experiences'],
  ['/destinations', 'nav.destinations'],
  ['/about', 'nav.about'],
  ['/contact', 'nav.contact'],
];
export function Layout() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (previousPath.current !== pathname)
      document.getElementById('main')?.focus({ preventScroll: true });
    previousPath.current = pathname;
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        {t('nav.skip')}
      </a>
      <header className="site-header">
        <div className="container nav-inner">
          <Link to="/" aria-label={t('nav.homeLabel')} onClick={() => setOpen(false)}>
            <Brand />
          </Link>
          <nav
            id="main-navigation"
            aria-label={t('nav.main')}
            className={open ? 'navigation open' : 'navigation'}
          >
            {links.map(([to, key]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>
                {t(key)}
              </NavLink>
            ))}
            <LanguageSelector />
            <Link to="/contact" className="button nav-cta" onClick={() => setOpen(false)}>
              {t('nav.plan')}
              <ArrowUpRight size={17} />
            </Link>
          </nav>
          <button
            id="menu-toggle"
            className="menu-toggle"
            aria-label={t(open ? 'nav.close' : 'nav.open')}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Link to="/" aria-label={t('nav.homeLabel')}>
              <Brand />
            </Link>
            <p>{t('footer.tagline')}</p>
            <span className="footer-location">{t('footer.based')}</span>
          </div>
          <div>
            <h3>{t('footer.discover')}</h3>
            <Link to="/experiences">{t('nav.experiences')}</Link>
            <Link to="/destinations">{t('nav.destinations')}</Link>
            <Link to="/about">{t('footer.story')}</Link>
            <ExternalLink href={company.getYourGuideUrl} label={t('common.reviews')} />
          </div>
          <div>
            <h3>{t('footer.plans')}</h3>
            <Link to="/contact">
              {t('common.inquiry')}
              <ArrowUpRight size={15} />
            </Link>
            <ExternalLink href={company.instagramUrl} label={company.instagramHandle} />
            <ExternalLink href={company.getYourGuideUrl} label="GetYourGuide" />
            {company.email && <a href={'mailto:' + company.email}>{company.email}</a>}
            <Link to="/privacy">{t('footer.privacy')}</Link>
          </div>
          <div className="footer-note">
            <span className="eyebrow">{t('footer.eye')}</span>
            <h3>{t('footer.title')}</h3>
            <Link to="/contact" className="text-link">
              {t('common.getInTouch')}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} {company.companyName}
          </span>
          <span>{t('footer.booking')}</span>
        </div>
      </footer>
    </>
  );
}

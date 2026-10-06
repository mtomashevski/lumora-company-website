import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { isLocale } from '../locales';
export default function Entry() {
  const navigate = useNavigate();
  useEffect(() => {
    let preferred = 'en';
    try {
      const stored = localStorage.getItem('lumora-language');
      if (isLocale(stored)) preferred = stored;
    } catch {
      /* Use English. */
    }
    void navigate(`/${preferred}/`, { replace: true });
  }, [navigate]);
  return (
    <section className="container page-intro">
      <h1>Lumora Company</h1>
      <Link to="/en/">Explore experiences</Link>
    </section>
  );
}

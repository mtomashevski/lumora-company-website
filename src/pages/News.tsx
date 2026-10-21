import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { newsArticles } from '../data/news';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { Image } from '../components/common/Image';

export default function News() {
  const { t, l, language } = useLanguage();
  usePageMeta(t('news.title'), t('news.intro'), false, newsArticles[0]?.cover?.src);
  return (
    <>
      <section className="container page-intro news-intro">
        <span className="eyebrow">{t('news.eye')}</span>
        <h1>{t('news.title')}</h1>
        <p>{t('news.intro')}</p>
      </section>
      <section className="container news-list" aria-label={t('news.articles')}>
        {newsArticles.some((article) => article.demonstration) && (
          <p className="news-demonstration-note">{t('news.demonstrationNote')}</p>
        )}
        {newsArticles.length ? (
          <div className="news-grid">
            {newsArticles.map((article) => (
              <article className="news-card" key={article.slug}>
                {article.cover && (
                  <Link
                    to={'/news/' + article.slug}
                    className="news-card-image"
                    aria-label={l(article.title)}
                  >
                    <Image
                      src={article.cover.src}
                      alt={l(article.cover.alt)}
                      position={article.cover.position}
                    />
                  </Link>
                )}
                <div className="news-card-body">
                  <div className="news-meta">
                    {article.category && <span>{l(article.category)}</span>}
                    {article.demonstration && (
                      <span className="news-demo-badge">{t('news.demo')}</span>
                    )}
                  </div>
                  <h2>
                    <Link to={'/news/' + article.slug}>{l(article.title)}</Link>
                  </h2>
                  <p>{l(article.excerpt)}</p>
                  <span className="news-date">
                    {article.publishedAt ? (
                      <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString(
                          language === 'mk' ? 'mk-MK' : 'en-GB',
                          { dateStyle: 'long', timeZone: 'UTC' },
                        )}
                      </time>
                    ) : (
                      t('news.undated')
                    )}
                  </span>
                  <Link
                    className="text-link"
                    to={'/news/' + article.slug}
                    aria-label={`${t('news.readMore')}: ${l(article.title)}`}
                  >
                    {t('news.readMore')}
                    <ArrowUpRight aria-hidden="true" size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>{t('news.empty')}</p>
        )}
      </section>
    </>
  );
}

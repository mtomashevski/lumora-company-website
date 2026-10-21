import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { newsArticles } from '../data/news';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { Image } from '../components/common/Image';
import NotFound from './NotFound';
import type { NewsArticle as Article } from '../types/news';

function ArticleContent({ article }: { article: Article }) {
  const { t, l, language } = useLanguage();
  usePageMeta(l(article.title), l(article.excerpt), false, article.cover?.src);
  return (
    <article className="container news-article">
      <Link to="/news" className="text-link">
        <ArrowLeft size={16} aria-hidden="true" />
        {t('news.back')}
      </Link>
      <header className="news-article-header">
        {article.category && <span className="eyebrow">{l(article.category)}</span>}
        <h1>{l(article.title)}</h1>
        <p className="lead">{l(article.excerpt)}</p>
        <p className="news-date">
          {article.publishedAt ? (
            <>
              {t('news.published')}{' '}
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString(
                  language === 'mk' ? 'mk-MK' : 'en-GB',
                  { dateStyle: 'long', timeZone: 'UTC' },
                )}
              </time>
            </>
          ) : (
            t('news.undated')
          )}
        </p>
        {article.demonstration && (
          <p className="news-demonstration-note">{t('news.demonstrationNote')}</p>
        )}
      </header>
      {article.cover && (
        <div className="news-article-cover">
          <Image
            src={article.cover.src}
            alt={l(article.cover.alt)}
            position={article.cover.position}
            eager
          />
        </div>
      )}
      <div className="news-article-body">
        {article.sections.map((section) => (
          <section key={section.heading.en}>
            <h2>{l(section.heading)}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.en}>{l(paragraph)}</p>
            ))}
          </section>
        ))}
        <Link to="/news" className="text-link">
          <ArrowLeft size={16} aria-hidden="true" />
          {t('news.back')}
        </Link>
      </div>
    </article>
  );
}
export default function NewsArticle() {
  const { slug } = useParams();
  const article = newsArticles.find((item) => item.slug === slug);
  return article ? <ArticleContent article={article} /> : <NotFound />;
}

import { LanguageProvider } from './i18n/LanguageContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import Destinations from './pages/Destinations';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import { PrivacyProvider } from './components/privacy/PrivacyProvider';
import { basePath } from './utils/deployment';
export default function App() {
  return (
    <PrivacyProvider>
      <LanguageProvider>
        <ErrorBoundary>
          <BrowserRouter basename={basePath}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="experiences" element={<Experiences />} />
                <Route path="experiences/:slug" element={<ExperienceDetail />} />
                <Route path="destinations" element={<Destinations />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="news" element={<News />} />
                <Route path="news/:slug" element={<NewsArticle />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </LanguageProvider>
    </PrivacyProvider>
  );
}

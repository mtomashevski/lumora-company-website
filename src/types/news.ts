import type { LocalizedText } from '../i18n/types';
import type { TravelImage } from './experience';

export interface NewsArticle {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  category?: LocalizedText;
  publishedAt?: string;
  cover?: TravelImage;
  sections: { heading: LocalizedText; paragraphs: LocalizedText[] }[];
}

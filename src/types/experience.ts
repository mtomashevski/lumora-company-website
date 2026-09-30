import type { LocalizedText } from '../i18n/types';
export type Category = 'culture-nature' | 'nature-adventure' | 'multi-day' | 'culture-heritage';
export type LocationId = 'skopje' | 'vodno' | 'matka' | 'ohrid' | 'lake-ohrid' | 'bitola' | 'debar';
export interface TravelImage {
  src: string;
  alt: LocalizedText;
  position?: string;
}
export interface Experience {
  id: string;
  slug: string;
  title: LocalizedText;
  destination: LocationId;
  locations: LocationId[];
  category: Category;
  categories: Category[];
  shortDescription: LocalizedText;
  description: LocalizedText;
  duration: LocalizedText;
  priceFrom?: number;
  currency: 'EUR';
  priceLabel?: LocalizedText;
  highlights: LocalizedText[];
  itinerary?: { title: LocalizedText; description: LocalizedText }[];
  included?: LocalizedText[];
  notIncluded?: LocalizedText[];
  meetingPoint?: LocalizedText;
  languages?: LocalizedText;
  groupSize?: LocalizedText;
  activityLevel?: LocalizedText;
  heroImage: TravelImage;
  gallery: TravelImage[];
  getYourGuideUrl?: string;
  featured: boolean;
  sourceChecked: string;
}

import { website } from '../data/company';
import type { TranslationKey } from '../i18n/en';
export interface Inquiry {
  name: string;
  email: string;
  phone: string;
  experience: string;
  travelers: number;
  date: string;
  message: string;
  consent: boolean;
}
export type InquiryErrors = Partial<Record<keyof Inquiry, TranslationKey>>;
export function localToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Skopje',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
export function readInquiry(form: FormData): Inquiry {
  const value = (key: string) => String(form.get(key) || '').trim();
  return {
    name: value('name'),
    email: value('email'),
    phone: value('phone'),
    experience: value('experience'),
    travelers: Number(value('travelers')),
    date: value('date'),
    message: value('message'),
    consent: form.get('consent') === 'yes',
  };
}
// Custom validation keys let errors change language immediately, unlike browser-native messages.
export function validateInquiry(data: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (data.name.length < 2 || data.name.length > 100) errors.name = 'validation.name';
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'validation.email';
  if (data.phone.length > 40) errors.phone = 'validation.phone';
  if (!Number.isInteger(data.travelers) || data.travelers < 1 || data.travelers > 100)
    errors.travelers = 'validation.travelers';
  if (data.date && (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || data.date < localToday()))
    errors.date = 'validation.date';
  if (data.message.length < 10 || data.message.length > 3000) errors.message = 'validation.message';
  if (!data.consent) errors.consent = 'validation.consent';
  return errors;
}
export async function submitInquiry(data: Inquiry): Promise<'prepared' | 'sent'> {
  // With no endpoint, nothing leaves the browser. The visitor chooses how to share the prepared message.
  if (!website.inquiryEndpoint) return 'prepared';
  const response = await fetch(website.inquiryEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Inquiry endpoint rejected the request');
  return 'sent';
}

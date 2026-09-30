import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, CheckCircle } from 'lucide-react';
import { company, website } from '../../data/company';
import { experiences } from '../../data/experiences';
import { localToday, readInquiry, submitInquiry, validateInquiry } from '../../utils/inquiry';
import type { Inquiry, InquiryErrors } from '../../utils/inquiry';
import { useLanguage } from '../../i18n/LanguageContext';
import { ExternalLink } from '../common/ExternalLink';
export function InquiryForm() {
  const { t, l, language } = useLanguage();
  const [params] = useSearchParams();
  const [state, setState] = useState<'idle' | 'loading' | 'prepared' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [inquiry, setInquiry] = useState<Inquiry>();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (state === 'prepared' || state === 'sent')
      document.getElementById('inquiry-confirmation')?.focus();
  }, [state]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = readInquiry(new FormData(form));
    const nextErrors = validateInquiry(data);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      (form.elements.namedItem(first) as HTMLElement)?.focus();
      return;
    }
    setState('loading');
    setInquiry(data);
    try {
      setState(await submitInquiry(data));
    } catch {
      setState('error');
    }
  }
  function field(name: keyof Inquiry) {
    return {
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
    };
  }
  const error = (name: keyof Inquiry) =>
    errors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {t(errors[name]!)}
      </span>
    ) : null;
  const selected = experiences.find((e) => e.slug === inquiry?.experience);
  const summary = inquiry
    ? [
        `${t('form.name')}: ${inquiry.name}`,
        `${t('form.email')}: ${inquiry.email}`,
        ...(inquiry.phone ? [`${t('form.phone')}: ${inquiry.phone}`] : []),
        `${t('form.experience')}: ${selected ? l(selected.title) : t('form.openIdeas')}`,
        `${t('form.travelers')}: ${inquiry.travelers}`,
        `${t('form.date')}: ${inquiry.date ? new Intl.DateTimeFormat(language === 'mk' ? 'mk-MK' : 'en-GB', { dateStyle: 'long' }).format(new Date(inquiry.date + 'T12:00:00')) : t('form.noDate')}`,
        '',
        inquiry.message,
      ].join('\n')
    : '';
  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }
  if (state === 'prepared' || state === 'sent')
    return (
      <div className="success-state">
        <CheckCircle size={44} />
        <span className="eyebrow">
          {t(state === 'prepared' ? 'form.preparedEye' : 'form.sentEye')}
        </span>
        <h2 id="inquiry-confirmation" tabIndex={-1}>
          {t(state === 'prepared' ? 'form.preparedTitle' : 'form.sentTitle')}
        </h2>
        <p role="status">
          {t(state === 'prepared' ? 'form.preparedText' : 'form.sentText', {
            handle: company.instagramHandle,
          })}
        </p>
        {state === 'prepared' && (
          <>
            <label className="inquiry-summary">
              {t('form.summary')}
              <textarea
                readOnly
                value={summary}
                rows={9}
                onFocus={(e) => e.currentTarget.select()}
              />
            </label>
            <button className="button" type="button" onClick={copy}>
              {t(copyState === 'copied' ? 'form.copied' : 'form.copy')}
            </button>
            <p className="form-footnote" aria-live="polite">
              {copyState === 'failed'
                ? t('form.copyFailed')
                : copyState === 'copied'
                  ? t('form.copied')
                  : ''}
            </p>
            <ExternalLink href={company.instagramUrl} label={t('contact.instagram')} />
          </>
        )}
        <button
          className="text-link"
          type="button"
          onClick={() => {
            setState('idle');
            setCopyState('idle');
            setErrors({});
          }}
        >
          {t('form.back')}
        </button>
        <Link className="text-link" to="/experiences">
          {t('common.keepExploring')}
          <ArrowUpRight size={17} />
        </Link>
      </div>
    );
  return (
    <form
      onSubmit={submit}
      noValidate
      onInput={(e) => {
        const name = (e.target as HTMLInputElement).name as keyof Inquiry;
        if (errors[name]) setErrors((previous) => ({ ...previous, [name]: undefined }));
      }}
    >
      <h2>{t('form.title')}</h2>
      <div className="form-grid">
        <label htmlFor="inquiry-name">
          {t('form.name')} <span>*</span>
          <input
            id="inquiry-name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder={t('form.namePlaceholder')}
            {...field('name')}
          />
          {error('name')}
        </label>
        <label htmlFor="inquiry-email">
          {t('form.email')} <span>*</span>
          <input
            id="inquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder={t('form.emailPlaceholder')}
            {...field('email')}
          />
          {error('email')}
        </label>
        <label htmlFor="inquiry-phone">
          {t('form.phone')} <small>({t('common.optional')})</small>
          <input
            id="inquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder={t('form.phonePlaceholder')}
            {...field('phone')}
          />
          {error('phone')}
        </label>
        <label htmlFor="inquiry-experience">
          <span id="inquiry-experience-label">{t('form.experience')}</span>
          <select
            id="inquiry-experience"
            name="experience"
            aria-labelledby="inquiry-experience-label"
            defaultValue={
              experiences.some((e) => e.slug === params.get('experience'))
                ? params.get('experience')!
                : ''
            }
          >
            <option value="">{t('form.openIdeas')}</option>
            {experiences.map((e) => (
              <option value={e.slug} key={e.slug}>
                {l(e.title)}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="inquiry-travelers">
          {t('form.travelers')} <span>*</span>
          <input
            id="inquiry-travelers"
            type="number"
            name="travelers"
            min="1"
            max="100"
            step="1"
            required
            defaultValue="2"
            {...field('travelers')}
          />
          {error('travelers')}
        </label>
        <label htmlFor="inquiry-date">
          {t('form.date')} <small>({t('common.optional')})</small>
          <input id="inquiry-date" type="date" name="date" min={localToday()} {...field('date')} />
          {error('date')}
        </label>
        <label className="full-width" htmlFor="inquiry-message">
          {t('form.message')} <span>*</span>
          <textarea
            id="inquiry-message"
            name="message"
            required
            minLength={10}
            maxLength={3000}
            rows={5}
            placeholder={t('form.messagePlaceholder')}
            {...field('message')}
          />
          {error('message')}
        </label>
      </div>
      <div className="consent">
        <input
          id="inquiry-consent"
          name="consent"
          type="checkbox"
          value="yes"
          required
          {...field('consent')}
        />
        <label htmlFor="inquiry-consent">
          {t('form.consentBefore')} <Link to="/privacy">{t('form.privacyLink')}</Link>{' '}
          {t('form.consentAfter')} <span>*</span>
        </label>
      </div>
      {error('consent')}
      {state === 'error' && (
        <p className="form-error" role="alert">
          {t('form.error')}
        </p>
      )}
      <button className="button" disabled={state === 'loading'} type="submit">
        {t(
          state === 'loading'
            ? 'form.submitting'
            : website.inquiryEndpoint
              ? 'form.send'
              : 'form.prepare',
        )}
        <ArrowUpRight size={18} />
      </button>
      <p className="form-footnote">
        {!website.inquiryEndpoint && t('form.localNote')} {t('form.required')}
      </p>
    </form>
  );
}

import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
// External booking remains a normal link; the site never creates a checkout or reservation.
export function ExternalLink({
  href,
  label,
  className = 'text-link',
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const { t } = useLanguage();
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {label}
      <ArrowUpRight size={17} aria-hidden="true" />
      <span className="sr-only"> ({t('common.external')})</span>
    </a>
  );
}

import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
export function SectionHeading({
  eyebrow,
  title,
  text,
  link,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  link?: { to: string; label: string };
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {link && (
        <Link className="text-link" to={link.to}>
          {link.label}
          <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      )}
    </div>
  );
}

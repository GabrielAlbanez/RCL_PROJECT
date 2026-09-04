import Link from 'next/link';
import { getContent } from '@/lib/content';

/**
 * Closing conversion band, shared by every inner page.
 *
 * Before this, only /projects and /about offered a way forward — /solutions,
 * /industries and /approach ended on a grid and left the reader with nowhere
 * to go. Extracted rather than pasted four times so the copy and the markup
 * stay in one place.
 */
export default function CtaBand({ locale }: { locale: string }) {
  const t = getContent(locale);

  return (
    <section className="cta">
      <div className="container cta-grid">
        <div>
          <div className="eyebrow">{t.cta.eyebrow}</div>
          <h2>{t.cta.title}</h2>
        </div>
        <div>
          <p>{t.cta.text}</p>
          <Link className="button" href={`/${locale}/contact`}>
            {t.cta.button}<span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

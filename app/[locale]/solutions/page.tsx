import Link from 'next/link';
import { getContent } from '@/lib/content';
import { localeAlternates } from '@/lib/seo';
import CtaBand from '@/components/CtaBand';
import Reveal from '@/components/Reveal';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getContent(locale);
  return {
    title: t.pages.solutions.title,
    description: t.pages.solutions.intro,
    alternates: localeAlternates(locale, '/solutions'),
  };
}

export default async function Solutions({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getContent(locale);
  const page = t.pages.solutions;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">{page.eyebrow}</div>
          <h1>{page.heading} <span>{page.headingAccent}</span></h1>
          <p>{page.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t.solutions.eyebrow}</div>
              <h2>{t.solutions.title}</h2>
            </div>
            <p>{t.solutions.text}</p>
          </div>
          <div className="listing-grid">
            {t.solutions.items.map(([key, stack, text]) => (
              <Reveal key={key}>
                <Link className="listing-card" href={`/${locale}/solutions/${key.toLowerCase()}`}>
                  <b>{key}</b>
                  <h3>{stack}</h3>
                  <p>{text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Where these disciplines get applied. The pills are styled for a dark
          ground, hence section-dark. */}
      <section className="section section-dark">
        <div className="container">
          <div className="eyebrow">{t.industries.eyebrow}</div>
          <h2>{t.industries.title}</h2>
          <div className="industry-list">
            {t.industries.items.map(([name]) => (
              <Link className="industry-pill" href={`/${locale}/industries`} key={name}>
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}

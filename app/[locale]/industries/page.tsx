import { getContent } from '@/lib/content';
import { localeAlternates } from '@/lib/seo';
import CtaBand from '@/components/CtaBand';
import Reveal from '@/components/Reveal';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getContent(locale);
  return {
    title: t.pages.industries.title,
    description: t.pages.industries.intro,
    alternates: localeAlternates(locale, '/industries'),
  };
}

export default async function Industries({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getContent(locale);
  const page = t.pages.industries;

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
              <div className="eyebrow">{t.industries.eyebrow}</div>
              <h2>{t.industries.title}</h2>
            </div>
          </div>
          <div className="listing-grid">
            {t.industries.items.map(([name, text], index) => (
              <Reveal key={name}>
                <article className="listing-card">
                  <b>{String(index + 1).padStart(2, '0')}</b>
                  <h3>{name}</h3>
                  <p>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The sectors differ; the operational problems underneath them do not.
          Reuses the home page's own framing rather than restating it. */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t.problem.eyebrow}</div>
              <h2>{t.problem.title}</h2>
            </div>
            <p>{t.problem.text}</p>
          </div>
          <div className="problem-grid">
            {t.problem.cards.map(([number, heading, text]) => (
              <article className="problem-card" key={number}>
                <span className="card-num">{number}</span>
                <div>
                  <h3>{heading}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}

import { getContent } from '@/lib/content';
import { localeAlternates } from '@/lib/seo';
import CtaBand from '@/components/CtaBand';
import Reveal from '@/components/Reveal';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getContent(locale);
  return {
    title: t.pages.approach.title,
    description: t.pages.approach.intro,
    alternates: localeAlternates(locale, '/approach'),
  };
}

export default async function Approach({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getContent(locale);
  const page = t.pages.approach;
  const deliverables = page.deliverables;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">{page.eyebrow}</div>
          <h1>{page.heading} <span>{page.headingAccent}</span></h1>
          <p>{page.intro}</p>
        </div>
      </section>

      {/* The RCL System — the same five steps the hero object draws. */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t.method.eyebrow}</div>
              <h2>{t.method.title}</h2>
            </div>
            <p>{t.method.text}</p>
          </div>
          <div className="method-grid">
            {t.method.steps.map(([number, heading, text]) => (
              <div className="method-step" key={number}>
                <span>{number}</span>
                <h3>{heading}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The method describes what gets built; this describes what the client is
          left holding. It is the question a director of operations actually asks
          before signing. */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{deliverables.eyebrow}</div>
              <h2>{deliverables.title}</h2>
            </div>
            <p>{deliverables.text}</p>
          </div>
          <div className="canada-grid">
            {deliverables.items.map(([label, text]) => (
              <Reveal key={label}>
                <article className="canada-item">
                  <strong>{label}</strong>
                  <span>{text}</span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}

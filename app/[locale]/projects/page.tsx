import { getContent } from '@/lib/content';
import { localeAlternates } from '@/lib/seo';
import CtaBand from '@/components/CtaBand';
import Reveal from '@/components/Reveal';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getContent(locale);
  return {
    title: t.pages.projects.title,
    description: t.pages.projects.intro,
    alternates: localeAlternates(locale, '/projects'),
  };
}

export default async function Projects({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getContent(locale);
  const page = t.pages.projects;
  const framework = page.framework;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">{page.eyebrow}</div>
          <h1>{page.heading} <span>{page.headingAccent}</span></h1>
          <p>{page.intro}</p>
        </div>
      </section>

      {/* No case studies are invented here. README.md requires real project
          metrics to be approved before publication, so the page presents the
          framework each write-up follows — which is itself a credible answer to
          "how do you prove it" — and says plainly why the numbers are absent. */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{framework.eyebrow}</div>
              <h2>{framework.title}</h2>
            </div>
            <p>{framework.text}</p>
          </div>
          <div className="method-grid">
            {framework.steps.map(([number, heading, text]) => (
              <div className="method-step" key={number}>
                <span>{number}</span>
                <h3>{heading}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t.results.eyebrow}</div>
              <h2>{t.results.title}</h2>
            </div>
            <p>{framework.note}</p>
          </div>
          <div className="results">
            {t.results.items.map(([direction, label]) => (
              <Reveal key={label}>
                <div className="result">
                  <strong>{direction}</strong>
                  <span>{label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}

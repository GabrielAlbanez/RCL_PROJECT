import Link from 'next/link';
import HeroExperience from '@/components/HeroExperience';
import Reveal from '@/components/Reveal';
import TeamSection from '@/components/TeamSection';
import { getContent, locales, type Locale } from '@/lib/content';

export async function generateStaticParams(){return locales.map(locale=>({locale}))}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;const t=getContent(locale);return {title:t.hero.title,description:t.hero.text,alternates:{canonical:`/${locale}`,languages:{en:'/en',fr:'/fr'}}}}

export default async function Home({params}:{params:Promise<{locale:string}>}){const {locale}=await params; const L=locale as Locale; const t=getContent(locale); return <>
<HeroExperience locale={L} hero={t.hero}/>
<section className="section"><div className="container human"><Reveal><div className="human-visual"><div className="eyebrow" style={{color:'#fff'}}>{t.human.eyebrow}</div><div className="quote">{t.human.quote}</div></div></Reveal><Reveal><div className="human-copy"><div className="eyebrow">{t.human.eyebrow}</div><h2>{t.human.title}</h2><p>{t.human.text}</p><Link className="button" href={`/${locale}/about`}>{t.human.button}<span>↗</span></Link></div></Reveal></div></section>
<TeamSection locale={locale} variant="teaser"/>
<section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">{t.problem.eyebrow}</div><h2>{t.problem.title}</h2></div><p>{t.problem.text}</p></div><div className="problem-grid">{t.problem.cards.map(([n,h,p])=><Reveal key={n}><article className="problem-card"><span className="card-num">{n}</span><div><h3>{h}</h3><p>{p}</p></div></article></Reveal>)}</div></div></section>
<section className="section section-dark"><div className="container"><div className="section-head"><div><div className="eyebrow">{t.method.eyebrow}</div><h2>{t.method.title}</h2></div><p>{t.method.text}</p></div><div className="method-grid">{t.method.steps.map(([n,h,p])=><div className="method-step" key={n}><span>{n}</span><h3>{h}</h3><p>{p}</p></div>)}</div></div></section>
<section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">{t.solutions.eyebrow}</div><h2>{t.solutions.title}</h2></div><p>{t.solutions.text}</p></div><div className="solution-grid">{t.solutions.items.map(([k,h,p])=><Reveal key={k}><Link href={`/${locale}/solutions`} className="solution-card"><b>{k}</b><h3>{h}</h3><p>{p}</p><span className="solution-arrow">↗</span></Link></Reveal>)}</div></div></section>
<section className="section section-dark"><div className="container"><div className="eyebrow">{t.industries.eyebrow}</div><h2>{t.industries.title}</h2><div className="industry-list">{t.industries.items.map(i=><Link className="industry-pill" href={`/${locale}/industries`} key={i}>{i}</Link>)}</div></div></section>
<section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">{t.results.eyebrow}</div><h2>{t.results.title}</h2></div></div><div className="results">{t.results.items.map(([d,x],i)=><div className="result" key={i}><strong>{d}</strong><span>{x}</span></div>)}</div></div></section>
<section className="cta"><div className="container cta-grid"><div><div className="eyebrow" style={{color:'#fff'}}>{t.cta.eyebrow}</div><h2>{t.cta.title}</h2></div><div><p>{t.cta.text}</p><Link className="button" href={`/${locale}/contact`}>{t.cta.button}<span>↗</span></Link></div></div></section>
</>}

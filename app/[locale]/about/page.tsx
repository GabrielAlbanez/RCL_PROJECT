import Link from 'next/link';
import { getContent } from '@/lib/content';
import { localeAlternates } from '@/lib/seo';
import MapleLeaf from '@/components/MapleLeaf';
import Reveal from '@/components/Reveal';
import TeamSection from '@/components/TeamSection';

export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;const t=getContent(locale);return {title:t.pages.about.title,description:t.pages.about.intro,alternates:localeAlternates(locale,'/about')}}

export default async function About({params}:{params:Promise<{locale:string}>}){const {locale}=await params;const t=getContent(locale);const a=t.about;return <>
<section className="page-hero"><div className="container"><div className="eyebrow eyebrow-canada"><MapleLeaf/>{a.eyebrow}</div><h1>{a.title} <span>{a.titleAccent}</span></h1><p>{t.pages.about.intro}</p></div></section>

<section className="section"><div className="container human"><div className="human-copy"><div className="eyebrow">{a.human.eyebrow}</div><h2>{a.human.title}</h2><p>{t.human.text}</p><Link className="button" href={`/${locale}/contact`}>{t.headerCta}<span>↗</span></Link></div><div className="human-visual"><div className="eyebrow eyebrow-canada" style={{color:'#fff'}}><MapleLeaf className="maple-light"/>{t.canada.eyebrow}</div><div className="quote">{t.footer.line}</div></div></div></section>

{/* The Canadian argument lives here — off the landing page, where it can be made in full. */}
<section className="section canada-band"><MapleLeaf className="maple-watermark"/><div className="container"><div className="section-head"><div><div className="eyebrow eyebrow-canada"><MapleLeaf/>{t.canada.eyebrow}</div><h2>{t.canada.title}</h2></div><p>{t.canada.text}<em className="canada-origin">{t.canada.originNote}</em></p></div><div className="canada-grid">{t.canada.points.map(([label,text])=><Reveal key={label}><article className="canada-item"><strong>{label}</strong><span>{text}</span></article></Reveal>)}</div></div></section>

{/* Bilingualism shown as a deliverable, not claimed as a feature: the same alarm, both ways. */}
<section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">{a.bilingual.eyebrow}</div><h2>{a.bilingual.title}</h2></div><p>{a.bilingual.text}</p></div><div className="lang-split"><Reveal><div className="lang-panel"><div className="lang-panel-head"><span>{a.bilingual.sampleLabel}</span><b>{a.bilingual.sampleTag}</b></div>{a.bilingual.sample.map(([tag,line])=><div className="lang-row" key={tag}><b>{tag}</b><span>{line}</span></div>)}<div className="lang-panel-foot"><i aria-hidden="true">▲</i>{a.bilingual.sampleLabel}</div></div></Reveal><div className="canada-grid canada-grid-3 lang-cards">{a.bilingual.items.map(([label,text])=><Reveal key={label}><article className="canada-item"><strong>{label}</strong><span>{text}</span></article></Reveal>)}</div></div></div></section>

<section className="section section-dark"><div className="container"><div className="section-head"><div><div className="eyebrow">{a.position.eyebrow}</div><h2>{a.position.title}</h2></div><p>{a.position.text}</p></div><div className="canada-grid">{a.position.pillars.map(([label,text])=><article className="canada-item" key={label}><strong>{label}</strong><span>{text}</span></article>)}</div><div className="presence"><div className="eyebrow eyebrow-canada"><MapleLeaf className="maple-light"/>{a.presence.eyebrow}</div><h3>{a.presence.title}</h3><p>{a.presence.text}</p><div className="industry-list">{a.presence.regions.map(r=><span className="industry-pill" key={r}>{r}</span>)}</div></div></div></section>

<TeamSection locale={locale} variant="full"/>

<section className="cta"><div className="container cta-grid"><div><div className="eyebrow" style={{color:'#fff'}}>{t.cta.eyebrow}</div><h2>{t.cta.title}</h2></div><div><p>{t.cta.text}</p><Link className="button" href={`/${locale}/contact`}>{t.cta.button}<span>↗</span></Link></div></div></section>
</>}

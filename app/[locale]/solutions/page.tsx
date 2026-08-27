import Link from 'next/link';
import { getContent } from '@/lib/content';
import Reveal from '@/components/Reveal';

export default async function Solutions({params}:{params:Promise<{locale:string}>}){const {locale}=await params;const t=getContent(locale);return <><section className="page-hero"><div className="container"><div className="eyebrow">{t.pages.solutions.title.toUpperCase()}</div><h1>Engineering systems that <span>perform.</span></h1><p>{t.pages.solutions.intro}</p></div></section><section className="section"><div className="container"><div className="listing-grid">{t.solutions.items.map(([k,h,p])=><Reveal key={k}><Link className="listing-card" href={`/${locale}/solutions/${k.toLowerCase()}`}><b>{k}</b><h3>{h}</h3><p>{p}</p></Link></Reveal>)}</div></div></section></>}

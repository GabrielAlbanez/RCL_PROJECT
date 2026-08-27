import Link from 'next/link';
import { getContent, locales } from '@/lib/content';
import Reveal from '@/components/Reveal';

const map:{[key:string]:{en:string;fr:string;tag:string;bullets:string[]}}={
  control:{en:'Industrial Control',fr:'Contrôle industriel',tag:'CONTROL',bullets:['PLC, HMI and SCADA architecture','Modernization of legacy control systems','Troubleshooting and commissioning','Process control engineering']},
  connect:{en:'Industrial Connectivity',fr:'Connectivité industrielle',tag:'CONNECT',bullets:['IIoT architecture and data integration','Industrial network connectivity','SCADA and operational visibility','Machine and system integration']},
  engineer:{en:'Industrial Engineering',fr:'Ingénierie industrielle',tag:'ENGINEER',bullets:['Multidisciplinary engineering support','Industrial troubleshooting','Project engineering and implementation','Modernization planning']},
  develop:{en:'Industrial Software',fr:'Logiciels industriels',tag:'DEVELOP',bullets:['Custom industrial software','Digital operational tools','Data interfaces and integrations','Systems built around the plant']},
  optimize:{en:'Advanced Optimization',fr:'Optimisation avancée',tag:'OPTIMIZE',bullets:['Advanced process control','Machine learning opportunities','AI-assisted optimization','Data-driven performance improvement']}
};
export async function generateStaticParams(){return locales.flatMap(locale=>Object.keys(map).map(slug=>({locale,slug})))}
export default async function SolutionDetail({params}:{params:Promise<{locale:string;slug:string}>}){const {locale,slug}=await params;const t=getContent(locale);const item=map[slug]??map.control;const title=locale==='fr'?item.fr:item.en;return <><section className="page-hero"><div className="container"><div className="eyebrow">{item.tag}</div><h1>{title}<span>.</span></h1><p>{t.pages.solutions.intro}</p></div></section><section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">WHAT WE ENGINEER</div><h2>Built around the operation, not the buzzword.</h2></div><p>RCL combines engineering disciplines to solve the industrial problem end to end.</p></div><div className="listing-grid">{item.bullets.map((b,i)=><Reveal key={b}><article className="listing-card"><b>0{i+1}</b><h3>{b}</h3><p>Designed to improve reliability, visibility, integration and operational performance.</p></article></Reveal>)}</div><div style={{marginTop:50}}><Link className="button" href={`/${locale}/contact`}>{t.headerCta}<span>↗</span></Link></div></div></section></>}

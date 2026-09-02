import '../globals.css';
import '../three-scene.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContent, locales, type Locale } from '@/lib/content';
import { hreflang, organizationSchema } from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VLibras from '@/components/VLibras';

export const metadata: Metadata = { title: { default: 'Royal City Labs — Industrial Engineering & Automation', template: '%s | Royal City Labs' }, description: 'Canadian industrial engineering, automation, process control, IIoT, industrial software and optimization.', metadataBase: new URL('https://royalcitylabs.ca'), robots: { index: true, follow: true } };

export function generateStaticParams(){ return locales.map(locale => ({locale})); }
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{locale:string}> }) {
  const {locale} = await params; if(!locales.includes(locale as Locale)) notFound();
  const L = locale as Locale;
  // Region-qualified lang: `en-CA`/`fr-CA` instead of `en`/`fr`, so assistive tech and search
  // engines get the Canadian variant (Quebec French, not France French).
  const jsonLd = organizationSchema(L, getContent(L).pages.about.intro);
  return <html lang={hreflang[L]} data-scroll-behavior="smooth"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g,'\\u003c')}} /><Header locale={L}/><main>{children}</main><Footer locale={L}/><VLibras /></body></html>
}

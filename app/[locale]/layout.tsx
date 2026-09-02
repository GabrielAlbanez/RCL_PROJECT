import '../globals.css';
import '../three-scene.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VLibras from '@/components/VLibras';

export const metadata: Metadata = { title: { default: 'Royal City Labs — Industrial Engineering & Automation', template: '%s | Royal City Labs' }, description: 'Canadian industrial engineering, automation, process control, IIoT, industrial software and optimization.', metadataBase: new URL('https://royalcitylabs.ca'), robots: { index: true, follow: true } };

export function generateStaticParams(){ return locales.map(locale => ({locale})); }
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{locale:string}> }) { const {locale} = await params; if(!locales.includes(locale as Locale)) notFound(); return <html lang={locale}><body><Header locale={locale as Locale}/><main>{children}</main><Footer locale={locale as Locale}/><VLibras /></body></html> }

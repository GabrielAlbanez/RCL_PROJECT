import { notFound } from 'next/navigation';
import { locales, getContent, type Locale } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function generateStaticParams(){ return locales.map(locale => ({locale})); }
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{locale:string}> }) { const {locale} = await params; if(!locales.includes(locale as Locale)) notFound(); return <><Header locale={locale as Locale}/><main>{children}</main><Footer locale={locale as Locale}/></> }

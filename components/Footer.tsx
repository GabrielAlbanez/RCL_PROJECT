import Link from 'next/link';
import { getContent } from '@/lib/content';
import Logo from './Logo';

export default function Footer({ locale }: { locale: 'en' | 'fr' }) { const t = getContent(locale); return <footer className="site-footer"><div><Logo /><p>{t.footer.line}</p></div><div className="footer-links"><Link href={`/${locale}/solutions`}>{t.nav.solutions}</Link><Link href={`/${locale}/industries`}>{t.nav.industries}</Link><Link href={`/${locale}/about`}>{t.nav.about}</Link><Link href={`/${locale}/contact`}>{t.nav.contact}</Link></div><div className="footer-bottom"><span>© 2026 {t.footer.rights}</span><span>Canadian Engineering · Automation · IIoT</span></div></footer> }

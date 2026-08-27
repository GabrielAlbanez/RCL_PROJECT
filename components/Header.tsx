import Link from 'next/link';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import { getContent } from '@/lib/content';

export default function Header({ locale }: { locale: 'en' | 'fr' }) {
  const t = getContent(locale);
  return <header className="site-header"><Link href={`/${locale}`} className="logo-link"><Logo /></Link><nav className="main-nav" aria-label="Primary"><Link href={`/${locale}/solutions`}>{t.nav.solutions}</Link><Link href={`/${locale}/industries`}>{t.nav.industries}</Link><Link href={`/${locale}/approach`}>{t.nav.approach}</Link><Link href={`/${locale}/about`}>{t.nav.about}</Link><Link href={`/${locale}/projects`}>{t.nav.projects}</Link></nav><div className="header-actions"><LanguageToggle locale={locale} /><Link href={`/${locale}/contact`} className="button button-small">{t.headerCta}<span>↗</span></Link></div></header>;
}

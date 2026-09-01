'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';

export default function LanguageToggle({ locale }: { locale: 'en' | 'fr' }) {
  const pathname = usePathname();
  const other = locale === 'en' ? 'fr' : 'en';
  const nextPath = pathname.replace(/^\/(en|fr)(?=\/|$)/, `/${other}`);
  return <Link className="language-toggle" href={(nextPath || `/${other}`) as Route} aria-label={`Switch to ${other === 'fr' ? 'French' : 'English'}`}>{locale.toUpperCase()} <span>↔</span> {other.toUpperCase()}</Link>;
}

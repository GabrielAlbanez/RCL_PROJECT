'use client';

import { usePathname } from 'next/navigation';

export default function LanguageToggle({ locale }: { locale: 'en' | 'fr' }) {
  const pathname = usePathname();
  const other = locale === 'en' ? 'fr' : 'en';
  const nextPath = pathname.replace(/^\/(en|fr)(?=\/|$)/, `/${other}`);
  return <a className="language-toggle" href={nextPath || `/${other}`} aria-label={`Switch to ${other === 'fr' ? 'French' : 'English'}`}>{locale.toUpperCase()} <span>↔</span> {other.toUpperCase()}</a>;
}

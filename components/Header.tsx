'use client';

import { useState, useEffect, useRef } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import { getContent } from '@/lib/content';

/** True for the route itself and for anything nested under it — so Solutions
    stays marked current on /solutions/[slug], not just on the listing page. */
function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header({ locale }: { locale: 'en' | 'fr' }) {
  const t = getContent(locale);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1100) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inMenu = menuRef.current?.contains(target);
      const onButton = btnRef.current?.contains(target);
      if (!inMenu && !onButton) setMobileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks: Array<{ href: Route; label: string }> = [
    { href: `/${locale}/solutions` as Route, label: t.nav.solutions },
    { href: `/${locale}/industries` as Route, label: t.nav.industries },
    { href: `/${locale}/approach` as Route, label: t.nav.approach },
    { href: `/${locale}/about` as Route, label: t.nav.about },
    { href: `/${locale}/projects` as Route, label: t.nav.projects },
  ];

  return (
    <>
      <header className="site-header">
        <Link href={`/${locale}`} className="logo-link">
          <Logo />
        </Link>
        <nav className="main-nav" aria-label="Primary">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActiveRoute(pathname, link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageToggle locale={locale} />
          <Link href={`/${locale}/contact`} className="button button-small">
            {t.headerCta}<span>↗</span>
          </Link>
        </div>
      </header>

      {/* Mobile hamburger. Deliberately a sibling of <header>, not a child: the header
          is position: fixed with a z-index, so it forms a stacking context and nothing
          inside it can paint above the menu panel. It is pinned by CSS to the exact
          coordinates it occupied as a header flex item. */}
      <button
        ref={btnRef}
        className={`mobile-menu-btn${mobileOpen ? ' is-active' : ''}`}
        onClick={() => setMobileOpen(open => !open)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile menu overlay */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-menu${mobileOpen ? ' is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <nav className="mobile-nav">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActiveRoute(pathname, link.href) ? 'page' : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/contact`}
            className="mobile-nav-cta"
            onClick={() => setMobileOpen(false)}
          >
            {t.headerCta}
          </Link>
        </nav>
        <div className="mobile-menu-footer">
          <LanguageToggle locale={locale} />
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

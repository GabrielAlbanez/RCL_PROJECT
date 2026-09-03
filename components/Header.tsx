'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import { getContent } from '@/lib/content';

export default function Header({ locale }: { locale: 'en' | 'fr' }) {
  const t = getContent(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
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

  const navLinks = [
    { href: `/${locale}/solutions`, label: t.nav.solutions },
    { href: `/${locale}/industries`, label: t.nav.industries },
    { href: `/${locale}/approach`, label: t.nav.approach },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/projects`, label: t.nav.projects },
  ];

  return (
    <>
      <header className="site-header">
        <Link href={`/${locale}`} className="logo-link">
          <Logo />
        </Link>
        <nav className="main-nav" aria-label="Primary">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageToggle locale={locale} />
          <Link href={`/${locale}/contact`} className="button button-small">
            {t.headerCta}<span>↗</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`mobile-menu-btn${mobileOpen ? ' is-active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile menu overlay */}
      <div
        ref={menuRef}
        className={`mobile-menu${mobileOpen ? ' is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <nav className="mobile-nav">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
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

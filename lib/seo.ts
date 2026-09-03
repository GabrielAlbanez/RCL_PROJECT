import { locales, type Locale } from './content';
import { COMPANY_LINKEDIN } from './team';

export const SITE_URL = 'https://royalcitylabs.ca';

/**
 * Region-qualified hreflang. A bilingual site aimed at Canada should say `en-CA`/`fr-CA`,
 * not bare `en`/`fr`: it is what tells Google these pages target Canadian searchers
 * (and, for Quebec, that the French page is the Canadian French one).
 */
export const hreflang: Record<Locale, string> = { en: 'en-CA', fr: 'fr-CA' };

/** `path` is the route *after* the locale segment — '' for the home page, '/about', '/solutions/control'… */
export function localeAlternates(locale: string, path = '') {
  const languages: Record<string, string> = { 'x-default': `/en${path}` };
  for (const l of locales) languages[hreflang[l]] = `/${l}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}

/**
 * Organization structured data. Beyond rich results, this is where the Canadian
 * positioning becomes machine-readable: country, area served and both official languages.
 * ⚠️ addressRegion / addressLocality / telephone are intentionally omitted until the client
 * confirms the registered address — do not guess them here, search engines take it literally.
 */
export function organizationSchema(locale: Locale, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Royal City Process Control Labs',
    alternateName: 'Royal City Labs',
    description,
    url: `${SITE_URL}/${locale}`,
    inLanguage: hreflang[locale],
    address: { '@type': 'PostalAddress', addressCountry: 'CA' },
    areaServed: { '@type': 'Country', name: 'Canada' },
    availableLanguage: locales.map(l => ({ '@type': 'Language', name: l === 'en' ? 'English' : 'French', alternateName: hreflang[l] })),
    knowsAbout: ['Industrial engineering', 'Process control', 'PLC programming', 'SCADA', 'IIoT', 'Industrial automation', 'Advanced process control'],
    sameAs: [COMPANY_LINKEDIN],
  };
}

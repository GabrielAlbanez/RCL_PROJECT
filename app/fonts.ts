import { Barlow, Exo_2, Saira } from 'next/font/google';

/**
 * Self-hosted through next/font instead of an @import in globals.css.
 *
 * The @import version cost three serial round trips before the first glyph could
 * paint: HTML → globals.css → fonts.googleapis.com/css2 → fonts.gstatic.com/*.woff2.
 * next/font inlines the @font-face rules into the app's own stylesheet and serves
 * the .woff2 files from our origin, so the chain collapses to one hop.
 *
 * Weight sets mirror the old Google Fonts query exactly, so weight matching — and
 * the `bolder` fallbacks that <b>/<strong> resolve to — render as they did before.
 */

// 400 is deliberately absent. body sets font-weight: 450, and CSS weight matching
// resolves 401-500 upward first, so 500 always wins and no rule ever asks for 400 or
// `normal`. Shipping it would preload a 15 KB face nothing can select.
export const barlow = Barlow({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-barlow',
});

export const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-exo2',
});

export const saira = Saira({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-saira',
});

export const fontVariables = `${barlow.variable} ${exo2.variable} ${saira.variable}`;

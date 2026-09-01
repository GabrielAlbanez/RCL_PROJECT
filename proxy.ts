import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, type Locale } from '@/lib/content';

const defaultLocale: Locale = 'en';

function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language') ?? '';
  const preferred = header.split(',')[0]?.split('-')[0]?.toLowerCase();
  return locales.includes(preferred as Locale) ? (preferred as Locale) : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== '/') return NextResponse.next();
  return NextResponse.redirect(new URL(`/${detectLocale(request)}`, request.url));
}

export const config = {
  matcher: '/',
};

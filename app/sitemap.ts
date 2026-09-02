import type { MetadataRoute } from 'next';
import { locales } from '@/lib/content';
import { SITE_URL, hreflang } from '@/lib/seo';
// Each entry declares its en-CA/fr-CA twin, so Google serves the right official language
// to the right Canadian searcher instead of picking one and treating the other as duplicate.
export default function sitemap():MetadataRoute.Sitemap{const paths=['','/solutions','/industries','/approach','/about','/projects','/contact'];return locales.flatMap(locale=>paths.map(path=>({url:`${SITE_URL}/${locale}${path}`,lastModified:new Date(),alternates:{languages:Object.fromEntries(locales.map(l=>[hreflang[l],`${SITE_URL}/${l}${path}`]))}})))}

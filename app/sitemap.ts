import type { MetadataRoute } from 'next';
export default function sitemap():MetadataRoute.Sitemap{const locales=['en','fr'];const paths=['','/solutions','/industries','/approach','/about','/projects','/contact'];return locales.flatMap(locale=>paths.map(path=>({url:`https://royalcitylabs.ca/${locale}${path}`,lastModified:new Date()})))}

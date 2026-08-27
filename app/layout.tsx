import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: { default: 'Royal City Labs — Industrial Engineering & Automation', template: '%s | Royal City Labs' }, description: 'Canadian industrial engineering, automation, process control, IIoT, industrial software and optimization.', metadataBase: new URL('https://royalcitylabs.ca'), robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

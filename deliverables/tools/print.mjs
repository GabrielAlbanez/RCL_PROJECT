// Renders build/<html> to a PDF, after checking every page for overflow.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const src = process.argv[2];
const out = process.argv[3];
if (!src || !out) { console.error('usage: node print.mjs <build/x.html> <out.pdf>'); process.exit(1); }

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable', headless: true,
  args: ['--no-sandbox','--font-render-hinting=none','--force-color-profile=srgb','--allow-file-access-from-files'],
});
const page = await browser.newPage();
page.on('pageerror', e => console.log('  !pageerror', String(e).slice(0,140)));
await page.goto('file://' + path.resolve(src), { waitUntil: 'networkidle0', timeout: 180000 });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(async () => {
  await Promise.all([...document.images].map(i => i.complete ? 1
    : new Promise(r => { i.onload = i.onerror = r; })));
});
await new Promise(r => setTimeout(r, 2000));

const info = await page.evaluate(() => ({
  pages: document.querySelectorAll('.page').length,
  imgs: document.images.length,
  broken: [...document.images].filter(i => !i.naturalWidth).map(i => i.src.split('/').pop()),
  overflow: [...document.querySelectorAll('.page')].map((p, i) => {
    const pb = p.getBoundingClientRect();
    const bad = [...p.querySelectorAll('*')].filter(e => {
      if (e.closest('.strip-win')) return false;          // deliberately cropped
      const b = e.getBoundingClientRect();
      return b.width > 0 && b.height > 0 &&
        (b.bottom > pb.bottom + 1 || b.right > pb.right + 1 ||
         b.top < pb.top - 1 || b.left < pb.left - 1);
    });
    return bad.length ? { page: i + 1, n: bad.length,
      first: (bad[0].className || bad[0].tagName).toString().slice(0, 40) } : null;
  }).filter(Boolean),
  // caption text must not collide with the image above it
  collisions: [...document.querySelectorAll('.page.content')].map((p, i) => {
    const cap = p.querySelector('.pcap'); const st = p.querySelector('.stage');
    if (!cap || !st) return null;
    const c = cap.getBoundingClientRect(), s = st.getBoundingClientRect();
    return s.bottom > c.top + 1 ? { page: i + 1, overlap: Math.round(s.bottom - c.top) } : null;
  }).filter(Boolean),
}));

console.log(`pages ${info.pages} | images ${info.imgs} | broken ${info.broken.length}`,
            info.broken.slice(0, 5));
console.log('overflowing:', info.overflow.length, JSON.stringify(info.overflow.slice(0, 10)));
console.log('caption collisions:', info.collisions.length, JSON.stringify(info.collisions.slice(0, 10)));

await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true,
  width: '297mm', height: '210mm', margin: { top: '0', bottom: '0', left: '0', right: '0' },
  timeout: 600000 });
const d = fs.readFileSync(out);
const n = (d.toString('latin1').match(/\/Type \/Page[^s]/g) || []).length;
console.log(`PDF ${out} — ${(d.length / 1048576).toFixed(1)} MB, ${n} pages, ` +
            `${d.slice(0, 8)}, ends ${d.subarray(d.length - 6).toString().trim()}`);
await browser.close();

import puppeteer from 'puppeteer-core';
import path from 'node:path';
const src = process.env.DECK || 'build/compact-pt.html';
const want = process.argv.slice(2).map(Number);
const browser = await puppeteer.launch({ executablePath:'/usr/bin/google-chrome-stable', headless:true,
  args:['--no-sandbox','--font-render-hinting=none','--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width:1123, height:794, deviceScaleFactor:1.6 });
await page.goto('file://'+path.resolve(src), { waitUntil:'networkidle0', timeout:180000 });
await page.evaluate(()=>document.fonts.ready);
await new Promise(r=>setTimeout(r,1500));
// real content-vs-caption clearance, measured on the visual children
const clear = await page.evaluate(() => [...document.querySelectorAll('.page.content')].map((p,i)=>{
  const cap = p.querySelector('.pcap'); if (!cap) return null;
  const kids = [...p.querySelectorAll('.stage .shotframe, .stage .grid, .stage .strips, .stage .toc-split, .stage .phone, .stage .tablet')];
  if (!kids.length) return null;
  const bot = Math.max(...kids.map(k=>k.getBoundingClientRect().bottom));
  const gap = cap.getBoundingClientRect().top - bot;
  return gap < 1 ? { page:i+1, gap:Math.round(gap) } : null;
}).filter(Boolean));
console.log('content touching caption:', JSON.stringify(clear));
for (const n of want) {
  const el = (await page.$$('.page'))[n-1];
  if (el) { await el.screenshot({ path:`peek-${n}.png`, captureBeyondViewport:true }); console.log('peek-'+n+'.png'); }
}
await browser.close();

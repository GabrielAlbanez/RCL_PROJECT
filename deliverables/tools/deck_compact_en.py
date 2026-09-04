# -*- coding: utf-8 -*-
"""Compact edition. Same page plan as deck_compact_pt.py, English copy."""
from deckcore import *   # noqa: F403

DATA = '4 September 2026'
D = 'Desktop · 1600 × 1000'

set_ui({
    'vp_desktop': D,
    'foot': 'Royal City Labs — Website Design Preview',
    'doc_title': 'Royal City Labs — Website Design Preview (summary)',
    'back_marker': '@@nunca@@',
    'toc_index': 1,
    'toc_front': [],
    'chapter_no': {
        'The whole site at a glance': '01', 'Home': '02', 'Solutions': '03',
        'Industries': '04', 'Approach': '05', 'About': '06', 'Projects': '07',
        'Contact': '08', 'Tablet and phone': '09', 'Français': '10',
        'Interaction details': '11', 'Technical summary': '12',
    },
})

# 1 — capa
add(f'''<div class="cover-top">{LOGO}</div>
  <div class="cover-mid">
    <div class="eyebrow">WEBSITE — DESIGN PREVIEW</div>
    <h1>The new Royal City Labs<br>website<span class="dot">.</span></h1>
    <p>A visual summary of the working build — desktop, tablet and phone, in English and
       French, including the enquiry form and the interactive states.</p>
  </div>
  <div class="cover-foot">
    <div><b>Prepared for</b><span>Royal City Labs</span></div>
    <div><b>Date</b><span>{DATA}</span></div>
    <div><b>Contents</b><span>{{PAGECOUNT}} pages</span></div>
  </div>''', chrome='cover')

# 2 — sumário + como ler
add(head('CONTENTS', 'What is in here<span class="dot">.</span>',
         meta_chip('{PAGECOUNT} pages', '{SHOTCOUNT} captures on file')) +
    '<div class="stage"><div class="toc-split"><div>{TOC}</div><div class="prose" '
    'style="height:auto;margin:0">'
    '<h3>Every image is a screenshot</h3>'
    '<p>Nothing here is an illustration. Each image was captured from the production build '
    'running in a real browser, at the viewport size printed in the top-right corner of the '
    'page.</p>'
    '<h3>Three viewports, two languages</h3>'
    '<p>The site is documented at <b>1600 × 1000</b> (desktop), <b>900</b> and <b>768</b> '
    '(tablet) and <b>430 × 932</b> (phone), and it is served as <b>en-CA</b> and '
    '<b>fr-CA</b>.</p>'
    '<h3>This is the summary</h3>'
    '<p>A full 120-page edition walks every section of every route, and every phone page top to '
    'bottom. What is here is the essential: the visual language at a size you can read, plus '
    'the entire site in thumbnail on the next page.</p>'
    '<h3>Placeholder content is flagged</h3>'
    '<p>The logo is a recreation in your brand palette, the portraits are licensed stand-ins, '
    'and no project metric has been invented. Everything waiting on your input is on the last '
    'page.</p>'
    '</div></div></div>' +
    caption('Page numbers run along the bottom edge of every sheet.'))

# 3 — mapa do site
textpage('STRUCTURE', 'Site map<span class="dot">.</span>', '''
<div class="sitemap">
  <div class="sm-col">
    <div class="sm-h">Primary routes <b>× 2 languages</b></div>
    <ul class="sm-list">
      <li><span>/en</span><i>Home — the scroll narrative, team, method, solutions, industries</i></li>
      <li><span>/en/solutions</span><i>The five engineering disciplines</i></li>
      <li><span>/en/industries</span><i>Ten sectors, each with its own description</i></li>
      <li><span>/en/approach</span><i>The RCL system, and what stays yours afterwards</i></li>
      <li><span>/en/about</span><i>Team, Canadian standards, bilingual delivery, positioning</i></li>
      <li><span>/en/projects</span><i>How every project is documented</i></li>
      <li><span>/en/contact</span><i>The enquiry form</i></li>
    </ul>
  </div>
  <div class="sm-col">
    <div class="sm-h">Solution detail routes <b>× 2 languages</b></div>
    <ul class="sm-list">
      <li><span>/en/solutions/control</span><i>Industrial Control</i></li>
      <li><span>/en/solutions/connect</span><i>Industrial Connectivity</i></li>
      <li><span>/en/solutions/engineer</span><i>Industrial Engineering</i></li>
      <li><span>/en/solutions/develop</span><i>Industrial Software</i></li>
      <li><span>/en/solutions/optimize</span><i>Advanced Optimization</i></li>
    </ul>
    <div class="sm-h" style="margin-top:9mm">Machine-facing</div>
    <ul class="sm-list">
      <li><span>/robots.txt</span><i>Crawl rules</i></li>
      <li><span>/sitemap.xml</span><i>All routes, both languages, with hreflang pairs</i></li>
      <li><span>/</span><i>Redirects to /en or /fr from the browser's language</i></li>
    </ul>
    <p class="sm-note">24 page routes in total, every one prerendered as static HTML at build
      time, so the first paint does not wait on a server.</p>
  </div>
</div>''')

# 4 — o site inteiro
STRIPS = [('home-full','Home'),('solutions-full','Solutions'),('industries-full','Industries'),
          ('approach-full','Approach'),('about-full','About'),('projects-full','Projects'),
          ('contact-full','Contact'),('sol-control-full','Solutions › Control'),
          ('sol-connect-full','Solutions › Connect'),('sol-eng-full','Solutions › Engineer'),
          ('sol-dev-full','Solutions › Develop'),('sol-opt-full','Solutions › Optimize')]
cards = ''.join(f'<figure class="strip"><div class="strip-win">{img(one(pid))}</div>'
                f'<figcaption>{E(lbl)}</figcaption></figure>' for pid, lbl in STRIPS)
add(head('OVERVIEW', 'The whole site at a glance<span class="dot">.</span>',
         meta_chip('Desktop · full-page captures')) +
    f'<div class="stage"><div class="strips">{cards}</div></div>' +
    caption('All twelve routes at one scale, each cropped where the sheet runs out. The relative '
            'heights show how much there is to read on each. Every one is a live capture.'),
    toc='The whole site at a glance')

# 5–8 — Home
shot('home-hero-intro', '02 · HOME', 'The first screen',
     'First paint. The headline, both calls to action and the five-step index are in place, and '
     'the 3D model shows only the layer the plant already has — three more wait out of register '
     'above it. The empty space above the solid layer is the argument: three layers are missing.',
     url='royalcitylabs.ca/en', chip=['Headline + dual CTA', 'Five-step index',
                                      '3D model at rest'], toc='Home')

grid([(one('home-hero-s1'), '01 · AUDIT'), (one('home-hero-s2'), '02 · DIAGNOSE'),
      (one('home-hero-s3'), '03 · AUTOMATE'), (one('home-hero-s4'), '04 · CONNECT'),
      (one('home-hero-s5'), '05 · OPTIMIZE'), (one('home-hero-intro'), 'AT REST')],
     '02 · HOME', 'The scroll-driven narrative',
     'As the visitor moves down the home page the headline collapses and the five engineering '
     'steps open one at a time — while the 3D model assembles itself layer by layer: the plant '
     'as it stands, the fault diagnosed, the control layer, the network, and finally analytics '
     'with the loop closed. Orange has exactly one job across the site: marking the step being '
     'described now.',
     D, cols=3, url='royalcitylabs.ca/en')

shot('home-sec2', '02 · HOME', 'The engineers, not the vendor',
     'A trust strip over flip cards: portrait, tenure, role and credentials on the front; the '
     'full biography on the back, on hover or tap. <b>The figures in the strip are '
     'placeholders</b> pending your confirmation.',
     url='royalcitylabs.ca/en', part=band('home-sec2', 1))

shot('home-sec4', '02 · HOME', 'The RCL system',
     'Five steps from machines to decisions. This is the same vocabulary the 3D model draws at '
     'the top of the page, so the picture and the explanation read as one argument.',
     url='royalcitylabs.ca/en')

# 9–10 — Solutions
shot('solutions-fold', '03 · SOLUTIONS', 'Solutions',
     'The primary navigation marks the current route with an orange dot under the label, so a '
     'visitor who lands here from a search result knows where they are. The page lists the five '
     'disciplines and hands each one to a detail route of its own.',
     url='royalcitylabs.ca/en/solutions', toc='Solutions')

grid([(one('sol-control-fold'), 'CONTROL'), (one('sol-connect-fold'), 'CONNECT'),
      (one('sol-eng-fold'), 'ENGINEER'), (one('sol-dev-fold'), 'DEVELOP'),
      (one('sol-opt-fold'), 'OPTIMIZE')],
     '03 · SOLUTIONS', 'The five detail routes',
     'Industrial control, industrial connectivity, industrial engineering, industrial software '
     'and advanced optimization. Each has its own URL, title tag and meta description, and four '
     'capability cards of its own — ten routes in total, counting French.',
     D, cols=3, url='royalcitylabs.ca/en/solutions/…')

# 11–12
shot('industries-sec1', '04 · INDUSTRIES', 'Ten sectors, ten descriptions',
     'Each sector carries a distinct description in both languages — all ten are visible in the '
     'thumbnail on page 4. The descriptions speak about capability and never claim a result, '
     'because no result has been approved for publication yet.',
     url='royalcitylabs.ca/en/industries', part=band('industries-sec1', 1), toc='Industries')

shot('approach-sec2', '05 · APPROACH', 'What stays yours',
     'The question an operations director actually asks before signing: as-built documentation, '
     'operator screens, training, source code and licences. <b>This copy is a proposal and needs '
     'your review</b> — it describes how you work.',
     url='royalcitylabs.ca/en/approach', toc='Approach')

# 13–15 — About
shot('about-fold', '06 · ABOUT', 'About',
     'The credibility route: who the engineers are, the standards the work is held to, the '
     'bilingual delivery proof, and the position between traditional industry and Industry 4.0. '
     'CSA, IEC and ISO appear as design references, never as certifications.',
     url='royalcitylabs.ca/en/about', toc='About')

shot('about-sec3', '06 · ABOUT', 'Bilingual delivery, demonstrated',
     'Rather than claiming bilingual capability, the page shows it: a sample operator panel with '
     'its English and French labels side by side, next to the deliverables that ship in both '
     'languages. The difference between saying and proving.',
     url='royalcitylabs.ca/en/about')

shot('team-grid-flipped', '06 · ABOUT', 'The full team',
     'The engineer grid with one card turned over, as a visitor would see it while reading. '
     '<b>The portraits are licensed stand-ins</b> until the real photographs are approved; roles '
     'and credentials are proposals for your review.',
     url='royalcitylabs.ca/en/about', part=band('team-grid-flipped', 1))

# 16
shot('projects-sec1', '07 · PROJECTS', 'The documentation framework',
     'No case study has been invented. The page presents the five-step structure every project '
     'write-up follows — situation, diagnosis, engineering, commissioning, outcome — and says '
     'plainly why the numbers are not there yet. Once you approve a real project, it drops '
     'straight into this shape.',
     url='royalcitylabs.ca/en/projects', toc='Projects')

# 17–18 — formulário
shot('form-empty', '08 · CONTACT', 'The enquiry form is not a mock-up',
     'Six fields, two of them required. Labels are permanent — never placeholders that vanish as '
     'soon as someone types. Every field is validated on the server, the submission is '
     'rate-limited and screened for bots, and it works with JavaScript switched off.',
     url='royalcitylabs.ca/en/contact', toc='Contact')

grid([(one('form-select-open'), 'SELECTOR OPEN'), (one('form-errors'), 'SERVER-SIDE VALIDATION'),
      (one('form-success-live'), 'CONFIRMATION')],
     '08 · CONTACT', 'The form in use',
     'Left: the challenge selector is a custom listbox, keyboard operable, with its values '
     'checked against an allow-list on the server. Centre: an empty submission — validation runs '
     'on the server, not only in the browser, and each message is announced to screen readers and '
     'translated per language; what was already typed survives the error. Right: the '
     'confirmation, verified end to end against a live webhook during this review.',
     D, cols=3, url='royalcitylabs.ca/en/contact')

# 19–20 — tablet e celular
grid([(one('tab-home'), 'HOME · 900'), (one('tab-solutions'), 'SOLUTIONS · 900'),
      (one('tab768-approach'), 'APPROACH · 768'), (one('tab768-projects'), 'PROJECTS · 768')],
     '09 · TABLET', 'The layout changes shape on a tablet',
     'Between 701 and 1100 pixels the primary navigation folds into the menu button, the hero '
     'splits, and the multi-column grids reflow. In the two on the right, at 768 px, the '
     'five-step grid folds to two columns with the fifth step spanning the width — before this '
     'review it was clipped off the edge.',
     'Tablet · 900 and 768 px', cols=4, wrapper='tablet', toc='Tablet and phone')

grid([(one('m-home-fold'), 'HOME'), (one('m-solutions-fold'), 'SOLUTIONS'),
      (one('m-industries-fold'), 'INDUSTRIES'), (one('m-about-fold'), 'ABOUT'),
      (one('m-contact-fold'), 'CONTACT'), (one('m-menu-open'), 'NAVIGATION'),
      (one('m-home-f4'), 'HOME · SCROLL'), (one('m-home-f9'), 'HOME · SCROLL'),
      (one('m-about-f6'), 'ABOUT · SCROLL'), (one('m-form'), 'ENQUIRY FORM')],
     '09 · PHONE', 'On a phone',
     'Five routes as they load, the navigation panel with the current route marked and the '
     'EN ↔ FR switch in its footer, and four screens further down the pages. On a phone the hero '
     'presents its finished state rather than animating, so nothing depends on a scroll gesture. '
     'The full edition walks all eight routes end to end, frame by frame.',
     'Phone · 430 × 932', cols=5, wrapper='phone')

# 21 — francês
grid([(one('fr-home'), 'ACCUEIL'), (one('fr-solutions'), 'SOLUTIONS'),
      (one('fr-about'), 'À PROPOS'), (one('fr-contact'), 'CONTACT')],
     '10 · FRANÇAIS', 'The French site is not a translation layer',
     'It is twelve routes of its own, each with its own URL, title, meta description and copy, '
     'served as fr-CA and paired to the English route by hreflang. Form labels, selector options '
     'and every validation message are translated. Switching language keeps the visitor on the '
     'same page: /en/industries becomes /fr/industries.',
     D, cols=2, url='royalcitylabs.ca/fr/…', toc='Français')

# 22 — detalhes
bands([(20.0, [(one("nav-active-solutions"), 'THE NAVIGATION MARKS THE CURRENT ROUTE', 'plain')]),
       (54.0, [(one("footer-desktop"), 'FOOTER, ANCHORED ACROSS ROUTE CHANGES', 'plain')]),
       (68.0, [(one("team-card-front"), 'CARD — FRONT', 'plain'),
               (one('team-card-back'), 'CARD — BACK', 'plain')])],
      '11 · DETAILS', 'The parts that only exist in motion',
      'The current page is bolder and tinted, with an orange dot under the label — the same orange '
      'convention the 3D model uses; screen readers get aria-current="page" on the same link. The '
      'footer is anchored, so it does not flicker when a visitor navigates. The engineer card is a '
      'real button: it works from the keyboard, and flips to the biography on hover or tap.',
      D, toc='Interaction details')

# 23–26 — fechamento
textpage('TECHNICAL SUMMARY', 'What it is built on<span class="dot">.</span>', '''
<div class="cols2">
 <div>
  <h3>Stack</h3>
  <table class="spec">
   <tr><th>Framework</th><td>Next.js 16, App Router</td></tr>
   <tr><th>UI</th><td>React 19, TypeScript (strict)</td></tr>
   <tr><th>3D</th><td>React Three Fiber + drei over three.js — geometry generated in code, no multi-megabyte asset</td></tr>
   <tr><th>Motion</th><td>Framer Motion for reveals; the browser's own View Transitions API for route changes</td></tr>
   <tr><th>Styling</th><td>Hand-authored CSS on a token system</td></tr>
   <tr><th>Type</th><td>Exo 2 · Saira · Barlow, self-hosted from your own origin</td></tr>
  </table>
  <h3>Delivery and performance</h3>
  <p>All 24 routes are prerendered as static HTML at build time, so the first paint never waits on
     a server. Fonts come from your own domain rather than Google's, which removes three round
     trips before the first glyph. The 3D hero costs around 29 draw calls and fewer than 3,000
     triangles, and the render loop stops entirely when the model is off screen.</p>
  <h3>The enquiry form</h3>
  <ul class="ticks">
   <li>Validated on the server — the browser's own checks are a convenience, not a guard</li>
   <li>Hidden honeypot field plus a rate limit of five submissions per ten minutes per address</li>
   <li>Works with JavaScript disabled</li>
   <li>Delivery is pluggable: a webhook (CRM, Zapier, Make, n8n, Slack) or transactional email</li>
  </ul>
 </div>
 <div>
  <h3>Accessibility</h3>
  <ul class="ticks">
   <li>Correct language on the document: <span class="mono">en-CA</span> / <span class="mono">fr-CA</span></li>
   <li><span class="mono">aria-current="page"</span> on the active navigation link, in both navigations</li>
   <li>Form errors wired to their fields with <span class="mono">aria-invalid</span> and <span class="mono">aria-describedby</span>, and announced</li>
   <li>Visible focus rings on every interactive element</li>
   <li>The whole narrative respects <span class="mono">prefers-reduced-motion</span>: the model presents its finished state instead of animating</li>
   <li>The 3D model carries a translated text alternative; decorative overlays are hidden from screen readers</li>
  </ul>
  <h3>Findability</h3>
  <ul class="ticks">
   <li>Per-page title and meta description on all 24 routes</li>
   <li><span class="mono">hreflang</span> pairs every English route with its French twin</li>
   <li>Organization structured data (JSON-LD) on every page</li>
   <li><span class="mono">robots.txt</span> and a generated <span class="mono">sitemap.xml</span></li>
   <li><span class="mono">/</span> redirects to the visitor's own language</li>
  </ul>
  <p class="note">Colour contrast is the one open item: 19 text styles sit below the WCAG AA
     minimum, the lowest at 1.95:1. All of it is legible — none of it is invisible — and the cause
     is two brand greys used at small sizes. See the facing page.</p>
 </div>
</div>''', toc='Technical summary')

textpage('QUALITY', 'What was checked, and what it turned up<span class="dot">.</span>', '''
<p class="lede">This document was produced by driving the production build in a real browser, which
   made it possible to test what a code review cannot see. Six genuine faults surfaced — two of
   them content nobody could read — and all six are fixed and re-verified.</p>
<div class="cols2">
 <div>
  <h3>Faults found and fixed</h3>
  <table class="spec faults">
   <tr><th>Projects, every width</th><td><b>The framework descriptions were invisible.</b> The
       five-step pattern was written for the dark blue ground it uses on Home and Approach — white
       body copy, white hairlines — and Projects places it on a light section. White on white.</td></tr>
   <tr><th>Seven sections, 14 routes</th><td><b>Dark-section headings were navy on navy.</b> The
       shared heading rule and the dark override carried identical weight, and the shared one was
       written second — so it won.</td></tr>
   <tr><th>About, phones</th><td>The bilingual panel sat in a two-column split wider than any
       phone, cutting off its right edge.</td></tr>
   <tr><th>About, phones and tablets</th><td>Six region pills stayed six across at every width,
       pushing "British Columbia" past the edge.</td></tr>
   <tr><th>Five-step grids, 701–1100 px</th><td>Five columns in a space that fits three clipped
       step 05 on Approach, Projects and the French home page.</td></tr>
   <tr><th>Language switch, phones</th><td>A rule that slims the header was also hiding the switch
       inside the navigation panel — the only one on screen at that width.</td></tr>
  </table>
 </div>
 <div>
  <h3>Checks that pass</h3>
  <ul class="ticks">
   <li>Linting, TypeScript and the production build: clean</li>
   <li>All 24 routes prerender; no route errors and no runtime errors in the console</li>
   <li><b>195 combinations</b> — 15 pages × 13 viewport widths from 360 px to 1920 px, in both
       languages — checked for sideways scroll and clipped content: none left</li>
   <li>The 3D narrative renders and advances correctly through all five stages, in both languages</li>
   <li>The enquiry form delivered a lead end to end to a live webhook endpoint</li>
   <li>Every screenshot in this document was taken after the fixes, from the same build</li>
  </ul>
  <h3>One open item: contrast</h3>
  <p>An automated sweep of every text style on all 15 pages, in both languages, measured contrast
     against WCAG AA. <b>19 styles fall below the minimum</b> — four of them below 3:1, the lowest
     at 1.95:1. None of it is invisible and none of it is a bug: it is the brand subtext grey
     (<span class="mono">#A7B0BA</span>) at 7–15 px, a family of muted mid-greys in body copy, and
     the brand orange at 11 px on white.</p>
  <p>Clearing the list means darkening two or three values in the palette — a brand decision, not
     an engineering one, so we have left it with you rather than quietly changing the look you
     approved.</p>
  <p class="note">Everything else on this page was fixed on sight, because a heading nobody can
     read is not a matter of taste.</p>
 </div>
</div>''', toc='Quality & verification')

textpage('NEXT', 'What we need from you<span class="dot">.</span>', '''
<p class="lede">The build is complete and the site works. What is left is content and decisions that
   are yours to make — nothing on this list needs engineering work, and none of it blocks a
   decision on the proposal.</p>
<div class="cols2">
 <div>
  <h3>Assets</h3>
  <table class="spec">
   <tr><th>Logo</th><td>The official vector. What you see is a careful recreation in your 2026
       brand palette — good enough to review, not to ship.</td></tr>
   <tr><th>Engineer portraits</th><td>Photographs of the real team. The current ones are licensed
       stand-ins, in place so the card layout could be judged with the photo slot filled.</td></tr>
   <tr><th>Favicon</th><td>A browser-tab icon and app icons. Currently absent — the browser asks
       for one and gets nothing.</td></tr>
  </table>
  <h3>Content to confirm</h3>
  <table class="spec">
   <tr><th>Names and credentials</th><td>Each engineer's name, role and licence, so the cards can
       stop showing a role where a name belongs.</td></tr>
   <tr><th>The trust figures</th><td>Combined plant years, licensed engineers, disciplines
       in-house. These are placeholders in the code and are marked as such.</td></tr>
   <tr><th>LinkedIn</th><td>The company page URL, and personal profiles where they exist. The
       buttons currently all fall back to the company link, which could not be verified.</td></tr>
   <tr><th>Proposed copy</th><td>The ten industry descriptions and the "what stays yours" list on
       Approach describe how you work. They are our proposal and need your read.</td></tr>
  </table>
 </div>
 <div>
  <h3>Decisions</h3>
  <table class="spec">
   <tr><th>Where leads go</th><td>A CRM or automation webhook, or an inbox for transactional
       email. One setting either way — the pipeline is built and tested.</td></tr>
   <tr><th>Domain</th><td>The site is built against <span class="mono">royalcitylabs.ca</span>;
       confirm it, and whether French sits on the same domain.</td></tr>
   <tr><th>Standards wording</th><td>CSA, IEC and ISO are referenced as design practice, never as
       certifications. If you hold certifications and want them claimed, we need the
       documentation.</td></tr>
   <tr><th>First case studies</th><td>Projects deliberately shows the framework instead of invented
       numbers. Approve one or two projects with real figures and they drop straight in.</td></tr>
   <tr><th>Contrast</th><td>Darken two or three greys in the palette to clear the accessibility
       list, or keep the look exactly as it is.</td></tr>
  </table>
  <h3>Deliberately not done</h3>
  <p>No metric, certification or client name has been invented anywhere on the site. Every number
     you see is either structural — five disciplines, ten sectors, five steps — or flagged in the
     code as a placeholder awaiting your confirmation. That is why the Projects page has a
     framework where a competitor would have put percentages.</p>
 </div>
</div>''', toc='What we need from you')


render('compact-en.html')

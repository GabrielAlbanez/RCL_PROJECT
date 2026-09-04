# -*- coding: utf-8 -*-
"""Structure, styling and page assembly for the Royal City Labs preview document.

Language-neutral on purpose: a content script (deck_compact_en.py,
deck_compact_pt.py) calls set_ui() with the chrome strings, then adds pages, then
calls render(). Two editions therefore cannot drift apart in layout."""
import html, json, math, pathlib

HERE = pathlib.Path(__file__).resolve().parent
BUILD = HERE / 'build'
SHOTS = HERE.parent / 'screenshots'

derived = json.loads((BUILD / 'derived.json').read_text())
manifest = {m['id']: m for m in json.loads((SHOTS / 'manifest.json').read_text())}
FONTS_CSS = (BUILD / 'fonts.css').read_text()

E = html.escape
GAP, BOXW, BOXH = 7.0, 269.0, 152.0          # mm: gutter, image box width, height
PAD = {'phone': 1.1, 'tablet': 1.4, 'plain': 0.3, None: 0.0}

UI = {}
def set_ui(d):
    UI.clear(); UI.update(d)

pages = []
def add(html_body, section=None, toc=None, chrome='content'):
    pages.append({'html': html_body, 'section': section, 'toc': toc, 'chrome': chrome})

def parts(pid):
    return derived[pid]['parts']

def one(pid):
    p = parts(pid)
    assert len(p) == 1, (pid, len(p))
    return p[0]

def band(pid, i):
    """Band i (1-based) of a capture that was cut to fit a sheet."""
    return parts(pid)[i - 1]

def focus(pid, name):
    """Purpose-made crop that preserves a complete visual subject."""
    return derived[pid]['focus'][name]

def img(part, cls=''):
    return (f'<img class="{cls}" src="img/{part["file"]}" '
            f'width="{part["w"]}" height="{part["h"]}" alt="">')

def frame(part, url=None, note=None):
    bar = ('<div class="bar"><i></i><i></i><i></i>'
           f'<span class="url">{E(url)}</span></div>') if url else ''
    tag = f'<span class="band-tag">{E(note)}</span>' if note else ''
    return f'<div class="shotframe{" has-bar" if url else ""}">{bar}{img(part, "shot")}{tag}</div>'

def head(sec, title, meta=''):
    return (f'<header class="phead"><div class="phead-l">'
            f'<div class="eyebrow">{E(sec)}</div><h2>{title}</h2></div>'
            f'<div class="phead-r">{meta}</div></header>')

def chips(items):
    return ('<div class="chips">' + ''.join(f'<span>{E(c)}</span>' for c in items) + '</div>'
            ) if items else ''

def caption(text, items=None):
    return f'<footer class="pcap"><p>{text}</p>{chips(items)}</footer>'

def meta_chip(*vals):
    return ''.join(f'<span class="mchip">{E(v)}</span>' for v in vals if v)

def _sized(part, max_w, max_h, wrapper=None):
    """An image capped in absolute millimetres, optionally inside a device bezel.
    Absolute units on purpose: a percentage max-height inside a shrink-to-fit
    bezel has no definite parent to resolve against and is silently ignored."""
    pad = PAD.get(wrapper, 0.0)
    # The source width/height attributes reserve layout space, but they must not
    # be clamped independently by max-width/max-height: doing so distorts images
    # whenever the source aspect ratio differs from the grid cell (notably the
    # form confirmation and portrait team cards). Explicit auto dimensions make
    # the browser scale each image uniformly inside its available box.
    im = img(part).replace('<img ', f'<img style="width:auto;height:auto;'
                                    f'max-width:{max_w - 2 * pad:.2f}mm;'
                                    f'max-height:{max_h - 2 * pad:.2f}mm" ')
    if wrapper == 'phone':
        return f'<div class="phone">{im}</div>'
    if wrapper == 'tablet':
        return f'<div class="tablet">{im}</div>'
    if wrapper == 'plain':
        return f'<div class="shotframe">{im}</div>'
    return f'<div class="shotframe">{im}</div>'

# --------------------------------------------------------------- page recipes
def shot(pid, sec, title, cap, url=None, vp=None, part=None, chip=None, toc=None,
         inset=False):
    """One capture, full width. `part` picks a band of a capture that was cut."""
    p = part or parts(pid)[0]
    is_top = manifest.get(pid, {}).get('kind') == 'fold'
    add(head(sec, title, meta_chip(vp or UI['vp_desktop'], url or '')) +
        f'<div class="stage{" stage-inset" if inset else ""}">'
        f'{frame(p, url if is_top else None)}</div>' +
        caption(cap, chip), section=sec, toc=toc)

def grid(items, sec, title, cap, vp, cols, wrapper=None, toc=None, url=''):
    """Equal cells wrapped into centred rows. items: [(part, label)]."""
    n = len(items)
    nrows = max(1, math.ceil(n / cols))
    GX, GY, LABEL = 5.0, 5.0, 6.0
    w = (BOXW - GX * (cols - 1)) / cols
    has_labels = any(lbl for _, lbl in items)
    h = (BOXH - GY * (nrows - 1)) / nrows - (LABEL if has_labels else 0)
    cells = ''.join(
        f'<figure class="gcell" style="width:{w:.2f}mm">{_sized(p, w, h, wrapper)}'
        + (f'<figcaption class="glabel">{E(lbl)}</figcaption>' if lbl else '')
        + '</figure>' for p, lbl in items)
    add(head(sec, title, meta_chip(vp, url)) +
        f'<div class="stage"><div class="grid">{cells}</div></div>' + caption(cap),
        section=sec, toc=toc)

def bands(spec, sec, title, cap, vp, toc=None, url=''):
    """Rows of differing height. spec: [(height_mm, [(part, label, wrapper)])].
    Heights are declared rather than derived, so no row can overflow the sheet."""
    GY, GX, LABEL = 5.0, 5.0, 5.0
    total = sum(hh for hh, _ in spec) + GY * (len(spec) - 1)
    assert total <= BOXH + 0.01, f'{title}: rows total {total:.1f}mm > {BOXH}mm'
    out = []
    for hh, items in spec:
        has_labels = any(lbl for _, lbl, _ in items)
        ih = hh - (LABEL if has_labels else 0)
        w = (BOXW - GX * (len(items) - 1)) / len(items)
        cells = ''.join(
            f'<figure class="gcell" style="width:{w:.2f}mm">{_sized(p, w, ih, wr)}'
            + (f'<figcaption class="glabel">{E(lbl)}</figcaption>' if lbl else '')
            + '</figure>' for p, lbl, wr in items)
        out.append(f'<div class="grid" style="height:{hh:.2f}mm">{cells}</div>')
    add(head(sec, title, meta_chip(vp, url)) +
        f'<div class="stage stage-col">{"".join(out)}</div>' + caption(cap),
        section=sec, toc=toc)

def textpage(sec, title, blocks, toc=None):
    add(head(sec, title) + f'<div class="prose">{blocks}</div>', section=sec, toc=toc)

LOGO = ('<span class="logo"><span class="logo-mark">RCL</span>'
        '<span class="logo-words"><b>ROYAL CITY LABS</b><i>PROCESS CONTROL</i></span></span>')

CSS = '''
*{margin:0;padding:0;box-sizing:border-box}
:root{
 --primary:#042D7B; --orange:#D95F0F; --cyan:#2AA8FF; --sub:#A7B0BA;
 --ink:#2F4357; --paper:#F5F7FA; --line:#E3E9F0; --maple:#C8102E;
 --ui:"Saira",Arial,sans-serif; --display:"Exo 2",Arial,sans-serif; --body:"Barlow",Arial,sans-serif;
}
@page{size:297mm 210mm; margin:0}
html,body{background:#fff}
body{font-family:var(--body); color:var(--ink); -webkit-print-color-adjust:exact; print-color-adjust:exact}
.page{position:relative; width:297mm; height:210mm; overflow:hidden; break-after:page; background:#fff}
.page:last-child{break-after:auto}
.page.content{padding:11mm 14mm 9mm}
img{display:block}
.dot{color:var(--orange)}
.eyebrow{font:700 7.4pt var(--ui); letter-spacing:.19em; text-transform:uppercase; color:var(--cyan)}
.mono{font-family:var(--ui); font-size:.94em}

.phead{display:flex; align-items:flex-start; justify-content:space-between; gap:8mm; height:14mm}
.phead-l{min-width:0}
.phead h2{font:700 15.5pt/1.08 var(--display); color:var(--primary); letter-spacing:-.022em; margin-top:1.6mm}
.phead h2 .cont{font:600 10.5pt var(--ui); color:var(--sub); letter-spacing:.02em}
.phead-r{display:flex; flex-direction:column; align-items:flex-end; gap:1.3mm; flex:none; padding-top:.6mm}
.mchip{font:600 6.6pt var(--ui); letter-spacing:.11em; text-transform:uppercase; color:#7b8fa4;
 border:.28mm solid var(--line); border-radius:99mm; padding:1.1mm 2.6mm; white-space:nowrap; background:#fcfdfe}
.stage{height:152mm; display:flex; align-items:center; justify-content:center; margin-top:1mm}
.stage-col{flex-direction:column; gap:5mm}
.stage-inset{padding:6mm 8mm}
.stage-inset .shotframe .shot{max-height:140mm}

.shotframe{position:relative; max-width:100%; max-height:100%; border-radius:2.4mm; overflow:hidden;
 border:.28mm solid var(--line); box-shadow:0 1.4mm 5mm rgba(4,45,123,.10)}
.shotframe .shot{max-width:100%; max-height:152mm; width:auto; height:auto}
.shotframe.has-bar .shot{max-height:145mm}
.bar{display:flex; align-items:center; gap:1.4mm; height:6.4mm; padding:0 3mm;
 background:linear-gradient(#fbfcfe,#f1f5f9); border-bottom:.28mm solid var(--line)}
.bar i{width:1.7mm; height:1.7mm; border-radius:50%; background:#d3dce6}
.bar i:first-child{background:#e6b7a4}
.bar .url{margin-left:2mm; font:600 6.6pt var(--ui); letter-spacing:.05em; color:#8497aa;
 background:#fff; border:.25mm solid var(--line); border-radius:99mm; padding:.9mm 3mm}
.band-tag{position:absolute; right:2mm; bottom:1.6mm; font:700 6pt var(--ui); letter-spacing:.14em;
 text-transform:uppercase; color:#fff; background:rgba(4,45,123,.62); border-radius:99mm; padding:.9mm 2.4mm}

.pcap{position:absolute; left:14mm; right:14mm; bottom:9mm; padding-top:2.6mm; border-top:.28mm solid var(--line)}
.pcap p{font:500 8.1pt/1.42 var(--body); color:#4a6076; max-width:250mm}
.pcap p b{font-weight:700; color:var(--primary)}
.chips{display:flex; gap:1.6mm; flex-wrap:wrap; margin-top:2mm}
.chips span{font:600 6.4pt var(--ui); letter-spacing:.1em; text-transform:uppercase; color:var(--primary);
 background:#eef3f9; border-radius:99mm; padding:1mm 2.6mm}
.inline-tag{font:600 7pt var(--ui); letter-spacing:.08em; color:var(--primary); background:#eef3f9;
 border-radius:99mm; padding:.5mm 1.8mm}

.pfoot{position:absolute; left:14mm; right:14mm; bottom:4.2mm; display:flex; justify-content:space-between;
 font:600 6.2pt var(--ui); letter-spacing:.15em; text-transform:uppercase; color:#a8b7c6}
.pfoot .pno{color:var(--primary); font-weight:700; letter-spacing:.06em}

.grid{display:flex; flex-wrap:wrap; align-items:center; align-content:center;
 justify-content:center; gap:5mm; width:100%; height:100%}
.gcell{display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.8mm}
.glabel{font:700 6.2pt var(--ui); letter-spacing:.11em; text-transform:uppercase; color:#7b8fa4;
 text-align:center; max-width:100%}
.phone{border-radius:5mm; padding:1.1mm; background:linear-gradient(160deg,#16274a,#0a1730);
 box-shadow:0 1.8mm 6mm rgba(4,45,123,.22)}
.phone img{border-radius:4.1mm}
.tablet{border-radius:4mm; padding:1.4mm; background:linear-gradient(160deg,#e8edf4,#d5dde8);
 box-shadow:0 1.8mm 6mm rgba(4,45,123,.16)}
.tablet img{border-radius:2.8mm}

.page.cover{background:
 radial-gradient(115% 80% at 82% 8%, rgba(42,168,255,.30), transparent 58%),
 radial-gradient(80% 60% at 6% 96%, rgba(217,95,15,.22), transparent 60%),
 linear-gradient(155deg,#042D7B,#06336f 55%,#02214f);
 color:#fff; padding:16mm 18mm; display:flex; flex-direction:column; justify-content:space-between}
.cover:after{content:""; position:absolute; inset:0; pointer-events:none;
 background-image:linear-gradient(rgba(255,255,255,.045) .25mm,transparent .25mm),
 linear-gradient(90deg,rgba(255,255,255,.045) .25mm,transparent .25mm); background-size:11mm 11mm}
.cover>*{position:relative; z-index:1}
.cover .eyebrow{color:var(--cyan)}
.cover-mid h1{font:800 33pt/1.02 var(--display); letter-spacing:-.035em; margin:5mm 0 6mm; max-width:215mm}
.cover-mid p{font:500 11pt/1.5 var(--body); color:rgba(255,255,255,.76); max-width:150mm}
.cover-foot{display:flex; gap:22mm; padding-top:7mm; border-top:.3mm solid rgba(255,255,255,.22)}
.cover-foot div{display:flex; flex-direction:column; gap:1.6mm}
.cover-foot b{font:700 6.8pt var(--ui); letter-spacing:.19em; text-transform:uppercase; color:rgba(255,255,255,.5)}
.cover-foot span{font:600 11pt var(--display); color:#fff; letter-spacing:-.01em}
.page.cover.back .cover-mid h1{font-size:27pt}
.logo{display:inline-flex; align-items:center; gap:3.4mm}
.logo-mark{width:11mm; height:11mm; border-radius:50%; background:#fff; color:var(--primary);
 font:800 9.4pt var(--display); letter-spacing:-.02em; display:flex; align-items:center; justify-content:center}
.logo-words{display:flex; flex-direction:column; gap:.5mm}
.logo-words b{font:700 11.4pt var(--display); letter-spacing:.05em; color:#fff}
.logo-words i{font:600 6.4pt var(--ui); font-style:normal; letter-spacing:.26em; color:rgba(255,255,255,.6)}

.prose{margin-top:3mm; height:158mm; overflow:hidden}
.prose .lede{font:500 10pt/1.45 var(--body); color:var(--primary); max-width:230mm; margin-bottom:6mm}
.cols2{display:grid; grid-template-columns:1fr 1fr; gap:12mm; align-items:start}
.prose h3{font:700 10pt var(--display); color:var(--primary); letter-spacing:-.015em; margin:0 0 2.4mm}
.cols2>div>h3:not(:first-child), .prose>h3:not(:first-child){margin-top:6mm}
.prose p{font:500 8.2pt/1.46 var(--body); color:#4a6076; margin-bottom:2mm}
.prose p b{color:var(--primary); font-weight:700}
.prose .note{font-size:7.6pt; color:#7b8fa4; margin-top:3mm}
table.spec{width:100%; border-collapse:collapse}
table.spec th{width:34%; text-align:left; vertical-align:top; padding:1.7mm 3mm 1.7mm 0;
 font:700 7.2pt var(--ui); letter-spacing:.06em; color:var(--primary); border-top:.28mm solid var(--line)}
table.spec td{vertical-align:top; padding:1.7mm 0; font:500 8pt/1.4 var(--body); color:#4a6076;
 border-top:.28mm solid var(--line)}
table.spec.faults th{width:30%}
ul.ticks{list-style:none}
ul.ticks li{position:relative; padding:1.3mm 0 1.3mm 5.4mm; font:500 8pt/1.4 var(--body); color:#4a6076;
 border-top:.28mm solid var(--line)}
ul.ticks li:before{content:"›"; position:absolute; left:1mm; top:1.3mm; color:var(--orange); font-weight:700}
ul.ticks li b{color:var(--primary)}

.toc{list-style:none; width:100%; align-self:flex-start}
.toc .trow{display:flex; align-items:baseline; gap:3.4mm; padding:1.75mm 0; border-bottom:.28mm solid var(--line)}
.toc .tc{flex:0 0 8mm; font:700 7.4pt var(--ui); letter-spacing:.1em; color:var(--orange)}
.toc .tl{font:600 9.4pt var(--ui); color:var(--primary)}
.toc .dots{flex:1; border-bottom:.25mm dotted #ccd8e4; margin-bottom:1mm; min-width:8mm}
.toc .tn{font:700 9.6pt var(--display); color:var(--primary); min-width:8mm; text-align:right}
.toc-split{display:grid; grid-template-columns:1.06fr .94fr; gap:12mm; align-items:start; width:100%}

.sitemap{display:grid; grid-template-columns:1fr 1fr; gap:14mm}
.sm-h{font:700 7.4pt var(--ui); letter-spacing:.17em; text-transform:uppercase; color:var(--cyan);
 padding-bottom:2mm; border-bottom:.3mm solid var(--line); margin-bottom:1mm}
.sm-h b{color:var(--sub)}
.sm-list{list-style:none}
.sm-list li{display:flex; gap:4mm; padding:2.1mm 0; border-bottom:.28mm solid var(--line)}
.sm-list span{flex:0 0 44mm; font:600 8pt var(--ui); color:var(--primary)}
.sm-list i{font:500 7.9pt/1.35 var(--body); font-style:normal; color:#5c7288}
.sm-note{margin-top:5mm; font:500 7.8pt/1.4 var(--body); color:#7b8fa4}

.strips{display:grid; grid-template-columns:repeat(6,1fr); gap:5mm 4mm; width:100%; align-self:flex-start}
.strip figcaption{margin-top:1.8mm; font:700 6.2pt var(--ui); letter-spacing:.1em; text-transform:uppercase;
 color:#7b8fa4; text-align:center}
.strip-win{position:relative; height:54mm; overflow:hidden; border-radius:1.6mm;
 border:.28mm solid var(--line); box-shadow:0 .8mm 3mm rgba(4,45,123,.08)}
.strip-win img{width:100%; height:auto}
.strip-win:after{content:""; position:absolute; left:0; right:0; bottom:0; height:14mm;
 background:linear-gradient(transparent,#fff)}
'''

def render(out_name):
    for i, p in enumerate(pages):
        p['no'] = i + 1
    toc_rows = [(p['toc'], p['no']) for p in pages if p.get('toc')]
    shot_total = len(manifest)

    rows = []
    for label, no in list(UI.get('toc_front', [])) + toc_rows:
        num = UI['chapter_no'].get(label, '')
        rows.append(f'<li class="trow"><span class="tc">{num}</span>'
                    f'<span class="tl">{E(label)}</span><span class="dots"></span>'
                    f'<span class="tn">{no}</span></li>')
    toc_html = f'<ol class="toc">{"".join(rows)}</ol>'
    idx = UI['toc_index']
    pages[idx]['html'] = pages[idx]['html'].replace('{TOC}', toc_html)

    body = []
    for p in pages:
        inner = (p['html'].replace('{PAGECOUNT}', str(len(pages)))
                          .replace('{SHOTCOUNT}', str(shot_total)))
        if p['chrome'] == 'content':
            foot = (f'<div class="pfoot"><span>{UI["foot"]}</span>'
                    f'<span class="pno">{p["no"]}</span></div>')
        else:
            foot = ''
        cls = p['chrome'] + (' back' if UI['back_marker'] in inner else '')
        body.append(f'<section class="page {cls}">{inner}{foot}</section>')

    out = (f'<title>{UI["doc_title"]}</title>\n'
           f'<style>{FONTS_CSS}</style>\n<style>{CSS}</style>\n' + ''.join(body) + '\n')
    (BUILD / out_name).write_text(out, encoding='utf-8')
    print(f'{out_name} — {len(pages)} pages, {shot_total} captures indexed')

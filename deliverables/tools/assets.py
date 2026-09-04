# -*- coding: utf-8 -*-
"""Build assets for the preview document: the brand fonts lifted straight out of
the production CSS bundle, plus JPEG derivatives of every screenshot.

Run from this directory. Reads ../screenshots, writes ./build."""
import json, math, pathlib, re, shutil
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
PROJ = HERE.parent.parent
SHOTS = HERE.parent / 'screenshots'
BUILD = HERE / 'build'
IMG = BUILD / 'img'
FONTS = BUILD / 'fonts'
for d in (BUILD, IMG, FONTS):
    d.mkdir(parents=True, exist_ok=True)

# ------------------------------------------------------------------ brand fonts
css_files = sorted((PROJ / '.next/static/chunks').glob('*.css'))
if not css_files:
    raise SystemExit('No built CSS found — run `npm run build` in the project root first.')
css = css_files[0].read_text()
faces, copied = [], set()
for face in re.findall(r'@font-face\{[^}]*\}', css):
    if 'Fallback' in face:
        continue
    def repl(m):
        name = m.group(1).split('/')[-1]
        src = PROJ / '.next/static/media' / name
        if name not in copied and src.exists():
            shutil.copy(src, FONTS / name)
            copied.add(name)
        return f'url(fonts/{name})'
    faces.append(re.sub(r'url\(([^)]+)\)', repl, face))
(BUILD / 'fonts.css').write_text('\n'.join(faces))
print(f'fonts: {len(faces)} @font-face rules, {len(copied)} files')

# --------------------------------------------------------------------- geometry
BAND_ASPECT = 1.671    # the document's image box, width / height
WHOLE_MIN   = 1.55     # at or above this a capture fits one sheet uncut
OVERLAP     = 0.04     # band overlap, so no pixel row falls in a seam
FULL_W, PHONE_W, TABLET_W, STRIP_W = 2700, 1000, 1500, 420

def save(im, path, q=86):
    im.convert('RGB').save(path, 'JPEG', quality=q, subsampling=1,
                           optimize=True, progressive=True)

def fit(im, max_w):
    if im.width <= max_w:
        return im
    return im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)

def quiet_row(im, ideal, window):
    """Nudge a cut to the calmest pixel row nearby, so bands break in the gaps
    between blocks rather than through a headline."""
    lo, hi = max(1, ideal - window), min(im.height - 1, ideal + window)
    if hi <= lo:
        return ideal
    strip = im.convert('L').crop((0, lo, im.width, hi)).resize((64, hi - lo), Image.BILINEAR)
    px = strip.load()
    best, best_score = ideal, None
    for y in range(hi - lo):
        row = [px[x, y] for x in range(64)]
        mean = sum(row) / 64
        score = sum((v - mean) ** 2 for v in row) / 64
        if best_score is None or score < best_score:
            best, best_score = lo + y, score
    return best

manifest = json.loads((SHOTS / 'manifest.json').read_text())
derived = {}

for rec in manifest:
    im = Image.open(SHOTS / rec['file'])
    stem = rec['file'].rsplit('.', 1)[0]
    aspect = im.width / im.height
    kind, vp = rec.get('kind'), rec.get('vp')

    if kind == 'full':                                    # whole-page capture → thumbnail
        th = fit(im, STRIP_W)
        name = f'{stem}-strip.jpg'
        save(th, IMG / name, q=80)
        derived[rec['id']] = {'mode': 'strip',
                              'parts': [{'file': name, 'w': th.width, 'h': th.height}]}
        continue

    # discrete UI states and details are never cut: each is one object
    if (vp in ('mobile', 'tablet', 'tablet768') or kind in ('state', 'detail')
            or aspect >= WHOLE_MIN or im.height < 1200):
        max_w = (PHONE_W if vp == 'mobile'
                 else TABLET_W if vp and vp.startswith('tablet') else FULL_W)
        one = fit(im, max_w)
        name = f'{stem}.jpg'
        save(one, IMG / name)
        derived[rec['id']] = {'mode': 'whole',
                              'parts': [{'file': name, 'w': one.width, 'h': one.height}]}
        continue

    n = max(2, math.ceil(im.height * BAND_ASPECT / im.width))
    step = im.height / n
    cuts = [0] + [quiet_row(im, round(step * i), round(step * 0.16))
                  for i in range(1, n)] + [im.height]
    parts = []
    for i in range(n):
        top = cuts[i] if i == 0 else max(0, cuts[i] - round(step * OVERLAP))
        bottom = (cuts[i + 1] if i == n - 1
                  else min(im.height, cuts[i + 1] + round(step * OVERLAP)))
        band = fit(im.crop((0, top, im.width, bottom)), FULL_W)
        name = f'{stem}-b{i + 1}.jpg'
        save(band, IMG / name)
        parts.append({'file': name, 'w': band.width, 'h': band.height})
    derived[rec['id']] = {'mode': 'bands', 'parts': parts}

(BUILD / 'derived.json').write_text(json.dumps(derived, indent=1))
total = sum(len(v['parts']) for v in derived.values())
print(f'images: {len(derived)} captures → {total} JPEG parts, '
      f'{sum(f.stat().st_size for f in IMG.iterdir()) // 1048576} MB')

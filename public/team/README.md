# Team portraits

The five `*.jpg` files in this folder right now are **generated generic
placeholders** — a gradient background plus an abstract head-and-shoulders
silhouette (script: nothing checked into the repo, one-off), not stock
photos and not real people. They exist only so the flip-card layout could be
previewed with the photo slot filled in before the real photo shoot. Replace
every one of them with the real portrait as soon as it's available — do not
ship these to production.

Drop the real portraits here and point `photo` at them in `lib/team.ts`
(e.g. `photo: '/team/controls-automation-lead.jpg'`).

Specs
- Square crop, minimum 900 × 900 px (1200 px preferred), JPG or WebP, < 300 KB.
- Head-and-shoulders, subject looking at camera, eyes roughly on the upper third.
- Neutral or real plant background — consistent across the team.
- The card overlays a dark gradient over the bottom ~40%: keep that area free of detail.

Setting `photo: ''` in `lib/team.ts` falls back to the branded placeholder
portrait (a simple inline SVG icon) instead of one of these generated images.

'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { Locale } from '@/lib/content';

/* ─────────────────────────────────────────────────────────────────────────────
   CONTROL STACK — the hero object.

   Four thin slabs stacked in depth: FIELD (the plant the client already owns),
   then CONTROL, NETWORK and ANALYTICS arriving on top of it. Nothing here is
   shaped like equipment: the scene sells the engineering layer, not the machine.

   The narrative gesture is *arrival*, not illumination. A slab waits off-register
   in XZ, drifting and slightly rotated, until its stage locks it into place.
   One slab becomes four, so "disorder → system" is arithmetic the viewer can
   count rather than a lighting change they have to be told about.

   Colour rule, enforced throughout: orange marks the step being described right
   now — the stage tick, the focus bracket, the diagnostic probe — and nothing
   else. Structure is primary, live signal is cyan, the un-instrumented plant is
   ink, hairlines and pending layers are sub.
   ──────────────────────────────────────────────────────────────────────────── */

type Point3 = [number, number, number];
type LayerKind = 'field' | 'control' | 'network' | 'analytics';

/* Sourced verbatim from app/styles/tokens.css. The scene may not invent a hex:
   every colour below is one of these seven values or a mix of two of them. */
const CSS_TOKEN = {
  primary: '#042D7B',
  cyan: '#2AA8FF',
  orange: '#D95F0F',
  ink: '#2F4357',
  sub: '#A7B0BA',
  paper: '#F5F7FA',
  white: '#FFFFFF',
} as const;

const COLOR = {
  primary: new THREE.Color(CSS_TOKEN.primary),
  cyan: new THREE.Color(CSS_TOKEN.cyan),
  orange: new THREE.Color(CSS_TOKEN.orange),
  ink: new THREE.Color(CSS_TOKEN.ink),
  sub: new THREE.Color(CSS_TOKEN.sub),
  paper: new THREE.Color(CSS_TOKEN.paper),
  white: new THREE.Color(CSS_TOKEN.white),
};

/* Stage boundaries mirror `boundaries` in HeroExperience.tsx. The scene derives
   its own stage from scroll progress instead of reading the activeStage prop so
   that nothing in here depends on a React re-render. */
const STAGE_BOUNDARIES = [0.2, 0.4, 0.6, 0.8];
const STAGE_COUNT = 5;

/* Which slab each stage is about. AUDIT and DIAGNOSE both work on FIELD — the
   audit reveals the plant, the diagnosis finds the fault inside it — and the
   three later stages each add a layer. */
const STAGE_LAYER = [0, 0, 1, 2, 3];

/* The object is sized off the base plate, because the base plate is the widest
   thing in the scene and the camera looks at it obliquely: a square of side S
   seen at this yaw projects to roughly S * 1.41. At the old S = 3.55 that came
   to ~5.0 units against a ~5.3-unit-wide frame — 95%, which is why it read as
   too big and crowded the shell's inner hairline. Everything below is derived,
   so PLATE is the one number to nudge if the object needs to breathe more. */
const PLATE = 2.34;
const PLATE_THICKNESS = 0.075;
const PLATE_HALF = PLATE / 2;
const RISER_INSET = 0.14;
/** Slab-to-slab spacing. Four slabs plus the trend crown must stay in frame. */
const LAYER_STEP = 0.56;
const BASE_Y = -1.02;

type LayerSpec = {
  kind: LayerKind;
  y: number;
  /** Where the slab waits, off-register, before its stage locks it in. */
  drift: Point3;
  driftRotation: number;
  /** Scroll window over which it travels in and settles. */
  lock: [number, number];
};

/* Lock windows are deliberately narrow — about a tenth of the scroll each. A
   slab that dissolves in over 18% of the page reads as a slow fade; one that
   travels in over 10% and then sits still reads as an event that happened, with
   a held beat after it. That held beat is what makes the next arrival land. */
const LAYERS: LayerSpec[] = [
  { kind: 'field', y: BASE_Y + 0.4, drift: [0, 0, 0], driftRotation: 0, lock: [0, 0] },
  { kind: 'control', y: BASE_Y + 0.4 + LAYER_STEP, drift: [0.44, 0.14, -0.4], driftRotation: 0.3, lock: [0.42, 0.53] },
  { kind: 'network', y: BASE_Y + 0.4 + LAYER_STEP * 2, drift: [-0.48, 0.14, 0.36], driftRotation: -0.26, lock: [0.62, 0.73] },
  { kind: 'analytics', y: BASE_Y + 0.4 + LAYER_STEP * 3, drift: [0.38, 0.14, 0.44], driftRotation: 0.34, lock: [0.82, 0.93] },
];

/* Framing. One fixed camera cannot serve both ends of this story: at AUDIT it
   frames mostly empty air above a single slab, and at OPTIMIZE the finished
   four-slab stack crowds the frame. So the camera dollies out as the stack is
   built — which also gives the scroll something to do besides assemble slabs.
   Nudge these numbers to retune the composition; nothing else reads them. */
/* Tuned for the shell's 551 x 480 px aspect (~1.15). fov is vertical, so the
   box height sets how much *horizontal* room the object gets: a taller box is
   proportionally narrower, and at a fixed distance the object would crowd the
   side walls. Hence the camera pulls back as the box grows taller. Retune these
   together with the height in three-shell.css — they are one decision. */
const FRAMING = {
  start: { x: 3.84, y: 1.44, z: 5.1 },
  end: { x: 4.38, y: 2.12, z: 5.81 },
  /** Extra push-in while DIAGNOSE is the stage on screen. */
  inspect: { x: -0.33, y: -0.22, z: -0.44 },
} as const;

/* Where the frame is centred, in world Y. Both ends sit near where the
   *finished* stack will be rather than on whatever is solid at the time: the
   empty air above FIELD during AUDIT is the "three layers missing" argument, so
   the composition reserves it from the first paint instead of zooming out to
   make room later. */
const FRAME_CENTRE = { start: -0.06, end: 0.16 } as const;

function smoothstep(value: number, start: number, end: number) {
  const normalized = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}

/** A one-hump window: rises over [start, peak], falls over [peak, end]. */
function bump(value: number, start: number, peak: number, end: number) {
  return smoothstep(value, start, peak) * (1 - smoothstep(value, peak, end));
}

/* In static presentation only a single frame is ever rendered (frameloop
   'demand'), so damping with delta ≈ 0 would leave every value at its initial
   state. `snap` makes every animated value resolve to its target in that one
   frame instead. */
function approach(current: number, target: number, lambda: number, delta: number, snap: boolean) {
  return snap ? target : THREE.MathUtils.damp(current, target, lambda, delta);
}

/* A light spring for the arrival axes. Exponential damping alone approaches its
   target asymptotically, which is exactly why the assembly read as inert: it
   never actually *lands*. At this ratio (~0.62) a slab overshoots by a few
   percent and settles, which is what makes the arrival feel mechanical. */
const SPRING_STIFFNESS = 190;
const SPRING_DAMPING = 17;

function spring(current: number, velocity: number, target: number, delta: number) {
  const acceleration = (target - current) * SPRING_STIFFNESS - velocity * SPRING_DAMPING;
  const nextVelocity = velocity + acceleration * delta;
  return { value: current + nextVelocity * delta, velocity: nextVelocity };
}

/* The spring integrates explicitly, so a long frame (tab restored, GC pause)
   would overshoot into instability. One thirtieth is well inside its limit. */
const MAX_STEP = 1 / 30;

function stageFromProgress(progress: number) {
  let stage = 0;
  while (stage < STAGE_BOUNDARIES.length && progress > STAGE_BOUNDARIES[stage]) stage += 1;
  return stage;
}

function layerLock(index: number, progress: number) {
  if (index === 0) return 1;
  const [start, end] = LAYERS[index].lock;
  return smoothstep(progress, start, end);
}

/** How much this slab is the subject of the narrative right now. */
function layerFocus(index: number, progress: number) {
  if (index === 0) return 1 - smoothstep(progress, 0.3, 0.46);
  if (index === 1) return bump(progress, 0.36, 0.5, 0.66);
  if (index === 2) return bump(progress, 0.56, 0.7, 0.86);
  /* ANALYTICS keeps gaining focus all the way to the end of the scroll: OPTIMIZE
     is the one stage whose payoff is not a slab landing. */
  return smoothstep(progress, 0.78, 0.97);
}

/* OPTIMIZE's second act. The last slab lands at 0.93 but the reader scrolls to
   1.0 — about 14svh with nothing structural left to happen, which is what read
   as frozen. This window drives that beat: the loop closes and every slab's
   edge goes live, so the object finishes exactly when the copy does. */
function convergence(progress: number) {
  return smoothstep(progress, 0.9, 1);
}

/* The trend gets its OWN window rather than riding `convergence`.
   On `convergence` the chart was only half drawn at progress 0.95 — and the
   half that exists first is the flat left-hand end. The tall right-hand end,
   which is the entire point of drawing a trend, only appeared inside the last
   5% of the scroll, so raising TREND_RISE changed almost nothing the reader
   ever saw. Drawing across 0.84-0.95 instead puts the chart on screen at full
   height for the last tenth of the scroll, and lets it draw itself alongside
   the analytics slab's own arrival (lock 0.82-0.93) rather than after it. */
function trendDraw(progress: number) {
  return smoothstep(progress, 0.84, 0.95);
}

/** Every animated number for one slab, from progress alone. */
function layerVisual(index: number, progress: number) {
  const lock = layerLock(index, progress);
  const focus = layerFocus(index, progress);
  const settle = 1 - lock;
  /* FIELD never travels — it is the plant, already there. What changes is
     whether it has been absorbed into a system, which happens when the control
     layer lands on it. */
  const integration = index === 0 ? smoothstep(progress, 0.36, 0.58) : lock;
  const isField = index === 0;
  /* Until OPTIMIZE only the slab under discussion is bright. At OPTIMIZE they
     all come up together — the argument is no longer "a layer arrived" but
     "the whole thing is running". */
  const converged = convergence(progress);

  return {
    lock,
    focus,
    settle,
    integration,
    converged,
    plateOpacity: THREE.MathUtils.clamp(
      (isField ? 0.17 + integration * 0.05 + focus * 0.05 : 0.06 + lock * 0.08 + focus * 0.08) + converged * 0.05,
      0,
      1,
    ),
    outlineOpacity: THREE.MathUtils.clamp(
      (isField ? 0.4 + integration * 0.24 + focus * 0.32 : 0.16 + lock * 0.44 + focus * 0.36) + converged * 0.18,
      0,
      1,
    ),
    /* The legacy readout is what the audit reveals, so it is legible from the
       first frame; the upper layers only render once they have arrived. */
    readoutOpacity: THREE.MathUtils.clamp(
      (isField ? 0.38 + focus * 0.44 : lock * (0.26 + focus * 0.62)) + converged * 0.14,
      0,
      1,
    ),
    signalMix: THREE.MathUtils.clamp(integration * (0.26 + focus * 0.58) + converged * 0.45, 0, 1),
  };
}

const DIAGNOSE_WINDOW: [number, number, number] = [0.15, 0.28, 0.46];

function pseudoRandom(x: number, y: number, seed: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 19.19) * 43758.5453;
  return value - Math.floor(value);
}

function rgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Procedural readouts ──────────────────────────────────────────────────────
   Each slab carries a different kind of work on its face, so the four layers
   are not four copies of the same thing: a patchy legacy grid, a control
   program, a routing graph, a trend. Canvas only — no external asset. */

function drawFieldReadout(ctx: CanvasRenderingContext2D, size: number) {
  const cells = 8;
  const step = size / cells;
  ctx.lineWidth = 2;
  ctx.strokeStyle = rgba(CSS_TOKEN.ink, 0.42);

  /* The legacy plant is documented in patches, not end to end: each grid
     segment survives only if the gate opens. */
  for (let i = 1; i < cells; i += 1) {
    for (let j = 0; j < cells; j += 1) {
      if (pseudoRandom(i, j, 3) < 0.7) {
        ctx.beginPath();
        ctx.moveTo(i * step, j * step);
        ctx.lineTo(i * step, (j + 1) * step);
        ctx.stroke();
      }
      if (pseudoRandom(j, i, 11) < 0.7) {
        ctx.beginPath();
        ctx.moveTo(j * step, i * step);
        ctx.lineTo((j + 1) * step, i * step);
        ctx.stroke();
      }
    }
  }

  /* Three cells whose behaviour nobody can account for. */
  ctx.fillStyle = rgba(CSS_TOKEN.ink, 0.15);
  ([[1, 5], [4, 2], [6, 6]] as const).forEach(([cx, cy]) => {
    ctx.fillRect(cx * step, cy * step, step, step);
  });
}

function drawControlReadout(ctx: CanvasRenderingContext2D, size: number) {
  const step = size / 8;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = rgba(CSS_TOKEN.primary, 0.2);
  for (let i = 1; i < 8; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * step, 0);
    ctx.lineTo(i * step, size);
    ctx.moveTo(0, i * step);
    ctx.lineTo(size, i * step);
    ctx.stroke();
  }

  /* Two rails and three rungs — the shape of a control program, with a contact
     interrupting each rung. */
  const left = step * 1.15;
  const right = size - step * 1.15;
  ctx.strokeStyle = rgba(CSS_TOKEN.cyan, 0.9);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(left, step * 1.15);
  ctx.lineTo(left, size - step * 1.15);
  ctx.moveTo(right, step * 1.15);
  ctx.lineTo(right, size - step * 1.15);
  ctx.stroke();

  ctx.lineWidth = 3;
  [0.3, 0.5, 0.7].forEach((t, rung) => {
    const y = size * t;
    const gapCenter = size * (0.4 + rung * 0.08);
    const gap = step * 0.42;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(gapCenter - gap, y);
    ctx.moveTo(gapCenter + gap, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gapCenter - gap, y - step * 0.3);
    ctx.lineTo(gapCenter - gap, y + step * 0.3);
    ctx.moveTo(gapCenter + gap, y - step * 0.3);
    ctx.lineTo(gapCenter + gap, y + step * 0.3);
    ctx.stroke();
  });
}

function drawNetworkReadout(ctx: CanvasRenderingContext2D, size: number) {
  const nodes: Array<[number, number]> = [];
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      nodes.push([size * (0.18 + i * 0.213), size * (0.18 + j * 0.213)]);
    }
  }

  ctx.strokeStyle = rgba(CSS_TOKEN.cyan, 0.5);
  ctx.lineWidth = 2;
  nodes.forEach(([x, y], index) => {
    const column = Math.floor(index / 4);
    const row = index % 4;
    if (row < 3) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nodes[index + 1][0], nodes[index + 1][1]);
      ctx.stroke();
    }
    if (column < 3) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nodes[index + 4][0], nodes[index + 4][1]);
      ctx.stroke();
    }
  });

  /* Two routes carry more than the rest — the graph has a topology, not just
     a mesh. */
  ctx.strokeStyle = rgba(CSS_TOKEN.cyan, 0.95);
  ctx.lineWidth = 5;
  ([[0, 5, 10, 15], [12, 9, 6, 3]] as const).forEach((route) => {
    ctx.beginPath();
    ctx.moveTo(nodes[route[0]][0], nodes[route[0]][1]);
    route.slice(1).forEach((index) => ctx.lineTo(nodes[index][0], nodes[index][1]));
    ctx.stroke();
  });

  ctx.fillStyle = rgba(CSS_TOKEN.primary, 0.9);
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

/* Plot ground only — grid, axis and ticks. This used to draw a whole second
   chart here (area fill, thick curve, endpoint dot) while the 3D trend stood on
   top of the same slab in a different orientation. Two charts fighting over one
   face is what made the analytics layer read as crooked. The face is the paper;
   the columns are the data. */
function drawAnalyticsReadout(ctx: CanvasRenderingContext2D, size: number) {
  const left = size * 0.12;
  const right = size * 0.88;
  const bottom = size * 0.86;
  const top = size * 0.14;

  ctx.strokeStyle = rgba(CSS_TOKEN.sub, 0.5);
  ctx.lineWidth = 1.5;
  for (let i = 1; i < 5; i += 1) {
    const y = top + ((bottom - top) * i) / 5;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
  }

  /* One tick per column of the 3D trend, so the paper is ruled to the data
     standing on it. */
  ctx.strokeStyle = rgba(CSS_TOKEN.primary, 0.3);
  ctx.lineWidth = 2;
  for (let i = 0; i < TREND_COLUMNS; i += 1) {
    const x = left + ((right - left) * i) / (TREND_COLUMNS - 1);
    ctx.beginPath();
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, bottom - size * 0.035);
    ctx.stroke();
  }

  ctx.strokeStyle = rgba(CSS_TOKEN.primary, 0.6);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(left, bottom);
  ctx.lineTo(right, bottom);
  ctx.moveTo(left, bottom);
  ctx.lineTo(left, top);
  ctx.stroke();
}

function createReadoutTexture(kind: LayerKind) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (kind === 'field') drawFieldReadout(ctx, size);
    else if (kind === 'control') drawControlReadout(ctx, size);
    else if (kind === 'network') drawNetworkReadout(ctx, size);
    else drawAnalyticsReadout(ctx, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function createContactShadowTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, rgba(CSS_TOKEN.primary, 0.42));
    gradient.addColorStop(0.55, rgba(CSS_TOKEN.primary, 0.14));
    gradient.addColorStop(1, rgba(CSS_TOKEN.primary, 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function useStackTextures() {
  const textures = useMemo(
    () => ({
      field: createReadoutTexture('field'),
      control: createReadoutTexture('control'),
      network: createReadoutTexture('network'),
      analytics: createReadoutTexture('analytics'),
      shadow: createContactShadowTexture(),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(textures).forEach((texture) => texture.dispose());
    },
    [textures],
  );

  return textures;
}

type StackTextures = ReturnType<typeof useStackTextures>;

/* ── Geometry buffers ─────────────────────────────────────────────────────── */

/** Closed rectangle outline on a slab's top face, as line segments. */
function plateOutlinePositions() {
  const h = PLATE_HALF;
  const y = PLATE_THICKNESS / 2 + 0.002;
  const corners: Point3[] = [
    [-h, y, -h],
    [h, y, -h],
    [h, y, h],
    [-h, y, h],
  ];
  const positions = new Float32Array(corners.length * 2 * 3);
  corners.forEach((corner, index) => {
    const next = corners[(index + 1) % corners.length];
    positions.set([...corner, ...next], index * 6);
  });
  return positions;
}

/** Routing lattice for the NETWORK slab, in its local XZ plane. */
function routingPositions() {
  const span = PLATE_HALF * 0.78;
  const divisions = 4;
  const y = PLATE_THICKNESS / 2 + 0.05;
  const segments: number[] = [];
  for (let i = 0; i <= divisions; i += 1) {
    const t = -span + (i / divisions) * span * 2;
    segments.push(-span, y, t, span, y, t);
    segments.push(t, y, -span, t, y, span);
  }
  return new Float32Array(segments);
}

/* The trend, as columns standing on the ANALYTICS slab.

   It used to be a polyline in the slab's local XY plane — a flat billboard
   whose horizontal axis receded diagonally away from the camera, so its
   baseline was never level on screen and the whole chart looked sheared.
   Columns fix that geometrically: they are vertical in world space and their
   footprints sit on the slab's own top face, so the chart shares the object's
   perspective instead of fighting it. */
/* How far the tallest column climbs above its slab. This is the one number that
   decides how much the object *looks* like growth, so it is named rather than
   inlined: at 0.78 the crown reaches world y ~1.9 against a frame ceiling of
   2.74, and the climb reads at about 36° once the camera's oblique yaw
   foreshortens the horizontal run. Raising it lifts the top of the whole
   object, so re-check the frame headroom and the gap to the layer chips. */
const TREND_RISE = 0.78;

const TREND_COLUMNS = 9;
const TREND_SPAN = PLATE_HALF * 1.44;
const TREND_FOOT = 0.078;
const TREND_BASE = PLATE_THICKNESS / 2;

function trendX(index: number) {
  return -TREND_SPAN / 2 + (index / (TREND_COLUMNS - 1)) * TREND_SPAN;
}

/** Gently convex, so the chart accelerates rather than ramping in a straight
    line — the classic shape of growth — with a ripple small enough that the
    climb still dominates but present enough to read as measured data. */
function trendHeight(index: number) {
  const t = index / (TREND_COLUMNS - 1);
  return 0.05 + TREND_RISE * (t * 0.66 + t * t * 0.34) + Math.sin(t * 4.4) * 0.018;
}

/** The line across the column tops, left to right so drawRange draws it. */
const TREND_LINE = (() => {
  const out: number[] = [];
  for (let i = 0; i < TREND_COLUMNS - 1; i += 1) {
    out.push(trendX(i), TREND_BASE + trendHeight(i), 0);
    out.push(trendX(i + 1), TREND_BASE + trendHeight(i + 1), 0);
  }
  return new Float32Array(out);
})();
const TREND_LINE_VERTICES = TREND_LINE.length / 3;

const PLATE_OUTLINE = plateOutlinePositions();
const ROUTING_LATTICE = routingPositions();


/** 4 x 4 studs on the FIELD slab — the plant's physical measuring points. */
const FIELD_NODES: Point3[] = (() => {
  const nodes: Point3[] = [];
  const span = PLATE_HALF * 0.62;
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      nodes.push([
        -span + (i / 3) * span * 2,
        PLATE_THICKNESS / 2 + 0.028,
        -span + (j / 3) * span * 2,
      ]);
    }
  }
  return nodes;
})();

/** The one measuring point the diagnosis lands on. */
const FAULT_NODE = 9;

/* The columns rise one after another, left to right, and the trend line draws
   across their tops in step — a chart building itself, which is a better use of
   the OPTIMIZE beat than a single line unrolling. */
function TrendChart({ progress, snap }: { progress: MutableRefObject<number>; snap: boolean }) {
  const columns = useRef<THREE.InstancedMesh>(null);
  const line = useRef<THREE.BufferGeometry>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const drawn = snap ? 1 : trendDraw(progress.current);

    if (columns.current) {
      for (let index = 0; index < TREND_COLUMNS; index += 1) {
        /* Each column owns a slice of the window, overlapping its neighbours so
           the rise is a wave rather than nine separate pops. */
        const start = (index / TREND_COLUMNS) * 0.72;
        const local = THREE.MathUtils.clamp((drawn - start) / 0.28, 0, 1);
        const height = Math.max(0.001, trendHeight(index) * (local * local * (3 - 2 * local)));
        dummy.position.set(trendX(index), TREND_BASE + height / 2, 0);
        dummy.scale.set(1, height, 1);
        dummy.updateMatrix();
        columns.current.setMatrixAt(index, dummy.matrix);
      }
      columns.current.instanceMatrix.needsUpdate = true;
    }

    /* LineSegments takes two vertices per segment, so the range must be even. */
    if (line.current) {
      line.current.setDrawRange(0, Math.floor((TREND_LINE_VERTICES * drawn) / 2) * 2);
    }
  });

  return (
    <group>
      <instancedMesh ref={columns} args={[undefined, undefined, TREND_COLUMNS]}>
        <boxGeometry args={[TREND_FOOT, 1, TREND_FOOT]} />
        <meshStandardMaterial
          color={CSS_TOKEN.cyan}
          transparent
          opacity={0.46}
          metalness={0.1}
          roughness={0.4}
        />
      </instancedMesh>
      <lineSegments>
        <bufferGeometry ref={line}>
          <bufferAttribute attach="attributes-position" args={[TREND_LINE, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={CSS_TOKEN.cyan} transparent opacity={0.95} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

/* ── One slab ─────────────────────────────────────────────────────────────── */

function StackLayer({
  spec,
  index,
  progress,
  snap,
  textures,
}: {
  spec: LayerSpec;
  index: number;
  progress: MutableRefObject<number>;
  snap: boolean;
  textures: StackTextures;
}) {
  const group = useRef<THREE.Group>(null);
  const plate = useRef<THREE.MeshStandardMaterial>(null);
  const outline = useRef<THREE.LineBasicMaterial>(null);
  const readout = useRef<THREE.MeshBasicMaterial>(null);
  const overlay = useRef<THREE.LineBasicMaterial>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const flash = useRef(0);
  const wasLocked = useRef(snap);
  /** Spring velocities for the arrival axes: x, y, z and the settling spin. */
  const arrival = useRef({ x: 0, y: 0, z: 0, spin: 0 });
  const elapsed = useRef(0);
  const scratch = useMemo(() => new THREE.Color(), []);
  const nodeColor = useMemo(() => new THREE.Color(), []);
  const nodeDummy = useMemo(() => new THREE.Object3D(), []);

  const overlayPositions = spec.kind === 'network' ? ROUTING_LATTICE : null;

  const initial = useMemo(() => layerVisual(index, snap ? 1 : 0), [index, snap]);

  /* Node matrices never change; only their colour does. */
  useEffect(() => {
    const mesh = nodes.current;
    if (!mesh) return;
    FIELD_NODES.forEach((position, nodeIndex) => {
      nodeDummy.position.set(position[0], position[1], position[2]);
      nodeDummy.updateMatrix();
      mesh.setMatrixAt(nodeIndex, nodeDummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [nodeDummy]);

  useFrame(({ clock }, delta) => {
    const step = Math.min(delta, MAX_STEP);
    elapsed.current = clock.getElapsedTime();
    const p = progress.current;
    const visual = layerVisual(index, p);
    const settled = visual.lock > 0.92;

    if (settled && !wasLocked.current) flash.current = 1;
    wasLocked.current = settled;
    flash.current = approach(flash.current, 0, 3.2, step, snap);

    if (group.current) {
      /* Unlocked slabs hang off-register and slightly high, then travel in and
         land. The arrival is the whole argument, so it is a sprung translation
         the viewer can see — not a fade, and not an ease that never arrives. */
      /* A slab that has not been brought into the system is not parked, it is
         adrift — a slow wobble that only exists while `settle` does. Without it
         AUDIT and DIAGNOSE had nothing moving in them at all. */
      const adrift = snap ? 0 : visual.settle * 0.035;
      const wobble = elapsed.current;
      const targetX = spec.drift[0] * visual.settle + Math.sin(wobble * 0.7 + index) * adrift;
      const targetY =
        spec.y + spec.drift[1] * visual.settle + visual.focus * 0.075 + Math.sin(wobble * 0.5 + index * 2) * adrift;
      const targetZ = spec.drift[2] * visual.settle + Math.cos(wobble * 0.6 + index * 1.7) * adrift;
      const targetSpin = spec.driftRotation * visual.settle + Math.sin(wobble * 0.4 + index) * adrift * 0.5;

      if (snap) {
        group.current.position.set(targetX, targetY, targetZ);
        group.current.rotation.y = targetSpin;
        arrival.current.x = 0;
        arrival.current.y = 0;
        arrival.current.z = 0;
        arrival.current.spin = 0;
      } else {
        const sx = spring(group.current.position.x, arrival.current.x, targetX, step);
        const sy = spring(group.current.position.y, arrival.current.y, targetY, step);
        const sz = spring(group.current.position.z, arrival.current.z, targetZ, step);
        const ss = spring(group.current.rotation.y, arrival.current.spin, targetSpin, step);
        group.current.position.set(sx.value, sy.value, sz.value);
        group.current.rotation.y = ss.value;
        arrival.current.x = sx.velocity;
        arrival.current.y = sy.velocity;
        arrival.current.z = sz.velocity;
        arrival.current.spin = ss.velocity;
      }
    }

    if (plate.current) {
      plate.current.opacity = approach(plate.current.opacity, visual.plateOpacity, 9, step, snap);
      scratch.copy(index === 0 ? COLOR.ink : COLOR.primary);
      if (index === 0) scratch.lerp(COLOR.primary, visual.integration);
      plate.current.color.lerp(scratch, snap ? 1 : 1 - Math.exp(-9 * step));
    }

    if (outline.current) {
      outline.current.opacity = approach(
        outline.current.opacity,
        visual.outlineOpacity + flash.current * 0.35,
        11,
        step,
        snap,
      );
      /* The edge is where the slab reads as locked: primary while it is only
         structure, cyan once it is carrying signal, whitened for the instant it
         snaps into register. */
      scratch.copy(COLOR.primary).lerp(COLOR.cyan, visual.signalMix).lerp(COLOR.white, flash.current * 0.55);
      outline.current.color.lerp(scratch, snap ? 1 : 1 - Math.exp(-11 * step));
    }

    if (readout.current) {
      readout.current.opacity = approach(readout.current.opacity, visual.readoutOpacity, 9, step, snap);
    }

    if (overlay.current) {
      overlay.current.opacity = approach(
        overlay.current.opacity,
        visual.lock * (0.28 + visual.focus * 0.6),
        9,
        step,
        snap,
      );
    }


    if (nodes.current) {
      const diagnose = snap ? 0 : bump(p, DIAGNOSE_WINDOW[0], DIAGNOSE_WINDOW[1], DIAGNOSE_WINDOW[2]);
      for (let nodeIndex = 0; nodeIndex < FIELD_NODES.length; nodeIndex += 1) {
        nodeColor.copy(COLOR.ink).lerp(COLOR.cyan, visual.integration * 0.85);
        if (nodeIndex === FAULT_NODE) nodeColor.lerp(COLOR.orange, diagnose);
        nodes.current.setColorAt(nodeIndex, nodeColor);
      }
      if (nodes.current.instanceColor) nodes.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group
      ref={group}
      position={[
        spec.drift[0] * initial.settle,
        spec.y + spec.drift[1] * initial.settle + initial.focus * 0.075,
        spec.drift[2] * initial.settle,
      ]}
      rotation={[0, spec.driftRotation * initial.settle, 0]}
    >
      <RoundedBox args={[PLATE, PLATE_THICKNESS, PLATE]} radius={0.03} smoothness={2}>
        <meshStandardMaterial
          ref={plate}
          color={index === 0 ? CSS_TOKEN.ink : CSS_TOKEN.primary}
          transparent
          opacity={initial.plateOpacity}
          metalness={0.12}
          roughness={0.44}
        />
      </RoundedBox>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[PLATE_OUTLINE, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={outline}
          color={CSS_TOKEN.primary}
          transparent
          opacity={initial.outlineOpacity}
          toneMapped={false}
        />
      </lineSegments>

      {/* toneMapped={false} keeps the readout at the exact token colours the
          canvas was drawn with, instead of letting the renderer shift them. */}
      <mesh position={[0, PLATE_THICKNESS / 2 + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PLATE * 0.84, PLATE * 0.84]} />
        <meshBasicMaterial
          ref={readout}
          map={textures[spec.kind]}
          transparent
          opacity={initial.readoutOpacity}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {spec.kind === 'analytics' ? <TrendChart progress={progress} snap={snap} /> : null}

      {spec.kind === 'field' ? (
        <instancedMesh ref={nodes} args={[undefined, undefined, FIELD_NODES.length]}>
          <boxGeometry args={[0.085, 0.055, 0.085]} />
          <meshStandardMaterial metalness={0.2} roughness={0.4} toneMapped={false} />
        </instancedMesh>
      ) : null}

      {overlayPositions ? (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[overlayPositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={overlay}
            color={CSS_TOKEN.cyan}
            transparent
            opacity={initial.lock * 0.3}
            toneMapped={false}
          />
        </lineSegments>
      ) : null}
    </group>
  );
}

/* ── Risers and their traffic ─────────────────────────────────────────────── */

const RISER_CORNERS: Array<[number, number]> = [
  [-(PLATE_HALF - RISER_INSET), -(PLATE_HALF - RISER_INSET)],
  [PLATE_HALF - RISER_INSET, -(PLATE_HALF - RISER_INSET)],
  [PLATE_HALF - RISER_INSET, PLATE_HALF - RISER_INSET],
  [-(PLATE_HALF - RISER_INSET), PLATE_HALF - RISER_INSET],
];

const RISER_COUNT = 3 * RISER_CORNERS.length;

/* Each corner's post starts a little after the one before it, so the risers zip
   up rather than all four appearing at the same instant. */
const RISER_STAGGER = 0.035;

/* Telemetry rises on all four corners. The return flow — advanced control
   writing setpoints back down the stack — descends on two of them, which is
   what actually makes OPTIMIZE different from CONNECT: the loop closes. Two
   corners rather than four so it reads as a second flow and not as noise. */
const RETURN_CORNERS = [2, 3];
const RETURN_COUNT = 3 * RETURN_CORNERS.length;

function Risers({
  progress,
  velocity,
  snap,
}: {
  progress: MutableRefObject<number>;
  velocity: MutableRefObject<number>;
  snap: boolean;
}) {
  const posts = useRef<THREE.InstancedMesh>(null);
  const pulses = useRef<THREE.InstancedMesh>(null);
  const returns = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const p = progress.current;
    const time = clock.getElapsedTime();

    if (posts.current) {
      for (let gap = 0; gap < 3; gap += 1) {
        const from = LAYERS[gap].y + PLATE_THICKNESS / 2;
        const to = LAYERS[gap + 1].y - PLATE_THICKNESS / 2;
        RISER_CORNERS.forEach(([x, z], corner) => {
          const lock = layerLock(gap + 1, p - corner * RISER_STAGGER);
          const height = Math.max(0.001, (to - from) * lock);
          dummy.position.set(x, from + height / 2, z);
          dummy.scale.set(Math.max(0.001, lock), height, Math.max(0.001, lock));
          dummy.updateMatrix();
          posts.current?.setMatrixAt(gap * RISER_CORNERS.length + corner, dummy.matrix);
        });
      }
      posts.current.instanceMatrix.needsUpdate = true;
    }

    if (pulses.current) {
      for (let gap = 0; gap < 3; gap += 1) {
        const lock = layerLock(gap + 1, p);
        /* Traffic gets faster as more of the stack comes online — the plant is
           not just connected, it is being used — faster again once the loop
           closes, and faster again while the reader is actually scrolling, so
           the object answers the wheel. */
        const speed =
          0.22 + smoothstep(p, 0.6, 1) * 0.26 + convergence(p) * 0.3 + Math.abs(velocity.current) * 0.5;
        const from = LAYERS[gap].y + PLATE_THICKNESS / 2;
        const to = LAYERS[gap + 1].y - PLATE_THICKNESS / 2;
        RISER_CORNERS.forEach(([x, z], corner) => {
          const phase = snap
            ? 0.5
            : (time * speed + corner / RISER_CORNERS.length + gap * 0.17) % 1;
          const scale = Math.max(0.001, lock * (0.55 + Math.sin(phase * Math.PI) * 0.5) * 0.062);
          dummy.position.set(x, THREE.MathUtils.lerp(from, to, phase), z);
          dummy.scale.setScalar(scale);
          dummy.updateMatrix();
          pulses.current?.setMatrixAt(gap * RISER_CORNERS.length + corner, dummy.matrix);
        });
      }
      pulses.current.instanceMatrix.needsUpdate = true;
    }

    if (returns.current) {
      const loop = convergence(p);
      const speed = 0.3 + Math.abs(velocity.current) * 0.4;
      for (let gap = 0; gap < 3; gap += 1) {
        const from = LAYERS[gap].y + PLATE_THICKNESS / 2;
        const to = LAYERS[gap + 1].y - PLATE_THICKNESS / 2;
        for (let slot = 0; slot < RETURN_CORNERS.length; slot += 1) {
          const [x, z] = RISER_CORNERS[RETURN_CORNERS[slot]];
          /* Descending: phase runs from the analytics end back down. */
          const phase = snap ? 0.5 : 1 - ((time * speed + slot / 2 + gap * 0.23) % 1);
          const scale = Math.max(0.001, loop * (0.5 + Math.sin(phase * Math.PI) * 0.5) * 0.05);
          dummy.position.set(x, THREE.MathUtils.lerp(from, to, phase), z);
          dummy.scale.setScalar(scale);
          dummy.updateMatrix();
          returns.current.setMatrixAt(gap * RETURN_CORNERS.length + slot, dummy.matrix);
        }
      }
      returns.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={posts} args={[undefined, undefined, RISER_COUNT]}>
        <cylinderGeometry args={[0.021, 0.021, 1, 8]} />
        <meshStandardMaterial color={CSS_TOKEN.primary} metalness={0.3} roughness={0.4} transparent opacity={0.62} />
      </instancedMesh>
      <instancedMesh ref={pulses} args={[undefined, undefined, RISER_COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={CSS_TOKEN.cyan} transparent opacity={0.92} toneMapped={false} />
      </instancedMesh>
      {/* The return flow. Same cyan — direction is the signal, and orange stays
          reserved for "the step being described right now" — but a tetrahedron
          instead of an octahedron so the two flows stay separable. */}
      <instancedMesh ref={returns} args={[undefined, undefined, RETURN_COUNT]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={CSS_TOKEN.cyan} transparent opacity={0.8} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/* ── "You are here" ──────────────────────────────────────────────────────────
   The single orange element that tracks the narrative: four corner brackets
   that ride to whichever slab the current stage is about. */

const BRACKET_ARM = PLATE * 0.15;
const BRACKET_COUNT = 8;

function FocusBracket({ progress, snap }: { progress: MutableRefObject<number>; snap: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    let slot = 0;
    ([-1, 1] as const).forEach((sx) => {
      ([-1, 1] as const).forEach((sz) => {
        /* Each corner gets one arm along X and one along Z. The second arm is
           the same bar turned a quarter turn, not the same bar scaled on an
           axis it has no length on. */
        dummy.scale.set(BRACKET_ARM, 1, 1);

        dummy.rotation.set(0, 0, 0);
        dummy.position.set(sx * (PLATE_HALF - BRACKET_ARM / 2), 0, sz * PLATE_HALF);
        dummy.updateMatrix();
        instanced.setMatrixAt(slot, dummy.matrix);
        slot += 1;

        dummy.rotation.set(0, Math.PI / 2, 0);
        dummy.position.set(sx * PLATE_HALF, 0, sz * (PLATE_HALF - BRACKET_ARM / 2));
        dummy.updateMatrix();
        instanced.setMatrixAt(slot, dummy.matrix);
        slot += 1;
      });
    });
    instanced.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const p = progress.current;
    const stage = stageFromProgress(p);
    const target = LAYERS[STAGE_LAYER[stage]];
    const focus = layerFocus(STAGE_LAYER[stage], p);
    const y = target.y + focus * 0.075 + PLATE_THICKNESS / 2 + 0.012;
    group.current.position.y = approach(group.current.position.y, y, 9, delta, snap);
    const breathe = snap ? 1 : 0.9 + Math.sin(clock.getElapsedTime() * 1.5) * 0.1;
    group.current.scale.setScalar(approach(group.current.scale.x, breathe, 4, delta, snap));
  });

  const initialStage = snap ? STAGE_COUNT - 1 : 0;

  return (
    <group ref={group} position={[0, LAYERS[STAGE_LAYER[initialStage]].y + PLATE_THICKNESS / 2 + 0.012, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, BRACKET_COUNT]}>
        <boxGeometry args={[1, 0.014, 0.032]} />
        <meshBasicMaterial color={CSS_TOKEN.orange} transparent opacity={0.9} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/* ── The diagnostic probe ─────────────────────────────────────────────────── */

function DiagnosticProbe({ progress, snap }: { progress: MutableRefObject<number>; snap: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shaft = useRef<THREE.MeshBasicMaterial>(null);
  const ring = useRef<THREE.MeshBasicMaterial>(null);
  const fault = FIELD_NODES[FAULT_NODE];

  useFrame((_, delta) => {
    const p = progress.current;
    /* One attention point, one stage. The probe exists only while DIAGNOSE is
       on screen; the fault node it lands on stays orange for that window too. */
    const active = snap ? 0 : bump(p, DIAGNOSE_WINDOW[0], DIAGNOSE_WINDOW[1], DIAGNOSE_WINDOW[2]);
    if (group.current) {
      group.current.scale.setScalar(Math.max(0.001, approach(group.current.scale.x, active, 6, delta, snap)));
      group.current.position.y = approach(group.current.position.y, (1 - active) * 0.5, 5, delta, snap);
    }
    if (shaft.current) shaft.current.opacity = approach(shaft.current.opacity, active * 0.5, 6, delta, snap);
    if (ring.current) ring.current.opacity = approach(ring.current.opacity, active * 0.8, 6, delta, snap);
  });

  return (
    <group ref={group} scale={0.001} position={[0, 0.5, 0]}>
      <mesh position={[fault[0], LAYERS[0].y + 1.15, fault[2]]}>
        <cylinderGeometry args={[0.008, 0.008, 2.1, 6]} />
        <meshBasicMaterial ref={shaft} color={CSS_TOKEN.orange} transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh
        position={[fault[0], LAYERS[0].y + PLATE_THICKNESS / 2 + 0.02, fault[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.15, 0.168, 32]} />
        <meshBasicMaterial ref={ring} color={CSS_TOKEN.orange} transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ── Base plate and the five-step index ───────────────────────────────────── */

/* The base plate is the widest thing in the scene, so it — not the slabs — sets
   how large the object reads. At 1.24 it projected to ~95% of the frame width. */
const BASE_PLATE = PLATE * 1.1;

function StackBase({ progress, textures }: { progress: MutableRefObject<number>; textures: StackTextures }) {
  const ticks = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  const outlinePositions = useMemo(() => {
    const h = BASE_PLATE / 2;
    const y = 0.04;
    const corners: Point3[] = [
      [-h, y, -h],
      [h, y, -h],
      [h, y, h],
      [-h, y, h],
    ];
    const positions = new Float32Array(corners.length * 2 * 3);
    corners.forEach((corner, index) => {
      const next = corners[(index + 1) % corners.length];
      positions.set([...corner, ...next], index * 6);
    });
    return positions;
  }, []);

  useEffect(() => {
    const mesh = ticks.current;
    if (!mesh) return;
    for (let index = 0; index < STAGE_COUNT; index += 1) {
      dummy.position.set(-0.62 + index * 0.31, 0.05, BASE_PLATE / 2 - 0.16);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(() => {
    const mesh = ticks.current;
    if (!mesh) return;
    const stage = stageFromProgress(progress.current);
    /* A literal step counter inside the frame: done, here, still to come.
       Orange means "here" and nothing else in this scene. */
    for (let index = 0; index < STAGE_COUNT; index += 1) {
      if (index === stage) color.copy(COLOR.orange);
      else if (index < stage) color.copy(COLOR.cyan);
      else color.copy(COLOR.sub);
      mesh.setColorAt(index, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <group position={[0, BASE_Y, 0]}>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BASE_PLATE * 1.5, BASE_PLATE * 1.5]} />
        <meshBasicMaterial map={textures.shadow} transparent opacity={0.7} depthWrite={false} toneMapped={false} />
      </mesh>

      <RoundedBox args={[BASE_PLATE, 0.07, BASE_PLATE]} radius={0.025} smoothness={2}>
        <meshStandardMaterial color={CSS_TOKEN.primary} transparent opacity={0.1} metalness={0.15} roughness={0.5} />
      </RoundedBox>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[outlinePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={CSS_TOKEN.sub} transparent opacity={0.6} toneMapped={false} />
      </lineSegments>

      <mesh position={[0, 0.05, BASE_PLATE / 2 - 0.16]}>
        <boxGeometry args={[1.42, 0.006, 0.014]} />
        <meshBasicMaterial color={CSS_TOKEN.sub} transparent opacity={0.55} toneMapped={false} />
      </mesh>

      <instancedMesh ref={ticks} args={[undefined, undefined, STAGE_COUNT]}>
        <boxGeometry args={[0.2, 0.016, 0.05]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/* ── Lighting ─────────────────────────────────────────────────────────────── */

function StackLighting({ progress, snap }: { progress: MutableRefObject<number>; snap: boolean }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const p = snap ? 1 : progress.current;
    const online = smoothstep(p, 0.38, 0.95);
    if (key.current) key.current.intensity = approach(key.current.intensity, 2.1 + online * 0.4, 5, delta, snap);
    if (fill.current) fill.current.intensity = approach(fill.current.intensity, 0.7 + online * 0.35, 5, delta, snap);
    if (rim.current) rim.current.intensity = approach(rim.current.intensity, 5 + online * 9, 5, delta, snap);
  });

  return (
    <>
      <ambientLight intensity={0.95} />
      <hemisphereLight args={[CSS_TOKEN.paper, CSS_TOKEN.primary, 1.1]} />
      <directionalLight ref={key} position={[4.2, 6.5, 5]} intensity={2.1} color={CSS_TOKEN.white} />
      <directionalLight ref={fill} position={[-4, 2.2, -3]} intensity={0.7} color={CSS_TOKEN.cyan} />
      <pointLight ref={rim} position={[-2.6, 1.4, 3.2]} intensity={5} distance={9} color={CSS_TOKEN.cyan} />
    </>
  );
}

/** Where the camera aims: the reserved frame centre, leaned a little toward the
    slab the current stage is about. Shared so the first painted frame and the
    frame loop cannot disagree about the composition. */
function cameraLookY(progress: number) {
  const centre = THREE.MathUtils.lerp(FRAME_CENTRE.start, FRAME_CENTRE.end, smoothstep(progress, 0.34, 1));
  const focusY = LAYERS[STAGE_LAYER[stageFromProgress(progress)]].y;
  return centre + (focusY - centre) * 0.16;
}

/* ── The assembled object ─────────────────────────────────────────────────── */

function ControlStack({
  scrollProgress,
  layoutOffset,
  layoutScale,
  snap,
  pointerEnabled,
  simplified,
}: {
  scrollProgress: MutableRefObject<number>;
  layoutOffset: number;
  layoutScale: number;
  snap: boolean;
  pointerEnabled: boolean;
  simplified: boolean;
}) {
  const textures = useStackTextures();
  const assembly = useRef<THREE.Group>(null);
  const visualProgress = useRef(snap ? 1 : scrollProgress.current);
  const cameraLook = useRef(new THREE.Vector3(0, cameraLookY(snap ? 1 : 0), 0));
  /** How fast the reader is scrolling, in progress units per second. */
  const scrollVelocity = useRef(0);
  const lastProgress = useRef(snap ? 1 : scrollProgress.current);
  const lastStage = useRef(snap ? STAGE_COUNT - 1 : 0);
  const punch = useRef(0);

  useFrame(({ camera, pointer }, delta) => {
    const step = Math.min(delta, MAX_STEP);
    /* Tracks scroll closely — at lambda 12 this only takes the jitter off the
       wheel. The old lambda 7.5 sat on top of the per-slab damping, and two
       lag stages in series is what made the whole object feel like it was
       swimming a beat behind the page. */
    const progress = snap ? 1 : THREE.MathUtils.damp(visualProgress.current, scrollProgress.current, 12, step);
    visualProgress.current = progress;

    /* Scroll speed, not just scroll position. Coupling the object to how fast
       the reader is moving is what makes the scroll feel connected rather than
       merely synchronised. */
    const raw = snap ? 1 : scrollProgress.current;
    const instant = step > 0 ? (raw - lastProgress.current) / step : 0;
    lastProgress.current = raw;
    scrollVelocity.current = approach(
      scrollVelocity.current,
      THREE.MathUtils.clamp(instant, -1.6, 1.6),
      9,
      step,
      snap,
    );

    const stage = stageFromProgress(progress);
    if (stage !== lastStage.current) {
      punch.current = 1;
      lastStage.current = stage;
    }
    punch.current = approach(punch.current, 0, 7, step, snap);

    const pointerX = pointerEnabled ? pointer.x : 0;
    const pointerY = pointerEnabled ? pointer.y : 0;
    const inspect = snap ? 0 : bump(progress, DIAGNOSE_WINDOW[0], DIAGNOSE_WINDOW[1], DIAGNOSE_WINDOW[2]);
    /* Runs to 1.0, not 0.95: the dolly is the last thing still moving through
       OPTIMIZE's second act, and stopping it early is what made the end of the
       scroll feel like the object had given up. */
    const built = smoothstep(progress, 0.34, 1);

    if (assembly.current) {
      /* A continuous half-radian turn across the scroll, so there is always
         something moving while the reader scrolls, plus a lead term from scroll
         speed and a slight bank — the object leans into the direction of
         travel and rights itself when the reader stops. */
      assembly.current.rotation.y = approach(
        assembly.current.rotation.y,
        -0.22 + progress * 0.5 + scrollVelocity.current * 0.07 + pointerX * 0.05,
        7,
        step,
        snap,
      );
      assembly.current.rotation.x = approach(assembly.current.rotation.x, pointerY * 0.02, 5, step, snap);
      assembly.current.rotation.z = approach(
        assembly.current.rotation.z,
        scrollVelocity.current * -0.022,
        6,
        step,
        snap,
      );
      /* Nudged off centre so the layer index down the right edge keeps its air. */
      assembly.current.position.x = approach(assembly.current.position.x, layoutOffset - 0.26, 7, step, snap);
      const scale = approach(assembly.current.scale.x, layoutScale * (1 + punch.current * 0.012), 8, step, snap);
      assembly.current.scale.setScalar(scale);
    }

    /* The camera dollies out as the stack is built, so the single slab at AUDIT
       fills its frame and the finished four-slab stack still clears the shell's
       hairline. It also goes to the layer being described — the subject of the
       copy is the subject of the frame. */
    camera.position.x = approach(
      camera.position.x,
      THREE.MathUtils.lerp(FRAMING.start.x, FRAMING.end.x, built) + inspect * FRAMING.inspect.x,
      4.2,
      step,
      snap,
    );
    camera.position.y = approach(
      camera.position.y,
      THREE.MathUtils.lerp(FRAMING.start.y, FRAMING.end.y, built) + inspect * FRAMING.inspect.y,
      4.2,
      step,
      snap,
    );
    camera.position.z = approach(
      camera.position.z,
      THREE.MathUtils.lerp(FRAMING.start.z, FRAMING.end.z, built) + inspect * FRAMING.inspect.z,
      4.2,
      step,
      snap,
    );

    cameraLook.current.y = approach(cameraLook.current.y, cameraLookY(progress), 4, step, snap);
    camera.lookAt(cameraLook.current);
  });

  return (
    <group
      ref={assembly}
      position={[layoutOffset - 0.26, 0, 0]}
      rotation={[0, -0.22, 0]}
      scale={layoutScale}
    >
      <StackBase progress={visualProgress} textures={textures} />

      {LAYERS.map((spec, index) => (
        <StackLayer
          key={spec.kind}
          spec={spec}
          index={index}
          progress={visualProgress}
          snap={snap}
          textures={textures}
        />
      ))}

      <Risers progress={visualProgress} velocity={scrollVelocity} snap={snap} />
      <FocusBracket progress={visualProgress} snap={snap} />
      {simplified ? null : <DiagnosticProbe progress={visualProgress} snap={snap} />}
    </group>
  );
}

/* ── Overlay copy ─────────────────────────────────────────────────────────── */

/* Overlay copy.

   These labels used to describe the geometry — "FIELD LAYER AUDIT", "CONTROL
   LAYER IN REGISTER". "In register" is a drafting term for the animation, not
   an engineering deliverable, and it told a director of operations nothing.

   The object draws a four-layer stack from the plant floor up to AI, which is
   exactly what `method` in lib/content.ts already calls **THE RCL SYSTEM — from
   machines to decisions**. So the overlay borrows that vocabulary verbatim
   instead of inventing a parallel one: the hero image becomes a preview of the
   section that explains it, and the reader meets the same four words twice.

   `layers` are the method's own steps (Machines / Control / Connect / Optimize —
   step 04 "Understand" folds into the analytics slab, whose readout *is* the
   trend). `stages` are deliverables, not states. `disciplines` name what each
   stage actually involves, so across the five stages the reader sees the whole
   scope: documentation and risk, three troubleshooting disciplines, PLC and HMI,
   SCADA and IIoT, then advanced control and AI. */
const sceneLabels: Record<
  Locale,
  { description: string; stages: string[]; disciplines: string[]; layers: string[]; system: string }
> = {
  en: {
    description:
      'The RCL System built layer by layer while scrolling: machines, control, connect and optimize — from the plant floor up to advanced control, analytics and AI',
    stages: [
      'LEGACY SYSTEM MAPPED',
      'ROOT CAUSE ISOLATED',
      'CONTROL SYSTEM ENGINEERED',
      'PLANT DATA UNIFIED',
      'DATA INTO PERFORMANCE',
    ],
    disciplines: [
      'DOCUMENTATION · RISK MAPPING',
      'ELECTRICAL · MECHANICAL · HYDRAULIC',
      'PLC · HMI · INSTRUMENTATION',
      'SCADA · IIoT · INDUSTRIAL DATA',
      'ADVANCED CONTROL · ANALYTICS · AI',
    ],
    layers: ['MACHINES', 'CONTROL', 'CONNECT', 'OPTIMIZE'],
    system: 'RCL SYSTEM',
  },
  fr: {
    description:
      "Le Système RCL construit couche par couche au défilement : machines, contrôle, connexion et optimisation — du plancher d’usine au contrôle avancé, à l’analytique et à l’IA",
    stages: [
      'SYSTÈME EXISTANT RELEVÉ',
      'CAUSE RACINE ISOLÉE',
      'CONTRÔLE DE PROCÉDÉ CONÇU',
      'DONNÉES D’USINE UNIFIÉES',
      'PERFORMANCE OPTIMISÉE',
    ],
    disciplines: [
      'DOCUMENTATION · ANALYSE DE RISQUE',
      'ÉLECTRIQUE · MÉCANIQUE · HYDRAULIQUE',
      'PLC · IHM · INSTRUMENTATION',
      'SCADA · IIoT · INTÉGRATION',
      'CONTRÔLE AVANCÉ · ANALYTIQUE · IA',
    ],
    layers: ['MACHINES', 'CONTRÔLE', 'CONNEXION', 'OPTIMISER'],
    system: 'SYSTÈME RCL',
  },
};

/** A layer is set once its stage has passed; FIELD is there from the start. */
function layerState(layerIndex: number, stage: number) {
  if (STAGE_LAYER[stage] === layerIndex) return 'is-live';
  if (layerIndex === 0 || stage >= layerIndex + 1) return 'is-set';
  return '';
}

export default function ThreeScene({
  locale,
  scrollProgress,
  activeStage,
}: {
  locale: Locale;
  scrollProgress: MutableRefObject<number>;
  activeStage: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const shell = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [overlayLayout, setOverlayLayout] = useState(false);
  const labels = sceneLabels[locale];
  const staticPresentation = Boolean(prefersReducedMotion) || isCompact;

  useEffect(() => {
    const element = shell.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '160px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const compactQuery = window.matchMedia('(max-width: 700px)');
    const overlayQuery = window.matchMedia('(min-width: 701px) and (max-width: 1100px)');
    const update = () => {
      setIsCompact(compactQuery.matches);
      setOverlayLayout(overlayQuery.matches);
    };
    update();
    compactQuery.addEventListener('change', update);
    overlayQuery.addEventListener('change', update);
    return () => {
      compactQuery.removeEventListener('change', update);
      overlayQuery.removeEventListener('change', update);
    };
  }, []);

  return (
    <div
      ref={shell}
      className={`three-shell three-shell-detailed three-stage-${activeStage}`}
      role="img"
      aria-label={labels.description}
    >
      <Canvas
        camera={{ position: [FRAMING.start.x, FRAMING.start.y, FRAMING.start.z], fov: 36 }}
        dpr={isCompact ? 1 : [1, 1.4]}
        frameloop={staticPresentation || !isVisible ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ camera }) => camera.lookAt(0, cameraLookY(staticPresentation ? 1 : 0), 0)}
      >
        <StackLighting progress={scrollProgress} snap={staticPresentation} />
        <ControlStack
          scrollProgress={scrollProgress}
          layoutOffset={overlayLayout ? 1.05 : 0}
          layoutScale={overlayLayout ? 0.82 : isCompact ? 0.92 : 1}
          snap={staticPresentation}
          pointerEnabled={!staticPresentation && !overlayLayout}
          simplified={staticPresentation}
        />
      </Canvas>
      <div className="scanline" />
      {/* Step counter, then what the client gets out of that step, then the
          disciplines it draws on. The disciplines line is the one that truncates
          if the shell is narrow — see three-scene.css. */}
      <div className="three-caption" aria-hidden="true">
        <span>
          <em>{String(activeStage + 1).padStart(2, '0')}</em> / {String(STAGE_COUNT).padStart(2, '0')}
        </span>
        <span>{labels.stages[activeStage]}</span>
        <i />
        <b>{labels.disciplines[activeStage]}</b>
      </div>
      {/* The RCL System's own layers. Top-to-bottom order matches the physical
          stacking order in the scene, so the live chip sits at roughly the
          height of the live slab. */}
      <div className="three-detail-index" aria-hidden="true">
        <b>{labels.system}</b>
        {[3, 2, 1, 0].map((layerIndex) => (
          <span key={labels.layers[layerIndex]} className={layerState(layerIndex, activeStage)}>
            {labels.layers[layerIndex]}
          </span>
        ))}
      </div>
    </div>
  );
}

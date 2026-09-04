'use client';

import { ViewTransition } from 'react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Route transitions for the whole site.
 *
 * React's `<ViewTransition>` drives the browser's View Transitions API. Route
 * navigations in the App Router are already React Transitions, so the animation
 * activates on its own — no configuration, no animation library, no extra
 * client JS beyond this file. Where the browser lacks support the site simply
 * navigates without animating.
 *
 * `key={pathname}` is what makes `enter`/`exit` fire. A `<ViewTransition>` that
 * sits in a layout persists across navigations, so on its own it would only
 * ever report an update; re-keying it per route replaces the element, which is
 * the documented way to transition between two page bodies.
 *
 * It lives in the layout rather than in each `page.tsx` so that a route added
 * later cannot forget to opt in. The cost is that the page subtree remounts on
 * navigation — which it does anyway, since the page component itself changes.
 *
 * `enter`/`exit` carry a class rather than a shared `name` on purpose. A shared
 * name would pair the two pages and morph the group between them, and this
 * site's pages differ enormously in height — the home hero alone is 300svh
 * against roughly a screen and a half for /solutions. Morphing that group would
 * animate a huge size change for no meaning. Two independent snapshots that
 * cross-fade avoid the problem entirely.
 *
 * `default="none"` keeps everything else in the tree out of the transition.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="rcl-page" exit="rcl-page" default="none">
      {children}
    </ViewTransition>
  );
}

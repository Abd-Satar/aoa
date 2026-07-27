"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The page's scroll parallax, in one rAF loop.
 *
 * Anything carrying `data-parallax="<factor>"` trails or leads the scroll by
 * `factor × 100` px, measured from how far the element's center sits from
 * the viewport's. The design drove this off raw `scrollY`, which grows
 * without bound down a 6,000px page; taking it from the element's own
 * position keeps the drift inside a few dozen pixels wherever you are.
 * Written to `translate`, not `transform`, so it composes with the float
 * keyframes rather than fighting them.
 *
 * This also used to publish `--press-sy`, a scroll-velocity lean on the
 * press plates. That was removed with the text plate construction — the
 * photo separation is driven by the pointer alone (PrintPlates.tsx), so
 * there was nothing left for it to move.
 *
 * Stands down under `prefers-reduced-motion`, and the loop only runs while
 * something is actually moving.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  // Re-queried per route: this component lives in the root layout and stays
  // mounted across client-side navigation, so a one-time query would only
  // ever see the first page's parallax targets.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    let raf = 0;

    const frame = () => {
      raf = 0;
      const vh = innerHeight || 1;

      for (const el of nodes) {
        const factor = parseFloat(el.dataset.parallax || "0");
        if (!factor) continue;
        const r = el.getBoundingClientRect();
        // Skip anything well outside the viewport — no point paying for it.
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const d = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.translate = `0 ${(d * factor * 100).toFixed(1)}px`;
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
      for (const el of nodes) el.style.removeProperty("translate");
    };
  }, [pathname]);

  return null;
}

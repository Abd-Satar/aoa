"use client";

import { useEffect } from "react";

/**
 * The Broadsheet separation filters and their press driver.
 *
 * Ported from the design system's `print-plates.js`. The filters must live
 * in the document — a data-URI filter reference does not survive Chromium,
 * and external-file references are unreliable across engines — so this
 * renders the <defs> inline, once, near the end of the tree. Filter
 * references resolve document-wide, so one set serves every `.cmyk .print`
 * on the page.
 *
 * `#sep-all` chains four plates into one compound filter: each stage
 * re-extracts a plate from SourceGraphic, clips it to the source's own
 * silhouette (so it paints nothing outside itself, which is what lets the
 * misregistration overhang the figure), offsets it, and multiplies the
 * sheets together.
 *
 * The driver animates two things on the same eased value:
 *   - the offsets gather into register on hover, and
 *   - each plate matrix lerps from its brand ink to the pure-process
 *     factorization, whose four plates multiply back to SourceGraphic
 *     exactly: (R,1,1)·(1,G,1)·(1,1,B)·(1,1,1) = (R,G,B).
 * So the converged merge *is* the photograph by algebra, and nothing is
 * ever swapped in — the screen only shows a four-plate multiply.
 *
 * It stands down wholesale under reduced motion or without a fine hover
 * pointer; globals.css carries the matching media-gated `:hover` cut as
 * the fallback.
 */

const INK: Record<string, number[]> = {
  c: [1, 0, 0, 0, 0, 0.467, 0, 0, 0, 0.533, 0.31, 0, 0, 0, 0.69, 0, 0, 0, 0, 1],
  m: [0, 0.161, 0, 0, 0.839, 0, 1, 0, 0, 0, 0, 0.576, 0, 0, 0.424, 0, 0, 0, 0, 1],
  y: [0, 0, 0.071, 0, 0.929, 0, 0, 0.267, 0, 0.733, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  k: [
    0.112, 0.375, 0.038, 0, 0.475, 0.113, 0.379, 0.038, 0, 0.471, 0.113, 0.38,
    0.038, 0, 0.468, 0, 0, 0, 0, 1,
  ],
};

const TRUE: Record<string, number[]> = {
  c: [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  m: [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  y: [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  k: [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
};

// The registered misregistration, in px. C holds; M, Y and K drift.
const BASE: Record<string, [number, number]> = {
  m: [5, 3],
  y: [-5, -3],
  k: [3, 6],
};

// ±2.5px x / ±2px y at the viewport edges — half the M/Y x-offset, two
// thirds of its y. A breath, not a slide.
const LEAN_PX: [number, number] = [2.5, 2];
const REGISTER_MS = 450;

const MATRIX = {
  c: INK.c.join(" "),
  m: INK.m.join(" "),
  y: INK.y.join(" "),
  k: INK.k.join(" "),
};

export function PrintPlates() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const svg = document.getElementById("nur-print-plates");
    if (!svg) return;

    const nodes: Record<string, Element> = {};
    svg.querySelectorAll("feOffset[data-plate]").forEach((n) => {
      nodes[(n as HTMLElement).dataset.plate!] = n;
    });
    const mats: Record<string, Element> = {};
    svg.querySelectorAll("feColorMatrix[data-plate-mat]").forEach((n) => {
      mats[(n as HTMLElement).dataset.plateMat!] = n;
    });

    let nx = 0,
      ny = 0; // smoothed pointer, -1..1 from viewport center
    let tx = 0,
      ty = 0; // raw pointer target
    let reg = 1; // 1 = misregistered (rest), 0 = in register
    let regFrom = 1,
      regTo = 1,
      regT0 = 0;
    let raf = 0,
      lastOffs = "",
      lastReg = -1;

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    function tick(now: number) {
      raf = 0;
      nx += (tx - nx) * 0.22;
      ny += (ty - ny) * 0.22; // soften the hand

      if (regTo !== reg || regT0) {
        const t = Math.min(1, (now - regT0) / REGISTER_MS);
        reg = regFrom + (regTo - regFrom) * ease(t);
        if (t >= 1) {
          reg = regTo;
          regT0 = 0;
        }
      }

      // Every write is guarded on its *computed* output, not its inputs:
      // an equal-value setAttribute still dirties the filter, and at full
      // register the offsets are 0.00 whatever the lean — so a pointer
      // roaming over a converged figure must not recompute it each frame.
      const lx = LEAN_PX[0] * nx;
      const ly = LEAN_PX[1] * ny;
      const vals: Record<string, [string, string]> = {};
      let offsKey = "";
      for (const p in BASE) {
        const dx = ((BASE[p][0] + lx) * reg).toFixed(2);
        const dy = ((BASE[p][1] + ly) * reg).toFixed(2);
        vals[p] = [dx, dy];
        offsKey += `${dx},${dy};`;
      }
      if (offsKey !== lastOffs) {
        lastOffs = offsKey;
        for (const p in BASE) {
          nodes[p]?.setAttribute("dx", vals[p][0]);
          nodes[p]?.setAttribute("dy", vals[p][1]);
        }
      }

      // The ink purification rides the same eased value: INK at rest,
      // TRUE at register.
      if (reg !== lastReg) {
        lastReg = reg;
        for (const p in mats) {
          const a = INK[p],
            b = TRUE[p];
          const v = new Array(20);
          for (let i = 0; i < 20; i++) v[i] = (b[i] + (a[i] - b[i]) * reg).toFixed(3);
          mats[p].setAttribute("values", v.join(" "));
        }
      }

      if (regT0 || Math.abs(tx - nx) > 0.002 || Math.abs(ty - ny) > 0.002) {
        schedule();
      }
    }

    const onMove = (e: PointerEvent) => {
      tx = (2 * e.clientX) / innerWidth - 1;
      ty = (2 * e.clientY) / innerHeight - 1;
      schedule();
    };

    const retarget = (to: number) => {
      regFrom = reg;
      regTo = to;
      regT0 = performance.now();
      schedule();
    };

    const onOver = (e: PointerEvent) => {
      const p = (e.target as Element)?.closest?.(".cmyk .print");
      if (p && !(e.relatedTarget && p.contains(e.relatedTarget as Node))) retarget(0);
    };
    const onOut = (e: PointerEvent) => {
      const p = (e.target as Element)?.closest?.(".cmyk .print");
      if (p && !(e.relatedTarget && p.contains(e.relatedTarget as Node))) retarget(1);
    };

    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    return () => {
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      id="nur-print-plates"
      width="0"
      height="0"
      className="absolute"
      aria-hidden="true"
    >
      <defs>
        <filter id="sep-c" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={MATRIX.c} />
        </filter>
        <filter id="sep-m" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={MATRIX.m} />
        </filter>
        <filter id="sep-y" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={MATRIX.y} />
        </filter>
        <filter id="sep-k" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={MATRIX.k} />
        </filter>

        <filter id="sep-all" colorInterpolationFilters="sRGB">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={MATRIX.c}
            data-plate-mat="c"
            result="c0"
          />
          <feComposite in="c0" in2="SourceAlpha" operator="in" result="c" />

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={MATRIX.m}
            data-plate-mat="m"
            result="m0"
          />
          <feComposite in="m0" in2="SourceAlpha" operator="in" result="m1" />
          <feOffset in="m1" dx="5" dy="3" data-plate="m" result="m" />

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={MATRIX.y}
            data-plate-mat="y"
            result="y0"
          />
          <feComposite in="y0" in2="SourceAlpha" operator="in" result="y1" />
          <feOffset in="y1" dx="-5" dy="-3" data-plate="y" result="y" />

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={MATRIX.k}
            data-plate-mat="k"
            result="k0"
          />
          <feComposite in="k0" in2="SourceAlpha" operator="in" result="k1" />
          <feOffset in="k1" dx="3" dy="6" data-plate="k" result="k" />

          <feBlend in="m" in2="c" mode="multiply" result="s1" />
          <feBlend in="y" in2="s1" mode="multiply" result="s2" />
          <feBlend in="k" in2="s2" mode="multiply" />
        </filter>
      </defs>
    </svg>
  );
}

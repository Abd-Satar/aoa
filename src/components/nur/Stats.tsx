"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { stats, type Stat } from "@/lib/nur-content";

const DURATION_MS = 1500;

function format(value: number, stat: Stat) {
  const n = stat.dec
    ? value.toFixed(stat.dec)
    : Math.round(value).toLocaleString("en-US");
  return n + stat.suffix;
}

/**
 * The record, counted up the first time the block is reached. Each figure is
 * a three-plate numeral, so the count runs through the misregistration.
 */
export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState<number[]>(() => stats.map(() => 0));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const settle = () => setCounts(stats.map((s) => s.to));

    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      settle();
      return;
    }

    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / DURATION_MS);
        const e = 1 - Math.pow(1 - p, 3);
        setCounts(stats.map((s) => s.to * e));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        run();
      },
      { threshold: 0.25 },
    );
    io.observe(node);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[104px]"
    >
      <Reveal>
        <span className="mb-[34px] block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
          The academy, in figures
        </span>
        <div className="grid gap-x-10 gap-y-12 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {stats.map((stat, i) => (
            <div key={stat.label}>
              {/* Tabular figures: these count up, and proportional digits
                  change width on every frame, which shifts the label under
                  them. */}
              <span className="block font-heading text-[clamp(52px,6vw,76px)] leading-[0.9] font-semibold tracking-[-0.03em] tabular-nums">
                {format(counts[i], stat)}
              </span>
              <p className="mt-[18px] mb-0 max-w-[24ch] text-[15.5px] leading-[26px] text-ink-78">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

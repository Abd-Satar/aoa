"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nur-content";
import { ThemeToggle } from "./ThemeToggle";

// Only the hash links participate in scroll spy; route links (/teachers)
// are marked active from the pathname instead.
const SECTION_IDS = navLinks
  .filter((l) => l.href.includes("#"))
  .map((l) => l.href.split("#")[1]);

/**
 * The sticky masthead.
 *
 * Three scroll behaviours, all driven from one rAF-throttled listener so a
 * fast scroll does at most one layout read per frame:
 *   - it condenses (padding tightens, the ground goes more opaque),
 *   - the rule along its bottom edge fills as you read the page, and
 *   - the link for the section you are in takes its underline.
 */
export function SiteNav() {
  const [condensed, setCondensed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      setCondensed(scrollY > 28);
      setProgress(max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length || !("IntersectionObserver" in window)) return;

    // Anchor the decision to the band just under the masthead (`-88px` is
    // the nav's own height at rest). Track the whole visible set rather
    // than latching the last one seen: scrolling back into the hero must
    // clear the highlight, not leave the section you already left lit.
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        setActive(SECTION_IDS.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-40 flex flex-wrap items-center gap-x-[30px] gap-y-[10px] border-b-2 border-text backdrop-blur-[14px] backdrop-saturate-[1.35] transition-[padding,background] duration-300"
      style={{
        paddingInline:
          "max(clamp(20px,5vw,72px), calc((100% - 1200px) / 2 + clamp(20px,5vw,72px)))",
        paddingBlock: condensed ? "10px" : "18px",
        background: `color-mix(in srgb, var(--color-bg) ${
          condensed ? "94%" : "88%"
        }, transparent)`,
      }}
    >
      {/* The reading rule — it inks along the masthead's bottom edge as the
          page goes by, over the border rather than under it. Takes the
          bright step of the ramp: `--color-accent` sits too close to the
          border's own ink to read as a fill. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-accent-500"
        style={{ transform: `scaleX(${progress})` }}
      />

      <Link
        href="/"
        className="mr-auto flex items-baseline gap-[11px] text-text no-underline hover:text-text"
      >
        <span className="font-heading text-[21px] leading-none font-semibold tracking-[0.075em]">
          A.O.A
        </span>
        <span aria-hidden="true" className="h-[15px] w-px self-center bg-ink-30" />
        <span className="text-[10.5px] leading-none tracking-[0.16em] text-accent-700 uppercase">
          As-Sattar Online Academy
        </span>
      </Link>

      <div className="flex flex-wrap items-baseline gap-[26px]">
        {navLinks.map((link) => {
          // A route link is current when you are on it; a hash link is
          // current when its section is the one under the masthead.
          const isActive = link.href.includes("#")
            ? pathname === "/" && active === link.href.split("#")[1]
            : pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`text-[14.5px] tracking-[0.015em] underline decoration-1 underline-offset-[7px] transition-[color,text-decoration-color,text-underline-offset] duration-[260ms] hover:text-accent-700 hover:decoration-accent hover:underline-offset-[5px] ${
                isActive
                  ? "text-accent-700 decoration-accent underline-offset-[5px]"
                  : "text-text decoration-transparent"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <ThemeToggle />
        <Link
          className="btn btn-primary px-5 py-[11px] tracking-[0.03em] no-underline transition-[transform,box-shadow,background] duration-300 hover:-translate-y-0.5 hover:shadow-md"
          href="/#enroll"
        >
          Enroll now
        </Link>
      </div>
    </nav>
  );
}

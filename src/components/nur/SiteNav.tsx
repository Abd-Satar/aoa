"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react/ssr";
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
 *
 * Below `lg` the links collapse behind a hamburger. Six items plus the theme
 * switch and the enrol button cannot sit on one phone-width row — they used
 * to wrap onto two, which pushed the page down and read as a mistake.
 */
export function SiteNav() {
  const [condensed, setCondensed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Close the menu when the route changes — including via browser back and
  // forward, which no click handler would catch. Adjusted during render
  // rather than in an effect (React's documented pattern for reacting to a
  // changed input) so the panel is never painted open on the new page.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    // Resizing up to the desktop layout leaves the panel orphaned otherwise.
    const mq = matchMedia("(min-width: 1024px)");
    const onWide = () => mq.matches && setMenuOpen(false);

    // Hold the page still behind the panel. overflow-y only: the x axis is
    // `clip` in globals.css to stop the decorative plates being draggable,
    // and a blanket `hidden` here would undo that.
    const previous = document.body.style.overflowY;
    document.body.style.overflowY = "hidden";

    addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
      document.body.style.overflowY = previous;
    };
  }, [menuOpen]);

  const isCurrent = (href: string) => {
    if (href.includes("#")) {
      return pathname === "/" && active === href.split("#")[1];
    }
    // Home should not stay lit while you are reading a section of the home
    // page that has its own nav entry.
    if (href === "/") return pathname === "/" && active === null;
    return pathname === href;
  };

  // Masthead style: small caps, widely letterspaced, separated by hairline
  // rules. The current item is marked with a solid accent underline rather
  // than a colour change alone, so it reads at a glance in all-caps where
  // word shapes are less distinctive.
  // Metrics are tight on purpose. The masthead's padding formula caps the
  // content column at ~1056px at every viewport width, and small caps at
  // this tracking are wide — at 14px padding the row overflowed and "Our
  // method" and "Enroll now" broke onto second lines.
  const deskLink = (isActive: boolean) =>
    `relative px-[10px] py-1 text-[11px] leading-none tracking-[0.1em] whitespace-nowrap uppercase transition-colors duration-[260ms] hover:text-accent-700 ${
      isActive ? "text-accent-700" : "text-ink-78"
    }`;

  // The panel is a touch list, so it keeps sentence case at reading size.
  const mobileLink = (isActive: boolean) =>
    `tracking-[0.015em] underline decoration-1 underline-offset-[7px] transition-[color,text-decoration-color,text-underline-offset] duration-[260ms] hover:text-accent-700 hover:decoration-accent hover:underline-offset-[5px] ${
      isActive
        ? "text-accent-700 decoration-accent underline-offset-[5px]"
        : "text-text decoration-transparent"
    }`;

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-40 border-b-2 border-text backdrop-blur-[14px] backdrop-saturate-[1.35] transition-[background] duration-300"
      style={{
        background: `color-mix(in srgb, var(--color-bg) ${
          condensed ? "94%" : "88%"
        }, transparent)`,
      }}
    >
      {/* The double rule. A hairline, a gap, then the heavy 2px border on the
          <nav> itself — the way a broadsheet closes its masthead. Cheap to
          draw and the single strongest cue that this is a printed page
          rather than a web header. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[4px] h-px bg-text opacity-45"
      />

      {/* The reading rule — it inks along the masthead's bottom edge as the
          page goes by, over the border rather than under it. Takes the
          bright step of the ramp: `--color-accent` sits too close to the
          border's own ink to read as a fill. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-accent-500"
        style={{ transform: `scaleX(${progress})` }}
      />

      <div
        className="flex items-center gap-x-[30px] transition-[padding] duration-300"
        style={{
          paddingInline:
            "max(clamp(20px,5vw,72px), calc((100% - 1200px) / 2 + clamp(20px,5vw,72px)))",
          paddingBlock: condensed ? "10px" : "18px",
        }}
      >
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="mr-auto flex items-baseline gap-[11px] text-text no-underline hover:text-text"
        >
          <span className="font-heading text-[21px] leading-none font-semibold tracking-[0.075em]">
            A.O.A
          </span>
          <span
            aria-hidden="true"
            className="hidden h-[15px] w-px self-center bg-ink-30 sm:block lg:hidden xl:block"
          />
          {/* The full name is the first thing to go when width runs short —
              and it goes twice. Hidden on phones, shown on tablets where the
              nav is behind the hamburger, hidden again from 1024 to 1280
              where the full link row is competing for the same line, then
              back for good at 1280. The footer always carries it. */}
          <span className="hidden text-[10px] leading-none tracking-[0.12em] whitespace-nowrap text-accent-700 uppercase sm:block lg:hidden xl:block">
            As-Sattar Online Academy
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-5 lg:flex">
          <div className="flex items-center divide-x divide-ink-22">
            {navLinks.map((link) => {
              const current = isCurrent(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={deskLink(current)}
                >
                  {link.label}
                  {/* The rule under the current item, drawn rather than
                      toggled: it wipes out from the centre on hover too. */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-[10px] -bottom-[7px] h-[2px] origin-center bg-accent transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      current ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <ThemeToggle />

          <Link
            className="btn btn-primary px-4 py-[11px] text-[11px] tracking-[0.1em] whitespace-nowrap uppercase no-underline transition-[transform,box-shadow,background] duration-300 hover:-translate-y-0.5 hover:shadow-md"
            href="/#enroll"
          >
            Enroll now
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="btn btn-secondary btn-icon"
          >
            {menuOpen ? (
              <X size={18} weight="bold" />
            ) : (
              <List size={18} weight="bold" />
            )}
          </button>
        </div>
      </div>

      {/* The panel. Rendered inside the sticky nav so it hangs off the bar,
          and scrollable in its own right in case a short phone in landscape
          cannot show every entry. */}
      <div
        id="site-menu"
        hidden={!menuOpen}
        className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-divider lg:hidden"
        style={{ paddingInline: "clamp(20px,5vw,72px)" }}
      >
        <ul className="m-0 list-none p-0 py-2">
          {navLinks.map((link) => (
            <li key={link.label} className="border-b border-divider last:border-b-0">
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className={`block py-3.5 text-[17px] ${mobileLink(isCurrent(link.href))}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/#enroll"
          onClick={() => setMenuOpen(false)}
          className="btn btn-primary mt-3 mb-5 w-full justify-center py-3 text-[16px] no-underline"
        >
          Enroll now
        </Link>
      </div>
    </nav>
  );
}

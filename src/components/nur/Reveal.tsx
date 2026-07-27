"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveal — a block lifts and fades in once, the first time it
 * crosses into view.
 *
 * The initial hidden state is applied from the effect rather than in the
 * markup, so a visitor with JS disabled (or before hydration) sees the
 * content rather than an empty page. Under reduced motion the effect
 * returns immediately and nothing is ever hidden.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    node.style.opacity = "0";
    node.style.transform = "translateY(22px)";
    node.style.transition =
      "opacity 900ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)";

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "none";
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(node);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

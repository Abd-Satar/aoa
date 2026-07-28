"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import { Reveal } from "./Reveal";
import type { Story } from "@/lib/nur-content";

// Offset from the hero's clock so the two carousels never turn together.
const AUTOPLAY_MS = 9000;

// Data arrives as a prop: this is a client component (carousel state), so it
// cannot read from the database itself. StoriesSection does that.
export function Stories({ stories }: { stories: Story[] }) {
  const [index, setIndex] = useState(0);
  const count = stories.length;

  useEffect(() => {
    if (!count) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count]);

  // Nothing to show until real, permissioned testimonials exist.
  if (!count) return null;

  return (
    <section
      id="stories"
      className="mx-auto max-w-[1200px] scroll-mt-[90px] px-[clamp(20px,5vw,72px)] pt-[clamp(56px,9vw,108px)]"
    >
      <Reveal>
        <div className="mb-[30px] flex items-end justify-between gap-6">
          <span className="text-[13px] tracking-[0.08em] text-ink-70 uppercase">
            In their words
          </span>
          <div className="flex items-center gap-2">
            <Link className="btn btn-ghost mr-2 text-[15px] no-underline" href="/testimonials">
              All stories
            </Link>
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              aria-label="Previous story"
              onClick={() => setIndex((i) => (i + count - 1) % count)}
            >
              <CaretLeft size={17} weight="duotone" />
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              aria-label="Next story"
              onClick={() => setIndex((i) => (i + 1) % count)}
            >
              <CaretRight size={17} weight="duotone" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {stories.map((story, i) => (
              <figure
                key={story.source}
                aria-hidden={i !== index}
                className="m-0 shrink-0 grow-0 basis-full pr-[8%]"
              >
                <blockquote className="m-0 max-w-[30ch] font-heading text-[clamp(24px,2.8vw,36px)] leading-[1.34] font-normal tracking-[-0.01em] italic">
                  {story.quote}
                </blockquote>
                <figcaption className="mt-[26px] text-[15.5px] leading-7 text-ink-70">
                  {story.source}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

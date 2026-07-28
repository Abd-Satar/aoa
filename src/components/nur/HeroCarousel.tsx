"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import { ImageSlot } from "./ImageSlot";
import { heroSlides } from "@/lib/nur-content";

const AUTOPLAY_MS = 7000;
// Past this fraction of the track, releasing commits to the next slide.
const COMMIT_RATIO = 0.16;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const [trackWidth, setTrackWidth] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const count = heroSlides.length;

  // The depth effect needs the drag expressed in slide widths, not pixels.
  // ResizeObserver fires once on observe, so there is no initial setState in
  // the effect body to seed it.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) =>
      setTrackWidth(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dragFraction = trackWidth > 0 ? drag / trackWidth : 0;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Autoplay stands down while the reader is engaged with it — hovering,
  // tabbed into it, mid-drag — or while the tab is in the background.
  const playing = !paused && !dragging && !reduced;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [playing, go, index]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const width = () => trackRef.current?.offsetWidth ?? 1;

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    let dx = e.clientX - startX.current;
    // Resist at the ends so the track feels bounded rather than broken.
    if ((index === 0 && dx > 0) || (index === count - 1 && dx < 0)) dx *= 0.35;
    setDrag(dx);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragging) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    const threshold = width() * COMMIT_RATIO;
    if (drag <= -threshold) go(1);
    else if (drag >= threshold) go(-1);
    setDrag(0);
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const offset = `calc(${-index * 100}% + ${drag}px)`;

  return (
    <div
      className="mt-[66px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mb-[14px] flex items-end justify-between gap-6">
        <span className="text-[13px] tracking-[0.08em] text-ink-70 uppercase">
          From the academy
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            aria-label="Previous highlight"
            onClick={() => go(-1)}
          >
            <CaretLeft size={17} weight="duotone" />
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            aria-label="Next highlight"
            onClick={() => go(1)}
          >
            <CaretRight size={17} weight="duotone" />
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden"
        role="group"
        aria-roledescription="carousel"
        aria-label="Highlights from the academy"
      >
        <div
          ref={trackRef}
          className={`flex touch-pan-y will-change-transform ${
            dragging
              ? "cursor-grabbing"
              : "cursor-grab transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          }`}
          style={{ transform: `translate3d(${offset}, 0, 0)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {heroSlides.map((slide, i) => {
            // How far this slide sits from the viewport, in slide widths.
            // `dragFraction` folds the in-progress drag in, so the depth
            // effect tracks the finger rather than snapping at the end.
            const d = i - index + dragFraction;
            const dist = Math.min(1, Math.abs(d));
            const settle = dragging
              ? "none"
              : "opacity 900ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)";

            return (
              <div
                key={slide.id}
                aria-hidden={i !== index}
                className="grid shrink-0 grow-0 basis-full items-center gap-[clamp(24px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]"
                style={{
                  // Neighbours sit back rather than merely sliding past.
                  opacity: 1 - dist * 0.62,
                  transform: `scale(${1 - dist * 0.045})`,
                  transition: settle,
                }}
              >
                {/* The figure trails the scroll a little (ScrollEffects sets
                    `translate`) and lags the slide as it moves — the two
                    compose because they use different properties. */}
                <figure
                  className="cmyk m-0 overflow-visible"
                  data-parallax="-0.035"
                  style={{
                    transform: `translate3d(${(d * -11).toFixed(2)}%, 0, 0)`,
                    transition: settle,
                  }}
                >
                  <div className="print aspect-video">
                    <ImageSlot
                      alt={slide.title}
                      placeholder={slide.placeholder}
                      priority={i === 0}
                    />
                  </div>
                </figure>

                <div>
                  <span className="text-xs tracking-[0.1em] text-accent-700 uppercase">
                    {slide.kicker}
                  </span>
                  <h2 className="mt-3 mb-0 text-[clamp(26px,2.8vw,34px)] leading-[1.15]">
                    {slide.title}
                  </h2>
                  <p className="mt-4 mb-0 text-[15.5px] leading-7 text-ink-78">
                    {slide.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The dots double as the autoplay clock: the current one fills over
          the dwell, and the fill holds still whenever autoplay is paused. */}
      <div
        className="mt-5 flex gap-2"
        role="tablist"
        aria-label="Highlights"
        onKeyDown={onKeyDown}
      >
        {heroSlides.map((slide, i) => {
          const isActive = i === index;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-label={`Highlight ${i + 1}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setIndex(i)}
              className="h-1 cursor-pointer overflow-hidden rounded-[2px] border-0 bg-ink-22 p-0 transition-[width] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: isActive ? 34 : 12 }}
            >
              {isActive && (
                <span
                  key={`${index}-${playing}`}
                  className="block h-full bg-accent"
                  style={
                    playing
                      ? { animation: `nur-dot ${AUTOPLAY_MS}ms linear forwards` }
                      : { width: "100%" }
                  }
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

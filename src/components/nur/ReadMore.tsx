"use client";

import { useId, useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";

/**
 * Collapses the tail of a long passage on small screens.
 *
 * The height animates with the `grid-template-rows: 0fr -> 1fr` technique
 * rather than a measured max-height: it eases to the content's real height
 * whatever that is, so nothing is clipped on a narrow phone where the text
 * reflows to twice the lines, and there is no ResizeObserver to keep in sync.
 *
 * Above the breakpoint the region is always open and the toggle is hidden —
 * the desktop reading experience is unchanged, and the content is in the DOM
 * either way, so search engines and Ctrl+F always see all of it.
 */
export function ReadMore({
  children,
  more = "Read more",
  less = "Show less",
  className = "",
}: {
  children: ReactNode;
  more?: string;
  less?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className={className}>
      <div
        id={id}
        className={`grid transition-[grid-template-rows] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[1fr] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        {/* The row must clip, or the collapsed content still paints. */}
        <div className="overflow-hidden">{children}</div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="btn btn-ghost mt-3 -ml-[5px] gap-1.5 text-[14.5px] lg:hidden"
      >
        {open ? less : more}
        <CaretDown
          size={13}
          weight="bold"
          aria-hidden="true"
          className={`transition-transform duration-[380ms] ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}

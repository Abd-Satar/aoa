"use client";

import { Moon, Sun } from "@phosphor-icons/react/ssr";

/**
 * Light/dark switch, drawn as a two-state pill.
 *
 * Both icons are always visible and the current one is filled, so the
 * control reads as a switch rather than as decoration, and you can see which
 * theme you are in before you click. (A single-icon button gave neither —
 * it looked like an ornament and told you nothing about the current state.)
 *
 * Deliberately holds no React state. The theme lives in one place — the
 * `data-theme` attribute on <html>, written before paint by the script in
 * layout.tsx — and this only flips it. Keeping state out avoids a hydration
 * mismatch (the server cannot know the stored preference) and a
 * setState-in-effect to catch up after mount. Which half is filled is
 * decided in CSS by the `dark:` variant, so it is correct on first paint.
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
      className="group inline-flex shrink-0 cursor-pointer items-center gap-0 rounded-full border border-ink-30 p-0.5 transition-colors duration-200 hover:border-accent"
      onClick={() => {
        const root = document.documentElement;
        const next =
          root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try {
          localStorage.setItem("theme", next);
        } catch {
          // Private mode / storage disabled: the switch still works for this
          // page view, it just will not be remembered.
        }
      }}
    >
      <span
        aria-hidden="true"
        className="grid size-[26px] place-items-center rounded-full bg-accent text-bg transition-colors duration-200 dark:bg-transparent dark:text-ink-55"
      >
        <Sun size={15} weight="fill" />
      </span>
      <span
        aria-hidden="true"
        className="grid size-[26px] place-items-center rounded-full bg-transparent text-ink-55 transition-colors duration-200 dark:bg-accent dark:text-bg"
      >
        <Moon size={15} weight="fill" />
      </span>
    </button>
  );
}

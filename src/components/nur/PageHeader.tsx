import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * The masthead block every inner page opens with: eyebrow, display heading,
 * standfirst, and optionally a ledger of dot-leadered facts under a rule.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  ledger,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  ledger?: { label: string; value: string; accent?: boolean }[];
}) {
  return (
    <section className="relative mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[76px]">
      <div
        aria-hidden="true"
        data-parallax="0.4"
        className="pointer-events-none absolute top-8 -right-[70px] size-[300px] animate-nur-float rounded-full blur-[6px]"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 68%)",
        }}
      />

      <Reveal className="relative">
        <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
          {eyebrow}
        </span>
        <h1 className="m-0 -ml-[0.03em] max-w-[16ch] font-heading text-[clamp(40px,5.6vw,72px)] leading-[1.07] font-semibold tracking-[-0.028em]">
          {title}
        </h1>
        <p className="mt-8 mb-0 max-w-[58ch] text-[17.5px] leading-7 text-ink-82">
          {intro}
        </p>
      </Reveal>

      {ledger && ledger.length > 0 && (
        <Reveal className="pt-[54px]">
          <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
          <div className="grid gap-x-[60px] gap-y-[14px] pt-[14px] pb-7 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {ledger.map((row) => (
              <p
                key={row.label}
                className="m-0 flex items-baseline gap-2 text-[15.5px] leading-7"
              >
                <span>{row.label}</span>
                <span className="mb-[0.34em] min-w-[28px] flex-1 self-end border-b border-dotted border-ink-45" />
                <span
                  className={`font-heading text-[17px] font-semibold tabular-nums ${
                    row.accent ? "text-accent-700" : ""
                  }`}
                >
                  {row.value}
                </span>
              </p>
            ))}
          </div>
          <hr className="m-0 h-0 border-0 border-t border-text" />
        </Reveal>
      )}
    </section>
  );
}

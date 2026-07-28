import { Reveal } from "./Reveal";
import { HeroCarousel } from "./HeroCarousel";
import { ledger, marqueeFacts } from "@/lib/nur-content";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(36px,7vw,76px)]">
      {/* Two soft plates of ground color that drift on their own clock. */}
      <div
        aria-hidden="true"
        data-parallax="0.4"
        className="pointer-events-none absolute top-10 -right-[70px] size-[300px] animate-nur-float rounded-full blur-[6px]"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 68%)",
        }}
      />
      <div
        aria-hidden="true"
        data-parallax="-0.3"
        className="pointer-events-none absolute top-[320px] -left-[110px] size-[240px] animate-nur-float rounded-full blur-[8px] [animation-delay:1.5s] [animation-duration:14s]"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, color-mix(in srgb, var(--color-accent-2) 11%, transparent), transparent 66%)",
        }}
      />

      <Reveal className="relative">
        <h1 className="m-0 -ml-[0.035em] max-w-[16ch] font-heading text-[clamp(44px,6.4vw,86px)] leading-[1.06] font-semibold tracking-[-0.028em]">
          <span className="block">Learn the Qur&rsquo;an</span>
          <span className="block">in its own language.</span>
        </h1>
        <p className="mt-[34px] mb-0 max-w-[56ch] text-[17.5px] leading-7 text-ink-82">
          Live classes in recitation, classical Arabic, Yoruba and Islamic
          studies, for adults and for children. Taught in English, Arabic and
          Yoruba, one-to-one or in circles of five, by a teacher who studied it
          properly, on a timetable that fits the week you actually have.
        </p>
        <div className="mt-[30px] flex flex-wrap items-center gap-[14px]">
          <a className="btn btn-primary px-[22px] py-3 text-[15px] no-underline" href="#enroll">
            Enroll now
          </a>
          <a
            className="btn btn-secondary px-[22px] py-3 text-[15px] no-underline"
            href="#programs"
          >
            Explore programs
          </a>
          <span className="ml-1.5 text-[13px] leading-5 text-ink-65">
            First lesson free · no card
          </span>
        </div>
      </Reveal>

      <Reveal>
        <HeroCarousel />
      </Reveal>

      {/* The ledger: a rule, a run of facts, then dot-leadered figures.
          Straight out of the broadsheet's front page. */}
      <Reveal className="pt-[clamp(44px,7vw,78px)]">
        <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
        <p className="m-0 flex flex-wrap justify-between gap-x-7 gap-y-[14px] py-[14px] text-[13px] leading-[14px] tracking-[0.08em] text-ink-70 uppercase">
          {marqueeFacts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </p>
        <hr className="m-0 h-0 border-0 border-t border-text" />
        <div className="grid gap-x-[70px] gap-y-[14px] pt-[14px] pb-7 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {ledger.map((row) => (
            <p
              key={row.label}
              className="m-0 flex items-baseline gap-2 text-[15.5px] leading-7"
            >
              <span>{row.label}</span>
              <span className="mb-[0.34em] min-w-[28px] flex-1 self-end border-b border-dotted border-ink-45" />
              <span
                className={`font-heading text-[17px] font-semibold ${
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
    </section>
  );
}

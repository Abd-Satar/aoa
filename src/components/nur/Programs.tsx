import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Reveal } from "./Reveal";
import { getPrograms } from "@/lib/content";

export async function Programs() {
  const programs = await getPrograms();

  return (
    <section
      id="programs"
      className="mx-auto max-w-[1200px] scroll-mt-[90px] px-[clamp(20px,5vw,72px)] pt-[clamp(52px,8vw,96px)]"
    >
      <Reveal className="flex flex-wrap items-end justify-between gap-7">
        <div>
          <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
            Programs
          </span>
          <h2 className="m-0 max-w-[18ch] text-[clamp(32px,4vw,48px)] leading-[1.1]">
            Seven tracks. One of them is yours.
          </h2>
        </div>
        <div>
          <p className="m-0 max-w-[40ch] text-[15.5px] leading-7 text-ink-78">
            Each track has a fixed syllabus, a named teacher and an end: a
            certificate, not a subscription that runs forever.
          </p>
          <Link className="btn btn-ghost mt-4 text-[15px] no-underline" href="/programs">
            All programs <ArrowRight size={15} weight="duotone" />
          </Link>
        </div>
      </Reveal>

      <Reveal className="mt-[clamp(28px,4vw,44px)] grid gap-[14px] sm:gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {programs.map((program) => (
          /* The hover is a press metaphor rather than a UI one: a rule inks
             across the head of the card, the sheet lifts a little, and the
             title takes the accent. Everything eases on the same curve and
             the card never scales, since scaling resamples the type. */
          <article
            key={program.title}
            className="card group relative isolate gap-[8px] overflow-hidden p-[18px] transition-[transform,box-shadow,background] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[5px] hover:shadow-lg sm:gap-[10px] sm:p-[26px]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            />

            <span className="card-kicker transition-colors duration-300 group-hover:text-accent-700">
              {program.kicker}
            </span>

            <h3 className="card-title mb-0 text-[21px] transition-colors duration-300 group-hover:text-accent-700">
              {program.title}
            </h3>

            {/* On phones the seven cards ran to nearly 2,000px, most of it
                description. The title and the details line identify a track
                well enough to choose one; the descriptions stay on /programs,
                one tap away via "All programs" below. */}
            <p className="card-body hidden text-sm leading-6 sm:block">
              {program.body}
            </p>

            {/* No arrow here on purpose. These cards are not links, the only
                way onward is "All programs" above, and an arrow that appears
                on hover promises a destination the card does not have. The
                rule, the lift and the accent are the whole effect. */}
            <p className="card-meta mt-1.5 mb-0">{program.meta}</p>
          </article>
        ))}
      </Reveal>
    </section>
  );
}

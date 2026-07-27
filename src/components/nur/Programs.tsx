import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Reveal } from "./Reveal";
import { programs } from "@/lib/nur-content";

export function Programs() {
  return (
    <section
      id="programs"
      className="mx-auto max-w-[1200px] scroll-mt-[90px] px-[clamp(20px,5vw,72px)] pt-24"
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
            Each track has a fixed syllabus, a named teacher and an end — a
            certificate, not a subscription that runs forever.
          </p>
          <Link className="btn btn-ghost mt-4 text-[15px] no-underline" href="/programs">
            All programs <ArrowRight size={15} weight="duotone" />
          </Link>
        </div>
      </Reveal>

      <Reveal className="mt-11 grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {programs.map((program) => (
          <article
            key={program.title}
            className="card gap-[10px] p-[26px] transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-md"
          >
            <span className="card-kicker">{program.kicker}</span>
            <h3 className="card-title mb-0 text-[21px]">{program.title}</h3>
            <p className="card-body text-sm leading-6">{program.body}</p>
            <p className="card-meta mt-1.5 mb-0">{program.meta}</p>
          </article>
        ))}
      </Reveal>
    </section>
  );
}

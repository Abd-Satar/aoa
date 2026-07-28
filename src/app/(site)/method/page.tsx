import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { PageHeader } from "@/components/nur/PageHeader";
import { Reveal } from "@/components/nur/Reveal";
import { ImageSlot } from "@/components/nur/ImageSlot";
import {
  methodRefusals,
  methodSchedule,
  methodSteps,
  principles,
} from "@/lib/nur-content";

export const metadata: Metadata = {
  title: "Our method | A.O.A (As-Sattar Online Academy)",
  description:
    "How a track runs at A.O.A: a free assessment, an honest placement, a named teacher who does not rotate, live sessions of five or one-to-one, a written record of every class, and a syllabus with an end.",
};

export default function MethodPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our method"
        title="A named person, at a fixed hour."
        intro="Most people do not stop because the Qur'an is hard. They stop because nobody noticed they had gone quiet. Everything below exists to make that impossible."
        ledger={[
          { label: "Students per circle, at most", value: "5" },
          { label: "Reschedule window", value: "4 hrs" },
          { label: "Assessment, price of", value: "0", accent: true },
        ]}
      />

      {/* The origin, paired with a figure: the same beat as the home page's
          method section, given room. */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[88px]">
        <Reveal className="grid items-center gap-x-[clamp(24px,5vw,96px)] gap-y-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          <div>
            <h2 className="m-0 max-w-[20ch] text-[clamp(28px,3.2vw,40px)] leading-[1.14]">
              It started with people who had already given up once.
            </h2>
            <p className="mt-6 mb-0 max-w-[50ch] text-[15.5px] leading-7 text-ink-78 sm:text-justify sm:hyphens-auto">
              A.O.A began in 2015 with one teacher and a handful of students,
              most of whom had tried before and stopped. What kept them was not
              a better app. It was a named person, at a fixed hour, who asked
              where you got to and remembered the answer.
            </p>
            <p className="mt-4 mb-0 max-w-[50ch] text-[15.5px] leading-7 text-ink-78 sm:text-justify sm:hyphens-auto">
              That is still the whole method. A syllabus you can see the end of,
              a teacher who does not rotate, and a written record of every
              session so that progress is a fact rather than a feeling.
            </p>
          </div>
          <figure className="cmyk m-0 overflow-visible" data-parallax="-0.05">
            <div className="print aspect-[986/660]">
              <ImageSlot
                alt="A teacher and student at work"
                placeholder="Drop a photo: a teacher and student, or a manuscript page"
              />
            </div>
          </figure>
        </Reveal>
      </section>

      {/* How a track runs, numbered as folios. */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(72px,9vw,112px)]">
        <Reveal>
          <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
            How a track runs
          </span>
          <h2 className="m-0 max-w-[20ch] text-[clamp(28px,3.4vw,42px)] leading-[1.12]">
            Six steps, in order, every time.
          </h2>
        </Reveal>

        <div className="mt-12">
          {methodSteps.map((step, i) => (
            <Reveal key={step.title}>
              <article className="grid items-start gap-x-[clamp(24px,4vw,64px)] gap-y-3 border-t border-text py-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
                <div className="flex items-baseline gap-4">
                  <span className="font-heading text-[13px] tabular-nums text-accent-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 max-w-[24ch] text-[21px] leading-[1.2]">
                    {step.title}
                  </h3>
                </div>
                <p className="m-0 max-w-[54ch] text-[15.5px] leading-7 text-ink-78">
                  {step.body}
                </p>
              </article>
            </Reveal>
          ))}
          <hr className="m-0 h-0 border-0 border-t border-text" />
        </div>
      </section>

      {/* The principles, restated from the home page. */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(72px,9vw,112px)]">
        <Reveal>
          <span className="mb-[14px] block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
            What makes an A.O.A class
          </span>
          <div className="grid gap-x-[clamp(28px,4vw,64px)] gap-y-[28px] sm:gap-y-[42px] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {principles.map((item) => (
              <div key={item.title}>
                <h3 className="mt-0 mb-0 text-2xl leading-7">{item.title}</h3>
                <p className="mt-[14px] mb-0 text-[15.5px] leading-7 text-ink-78 sm:text-justify sm:hyphens-auto">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* What we refuse to do, stated as plainly as what we do. */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(72px,9vw,112px)]">
        <Reveal>
          <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
          <div className="grid items-start gap-x-[clamp(28px,5vw,80px)] gap-y-8 pt-9 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            <h2 className="m-0 max-w-[16ch] text-[clamp(26px,3vw,36px)] leading-[1.14]">
              And four things we will not do.
            </h2>
            <div className="grid gap-y-7">
              {methodRefusals.map((item) => (
                <div key={item.title}>
                  <h3 className="m-0 text-[18px] leading-[1.25]">{item.title}</h3>
                  <p className="mt-2 mb-0 max-w-[52ch] text-[15px] leading-[26px] text-ink-78">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Scheduling. */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(72px,9vw,112px)]">
        <Reveal>
          <div className="grid items-start gap-x-[clamp(28px,5vw,80px)] gap-y-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            <div>
              <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
                The week you actually have
              </span>
              <h2 className="m-0 max-w-[18ch] text-[clamp(26px,3vw,36px)] leading-[1.14]">
                Because the week does not always cooperate.
              </h2>
            </div>
            <ul className="m-0 list-none border-t border-divider p-0">
              {methodSchedule.map((line) => (
                <li
                  key={line}
                  className="flex items-baseline gap-3 border-b border-divider py-3.5 text-[15.5px] leading-7"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] size-1 shrink-0 self-start bg-accent-500"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(64px,8vw,104px)]">
        <Reveal>
          <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 pt-8">
            <p className="m-0 max-w-[44ch] text-[17px] leading-7 text-ink-80">
              The assessment is the whole method in thirty minutes. Book one and
              see whether it suits you.
            </p>
            <div className="flex flex-wrap items-center gap-[14px]">
              <Link
                className="btn btn-primary px-[22px] py-3 text-[15px] no-underline"
                href="/#enroll"
              >
                Book a free assessment
                <ArrowRight size={15} weight="duotone" />
              </Link>
              <Link
                className="btn btn-secondary px-[22px] py-3 text-[15px] no-underline"
                href="/#founder"
              >
                Meet the founder
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { Reveal } from "@/components/nur/Reveal";
import { TeacherProfile } from "@/components/nur/TeacherProfile";
import { teachers, contact } from "@/lib/nur-content";

export const metadata: Metadata = {
  title: "The teachers — A.O.A (As-Sattar Online Academy)",
  description:
    "The named, credentialed teachers of A.O.A — As-Sattar Online Academy. Every recitation teacher holds an ijāzah with a documented chain of transmission.",
};

export default function TeachersPage() {
  return (
    <main>
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
              The teachers
            </span>
            <h1 className="m-0 -ml-[0.03em] max-w-[16ch] font-heading text-[clamp(40px,5.6vw,72px)] leading-[1.07] font-semibold tracking-[-0.028em]">
              The people who will teach you.
            </h1>
            <p className="mt-8 mb-0 max-w-[58ch] text-[17.5px] leading-7 text-ink-82">
              You are not assigned to a rota. You are taught by a person, whose
              name you know, whose licence is documented, and who stays with you
              from the first assessment to the certificate at the end.
            </p>
          </Reveal>

          {/* The ledger, as on the front page — the record stated plainly. */}
          <Reveal className="pt-[54px]">
            <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
            {/* Three rows, so the run fills one line rather than orphaning a
                fourth. Every figure here is checkable against the profiles
                below — no academy-wide claims the roster cannot support. */}
            <div className="grid gap-x-[60px] gap-y-[14px] pt-[14px] pb-7 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
              {[
                {
                  label: "Teachers listed here",
                  value: String(teachers.length),
                  accent: true,
                },
                { label: "Both trained at", value: "Al-Azhar" },
                { label: "Languages of instruction", value: "3" },
              ].map((row) => (
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
        </section>

        <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[88px]">
          <div className="flex flex-col gap-[clamp(56px,7vw,96px)]">
            {teachers.map((teacher, i) => (
              <TeacherProfile
                key={teacher.id}
                teacher={teacher}
                index={i}
                flip={i % 2 === 1}
              />
            ))}
          </div>
        </section>

        {/* The roster is growing; say so rather than let two profiles read as
            the whole faculty. */}
        <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(64px,8vw,104px)]">
          <Reveal>
            <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
            <div className="grid items-start gap-x-[clamp(28px,5vw,80px)] gap-y-6 pt-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
              <div>
                <h2 className="m-0 max-w-[20ch] text-[clamp(26px,3vw,36px)] leading-[1.14]">
                  More teachers are joining the roster.
                </h2>
              </div>
              <div>
                <p className="m-0 max-w-[52ch] text-[15.5px] leading-7 text-ink-78">
                  Every teacher is listed here by name before they take a class,
                  with the institution that trained them and the chain their
                  licence runs through. If you would like to be taught by
                  someone in particular, say so at enrolment and we will tell
                  you honestly whether they have a slot.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-[14px]">
                  <Link
                    className="btn btn-primary px-[22px] py-3 text-[15px] no-underline"
                    href="/#enroll"
                  >
                    Book a free assessment
                    <ArrowRight size={15} weight="duotone" />
                  </Link>
                  <a
                    className="btn btn-secondary px-[22px] py-3 text-[15px] no-underline"
                    href={`mailto:${contact.email}`}
                  >
                    Ask admissions
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
    </main>
  );
}

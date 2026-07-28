import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { PageHeader } from "@/components/nur/PageHeader";
import { Reveal } from "@/components/nur/Reveal";
import { getPrograms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Programs | A.O.A (As-Sattar Online Academy)",
  description:
    "Seven tracks at A.O.A (As-Sattar Online Academy): Tajwīd, Ḥifẓ, Qur'anic Arabic, Classical Arabic, ʿAqīdah/Fiqh/Sīrah, Yoruba, and Kids' Foundations. Each with a fixed syllabus, a named teacher and an end.",
};

// The tracks grouped by their kicker, in first-appearance order, so the page
// reads as a curriculum rather than a card grid.
type Program = Awaited<ReturnType<typeof getPrograms>>[number];

function groupByKicker(list: Program[]) {
  const groups: { name: string; items: Program[] }[] = [];
  for (const item of list) {
    const found = groups.find((g) => g.name === item.kicker);
    if (found) found.items.push(item);
    else groups.push({ name: item.kicker, items: [item] });
  }
  return groups;
}

export default async function ProgramsPage() {
  const programs = await getPrograms();
  const groups = groupByKicker(programs);

  return (
    <main>
      <PageHeader
        eyebrow="Programs"
        title="Seven tracks. One of them is yours."
        intro="Each track has a fixed syllabus, a named teacher and an end: a certificate, not a subscription that runs forever. You are placed by assessment, not by the level you say you are."
        ledger={[
          { label: "Tracks running", value: String(programs.length) },
          { label: "Students per circle, at most", value: "5" },
          { label: "Assessment, price of", value: "0", accent: true },
        ]}
      />

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[88px]">
        {groups.map((group) => (
          <Reveal key={group.name}>
            <section className="pb-[clamp(40px,5vw,64px)]">
              <div className="flex items-baseline gap-4 border-t-2 border-text pt-4">
                <h2 className="m-0 text-[13px] tracking-[0.1em] text-accent-700 uppercase">
                  {group.name}
                </h2>
                <span className="h-px flex-1 bg-ink-22" />
                <span className="text-[13px] tabular-nums text-ink-70">
                  {group.items.length}
                </span>
              </div>

              {group.items.map((program) => {
                // "Beginner → advanced · 9 months · adults & children"
                const specs = program.meta.split("·").map((s) => s.trim());
                return (
                  <article
                    key={program.title}
                    className="grid items-start gap-x-[clamp(24px,4vw,64px)] gap-y-4 border-b border-divider py-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]"
                  >
                    <h3 className="m-0 max-w-[20ch] text-[clamp(21px,2.2vw,27px)] leading-[1.18]">
                      {program.title}
                    </h3>
                    <div>
                      <p className="m-0 max-w-[54ch] text-[15.5px] leading-7 text-ink-78">
                        {program.body}
                      </p>
                      <ul className="mt-5 mb-0 flex list-none flex-wrap gap-x-2 gap-y-2 p-0">
                        {specs.map((spec) => (
                          <li
                            key={spec}
                            className="border border-divider px-2.5 py-1 text-[12.5px] leading-5 text-ink-70"
                          >
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </section>
          </Reveal>
        ))}
      </section>

      {/* Choosing one. */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(48px,7vw,88px)]">
        <Reveal>
          <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
          <div className="grid items-start gap-x-[clamp(28px,5vw,80px)] gap-y-6 pt-9 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            <h2 className="m-0 max-w-[18ch] text-[clamp(26px,3vw,36px)] leading-[1.14]">
              Not sure which one you belong in?
            </h2>
            <div>
              <p className="m-0 max-w-[52ch] text-[15.5px] leading-7 text-ink-78">
                Then don&rsquo;t choose. The first lesson is an assessment: a
                teacher listens to you read, or starts you at the alphabet if
                that is where you are, and tells you honestly which track fits.
                It costs nothing and commits you to nothing.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-[14px]">
                <Link
                  className="btn btn-primary px-[22px] py-3 text-[15px] no-underline"
                  href="/#enroll"
                >
                  Book a free assessment
                  <ArrowRight size={15} weight="duotone" />
                </Link>
                <Link
                  className="btn btn-secondary px-[22px] py-3 text-[15px] no-underline"
                  href="/method"
                >
                  How a track runs
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

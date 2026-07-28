import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quotes } from "@phosphor-icons/react/ssr";

import { PageHeader } from "@/components/nur/PageHeader";
import { Reveal } from "@/components/nur/Reveal";
import { getTestimonials, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Student stories — A.O.A (As-Sattar Online Academy)",
  description:
    "What students of A.O.A — As-Sattar Online Academy — say about learning the Qur'an, Arabic and Yoruba with a named teacher. Published only with the student's permission.",
};

export default async function StoriesPage() {
  const stories = await getTestimonials();
  const { contact } = await getSettings();
  const hasStories = stories.length > 0;

  return (
    <main>
      <PageHeader
        eyebrow="Stories"
        title="In their words."
        intro="Every quote on this page is from a student or a parent who agreed to it being published, under the name they chose. We do not write them, and we do not buy them."
        ledger={
          hasStories
            ? [
                { label: "Stories published", value: String(stories.length) },
                { label: "Written by the academy", value: "0", accent: true },
              ]
            : undefined
        }
      />

      {hasStories ? (
        <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[88px]">
          <div>
            {stories.map((story, i) => (
              <Reveal key={story.source}>
                <figure className="m-0 grid items-start gap-x-[clamp(24px,4vw,64px)] gap-y-4 border-t border-text py-[clamp(36px,5vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
                  <div className="flex items-baseline gap-4">
                    <span className="font-heading text-[13px] tabular-nums text-accent-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <figcaption className="text-[15px] leading-7 text-ink-70">
                      {story.source}
                    </figcaption>
                  </div>
                  <blockquote className="m-0 max-w-[34ch] font-heading text-[clamp(22px,2.6vw,32px)] leading-[1.3] font-normal tracking-[-0.02em] italic">
                    {story.quote}
                  </blockquote>
                </figure>
              </Reveal>
            ))}
            <hr className="m-0 h-0 border-0 border-t border-text" />
          </div>
        </section>
      ) : (
        /* Deliberately empty rather than padded out. The three testimonials
           that used to sit here came from the design mockup and were invented;
           publishing them under invented names would be a fabricated review.
           Add real ones to `stories` and this block is replaced by them. */
        <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[88px]">
          <Reveal>
            <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
            <div className="grid items-start gap-x-[clamp(28px,5vw,80px)] gap-y-8 pt-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
              <div>
                <Quotes
                  size={30}
                  weight="duotone"
                  className="mb-5 text-accent"
                />
                <h2 className="m-0 max-w-[18ch] text-[clamp(26px,3vw,36px)] leading-[1.14]">
                  There is nothing published here yet.
                </h2>
              </div>
              <div>
                <p className="m-0 max-w-[52ch] text-[16px] leading-7 text-ink-78">
                  We would rather show you an empty page than a page of quotes
                  we wrote ourselves. Nothing appears here until a student or a
                  parent has read it and agreed to it going up.
                </p>
                <p className="mt-4 mb-0 max-w-[52ch] text-[16px] leading-7 text-ink-78">
                  In the meantime, the things you would want a testimonial to
                  tell you are all checkable directly: the teachers are named
                  with their licences, the syllabus for every track is fixed and
                  published, and the first lesson costs nothing — so you can
                  form your own view before you pay for anything.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-[14px]">
                  <Link
                    className="btn btn-primary px-[22px] py-3 text-[15px] no-underline"
                    href="/#founder"
                  >
                    Meet the founder
                    <ArrowRight size={15} weight="duotone" />
                  </Link>
                  <Link
                    className="btn btn-secondary px-[22px] py-3 text-[15px] no-underline"
                    href="/method"
                  >
                    Read our method
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* How to contribute one. */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(64px,8vw,104px)]">
        <Reveal>
          <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
          <div className="grid items-start gap-x-[clamp(28px,5vw,80px)] gap-y-6 pt-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            <h2 className="m-0 max-w-[18ch] text-[clamp(24px,2.8vw,34px)] leading-[1.14]">
              Studied with us? Tell us how it went.
            </h2>
            <div>
              <p className="m-0 max-w-[52ch] text-[15.5px] leading-7 text-ink-78">
                Write to admissions with whatever you would want to have read
                before you enrolled — the honest version. Tell us the name you
                want on it, or ask to stay anonymous. Nothing goes up without
                you seeing it first, and you can have it taken down at any time.
              </p>
              <a
                className="btn btn-ghost mt-6 text-[15px] no-underline"
                href={`mailto:${contact.email}?subject=${encodeURIComponent("My story")}`}
              >
                {contact.email} <ArrowRight size={15} weight="duotone" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

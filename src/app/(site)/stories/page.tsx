import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "@phosphor-icons/react/ssr";

import { PageHeader } from "@/components/nur/PageHeader";
import { Reveal } from "@/components/nur/Reveal";
import { AUDIENCES, AUDIENCE_LABEL } from "@/lib/stories";
import { getLibraryStories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Stories | A.O.A (As-Sattar Online Academy)",
  description:
    "Stories of the prophets and other accounts worth sitting with, for children and for adults. Free to read, no enrolment needed.",
};

export default async function StoriesPage() {
  const stories = await getLibraryStories();

  // Only render a group that has something in it, so the page never shows an
  // empty heading while the library is still filling up.
  const groups = AUDIENCES.map((audience) => ({
    audience,
    items: stories.filter((s) => s.audience === audience),
  })).filter((g) => g.items.length > 0);

  return (
    <main>
      <PageHeader
        eyebrow="Stories"
        title="Stories worth sitting with."
        intro="Accounts of the prophets and others worth telling, written plainly. Some for children, some for adults. Free to read, and no enrolment needed to read them."
        ledger={
          stories.length
            ? [
                { label: "Stories in the library", value: String(stories.length) },
                { label: "Price to read", value: "0", accent: true },
              ]
            : undefined
        }
      />

      {stories.length === 0 ? (
        <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[88px]">
          <Reveal>
            <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
            <div className="pt-10">
              <BookOpen size={30} weight="duotone" className="mb-5 text-accent" />
              <h2 className="m-0 max-w-[20ch] text-[clamp(26px,3vw,36px)] leading-[1.14]">
                The library is still being written.
              </h2>
              <p className="mt-5 mb-0 max-w-[52ch] text-[16px] leading-7 text-ink-78">
                The first stories are on their way. In the meantime, everything
                else on the site is open to read.
              </p>
            </div>
          </Reveal>
        </section>
      ) : (
        <div className="pt-[88px]">
          {groups.map((group) => (
            <section
              key={group.audience}
              className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pb-[clamp(48px,6vw,72px)]"
            >
              <Reveal>
                <div className="mb-7 flex items-baseline gap-4">
                  <h2 className="m-0 text-[clamp(22px,2.4vw,28px)] leading-[1.14]">
                    {AUDIENCE_LABEL[group.audience]}
                  </h2>
                  <span className="h-px flex-1 bg-ink-22" />
                  <span className="text-[13px] tabular-nums text-ink-70">
                    {group.items.length}
                  </span>
                </div>

                {/* auto-FILL, not auto-fit: a group holding a single story
                    would otherwise stretch it across the full width. */}
                <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
                  {group.items.map((story) => (
                    <Link
                      key={story.slug}
                      href={`/stories/${story.slug}`}
                      className="card group gap-[10px] p-[26px] text-text no-underline transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:text-text hover:shadow-md"
                    >
                      <span className="card-kicker">
                        {story.readingMinutes} min read
                      </span>
                      <h3 className="card-title mb-0 text-[21px] transition-colors group-hover:text-accent-700">
                        {story.title}
                      </h3>
                      <p className="card-body text-sm leading-6">
                        {story.summary}
                      </p>
                      {story.source && (
                        <p className="card-meta mt-1.5 mb-0">{story.source}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </Reveal>
            </section>
          ))}
        </div>
      )}

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(48px,7vw,88px)]">
        <Reveal>
          <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 pt-8">
            <p className="m-0 max-w-[46ch] text-[17px] leading-7 text-ink-80">
              These are the stories in translation. Reading them in the language
              they were revealed in is a different thing altogether, and that is
              what the academy is for.
            </p>
            <Link
              className="btn btn-primary px-[22px] py-3 text-[15px] no-underline"
              href="/register"
            >
              Book a free assessment
              <ArrowRight size={15} weight="duotone" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

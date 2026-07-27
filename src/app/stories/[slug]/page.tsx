import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";

import { Reveal } from "@/components/nur/Reveal";
import { AUDIENCE_LABEL, getStories, getStory } from "@/lib/stories";

// Every story is known at build time, so each gets its own static page.
export function generateStaticParams() {
  return getStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return { title: "Story not found — A.O.A" };
  return {
    title: `${story.title} — A.O.A (As-Sattar Online Academy)`,
    description: story.summary,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const others = getStories().filter((s) => s.slug !== story.slug);

  return (
    <main>
      <article className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[76px]">
        <Reveal>
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-[14px] text-ink-70 no-underline hover:text-accent-700"
          >
            <ArrowLeft size={14} weight="duotone" />
            All stories
          </Link>

          {/* The measure is deliberately narrow here — this is the one page
              on the site meant to be read straight through. */}
          <div className="mt-8 max-w-[64ch]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] tracking-[0.1em] text-accent-700 uppercase">
              <span>{AUDIENCE_LABEL[story.audience]}</span>
              <span aria-hidden="true" className="h-3 w-px bg-ink-30" />
              <span>{story.readingMinutes} min read</span>
            </div>

            <h1 className="mt-5 mb-0 font-heading text-[clamp(32px,4.4vw,56px)] leading-[1.08] font-semibold tracking-[-0.026em]">
              {story.title}
            </h1>

            {story.summary && (
              <p className="mt-6 mb-0 text-[18px] leading-[30px] text-ink-82">
                {story.summary}
              </p>
            )}

            {story.source && (
              <p className="mt-5 mb-0 text-[14px] leading-6 text-ink-65">
                {story.source}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal className="pt-10">
          <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
        </Reveal>

        <div className="max-w-[64ch] pt-10 pb-4">
          {story.blocks.map((block, i) => {
            if (block.kind === "heading") {
              return (
                <h2
                  key={i}
                  className="mt-11 mb-0 text-[clamp(21px,2.2vw,26px)] leading-[1.2] first:mt-0"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.kind === "quote") {
              return (
                <figure
                  key={i}
                  className="my-9 border-l-2 border-accent pl-6"
                >
                  <blockquote className="m-0 font-heading text-[clamp(19px,2vw,23px)] leading-[1.45] font-normal tracking-[-0.012em] italic">
                    {block.text}
                  </blockquote>
                  {block.cite && (
                    <figcaption className="mt-3 text-[14px] leading-6 text-ink-65">
                      — {block.cite}
                    </figcaption>
                  )}
                </figure>
              );
            }
            return (
              <p
                key={i}
                className="mt-5 mb-0 text-[17px] leading-[30px] text-ink-82 first:mt-0"
              >
                {block.text}
              </p>
            );
          })}
        </div>
      </article>

      {others.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(56px,7vw,88px)]">
          <Reveal>
            <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
            <span className="mt-8 mb-6 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
              Read next
            </span>
            <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
              {others.slice(0, 3).map((other) => (
                <Link
                  key={other.slug}
                  href={`/stories/${other.slug}`}
                  className="card group gap-[10px] p-[26px] text-text no-underline transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:text-text hover:shadow-md"
                >
                  <span className="card-kicker">
                    {AUDIENCE_LABEL[other.audience]}
                  </span>
                  <h3 className="card-title mb-0 text-[19px] transition-colors group-hover:text-accent-700">
                    {other.title}
                  </h3>
                  <p className="card-body text-sm leading-6">{other.summary}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(56px,7vw,88px)]">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <p className="m-0 max-w-[44ch] text-[17px] leading-7 text-ink-80">
              Read it in the language it was revealed in.
            </p>
            <Link
              className="btn btn-primary px-[22px] py-3 text-[15px] no-underline"
              href="/#enroll"
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

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Reveal } from "./Reveal";
import { getSettings } from "@/lib/content";

/**
 * The closing call to action on the home page.
 *
 * This used to capture an email address inline and file it as an enquiry.
 * It now sends people to /register instead: a registration collects what is
 * actually needed to place a student — who the classes are for, what they
 * want to study, what they can already do and when they are free — and an
 * address on its own did none of that.
 *
 * Contact details stay, but framed as they are meant to be used: for a
 * question the form cannot answer, not as a second way to sign up.
 */
export async function Enroll() {
  const { contact } = await getSettings();

  return (
    <section
      id="enroll"
      className="relative mx-auto max-w-[1200px] scroll-mt-[90px] px-[clamp(20px,5vw,72px)] pt-[clamp(60px,9vw,118px)]"
    >
      <div
        aria-hidden="true"
        data-parallax="0.35"
        className="pointer-events-none absolute top-[90px] right-[4%] size-[260px] animate-nur-float rounded-full blur-[8px] [animation-duration:13s]"
        style={{
          background:
            "radial-gradient(circle at 45% 40%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 68%)",
        }}
      />

      <Reveal className="relative">
        <hr className="m-0 mb-[34px] h-[5px] border-0 border-t-2 border-b border-text" />
        <h2 className="m-0 -ml-[0.035em] max-w-[17ch] font-heading text-[clamp(36px,5.4vw,68px)] leading-[1.07] font-semibold tracking-[-0.028em]">
          <span className="block">The intake closes.</span>
          <span className="block">The Book doesn&rsquo;t.</span>
        </h2>
        <p className="mt-7 mb-0 max-w-[52ch] text-[17px] leading-7 text-ink-80">
          Register in one form. Thirty minutes with a teacher, an honest
          placement, and a plan you can see the end of. No card, no obligation.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            className="btn btn-primary min-h-[48px] px-[26px] text-[15px] no-underline"
            href="/register"
          >
            Register now
            <ArrowRight size={15} weight="duotone" />
          </Link>
          <span className="text-[13px] leading-5 text-ink-65">
            First lesson free · no card
          </span>
        </div>

        <p className="mt-[18px] mb-0 max-w-[54ch] text-[13px] leading-[22px] text-ink-65">
          Please register using the form rather than writing in. If you have a
          question it does not cover, email{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </Reveal>
    </section>
  );
}

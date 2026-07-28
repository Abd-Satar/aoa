import { EnrollForm } from "./EnrollForm";
import { Reveal } from "./Reveal";
import { getSettings } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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
          Book a free assessment lesson this week. Thirty minutes with a
          teacher, an honest placement, and a plan you can see the end of. No
          card, no obligation.
        </p>

        <EnrollForm email={contact.email} connected={isSupabaseConfigured} />

        <p className="mt-[14px] mb-0 text-[13px] leading-[22px] text-ink-65">
          Or write to <a href={`mailto:${contact.email}`}>{contact.email}</a>. A
          person answers, usually within a day.
        </p>
      </Reveal>
    </section>
  );
}

import type { Metadata } from "next";
import { Warning } from "@phosphor-icons/react/ssr";

import { PageHeader } from "@/components/nur/PageHeader";
import { Reveal } from "@/components/nur/Reveal";
import { CounsellingForm } from "@/components/nur/CounsellingForm";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Counselling | A.O.A (As-Sattar Online Academy)",
  description:
    "Ask a question about Islam, or talk something through in confidence. Open to students of A.O.A (As-Sattar Online Academy) and to anyone else, free, and read only by the founder.",
};

export default async function CounsellingPage() {
  const { contact } = await getSettings();

  return (
    <main>
      <PageHeader
        eyebrow="Counselling"
        title="Ask, or talk it through."
        intro="A question about Islam you have never had a straight answer to. A doubt you would rather not say out loud. Something at home, at work, or in your own head that is getting heavier. Write it here and a person reads it."
        ledger={[
          { label: "Cost", value: "Free", accent: true },
          { label: "Open to", value: "Students and non-students" },
          { label: "Usual reply", value: "Within 2 days" },
        ]}
      />

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(40px,6vw,72px)]">
        <Reveal>
          <div className="max-w-[680px]">
            <h2 className="m-0 text-[clamp(20px,2.3vw,25px)] leading-[1.18]">
              What this is, and what it is not.
            </h2>

            {/* Said plainly and early. The rest of the site is built on not
                claiming more than is true, and this is the page where an
                overstatement would do the most damage to a real person. */}
            <p className="mt-5 mb-0 max-w-[58ch] text-[15.5px] leading-7 text-ink-78">
              This is religious guidance and a listening ear from a teacher.
              It is <strong className="font-semibold">not</strong> therapy, and
              the person answering is not a licensed counsellor, psychologist or
              doctor. He is a teacher of the Qur&rsquo;an who will answer what he
              knows, say so when he does not, and tell you when the thing you
              are carrying needs a professional rather than an imam.
            </p>
            <p className="mt-4 mb-0 max-w-[58ch] text-[15.5px] leading-7 text-ink-78">
              What you write is read by the founder and by nobody else. It is
              not published, not shown to other students, and not shared with
              anyone else except where the law requires it. You may use a first
              name only. We delete these messages within three weeks of
              replying, and sooner if you ask.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <aside
            role="note"
            className="mt-8 flex max-w-[680px] items-start gap-4 border-l-2 border-accent bg-surface px-5 py-5"
          >
            <Warning
              size={22}
              weight="duotone"
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-accent"
            />
            <div>
              <h3 className="m-0 text-[15.5px] leading-6 font-semibold">
                If you are in danger, do not use this form.
              </h3>
              <p className="mt-2 mb-0 max-w-[54ch] text-[14.5px] leading-6 text-ink-78">
                This is not an emergency service and it is not monitored around
                the clock. If you are at risk of harming yourself or someone
                else, or you are not safe where you are, contact your local
                emergency number or a crisis line in your country now. That is
                not a brush-off. It is the right help, faster than this page can
                reach you.
              </p>
            </div>
          </aside>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pb-[clamp(56px,8vw,96px)]">
        <Reveal>
          <CounsellingForm email={contact.email} />
        </Reveal>

        <Reveal>
          <aside className="mt-16 max-w-[680px] border-t border-divider pt-8">
            <h2 className="m-0 text-[17px] leading-6">
              Questions about classes instead?
            </h2>
            <p className="mt-3 mb-0 max-w-[56ch] text-[15px] leading-7 text-ink-78">
              This form is for questions about Islam and about life. If you want
              to study with us, <a href="/register">register here</a> instead.
              Anything else the site has not answered, email{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a>.
            </p>
          </aside>
        </Reveal>
      </section>
    </main>
  );
}

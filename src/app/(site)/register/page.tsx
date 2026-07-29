import type { Metadata } from "next";

import { PageHeader } from "@/components/nur/PageHeader";
import { Reveal } from "@/components/nur/Reveal";
import { RegistrationForm } from "@/components/nur/RegistrationForm";
import { getPrograms, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Register | A.O.A (As-Sattar Online Academy)",
  description:
    "Register for classes at A.O.A (As-Sattar Online Academy). Tell us who the classes are for, what you want to study and when you are free, and a teacher will write back within one working day.",
};

export default async function RegisterPage() {
  // Read from the same place the /programs page does, so the choices here are
  // whatever is actually on offer today.
  const [programs, { contact }] = await Promise.all([
    getPrograms(),
    getSettings(),
  ]);

  return (
    <main>
      <PageHeader
        eyebrow="Registration"
        title="Register for classes."
        intro="Fill this in once and you are registered. A teacher reads every one of these and will write back within one working day with your placement and a first session time. There is no payment at this stage, and no obligation."
        ledger={[
          { label: "First lesson", value: "Free", accent: true },
          { label: "We reply within", value: "1 working day" },
        ]}
      />

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(56px,8vw,96px)]">
        <Reveal>
          <RegistrationForm
            programs={programs.map((p) => p.title)}
            email={contact.email}
          />
        </Reveal>

        {/* The instruction is explicit: register with the form. Contact
            details are for questions the form cannot answer, and are framed
            that way rather than offered as an alternative route in. */}
        <Reveal>
          <aside className="mt-16 max-w-[720px] border-t border-divider pt-8">
            <h2 className="m-0 text-[17px] leading-6">
              Have a question first?
            </h2>
            <p className="mt-3 mb-0 max-w-[56ch] text-[15px] leading-7 text-ink-78">
              Register above rather than writing in. If something is genuinely
              unanswered, most questions are covered on the{" "}
              <a href="/faq">FAQ page</a>. For anything left over, email{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a> or message{" "}
              <a
                href={`https://wa.me/${contact.phoneHref.replace(/[^\d]/g, "")}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {contact.phone}
              </a>{" "}
              on WhatsApp.
            </p>
          </aside>
        </Reveal>
      </section>
    </main>
  );
}

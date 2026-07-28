import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { PageHeader } from "@/components/nur/PageHeader";
import { Reveal } from "@/components/nur/Reveal";
import { siteUrl } from "@/lib/nur-content";
import { getFaqs, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Questions | A.O.A (As-Sattar Online Academy)",
  description:
    "Answers about enrolling at A.O.A (As-Sattar Online Academy): whether you need Arabic to start, which languages classes are taught in, enrolling a child, female teachers, missed weeks, and the teacher's qualifications.",
  alternates: { canonical: new URL("/faq", siteUrl).toString() },
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  const { contact } = await getSettings();

  // Search engines render this as a rich result. Built from the same data the
  // page renders, so the two cannot disagree.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // Serialised from our own data, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHeader
        eyebrow="Questions"
        title="Before you enroll."
        intro="The things people ask us most, answered without hedging. If your question is not here, it is a fair question. Write to admissions and a person will answer it."
        ledger={[
          { label: "Questions answered", value: String(faqs.length) },
          { label: "Assessment, price of", value: "0", accent: true },
        ]}
      />

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[80px]">
        <Reveal>
          <div className="max-w-[860px]">
            {faqs.map((item, i) => (
              <details
                key={item.q}
                // The first is open so the page never reads as a wall of
                // closed rows.
                open={i === 0}
                className="group border-t border-text py-6"
              >
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-heading text-[clamp(18px,2vw,22px)] leading-[1.3] font-semibold">
                  <span className="flex items-baseline gap-4">
                    <span className="font-heading text-[13px] tabular-nums text-accent-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.q}
                  </span>
                  <span className="shrink-0 text-[15px] text-accent transition-transform duration-300 group-open:rotate-45">
                    ＋
                  </span>
                </summary>
                <p className="mt-4 mb-0 max-w-[64ch] pl-[calc(13px+1rem)] text-[16px] leading-7 text-ink-78">
                  {item.a}
                </p>
              </details>
            ))}
            <hr className="m-0 h-0 border-0 border-t border-text" />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(64px,8vw,104px)]">
        <Reveal>
          <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
          <div className="grid items-start gap-x-[clamp(28px,5vw,80px)] gap-y-6 pt-9 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            <h2 className="m-0 max-w-[18ch] text-[clamp(26px,3vw,36px)] leading-[1.14]">
              Still have a question?
            </h2>
            <div>
              <p className="m-0 max-w-[52ch] text-[15.5px] leading-7 text-ink-78">
                Write to admissions. A person answers, usually within a day, and
                you will get a straight answer even when it is not the one that
                wins us an enrolment.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-[14px]">
                <a
                  className="btn btn-primary px-[22px] py-3 text-[15px] no-underline"
                  href={`mailto:${contact.email}`}
                >
                  {contact.email}
                  <ArrowRight size={15} weight="duotone" />
                </a>
                <Link
                  className="btn btn-secondary px-[22px] py-3 text-[15px] no-underline"
                  href="/#enroll"
                >
                  Book a free assessment
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

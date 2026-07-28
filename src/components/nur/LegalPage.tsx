import Link from "next/link";
import type { ReactNode } from "react";

import { PageHeader } from "./PageHeader";
import { Reveal } from "./Reveal";
import { LEGAL_UPDATED, legalDocs, type LegalDoc } from "@/lib/legal";

/**
 * Renders one legal document.
 *
 * The body is stored as plain sentences with `{email}` and `{refunds}`
 * tokens, resolved here into real elements rather than interpolated into a
 * string. That keeps the contact address in one place (Site details) and
 * means a policy can never quote an address the footer has moved on from.
 */
function withTokens(text: string, email: string): ReactNode[] {
  return text.split(/(\{email\}|\{refunds\})/).map((part, i) => {
    if (part === "{email}") {
      return (
        <a key={i} href={`mailto:${email}`}>
          {email}
        </a>
      );
    }
    if (part === "{refunds}") {
      return (
        <Link key={i} href="/refunds">
          Refund Policy
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function LegalPage({ doc, email }: { doc: LegalDoc; email: string }) {
  const others = legalDocs.filter((d) => d.slug !== doc.slug);

  return (
    <main>
      <PageHeader
        eyebrow={doc.eyebrow}
        title={doc.title}
        intro={withTokens(doc.intro, email)}
      />

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(40px,6vw,64px)]">
        <Reveal>
          <div className="max-w-[68ch]">
            <p className="m-0 text-[13px] tracking-[0.08em] text-ink-65 uppercase">
              Last updated: {LEGAL_UPDATED}
            </p>
            <hr className="mt-4 mb-0 h-0 border-0 border-t-2 border-text" />

            {doc.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-6 mb-0 text-[16.5px] leading-[30px] text-ink-82"
              >
                {withTokens(paragraph, email)}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* The other two, so a reader never has to go back to the footer. */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(56px,8vw,96px)]">
        <Reveal>
          <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-7">
            <p className="m-0 text-[15px] leading-7 text-ink-70">
              Also worth reading:
            </p>
            {others.map((d) => (
              <Link
                key={d.slug}
                href={`/${d.slug}`}
                className="text-[16px] font-semibold no-underline"
              >
                {d.eyebrow}
              </Link>
            ))}
            <a
              className="btn btn-secondary ml-auto px-[22px] py-2.5 text-[15px] no-underline"
              href={`mailto:${email}`}
            >
              Ask a question
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

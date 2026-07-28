import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Reveal } from "./Reveal";
import { getFaqs } from "@/lib/content";

/**
 * Native <details> rows — no JavaScript, and they stay open for in-page
 * search and print.
 */
export async function Faq() {
  const faqs = await getFaqs();

  return (
    <section
      id="faq"
      className="mx-auto max-w-[1200px] scroll-mt-[90px] px-[clamp(20px,5vw,72px)] pt-[108px]"
    >
      <Reveal className="grid gap-x-[clamp(24px,5vw,80px)] gap-y-7 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
        <div>
          <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
            Questions
          </span>
          <h2 className="m-0 max-w-[14ch] text-[clamp(28px,3vw,38px)] leading-[1.14]">
            Before you enroll
          </h2>
          <Link className="btn btn-ghost mt-5 text-[15px] no-underline" href="/faq">
            All questions <ArrowRight size={15} weight="duotone" />
          </Link>
        </div>

        <div>
          {faqs.map((item, i) => (
            <details
              key={item.q}
              className={`border-t border-divider py-5 ${
                i === faqs.length - 1 ? "border-b" : ""
              }`}
            >
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-5 font-heading text-xl leading-7 font-semibold">
                {item.q}
                <span className="text-[15px] text-accent">＋</span>
              </summary>
              <p className="mt-3 mb-0 max-w-[60ch] text-[15.5px] leading-7 text-ink-78">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

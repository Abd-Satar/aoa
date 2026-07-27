import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { navLinks } from "@/lib/nur-content";

export const metadata: Metadata = {
  title: "Page not found — A.O.A (As-Sattar Online Academy)",
};

// Lives inside app/, so it inherits the masthead and footer from the layout
// rather than dumping the visitor on an unstyled default.
export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[96px] pb-[clamp(64px,8vw,120px)]">
      <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
        404
      </span>
      <h1 className="m-0 -ml-[0.03em] max-w-[16ch] font-heading text-[clamp(40px,5.6vw,72px)] leading-[1.07] font-semibold tracking-[-0.028em]">
        That page isn&rsquo;t here.
      </h1>
      <p className="mt-8 mb-0 max-w-[52ch] text-[17.5px] leading-7 text-ink-82">
        The link may be out of date, or we may have moved something. Everything
        the site has is one of these:
      </p>

      <ul className="mt-10 mb-0 max-w-[560px] list-none border-t border-text p-0">
        {navLinks.map((link) => (
          <li key={link.label} className="border-b border-divider">
            <Link
              href={link.href}
              className="flex items-baseline justify-between gap-4 py-4 text-[17px] no-underline"
            >
              {link.label}
              <ArrowRight size={15} weight="duotone" />
            </Link>
          </li>
        ))}
      </ul>

      <Link
        className="btn btn-primary mt-10 px-[22px] py-3 text-[15px] no-underline"
        href="/"
      >
        Back to the front page
      </Link>
    </main>
  );
}

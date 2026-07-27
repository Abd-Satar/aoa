import Link from "next/link";
import {
  InstagramLogo,
  WhatsappLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/ssr";
import { contact, footerLinks, youtube } from "@/lib/nur-content";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-24 pb-14">
      <div className="grid gap-x-10 gap-y-8 text-sm leading-[26px] [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        <div>
          <span className="font-heading text-lg font-semibold tracking-[0.02em]">
            A.O.A
          </span>
          <p className="mt-1 mb-0 text-[12px] tracking-[0.14em] text-accent-700 uppercase">
            As-Sattar Online Academy
          </p>
          <p className="mt-2.5 mb-0 max-w-[26ch] text-ink-65">
            Qur&rsquo;an, Arabic and Islamic studies, taught live in English,
            Arabic and Yoruba since 2014.
          </p>
        </div>

        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading} className="flex flex-col gap-1">
            <span className="mb-1.5 text-xs tracking-[0.1em] text-ink-55 uppercase">
              {heading}
            </span>
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="no-underline">
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <span className="mb-1.5 text-xs tracking-[0.1em] text-ink-55 uppercase">
            Contact
          </span>
          <a href={`mailto:${contact.email}`} className="no-underline">
            {contact.email}
          </a>
          <a href={`tel:${contact.phoneHref}`} className="no-underline">
            {contact.phone}
          </a>
          <div className="mt-2 flex gap-3">
            {/* TODO: no Instagram handle supplied yet — points at enrolment. */}
            <Link href="/#enroll" aria-label="Instagram" className="no-underline">
              <InstagramLogo size={20} weight="duotone" />
            </Link>
            <a
              href={youtube.url}
              target="_blank"
              rel="noopener"
              aria-label="YouTube"
              className="no-underline"
            >
              <YoutubeLogo size={20} weight="duotone" />
            </a>
            <a
              href={`https://wa.me/${contact.phoneHref.replace("+", "")}`}
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
              className="no-underline"
            >
              <WhatsappLogo size={20} weight="duotone" />
            </a>
          </div>
        </div>
      </div>

      <hr className="mt-10 mb-[18px] h-0 border-0 border-t border-divider" />

      <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 text-[12.5px] text-ink-60">
        <span>© 2026 As-Sattar Online Academy. All rights reserved.</span>
        {/* TODO: these three pages do not exist yet. */}
        <span className="flex gap-5">
          <Link href="/#enroll" className="no-underline">
            Privacy
          </Link>
          <Link href="/#enroll" className="no-underline">
            Terms
          </Link>
          <Link href="/#enroll" className="no-underline">
            Refunds
          </Link>
        </span>
      </div>
    </footer>
  );
}

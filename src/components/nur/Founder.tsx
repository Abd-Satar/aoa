import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import { founder } from "@/lib/nur-content";

/**
 * The founder, on the home page.
 *
 * This replaced a teachers grid and a separate /teachers route. With one
 * person to introduce, a portrait beside the full biography reads better
 * than a card that truncates it and a page you have to click through to.
 */
export function Founder() {
  return (
    <section
      id="founder"
      className="mx-auto max-w-[1200px] scroll-mt-[90px] px-[clamp(20px,5vw,72px)] pt-[104px]"
    >
      <Reveal>
        <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
          Founder &amp; Proprietor
        </span>
        <h2 className="m-0 mb-2 max-w-[22ch] text-[clamp(30px,3.4vw,42px)] leading-[1.12]">
          The person who will teach you.
        </h2>
      </Reveal>

      <Reveal>
        <article className="mt-10 grid items-start gap-x-[clamp(28px,5vw,72px)] gap-y-9 border-t border-text pt-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          <div>
            <figure className="cmyk m-0 overflow-visible" data-parallax="-0.045">
              <div className="print aspect-4/5">
                <ImageSlot
                  src={founder.image}
                  alt={`Portrait of ${founder.name}`}
                  placeholder={founder.placeholder}
                  sizes="(max-width: 900px) 100vw, 42vw"
                />
              </div>
            </figure>

            <dl className="mt-7 mb-0 border-t border-divider">
              <dt className="sr-only">Education and experience</dt>
              {founder.credentials.map((credential) => (
                <dd
                  key={credential}
                  className="m-0 flex items-baseline gap-3 border-b border-divider py-2.5 text-[14px] leading-6"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] size-1 shrink-0 self-start bg-accent-500"
                  />
                  {credential}
                </dd>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-1">
            <h3 className="m-0 text-[clamp(24px,2.8vw,32px)] leading-[1.14]">
              {founder.name}
            </h3>
            <p className="mt-3 mb-0">
              <span className="inline-block bg-accent px-2.5 py-1 text-[11.5px] tracking-[0.12em] text-bg uppercase">
                {founder.title}
              </span>
            </p>

            {founder.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-5 mb-0 max-w-[56ch] text-[16px] leading-[29px] text-ink-78"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </Reveal>
    </section>
  );
}

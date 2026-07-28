import { Reveal } from "./Reveal";
import { getSettings } from "@/lib/content";

export async function Ayah() {
  const { ayah } = await getSettings();

  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(56px,9vw,110px)]">
      <Reveal>
        <figure className="m-0 grid items-start gap-x-[clamp(28px,6vw,96px)] gap-y-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <p
            dir="rtl"
            lang="ar"
            className="m-0 text-right font-arabic text-[clamp(28px,3.6vw,46px)] leading-[1.85] text-accent-700"
          >
            {ayah.arabic}
          </p>
          <div>
            <blockquote className="m-0 max-w-[32ch] font-heading text-[clamp(23px,2.6vw,33px)] leading-[1.36] font-normal tracking-[-0.01em] italic">
              {ayah.text}
            </blockquote>
            <figcaption className="mt-6 text-[15.5px] leading-7 text-ink-70">
              {ayah.source}
            </figcaption>
          </div>
        </figure>
      </Reveal>
    </section>
  );
}

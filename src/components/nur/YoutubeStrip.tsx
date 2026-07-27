import { YoutubeLogo } from "@phosphor-icons/react/ssr";
import { Reveal } from "./Reveal";
import { youtube } from "@/lib/nur-content";

export function YoutubeStrip() {
  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[54px]">
      <Reveal className="flex flex-wrap items-baseline gap-x-[18px] gap-y-[10px]">
        <YoutubeLogo size={26} weight="duotone" className="text-accent" />
        <p className="m-0 max-w-[52ch] text-[17px] leading-7 text-ink-80">
          {youtube.text}
        </p>
        <a
          href={youtube.url}
          target="_blank"
          rel="noopener"
          className="font-heading text-[17px] leading-7 font-semibold text-accent-700 underline-offset-4"
        >
          {youtube.label} →
        </a>
      </Reveal>
    </section>
  );
}

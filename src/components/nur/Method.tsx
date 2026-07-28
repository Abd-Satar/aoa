import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { ImageSlot } from "./ImageSlot";
import { ReadMore } from "./ReadMore";
import { Reveal } from "./Reveal";

export function Method() {
  return (
    <section
      id="story"
      className="mx-auto max-w-[1200px] scroll-mt-[90px] px-[clamp(20px,5vw,72px)] pt-[clamp(56px,9vw,104px)]"
    >
      <Reveal className="grid items-center gap-x-[clamp(24px,5vw,96px)] gap-y-7 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
        <div>
          <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
            Our method
          </span>
          <h2 className="m-0 text-[clamp(30px,3.4vw,40px)] leading-[1.14]">
            Most people don&rsquo;t stop because it&rsquo;s hard. They stop
            because nobody noticed.
          </h2>
          {/* Ranged left on phones. Justified text needs a comfortable
              measure to avoid rivers, and a 350px column does not have one. */}
          <p className="mt-5 mb-0 max-w-[48ch] text-[15.5px] leading-7 text-ink-78 sm:text-justify sm:hyphens-auto">
            A.O.A began in 2015 with one teacher and a handful of students,
            most of whom had already given up once. What kept them was not a
            better app. It was a named person, at a fixed hour, who asked where
            you got to and remembered the answer.
          </p>
          <ReadMore more="Read the rest" less="Show less">
            <p className="mt-4 mb-0 max-w-[48ch] text-[15.5px] leading-7 text-ink-78 sm:text-justify sm:hyphens-auto">
              That is still the whole method. A syllabus you can see the end of,
              a teacher who does not rotate, and a written record of every
              session so that progress is a fact rather than a feeling.
            </p>
          </ReadMore>
          <Link className="btn btn-ghost mt-[18px] text-[15px] no-underline" href="/method">
            How a track runs <ArrowRight size={15} weight="duotone" />
          </Link>
        </div>

        <figure className="cmyk m-0 overflow-visible" data-parallax="-0.05">
          <div className="print aspect-[986/660]">
            <ImageSlot
              alt="A teacher and student at work"
              placeholder="Drop a photo: a teacher and student, or a manuscript page"
            />
          </div>
        </figure>
      </Reveal>
    </section>
  );
}

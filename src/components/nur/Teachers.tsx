import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import { teachers } from "@/lib/nur-content";

/**
 * The home page teaser. Full profiles live at /teachers; this shows the
 * roster and sends you there.
 */
export function Teachers() {
  return (
    <section
      id="teachers"
      className="mx-auto max-w-[1200px] scroll-mt-[90px] px-[clamp(20px,5vw,72px)] pt-[104px]"
    >
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
              The teachers
            </span>
            <h2 className="m-0 mb-2 max-w-[22ch] text-[clamp(30px,3.4vw,42px)] leading-[1.12]">
              Named, credentialed, and yours for the whole track
            </h2>
          </div>
          <Link
            className="btn btn-ghost text-[15px] no-underline"
            href="/teachers"
          >
            All teachers <ArrowRight size={15} weight="duotone" />
          </Link>
        </div>

        <div className="mt-11 grid gap-x-[clamp(28px,4vw,64px)] gap-y-10 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))]">
          {teachers.map((teacher) => (
            <Link
              key={teacher.id}
              href={`/teachers#${teacher.slug}`}
              className="group text-text no-underline hover:text-text"
            >
              <figure className="cmyk m-0 overflow-visible">
                <div className="print aspect-4/5">
                  <ImageSlot
                    src={teacher.image}
                    alt={`Portrait of ${teacher.name}`}
                    placeholder={teacher.placeholder}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </div>
              </figure>
              <h3 className="mt-5 mb-0 text-[21px] leading-[26px] transition-colors group-hover:text-accent-700">
                {teacher.name}
              </h3>
              <p className="mt-2 mb-0 text-[13px] tracking-[0.06em] text-accent-700 uppercase">
                {teacher.title ? `${teacher.title} · ${teacher.role}` : teacher.role}
              </p>
              <p className="mt-3 mb-0 text-[15px] leading-[26px] text-ink-78">
                {teacher.body[0]}
              </p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

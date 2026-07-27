import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import type { Teacher } from "@/lib/nur-content";

/**
 * A full teacher profile: portrait on one side, the record on the other.
 *
 * Profiles alternate sides down the page (`flip`), which gives the column a
 * rhythm and keeps a short roster from reading as a stub. The portrait keeps
 * its source order in the DOM either way — the swap is done with grid
 * placement, so the reading order stays name-then-record for a screen reader
 * regardless of which side the photograph lands on.
 */
export function TeacherProfile({
  teacher,
  index,
  flip = false,
}: {
  teacher: Teacher;
  index: number;
  flip?: boolean;
}) {
  return (
    <Reveal>
      <article
        id={teacher.slug}
        className="grid scroll-mt-[110px] items-start gap-x-[clamp(28px,5vw,80px)] gap-y-8 border-t border-text pt-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]"
      >
        <div className={flip ? "md:order-2" : undefined}>
          <figure className="cmyk m-0 overflow-visible" data-parallax="-0.045">
            <div className="print aspect-4/5">
              <ImageSlot
                src={teacher.image}
                alt={`Portrait of ${teacher.name}`}
                placeholder={teacher.placeholder}
                sizes="(max-width: 900px) 100vw, 45vw"
                priority={index === 0}
              />
            </div>
          </figure>
        </div>

        <div className={flip ? "md:order-1" : undefined}>
          {/* The index is set as a folio number, the way a broadsheet marks
              an entry in a list. */}
          <div className="flex items-baseline gap-4">
            <span className="font-heading text-[13px] tabular-nums text-accent-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px flex-1 bg-ink-22" />
            <span className="text-[12px] tracking-[0.1em] text-ink-70 uppercase">
              {teacher.role}
            </span>
          </div>

          <h2 className="mt-5 mb-0 text-[clamp(28px,3.2vw,40px)] leading-[1.12]">
            {teacher.name}
          </h2>

          {teacher.title && (
            <p className="mt-3 mb-0">
              <span className="inline-block bg-accent px-2.5 py-1 text-[11.5px] tracking-[0.12em] text-bg uppercase">
                {teacher.title}
              </span>
            </p>
          )}

          {teacher.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="mt-5 mb-0 max-w-[52ch] text-[16px] leading-[28px] text-ink-78"
            >
              {paragraph}
            </p>
          ))}

          <dl className="mt-8 mb-0 border-t border-divider">
            <dt className="sr-only">Credentials</dt>
            {teacher.credentials.map((credential) => (
              <dd
                key={credential}
                className="m-0 flex items-baseline gap-3 border-b border-divider py-2.5 text-[14.5px] leading-6"
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
      </article>
    </Reveal>
  );
}

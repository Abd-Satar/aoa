import Image from "next/image";

/**
 * The design's `<image-slot>`, ported.
 *
 * In the Claude Design runtime this was a drag-and-drop target that
 * persisted whatever you dropped on it. Here it is the same hole in the
 * layout: pass `src` once you have the photograph and it renders through
 * `next/image`; until then it draws a labelled plate so the composition —
 * and the separation filter wrapping it — still reads.
 *
 * Sits inside `figure.cmyk > .print`, which sizes it and applies `#sep-all`.
 */
export function ImageSlot({
  src,
  alt,
  placeholder,
  priority = false,
  sizes = "(max-width: 900px) 100vw, 50vw",
}: {
  src?: string;
  alt: string;
  placeholder: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className="grid h-full w-full place-items-center border border-divider bg-surface p-6 text-center"
    >
      <span className="max-w-[26ch] text-[12.5px] leading-5 tracking-[0.08em] text-ink-70 uppercase">
        {placeholder}
      </span>
    </div>
  );
}

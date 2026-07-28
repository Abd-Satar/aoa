import type { Field } from "@/lib/admin/resources";

/**
 * One labelled input, chosen from the field's type.
 *
 * Help text is rendered above the control rather than below it — you want to
 * know what good input looks like *before* you type, not after.
 */
export function FormField({
  field,
  value,
}: {
  field: Field;
  value: unknown;
}) {
  const id = `field-${field.name}`;

  const base =
    "w-full rounded-md border border-divider bg-surface px-3 py-2 text-[15px] leading-6 text-text " +
    "placeholder:text-ink-45 focus-visible:border-accent focus-visible:outline-none";

  const asText = (v: unknown) =>
    Array.isArray(v) ? (v as string[]).join("\n\n") : v == null ? "" : String(v);

  return (
    <div className={field.half ? "sm:col-span-1" : "sm:col-span-2"}>
      <label
        htmlFor={id}
        className="block text-[13px] font-semibold tracking-[0.01em] text-text"
      >
        {field.label}
        {field.required && (
          <span className="ml-1 text-accent" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {field.help && (
        <p className="mt-1 mb-2 text-[12.5px] leading-5 text-ink-65">
          {field.help}
        </p>
      )}

      <div className={field.help ? "" : "mt-2"}>
        {field.type === "boolean" ? (
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-[15px]">
            <input
              id={id}
              name={field.name}
              type="checkbox"
              defaultChecked={Boolean(value)}
              className="size-4 accent-[var(--color-accent)]"
            />
            <span className="text-ink-78">Visible on the public site</span>
          </label>
        ) : field.type === "select" ? (
          <select
            id={id}
            name={field.name}
            defaultValue={asText(value) || field.options?.[0]?.value}
            className={base}
          >
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : field.type === "number" ? (
          <input
            id={id}
            name={field.name}
            type="number"
            defaultValue={Number(value ?? 0)}
            className={base}
          />
        ) : field.type === "textarea" ||
          field.type === "list" ||
          field.type === "longform" ? (
          <textarea
            id={id}
            name={field.name}
            rows={field.rows ?? (field.type === "longform" ? 20 : 4)}
            defaultValue={asText(value)}
            placeholder={field.placeholder}
            className={`${base} ${
              field.type === "longform" ? "font-mono text-[14px]" : ""
            } resize-y`}
          />
        ) : (
          <input
            id={id}
            name={field.name}
            type="text"
            defaultValue={asText(value)}
            placeholder={field.placeholder}
            className={base}
          />
        )}
      </div>
    </div>
  );
}

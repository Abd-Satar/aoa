"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { FormField } from "./FormField";
import { saveRecord, type ActionState } from "@/lib/admin/actions";
import type { Resource } from "@/lib/admin/resources";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary px-6 py-2.5 text-[15px] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function RecordForm({
  resource,
  record,
}: {
  resource: Resource;
  record: Record<string, unknown> | null;
}) {
  const id = (record?.id as string | undefined) ?? null;

  const [state, action] = useActionState<ActionState, FormData>(
    saveRecord.bind(null, resource.key, id),
    null,
  );

  return (
    <form action={action}>
      {state?.error && (
        <p
          role="alert"
          className="mb-6 rounded-md border border-divider bg-surface px-4 py-3 text-[14px] leading-6 text-text"
        >
          <strong className="font-semibold">Not saved.</strong> {state.error}
        </p>
      )}

      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        {resource.fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={record?.[field.name]}
          />
        ))}
      </div>

      {/* Sticky so the save button is reachable from anywhere in a long form
          — the story editor is 22 rows on its own. */}
      <div className="sticky bottom-0 mt-10 flex flex-wrap items-center gap-3 border-t border-divider bg-bg/95 py-4 backdrop-blur">
        <SaveButton label={id ? "Save changes" : `Create ${resource.singular}`} />
        <Link
          href={`/admin/${resource.key}`}
          className="btn btn-secondary px-5 py-2.5 text-[15px] no-underline"
        >
          Cancel
        </Link>
        <span className="ml-auto text-[13px] text-ink-65">
          <span className="text-accent">*</span> required
        </span>
      </div>
    </form>
  );
}

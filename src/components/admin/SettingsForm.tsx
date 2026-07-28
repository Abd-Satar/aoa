"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormField } from "./FormField";
import { saveSettings, type ActionState } from "@/lib/admin/actions";
import type { Field } from "@/lib/admin/resources";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary px-6 py-2.5 text-[15px] disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save details"}
    </button>
  );
}

export function SettingsForm({
  fields,
  values,
}: {
  fields: Field[];
  values: Record<string, string>;
}) {
  const [state, action] = useActionState<ActionState, FormData>(
    saveSettings,
    null,
  );

  return (
    <form action={action}>
      {(state?.error || state?.ok) && (
        <p
          role="status"
          className="mb-6 rounded-md border border-divider bg-surface px-4 py-3 text-[14px] leading-6"
        >
          {state.error ? (
            <>
              <strong className="font-semibold">Not saved.</strong> {state.error}
            </>
          ) : (
            state.ok
          )}
        </p>
      )}

      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        {fields.map((field) => (
          <FormField key={field.name} field={field} value={values[field.name]} />
        ))}
      </div>

      <div className="sticky bottom-0 mt-10 border-t border-divider bg-bg/95 py-4 backdrop-blur">
        <SaveButton />
      </div>
    </form>
  );
}

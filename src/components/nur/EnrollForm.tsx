"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type EnquiryState } from "@/lib/enquiries";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary min-h-[44px] px-[22px] text-[15px] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Enroll now"}
    </button>
  );
}

/**
 * The enrolment form.
 *
 * When a database is connected the address is written to `enquiries` and the
 * visitor gets a confirmation in place. Without one it falls back to opening
 * a pre-addressed email.
 *
 * It used to *always* do the mailto. That silently did nothing for anyone
 * without a desktop mail client registered — the button appeared dead. A
 * form that cannot confirm it worked is worse than no form.
 */
export function EnrollForm({
  email: admissionsEmail,
  connected,
}: {
  email: string;
  connected: boolean;
}) {
  const [state, action] = useActionState<EnquiryState, FormData>(
    submitEnquiry,
    { status: "idle" },
  );

  if (state.status === "ok") {
    return (
      <div
        role="status"
        className="mt-7 max-w-[520px] rounded-md border border-accent/40 bg-surface px-5 py-4"
      >
        <p className="m-0 text-[15.5px] leading-7">
          <strong className="font-semibold">Thank you.</strong> We have your
          address and will write back within a day to arrange your free
          assessment.
        </p>
      </div>
    );
  }

  // No database: keep the old behaviour, but say where the button leads so a
  // missing mail client is not a mystery.
  if (!connected) {
    return (
      <form
        className="mt-7 flex max-w-[520px] flex-wrap items-stretch gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const address = String(data.get("email") ?? "");
          const subject = encodeURIComponent("Free assessment lesson");
          const body = encodeURIComponent(
            `Please book me a free assessment lesson.\n\nEmail: ${address}\n`,
          );
          window.location.href = `mailto:${admissionsEmail}?subject=${subject}&body=${body}`;
        }}
      >
        <input
          className="input min-h-[44px] min-w-[220px] flex-1"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          aria-label="Email address"
        />
        <button
          type="submit"
          className="btn btn-primary min-h-[44px] px-[22px] text-[15px]"
        >
          Enroll now
        </button>
        <p className="m-0 w-full text-[13px] leading-5 text-ink-65">
          This opens your email app. If nothing happens, write to{" "}
          <a href={`mailto:${admissionsEmail}`}>{admissionsEmail}</a> directly.
        </p>
      </form>
    );
  }

  return (
    <form action={action} className="mt-7 max-w-[520px]">
      <div className="flex flex-wrap items-stretch gap-3">
        <input
          className="input min-h-[44px] min-w-[220px] flex-1"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          aria-label="Email address"
          aria-describedby={state.status === "error" ? "enroll-error" : undefined}
        />
        <SubmitButton />
      </div>

      {/* Hidden from people, visible to naive bots. Not a substitute for rate
          limiting, but it costs nothing. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && (
        <p
          id="enroll-error"
          role="alert"
          className="mt-3 mb-0 text-[13.5px] leading-6 text-text"
        >
          {state.message}{" "}
          <a href={`mailto:${admissionsEmail}`}>{admissionsEmail}</a>
        </p>
      )}
    </form>
  );
}

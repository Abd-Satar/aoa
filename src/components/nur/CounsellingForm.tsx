"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle } from "@phosphor-icons/react/ssr";
import {
  submitCounsellingRequest,
  type CounsellingState,
} from "@/lib/counselling";
import { CONTACT_METHODS, TOPICS } from "@/lib/counselling-fields";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary min-h-[48px] px-[26px] text-[15px] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send this privately"}
    </button>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13.5px] leading-5 font-semibold">
        {label}
        {required ? (
          <span className="ml-1 text-accent-700" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 text-[12.5px] font-normal text-ink-65">
            optional
          </span>
        )}
      </span>
      {hint && <span className="-mt-1 text-[12.5px] leading-5 text-ink-65">{hint}</span>}
      {children}
    </div>
  );
}

/**
 * The counselling request form.
 *
 * Shorter than the registration form on purpose. Someone writing here may be
 * having a bad week, and a long form is one more reason to close the tab.
 * Name, a way to reply, and what they want to say. Everything else optional.
 */
export function CounsellingForm({ email }: { email: string }) {
  const [state, action] = useActionState<CounsellingState, FormData>(
    submitCounsellingRequest,
    { status: "idle" },
  );
  const [method, setMethod] = useState("email");

  if (state.status === "ok") {
    return (
      <div
        role="status"
        className="mt-10 border border-accent/40 bg-surface px-6 py-8 sm:px-8"
      >
        <CheckCircle size={30} weight="duotone" className="mb-4 text-accent" />
        <h2 className="m-0 text-[clamp(22px,2.6vw,28px)] leading-[1.16]">
          Your message has been sent.
        </h2>
        <p className="mt-4 mb-0 max-w-[54ch] text-[15.5px] leading-7 text-ink-78">
          It goes to the founder and nobody else. You will get a reply by{" "}
          {state.method === "whatsapp" ? "WhatsApp" : "email"}, usually within
          two days. If it is taking longer than that, it is because the answer
          deserves more thought, not because it has been forgotten.
        </p>
        <p className="mt-4 mb-0 max-w-[54ch] text-[14px] leading-6 text-ink-65">
          If your situation changes and it becomes urgent, please contact a
          local emergency service rather than waiting for this reply.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-10 max-w-[680px]">
      <div className="grid gap-6 border-t border-text pt-8 sm:grid-cols-2">
        <Field label="What may we call you?" required hint="A first name is enough.">
          <input
            className="input min-h-[44px]"
            name="name"
            required
            maxLength={120}
            autoComplete="given-name"
          />
        </Field>

        <Field label="How should we reply?" required>
          <select
            className="input min-h-[44px]"
            name="contact_method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            {CONTACT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field
            label={method === "whatsapp" ? "Your WhatsApp number" : "Your email address"}
            required
            hint={
              method === "whatsapp"
                ? "Include your country code."
                : "Used only to reply to you."
            }
          >
            <input
              className="input min-h-[44px]"
              type={method === "whatsapp" ? "tel" : "email"}
              name="contact_detail"
              required
              maxLength={320}
              placeholder={method === "whatsapp" ? "+234 703 522 6583" : "you@example.com"}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="What is it about?">
            <select className="input min-h-[44px]" name="topic" defaultValue="">
              <option value="">Prefer not to categorise it</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            label="What would you like to talk about?"
            required
            hint="Say as much or as little as you want. Nothing here is published anywhere."
          >
            <textarea
              className="input min-h-[180px] resize-y py-2.5"
              name="message"
              required
              rows={8}
              maxLength={4000}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-[14.5px] leading-6">
            <input
              type="checkbox"
              name="prefer_female"
              className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
            />
            <span>
              I would rather a woman answered this.
              <span className="mt-1 block text-[13px] leading-5 text-ink-65">
                We will say honestly whether we can. Classes and replies are
                currently handled by the founder, so at the moment we usually
                cannot, and we would rather tell you now than after you have
                written.
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* Hidden from people, visible to naive bots. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && (
        <p
          role="alert"
          className="mt-8 mb-0 border-l-2 border-accent bg-surface px-4 py-3 text-[14.5px] leading-6"
        >
          {state.message}{" "}
          {/email us/i.test(state.message) && (
            <a href={`mailto:${email}`}>{email}</a>
          )}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-divider pt-8">
        <SubmitButton />
        <p className="m-0 max-w-[40ch] text-[13px] leading-5 text-ink-65">
          Read by the founder only. See the{" "}
          <a href="/privacy">privacy policy</a>.
        </p>
      </div>
    </form>
  );
}

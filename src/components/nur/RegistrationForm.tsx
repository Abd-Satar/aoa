"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle } from "@phosphor-icons/react/ssr";
import { submitRegistration, type RegistrationState } from "@/lib/registrations";
import { LANGUAGES, LEVELS, STUDENT_TYPES } from "@/lib/registration-fields";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary min-h-[48px] px-[26px] text-[15px] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Complete registration"}
    </button>
  );
}

/** One labelled control. Labels are always visible — placeholders are not labels. */
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

function Legend({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <legend className="mb-6 flex items-baseline gap-3 text-[13px] tracking-[0.08em] text-ink-70 uppercase">
      <span className="font-heading text-[15px] tabular-nums text-accent-700">
        {String(n).padStart(2, "0")}
      </span>
      {children}
    </legend>
  );
}

/**
 * The registration form.
 *
 * Long forms lose people, so this asks only what is needed to place a student
 * and book the first session. Everything past that is marked optional and can
 * be left alone.
 *
 * `programs` is passed in from the server so the choices track whatever is in
 * the admin — a programme renamed there is renamed here, with no second list
 * to keep in step.
 */
export function RegistrationForm({
  programs,
  email,
}: {
  programs: string[];
  email: string;
}) {
  const [state, action] = useActionState<RegistrationState, FormData>(
    submitRegistration,
    { status: "idle" },
  );
  // Controlled, because the student's name and age only make sense when the
  // classes are for somebody other than the person filling the form in.
  const [studentType, setStudentType] = useState("self");
  const forSomeoneElse = studentType !== "self";
  const errorId = useId();

  if (state.status === "ok") {
    return (
      <div
        role="status"
        className="mt-10 border border-accent/40 bg-surface px-6 py-8 sm:px-8"
      >
        <CheckCircle size={30} weight="duotone" className="mb-4 text-accent" />
        <h2 className="m-0 text-[clamp(22px,2.6vw,28px)] leading-[1.16]">
          {state.name ? `Thank you, ${state.name}.` : "Thank you."} You are
          registered.
        </h2>
        <p className="mt-4 mb-0 max-w-[52ch] text-[15.5px] leading-7 text-ink-78">
          We have your details. A teacher will write to you within one working
          day to confirm your placement and arrange your first session. There is
          nothing else you need to do.
        </p>
        <p className="mt-4 mb-0 max-w-[52ch] text-[14px] leading-6 text-ink-65">
          If you have a further question in the meantime, write to{" "}
          <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-10 max-w-[720px]">
      <fieldset className="m-0 border-0 border-t border-text p-0 pt-8">
        <Legend n={1}>About you</Legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your full name" required>
            <input
              className="input min-h-[44px]"
              name="full_name"
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Aisha Abdullah"
            />
          </Field>

          <Field label="Email address" required>
            <input
              className="input min-h-[44px]"
              type="email"
              name="email"
              required
              maxLength={320}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </Field>

          <Field label="Phone or WhatsApp" required hint="Include your country code.">
            <input
              className="input min-h-[44px]"
              type="tel"
              name="phone"
              required
              maxLength={40}
              autoComplete="tel"
              placeholder="+234 703 522 6583"
            />
          </Field>

          <Field label="Where you are based" hint="City and country, so we can match a time zone.">
            <input
              className="input min-h-[44px]"
              name="location"
              maxLength={120}
              placeholder="Lagos, Nigeria"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="m-0 mt-12 border-0 border-t border-text p-0 pt-8">
        <Legend n={2}>Who the classes are for</Legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="These classes are for" required>
            <select
              className="input min-h-[44px]"
              name="student_type"
              value={studentType}
              onChange={(e) => setStudentType(e.target.value)}
            >
              {STUDENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          {forSomeoneElse && (
            <>
              <Field label="Student's name" required>
                <input
                  className="input min-h-[44px]"
                  name="student_name"
                  required
                  maxLength={120}
                />
              </Field>
              <Field label="Student's age">
                <input
                  className="input min-h-[44px]"
                  name="student_age"
                  maxLength={40}
                  placeholder="9"
                />
              </Field>
            </>
          )}
        </div>
      </fieldset>

      <fieldset className="m-0 mt-12 border-0 border-t border-text p-0 pt-8">
        <Legend n={3}>What you want to study</Legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Programme" hint="Not sure? Leave it and we will advise at the assessment.">
            <select className="input min-h-[44px]" name="program" defaultValue="">
              <option value="">Not sure yet</option>
              {programs.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Language of instruction" required>
            <select className="input min-h-[44px]" name="language" defaultValue="English">
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Current level">
              <select className="input min-h-[44px]" name="level" defaultValue="">
                <option value="">Prefer not to say</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field
              label="Days and times that suit you"
              hint="Roughly is fine. We will confirm an exact slot with you."
            >
              <input
                className="input min-h-[44px]"
                name="availability"
                maxLength={400}
                placeholder="Weekday evenings after 6pm, or Saturday mornings"
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Anything else we should know">
              <textarea
                className="input min-h-[110px] resize-y py-2.5"
                name="note"
                rows={4}
                maxLength={2000}
              />
            </Field>
          </div>
        </div>
      </fieldset>

      {/* Hidden from people, visible to naive bots. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && (
        <p
          id={errorId}
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
          We use these details only to arrange your classes. Read the{" "}
          <a href="/privacy">privacy policy</a>.
        </p>
      </div>
    </form>
  );
}

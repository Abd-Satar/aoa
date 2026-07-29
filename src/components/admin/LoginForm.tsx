"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, type ActionState } from "@/lib/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary mt-2 justify-center py-2.5 text-[15px] disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

/**
 * The password is posted to a server action and checked there against the
 * environment. Nothing about the credentials exists in the browser bundle.
 */
export function LoginForm() {
  const [state, action] = useActionState<ActionState, FormData>(signIn, null);

  const input =
    "w-full rounded-md border border-divider bg-surface px-3 py-2.5 text-[15px] text-text " +
    "placeholder:text-ink-45 focus-visible:border-accent focus-visible:outline-none";

  return (
    <form action={action} className="grid gap-4">
      {state?.error && (
        <p
          role="alert"
          className="m-0 rounded-md border border-divider bg-surface px-4 py-3 text-[14px] leading-6"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="block text-[13px] font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={`${input} mt-2`}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-[13px] font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={`${input} mt-2`}
        />
      </div>

      <SubmitButton />
    </form>
  );
}

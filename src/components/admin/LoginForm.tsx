"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const input =
    "w-full rounded-md border border-divider bg-surface px-3 py-2.5 text-[15px] text-text " +
    "placeholder:text-ink-45 focus-visible:border-accent focus-visible:outline-none";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("The database is not connected yet.");
      setBusy(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Deliberately not distinguishing "no such user" from "wrong password".
      setError("That email and password did not match.");
      setBusy(false);
      return;
    }

    // Full refresh so the server re-reads the new auth cookie and the proxy
    // sees the session.
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {error && (
        <p
          role="alert"
          className="m-0 rounded-md border border-divider bg-surface px-4 py-3 text-[14px] leading-6"
        >
          {error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="block text-[13px] font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${input} mt-2`}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-[13px] font-semibold">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${input} mt-2`}
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="btn btn-primary mt-2 justify-center py-2.5 text-[15px] disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

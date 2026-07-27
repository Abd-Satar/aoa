"use client";

import { useState } from "react";
import { contact } from "@/lib/nur-content";

/**
 * There is no admissions backend yet, so the form hands off to mail rather
 * than pretending to submit: a valid address opens a pre-addressed enquiry.
 * Swap `onSubmit` for a Server Action when the endpoint exists.
 */
export function EnrollForm() {
  const [email, setEmail] = useState("");

  return (
    <form
      className="mt-7 flex max-w-[520px] flex-wrap items-stretch gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const subject = encodeURIComponent("Free assessment lesson");
        const body = encodeURIComponent(
          `Please book me a free assessment lesson.\n\nEmail: ${email}\n`,
        );
        window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
      }}
    >
      <input
        className="input min-h-[44px] min-w-[220px] flex-1"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="btn btn-primary min-h-[44px] px-[22px] text-[15px]"
      >
        Enroll now
      </button>
    </form>
  );
}

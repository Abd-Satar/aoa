"use client";

import { useState, useTransition } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";
import { setRegistrationStatus, deleteRegistration } from "@/lib/admin/actions";
import { STATUSES } from "@/lib/registration-fields";

export type Registration = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string | null;
  student_type: string;
  student_name: string | null;
  student_age: string | null;
  program: string | null;
  language: string;
  level: string | null;
  availability: string | null;
  note: string | null;
  status: string;
  created_at: string;
};

const STATUS_DOT: Record<string, string> = {
  new: "bg-accent",
  contacted: "bg-accent/50",
  enrolled: "bg-ink-30",
  declined: "bg-ink-22",
};

/** A labelled line inside the expanded panel. Renders nothing when empty. */
function Line({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="text-[12.5px] tracking-[0.06em] text-ink-65 uppercase">
        {label}
      </dt>
      <dd className="m-0 text-[14.5px] leading-6 whitespace-pre-line">{value}</dd>
    </div>
  );
}

/**
 * One registration, collapsed to a summary until opened.
 *
 * A registration carries a dozen fields. Showing them all for every row makes
 * the list unreadable, so the summary answers "who, when, what next" and the
 * detail is one click away.
 */
export function RegistrationRow({ registration: r }: { registration: Registration }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const when = new Date(r.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const studentLabel =
    r.student_type === "self"
      ? "For themselves"
      : `For ${r.student_name ?? "someone else"}${r.student_age ? `, age ${r.student_age}` : ""}`;

  return (
    <li className="border-b border-divider">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
        <span
          aria-hidden="true"
          title={r.status}
          className={`size-2 shrink-0 rounded-full ${STATUS_DOT[r.status] ?? "bg-ink-30"}`}
        />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2 border-0 bg-transparent p-0 text-left"
        >
          <span className="min-w-0">
            <span className="block truncate text-[15.5px] font-semibold">
              {r.full_name}
            </span>
            <span className="mt-0.5 block truncate text-[13px] text-ink-65">
              {when} · {r.program ?? "No programme chosen"} · {r.language}
            </span>
          </span>
          <CaretDown
            size={14}
            weight="bold"
            aria-hidden="true"
            className={`shrink-0 text-ink-65 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <label className="flex items-center gap-2 text-[13px] text-ink-65">
          <span className="sr-only">Status for {r.full_name}</span>
          <select
            value={r.status}
            disabled={pending}
            onChange={(e) =>
              start(() =>
                setRegistrationStatus(r.id, e.target.value).then(() => {}),
              )
            }
            className="input min-h-[34px] w-auto text-[13px] disabled:opacity-50"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm(`Delete the registration from ${r.full_name}?`)) return;
            start(() => deleteRegistration(r.id).then(() => {}));
          }}
          className="btn btn-secondary px-3 py-1.5 text-[13px] text-ink-70 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      {open && (
        <dl className="m-0 border-t border-divider py-3 pb-6">
          <Line label="Email" value={r.email} />
          <Line label="Phone" value={r.phone} />
          <Line label="Based in" value={r.location} />
          <Line label="Student" value={studentLabel} />
          <Line label="Programme" value={r.program} />
          <Line label="Language" value={r.language} />
          <Line label="Level" value={r.level} />
          <Line label="Availability" value={r.availability} />
          <Line label="Notes" value={r.note} />

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              className="btn btn-secondary px-3 py-1.5 text-[13px] no-underline"
              href={`mailto:${r.email}?subject=${encodeURIComponent("Your registration at A.O.A")}`}
            >
              Email {r.full_name.split(" ")[0]}
            </a>
            <a
              className="btn btn-secondary px-3 py-1.5 text-[13px] no-underline"
              href={`https://wa.me/${r.phone.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </dl>
      )}
    </li>
  );
}

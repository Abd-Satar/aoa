"use client";

import { useState, useTransition } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";
import {
  setCounsellingStatus,
  deleteCounsellingRequest,
} from "@/lib/admin/actions";
import { STATUSES } from "@/lib/counselling-fields";

export type CounsellingRequest = {
  id: string;
  name: string;
  contact_method: string;
  contact_detail: string;
  topic: string | null;
  prefer_female: boolean;
  message: string;
  status: string;
  created_at: string;
};

const STATUS_DOT: Record<string, string> = {
  new: "bg-accent",
  answered: "bg-accent/50",
  closed: "bg-ink-30",
};

/**
 * One counselling request, collapsed until opened.
 *
 * The message stays hidden behind the toggle deliberately: this list may be
 * open on a screen with somebody else in the room, and the contents of these
 * are not for glancing at.
 */
export function CounsellingRow({ request: r }: { request: CounsellingRequest }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const when = new Date(r.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const replyHref =
    r.contact_method === "whatsapp"
      ? `https://wa.me/${r.contact_detail.replace(/[^\d]/g, "")}`
      : `mailto:${r.contact_detail}?subject=${encodeURIComponent("Your message to A.O.A")}`;

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
              {r.name}
              {r.prefer_female && (
                <span className="ml-2 text-[12px] font-normal tracking-[0.06em] text-accent-700 uppercase">
                  asked for a woman
                </span>
              )}
            </span>
            <span className="mt-0.5 block truncate text-[13px] text-ink-65">
              {when} · {r.topic ?? "No topic given"}
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
          <span className="sr-only">Status for {r.name}</span>
          <select
            value={r.status}
            disabled={pending}
            onChange={(e) =>
              start(() => setCounsellingStatus(r.id, e.target.value).then(() => {}))
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
            if (
              !confirm(
                `Delete ${r.name}'s message? This cannot be undone, and deleting it once you have replied is the right thing to do.`,
              )
            )
              return;
            start(() => deleteCounsellingRequest(r.id).then(() => {}));
          }}
          className="btn btn-secondary px-3 py-1.5 text-[13px] text-ink-70 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      {open && (
        <div className="border-t border-divider py-4 pb-6">
          <p className="m-0 text-[12.5px] tracking-[0.06em] text-ink-65 uppercase">
            Reply to
          </p>
          <p className="mt-1 mb-4 text-[14.5px] leading-6">
            {r.contact_detail}{" "}
            <span className="text-ink-65">
              ({r.contact_method === "whatsapp" ? "WhatsApp" : "email"})
            </span>
          </p>

          <p className="m-0 text-[12.5px] tracking-[0.06em] text-ink-65 uppercase">
            Message
          </p>
          <p className="mt-2 mb-0 max-w-[70ch] text-[15px] leading-7 whitespace-pre-line">
            {r.message}
          </p>

          <div className="mt-5">
            <a
              className="btn btn-secondary px-3 py-1.5 text-[13px] no-underline"
              href={replyHref}
              {...(r.contact_method === "whatsapp"
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              Reply to {r.name.split(" ")[0]}
            </a>
          </div>
        </div>
      )}
    </li>
  );
}

"use client";

import { useTransition } from "react";
import { markEnquiryHandled, deleteEnquiry } from "@/lib/admin/actions";

export function EnquiryRow({
  enquiry,
}: {
  enquiry: {
    id: string;
    email: string;
    note: string | null;
    handled: boolean;
    created_at: string;
  };
}) {
  const [pending, start] = useTransition();

  const when = new Date(enquiry.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-divider py-4">
      <span
        aria-hidden="true"
        title={enquiry.handled ? "Answered" : "Waiting"}
        className={`size-2 shrink-0 rounded-full ${
          enquiry.handled ? "bg-ink-30" : "bg-accent"
        }`}
      />
      <div className="min-w-0 flex-1">
        <a
          href={`mailto:${enquiry.email}?subject=${encodeURIComponent("Your free assessment at A.O.A")}`}
          className="text-[15.5px] font-semibold no-underline"
        >
          {enquiry.email}
        </a>
        <p className="mt-0.5 mb-0 text-[13px] text-ink-65">
          {when}
          {enquiry.note ? ` · ${enquiry.note}` : ""}
        </p>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(() =>
            markEnquiryHandled(enquiry.id, !enquiry.handled).then(() => {}),
          )
        }
        className="btn btn-secondary px-3 py-1.5 text-[13px] disabled:opacity-50"
      >
        {enquiry.handled ? "Mark unanswered" : "Mark answered"}
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete the enquiry from ${enquiry.email}?`)) return;
          start(() => deleteEnquiry(enquiry.id).then(() => {}));
        }}
        className="btn btn-secondary px-3 py-1.5 text-[13px] text-ink-70 disabled:opacity-50"
      >
        Delete
      </button>
    </li>
  );
}

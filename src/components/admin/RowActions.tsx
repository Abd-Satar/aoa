"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteRecord, togglePublished } from "@/lib/admin/actions";

export function RowActions({
  resourceKey,
  id,
  published,
  title,
}: {
  resourceKey: string;
  id: string;
  published: boolean;
  title: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() =>
            togglePublished(resourceKey, id, !published).then(() => {}),
          )
        }
        className="btn btn-secondary px-3 py-1.5 text-[13px] disabled:opacity-50"
      >
        {published ? "Hide" : "Publish"}
      </button>

      <Link
        href={`/admin/${resourceKey}/${id}`}
        className="btn btn-secondary px-3 py-1.5 text-[13px] no-underline"
      >
        Edit
      </Link>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          // Deletion is irreversible and there is no undo, so make the name
          // being destroyed part of the question.
          if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
          startTransition(() => deleteRecord(resourceKey, id).then(() => {}));
        }}
        className="btn btn-secondary px-3 py-1.5 text-[13px] text-ink-70 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}

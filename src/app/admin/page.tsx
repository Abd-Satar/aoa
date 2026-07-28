import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser, getSupabaseServerClient } from "@/lib/supabase/server";
import { RESOURCES } from "@/lib/admin/resources";

export default async function AdminDashboard() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const supabase = await getSupabaseServerClient();

  // One count per content type: total, and how many are live.
  const counts = await Promise.all(
    RESOURCES.map(async (r) => {
      const total = await supabase!
        .from(r.table)
        .select("id", { count: "exact", head: true });
      const live = await supabase!
        .from(r.table)
        .select("id", { count: "exact", head: true })
        .eq("published", true);
      return {
        resource: r,
        total: total.count ?? 0,
        live: live.count ?? 0,
        error: total.error?.message ?? null,
      };
    }),
  );

  const missingTables = counts.filter((c) => c.error);

  return (
    <div>
      <h1 className="m-0 font-heading text-[clamp(24px,3vw,32px)] leading-[1.14] font-semibold tracking-[-0.02em]">
        Everything you can edit
      </h1>
      <p className="mt-3 mb-8 max-w-[60ch] text-[15.5px] leading-7 text-ink-78">
        Changes go live as soon as you save. Anything switched off stays here
        but disappears from the public site.
      </p>

      {missingTables.length > 0 && (
        <p className="mb-8 rounded-md border border-divider bg-surface px-4 py-3 text-[14px] leading-6">
          <strong className="font-semibold">Some tables are missing.</strong>{" "}
          Run <code>supabase/schema.sql</code> in the Supabase SQL editor, then
          reload. ({missingTables.map((m) => m.resource.table).join(", ")})
        </p>
      )}

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
        {counts.map(({ resource, total, live }) => (
          <Link
            key={resource.key}
            href={`/admin/${resource.key}`}
            className="group rounded-lg border border-divider bg-surface p-5 text-text no-underline transition-colors hover:border-accent hover:text-text"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="m-0 text-[17px] leading-6 group-hover:text-accent-700">
                {resource.label}
              </h2>
              <span className="font-heading text-[20px] font-semibold tabular-nums">
                {total}
              </span>
            </div>
            <p className="mt-2 mb-0 text-[13.5px] leading-5 text-ink-70">
              {resource.description}
            </p>
            <p className="mt-3 mb-0 text-[12.5px] text-ink-55">
              {live} live
              {total - live > 0 ? ` · ${total - live} hidden` : ""}
            </p>
          </Link>
        ))}

        <Link
          href="/admin/settings"
          className="group rounded-lg border border-divider bg-surface p-5 text-text no-underline transition-colors hover:border-accent hover:text-text"
        >
          <h2 className="m-0 text-[17px] leading-6 group-hover:text-accent-700">
            Site details
          </h2>
          <p className="mt-2 mb-0 text-[13.5px] leading-5 text-ink-70">
            Contact details, the āyah, and the YouTube strip.
          </p>
        </Link>
      </div>
    </div>
  );
}

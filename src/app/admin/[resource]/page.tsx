import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getResource, RESOURCES } from "@/lib/admin/resources";
import { RowActions } from "@/components/admin/RowActions";

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ resource: r.key }));
}

export default async function ResourceListPage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { resource: key } = await params;
  const flags = await searchParams;

  const resource = getResource(key);
  if (!resource) notFound();

  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase!
    .from(resource.table)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[clamp(24px,3vw,32px)] leading-[1.14] font-semibold tracking-[-0.02em]">
            {resource.label}
          </h1>
          <p className="mt-2 mb-0 max-w-[56ch] text-[15px] leading-6 text-ink-78">
            {resource.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {resource.publicPath && (
            <Link
              href={resource.publicPath}
              className="text-[13.5px] text-ink-70 no-underline hover:text-accent-700"
            >
              View page ↗
            </Link>
          )}
          <Link
            href={`/admin/${resource.key}/new`}
            className="btn btn-primary px-5 py-2.5 text-[15px] no-underline"
          >
            Add {resource.singular}
          </Link>
        </div>
      </div>

      {(flags.saved || flags.deleted) && (
        <p className="mt-6 mb-0 rounded-md border border-divider bg-surface px-4 py-3 text-[14px]">
          {flags.saved ? "Saved." : "Deleted."}
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-md border border-divider bg-surface px-4 py-3 text-[14px] leading-6">
          <strong className="font-semibold">Could not load.</strong>{" "}
          {error.message}
        </p>
      )}

      {!error && rows.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-divider px-6 py-12 text-center">
          <p className="m-0 text-[15.5px] text-ink-78">
            Nothing here yet.
          </p>
          <Link
            href={`/admin/${resource.key}/new`}
            className="btn btn-primary mt-5 px-5 py-2.5 text-[15px] no-underline"
          >
            Add the first {resource.singular}
          </Link>
        </div>
      )}

      {rows.length > 0 && (
        <ul className="mt-8 list-none border-t border-divider p-0">
          {rows.map((row) => {
            const title = String(row[resource.titleField] ?? "Untitled");
            const subtitleRaw = resource.subtitleField
              ? row[resource.subtitleField]
              : null;
            const subtitle = Array.isArray(subtitleRaw)
              ? (subtitleRaw as string[])[0]
              : subtitleRaw
                ? String(subtitleRaw)
                : "";
            const published = Boolean(row.published);

            return (
              <li
                key={String(row.id)}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-divider py-4"
              >
                <span
                  aria-hidden="true"
                  title={published ? "Live" : "Hidden"}
                  className={`size-2 shrink-0 rounded-full ${
                    published ? "bg-accent" : "bg-ink-30"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/${resource.key}/${String(row.id)}`}
                    className="text-[16px] font-semibold text-text no-underline hover:text-accent-700"
                  >
                    {title}
                  </Link>
                  {subtitle && (
                    <p className="mt-0.5 mb-0 truncate text-[13.5px] text-ink-65">
                      {subtitle}
                    </p>
                  )}
                </div>
                {!published && (
                  <span className="rounded-full border border-divider px-2.5 py-0.5 text-[11.5px] tracking-[0.06em] text-ink-65 uppercase">
                    Hidden
                  </span>
                )}
                <RowActions
                  resourceKey={resource.key}
                  id={String(row.id)}
                  published={published}
                  title={title}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

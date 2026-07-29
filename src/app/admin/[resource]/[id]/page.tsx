import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getResource } from "@/lib/admin/resources";
import { RecordForm } from "@/components/admin/RecordForm";

export default async function RecordPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: key, id } = await params;

  const resource = getResource(key);
  if (!resource) notFound();

  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const isNew = id === "new";
  let record: Record<string, unknown> | null = null;

  if (!isNew) {
    const supabase = getSupabaseAdminClient();
    const { data } = await supabase!
      .from(resource.table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    record = data as Record<string, unknown>;
  }

  const heading = isNew
    ? `New ${resource.singular}`
    : String(record?.[resource.titleField] ?? `Edit ${resource.singular}`);

  return (
    <div className="max-w-[840px]">
      <Link
        href={`/admin/${resource.key}`}
        className="text-[13.5px] text-ink-70 no-underline hover:text-accent-700"
      >
        ← {resource.label}
      </Link>

      <h1 className="mt-3 mb-8 font-heading text-[clamp(23px,2.8vw,30px)] leading-[1.14] font-semibold tracking-[-0.02em]">
        {heading}
      </h1>

      <RecordForm resource={resource} record={record} />
    </div>
  );
}

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { EnquiryRow } from "@/components/admin/EnquiryRow";

export default async function EnquiriesPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase!
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as {
    id: string;
    email: string;
    note: string | null;
    handled: boolean;
    created_at: string;
  }[];

  const outstanding = rows.filter((r) => !r.handled).length;

  return (
    <div>
      <h1 className="m-0 font-heading text-[clamp(24px,3vw,32px)] leading-[1.14] font-semibold tracking-[-0.02em]">
        Enrolment enquiries
      </h1>
      <p className="mt-3 mb-8 max-w-[60ch] text-[15.5px] leading-7 text-ink-78">
        Everyone who has submitted the &ldquo;Enroll now&rdquo; form, newest
        first. {outstanding > 0
          ? `${outstanding} still to answer.`
          : "All answered."}
      </p>

      {error && (
        <p className="rounded-md border border-divider bg-surface px-4 py-3 text-[14px] leading-6">
          <strong className="font-semibold">Could not load.</strong>{" "}
          {error.message}
          {/enquiries/i.test(error.message) && (
            <>
              {" "}
              Re-run <code>supabase/schema.sql</code>. This table was added
              after you first ran it.
            </>
          )}
        </p>
      )}

      {!error && rows.length === 0 && (
        <div className="rounded-lg border border-dashed border-divider px-6 py-12 text-center">
          <p className="m-0 text-[15.5px] text-ink-78">No enquiries yet.</p>
        </div>
      )}

      {rows.length > 0 && (
        <ul className="list-none border-t border-divider p-0">
          {rows.map((row) => (
            <EnquiryRow key={row.id} enquiry={row} />
          ))}
        </ul>
      )}
    </div>
  );
}

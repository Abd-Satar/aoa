import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  CounsellingRow,
  type CounsellingRequest,
} from "@/components/admin/CounsellingRow";

export const metadata = { title: "Counselling" };

export default async function CounsellingAdminPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase!
    .from("counselling_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as CounsellingRequest[];
  const waiting = rows.filter((r) => r.status === "new").length;

  const tableMissing =
    !!error && /relation|does not exist|schema cache/i.test(error.message);

  return (
    <div>
      <h1 className="m-0 font-heading text-[clamp(24px,3vw,32px)] leading-[1.14] font-semibold tracking-[-0.02em]">
        Counselling
      </h1>
      <p className="mt-3 mb-6 max-w-[62ch] text-[15.5px] leading-7 text-ink-78">
        Messages sent through the counselling form, newest first. Open a row to
        read one.{" "}
        {rows.length > 0 &&
          (waiting > 0 ? `${waiting} waiting for a reply.` : "All answered.")}
      </p>

      <p className="mb-8 max-w-[62ch] border-l-2 border-accent bg-surface px-4 py-3 text-[14px] leading-6">
        <strong className="font-semibold">These are private.</strong> They are
        read by you and nobody else, they never appear on the public site, and
        the person who wrote one may be a child or in real difficulty. Delete a
        message once you have dealt with it rather than keeping it here.
      </p>

      {error && (
        <div className="mb-8 rounded-md border border-divider bg-surface px-4 py-3 text-[14px] leading-6">
          <strong className="font-semibold">Could not load messages.</strong>{" "}
          {tableMissing ? (
            <>
              The table has not been created yet. Open the Supabase SQL editor,
              paste in <code>supabase/counselling.sql</code> and press Run, then
              reload this page.
            </>
          ) : (
            error.message
          )}
        </div>
      )}

      {!error && rows.length === 0 && (
        <div className="rounded-lg border border-dashed border-divider px-6 py-12 text-center">
          <p className="m-0 text-[15.5px] text-ink-78">No messages yet.</p>
          <p className="mt-2 mb-0 text-[13.5px] text-ink-65">
            They will appear here as soon as someone writes in at{" "}
            <code>/counselling</code>.
          </p>
        </div>
      )}

      {rows.length > 0 && (
        <ul className="list-none border-t border-divider p-0">
          {rows.map((row) => (
            <CounsellingRow key={row.id} request={row} />
          ))}
        </ul>
      )}
    </div>
  );
}

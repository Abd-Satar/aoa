import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  RegistrationRow,
  type Registration,
} from "@/components/admin/RegistrationRow";

export const metadata = { title: "Registrations" };

export default async function RegistrationsPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase!
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Registration[];
  const fresh = rows.filter((r) => r.status === "new").length;
  const enrolled = rows.filter((r) => r.status === "enrolled").length;

  // The table ships in its own migration, so "not created yet" is a state the
  // owner will actually hit. Say exactly which file to run.
  const tableMissing =
    !!error && /relation|does not exist|schema cache/i.test(error.message);

  return (
    <div>
      <h1 className="m-0 font-heading text-[clamp(24px,3vw,32px)] leading-[1.14] font-semibold tracking-[-0.02em]">
        Registrations
      </h1>
      <p className="mt-3 mb-8 max-w-[62ch] text-[15.5px] leading-7 text-ink-78">
        Everyone who has registered through the form, newest first. Open a row
        to see the full details and to write back.{" "}
        {rows.length > 0 && (
          <>
            {fresh > 0 ? `${fresh} still to contact.` : "All contacted."}
            {enrolled > 0 ? ` ${enrolled} enrolled.` : ""}
          </>
        )}
      </p>

      {error && (
        <div className="mb-8 rounded-md border border-divider bg-surface px-4 py-3 text-[14px] leading-6">
          <strong className="font-semibold">Could not load registrations.</strong>{" "}
          {tableMissing ? (
            <>
              The table has not been created yet. Open the Supabase SQL editor,
              paste in <code>supabase/registrations.sql</code> and press Run,
              then reload this page.
            </>
          ) : (
            error.message
          )}
        </div>
      )}

      {!error && rows.length === 0 && (
        <div className="rounded-lg border border-dashed border-divider px-6 py-12 text-center">
          <p className="m-0 text-[15.5px] text-ink-78">No registrations yet.</p>
          <p className="mt-2 mb-0 text-[13.5px] text-ink-65">
            They will appear here as soon as someone completes the form at{" "}
            <code>/register</code>.
          </p>
        </div>
      )}

      {rows.length > 0 && (
        <ul className="list-none border-t border-divider p-0">
          {rows.map((row) => (
            <RegistrationRow key={row.id} registration={row} />
          ))}
        </ul>
      )}
    </div>
  );
}

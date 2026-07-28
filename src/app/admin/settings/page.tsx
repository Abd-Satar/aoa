import { redirect } from "next/navigation";
import { getAdminUser, getSupabaseServerClient } from "@/lib/supabase/server";
import { SETTINGS_FIELDS } from "@/lib/admin/resources";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const supabase = await getSupabaseServerClient();
  const { data } = await supabase!.from("settings").select("key, value");

  const values = Object.fromEntries(
    (data ?? []).map((row) => [row.key as string, row.value as string]),
  );

  return (
    <div className="max-w-[840px]">
      <h1 className="m-0 font-heading text-[clamp(24px,3vw,32px)] leading-[1.14] font-semibold tracking-[-0.02em]">
        Site details
      </h1>
      <p className="mt-3 mb-8 max-w-[58ch] text-[15.5px] leading-7 text-ink-78">
        The values that appear in more than one place — the footer, the
        enrolment block, the āyah, the YouTube strip.
      </p>

      <SettingsForm fields={SETTINGS_FIELDS} values={values} />
    </div>
  );
}

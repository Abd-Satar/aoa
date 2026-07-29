"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession, destroySession } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { SETTINGS_FIELDS, getResource, type Field } from "./resources";

export type ActionState = { ok?: string; error?: string } | null;

/**
 * Every mutation starts here.
 *
 * The proxy redirect is only for the look of the thing; this is the check
 * that decides. It matters more than it used to: the client returned below
 * uses the service-role key and bypasses row level security, so this
 * function is the only thing standing between a request and the database.
 * Never return the client before the session check passes.
 */
async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const supabase = getSupabaseAdminClient();
  if (!supabase) redirect("/admin");
  return supabase;
}

/** Turn one form value into what the column expects. */
function coerce(field: Field, form: FormData) {
  const raw = form.get(field.name);

  if (field.type === "boolean") return raw === "on" || raw === "true";
  if (field.type === "number") {
    const n = Number(raw ?? 0);
    return Number.isFinite(n) ? n : 0;
  }
  if (field.type === "list") {
    // A textarea of paragraphs -> text[]. Blank lines separate entries, so
    // the author can write naturally instead of counting array slots.
    return String(raw ?? "")
      .split(/\n{2,}/)
      .map((s) => s.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean);
  }
  const value = String(raw ?? "").trim();
  return value.length ? value : null;
}

function revalidateEverything(publicPath?: string) {
  // Content appears in more than one place — a teacher shows on /teachers and
  // on the home page — so refresh the whole tree rather than guessing.
  revalidatePath("/", "layout");
  if (publicPath) revalidatePath(publicPath);
}

export async function saveRecord(
  resourceKey: string,
  id: string | null,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const resource = getResource(resourceKey);
  if (!resource) return { error: "Unknown content type." };

  const supabase = await requireAdmin();

  const payload: Record<string, unknown> = {};
  for (const field of resource.fields) {
    payload[field.name] = coerce(field, form);
  }

  // Required text fields must not be silently saved as null.
  for (const field of resource.fields) {
    if (field.required && !payload[field.name]) {
      return { error: `${field.label} is required.` };
    }
  }

  if (id) {
    const { error } = await supabase
      .from(resource.table)
      .update(payload)
      .eq("id", id);
    if (error) return { error: friendly(error.message) };
  } else {
    const { error } = await supabase.from(resource.table).insert(payload);
    if (error) return { error: friendly(error.message) };
  }

  revalidateEverything(resource.publicPath);
  revalidatePath(`/admin/${resource.key}`);
  redirect(`/admin/${resource.key}?saved=1`);
}

export async function deleteRecord(resourceKey: string, id: string) {
  const resource = getResource(resourceKey);
  if (!resource) return;

  const supabase = await requireAdmin();
  await supabase.from(resource.table).delete().eq("id", id);

  revalidateEverything(resource.publicPath);
  revalidatePath(`/admin/${resource.key}`);
  redirect(`/admin/${resource.key}?deleted=1`);
}

/** Publish/unpublish straight from the list, without opening the record. */
export async function togglePublished(
  resourceKey: string,
  id: string,
  next: boolean,
) {
  const resource = getResource(resourceKey);
  if (!resource) return;

  const supabase = await requireAdmin();
  await supabase.from(resource.table).update({ published: next }).eq("id", id);

  revalidateEverything(resource.publicPath);
  revalidatePath(`/admin/${resource.key}`);
}

export async function saveSettings(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();

  const rows = SETTINGS_FIELDS.map((field) => ({
    key: field.name,
    value: String(form.get(field.name) ?? "").trim(),
  }));

  const { error } = await supabase
    .from("settings")
    .upsert(rows, { onConflict: "key" });

  if (error) return { error: friendly(error.message) };

  revalidateEverything();
  revalidatePath("/admin/settings");
  return { ok: "Saved." };
}

export async function markEnquiryHandled(id: string, handled: boolean) {
  const supabase = await requireAdmin();
  await supabase.from("enquiries").update({ handled }).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiry(id: string) {
  const supabase = await requireAdmin();
  await supabase.from("enquiries").delete().eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}

/**
 * Sign in. Deliberately a server action: the password is posted to the
 * server and compared there, so it never reaches any client-side code and
 * the credentials never leave the environment.
 */
export async function signIn(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { verifyCredentials, createSession, isAuthConfigured } = await import(
    "@/lib/auth"
  );

  if (!isAuthConfigured()) {
    return { error: "Sign-in is not configured on the server." };
  }

  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  if (!verifyCredentials(email, password)) {
    // A fixed delay on failure: without it, an attacker can measure how long
    // a wrong answer takes and learn things from the difference.
    await new Promise((r) => setTimeout(r, 600));
    // Never say which half was wrong.
    return { error: "That email and password did not match." };
  }

  await createSession(email.trim().toLowerCase());
  redirect("/admin");
}

/** Postgres errors are precise but unfriendly; translate the common ones. */
function friendly(message: string) {
  if (/duplicate key/i.test(message)) {
    return "Something already uses that web address. Pick a different one.";
  }
  if (/row-level security/i.test(message)) {
    // Admin writes use the service-role key, which bypasses RLS entirely — so
    // seeing this means the key is missing or wrong, not that a user lacks a
    // permission. Check SUPABASE_SERVICE_ROLE_KEY.
    return "The server's database key is missing or wrong. Check SUPABASE_SERVICE_ROLE_KEY.";
  }
  if (/violates check constraint/i.test(message)) {
    return "One of the values is not allowed. Check the fields and try again.";
  }
  return message;
}

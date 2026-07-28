"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

export type EnquiryState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; message: string };

/**
 * Handles the "Enroll now" form.
 *
 * Deliberately NOT admin-guarded — the whole point is that a stranger can
 * submit one. The `enquiries` table's row level security allows public
 * INSERT but restricts SELECT to admins, so a submission cannot be used to
 * read anybody else's.
 */
export async function submitEnquiry(
  _prev: EnquiryState,
  form: FormData,
): Promise<EnquiryState> {
  const email = String(form.get("email") ?? "").trim();

  // A honeypot: a field hidden from people but not from naive bots. Anything
  // that fills it in gets a success response and is silently dropped.
  if (String(form.get("website") ?? "").length > 0) return { status: "ok" };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "That email address does not look right." };
  }
  if (email.length > 320) {
    return { status: "error", message: "That email address is too long." };
  }

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message: "The enrolment form is not connected yet. Please email us instead.",
    };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("enquiries").insert({
    email,
    note: String(form.get("note") ?? "").trim() || null,
  });

  if (error) {
    console.error("[enquiry]", error.message);
    return {
      status: "error",
      message: "Something went wrong saving that. Please email us instead.",
    };
  }

  revalidatePath("/admin/enquiries");
  return { status: "ok" };
}

"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { CONTACT_METHODS, LIMITS, TOPICS } from "@/lib/counselling-fields";

/**
 * The /counselling form.
 *
 * Open to anyone, like the registration form, and for the same reason. What
 * arrives here is more sensitive than anything else the site collects, so:
 *
 *  - nothing submitted is ever shown on a public page;
 *  - the row is insert-only for the public (see supabase/counselling.sql);
 *  - the message is never written to the server log, not even on error. The
 *    error is logged; the contents are not.
 */

export type CounsellingState =
  | { status: "idle" }
  | { status: "ok"; method: string }
  | { status: "error"; message: string };

export async function submitCounsellingRequest(
  _prev: CounsellingState,
  form: FormData,
): Promise<CounsellingState> {
  // Honeypot: hidden from people, not from naive bots.
  if (String(form.get("website") ?? "").length > 0) {
    return { status: "ok", method: "email" };
  }

  const name = String(form.get("name") ?? "").replace(/\s+/g, " ").trim();
  const contactMethod = String(form.get("contact_method") ?? "email").trim();
  const contactDetail = String(form.get("contact_detail") ?? "").trim();
  const topic = String(form.get("topic") ?? "").trim();
  const preferFemale = form.get("prefer_female") === "on";
  // Prose: not whitespace-collapsed, so paragraphs survive.
  const message = String(form.get("message") ?? "").trim();

  if (!name) {
    return { status: "error", message: "Please give a name we can address you by. A first name is enough." };
  }
  if (!CONTACT_METHODS.some((m) => m.value === contactMethod)) {
    return { status: "error", message: "Please choose how you would like us to reply." };
  }
  if (!contactDetail) {
    return { status: "error", message: "Please give us a way to reply to you." };
  }
  if (contactMethod === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetail)) {
    return { status: "error", message: "That email address does not look right." };
  }
  if (contactMethod === "whatsapp" && !/^[+()\d][\d\s()+-]{4,}$/.test(contactDetail)) {
    return { status: "error", message: "That phone number does not look right. Include your country code." };
  }
  if (topic && !(TOPICS as readonly string[]).includes(topic)) {
    return { status: "error", message: "Please choose one of the listed topics." };
  }
  if (!message) {
    return { status: "error", message: "Please tell us what you would like to talk about." };
  }

  const values: Record<string, string> = {
    name,
    contact_detail: contactDetail,
    topic,
    message,
  };
  for (const [field, max] of Object.entries(LIMITS)) {
    if ((values[field] ?? "").length > max) {
      return {
        status: "error",
        message: `That ${field.replace(/_/g, " ")} is too long. Please keep it under ${max} characters.`,
      };
    }
  }

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message:
        "This form is not connected yet, so it cannot send your message. Please email us instead.",
    };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("counselling_requests").insert({
    name,
    contact_method: contactMethod,
    contact_detail: contactDetail,
    topic: topic || null,
    prefer_female: preferFemale,
    message,
  });

  if (error) {
    // The error only. Never the message body, which is the whole point of the
    // page and is nobody's business but the person who wrote it.
    console.error("[counselling] insert failed:", error.code ?? error.message);
    // Verified against the live API: PostgREST answers a missing table with
    // PGRST205 "Could not find the table ... in the schema cache".
    const missing = /schema cache|could not find the table|does not exist/i.test(
      error.message,
    );
    return {
      status: "error",
      message: missing
        ? "This form has not been switched on yet. Please email us instead and we will reply the same way."
        : "Something went wrong sending that. Please email us instead so your message is not lost.",
    };
  }

  revalidatePath("/admin/counselling");
  return { status: "ok", method: contactMethod };
}

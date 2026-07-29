"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { LANGUAGES, LIMITS, STUDENT_TYPES } from "@/lib/registration-fields";

/**
 * The /register form.
 *
 * Deliberately NOT admin-guarded — a stranger submitting one is the entire
 * point. `registrations` allows public INSERT but restricts SELECT to the
 * server, so a submission can never be used to read anybody else's.
 *
 * Every limit below matches a CHECK constraint in supabase/registrations.sql.
 * Validating here gives a readable message; the constraint is what actually
 * guarantees it, since a request can reach PostgREST without passing through
 * this function at all.
 */

export type RegistrationState =
  | { status: "idle" }
  | { status: "ok"; name: string }
  | { status: "error"; message: string; field?: string };

function clean(form: FormData, name: string) {
  return String(form.get(name) ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function submitRegistration(
  _prev: RegistrationState,
  form: FormData,
): Promise<RegistrationState> {
  // A honeypot: hidden from people, not from naive bots. Anything that fills
  // it in gets a success response and is silently dropped.
  if (String(form.get("website") ?? "").length > 0) {
    return { status: "ok", name: "" };
  }

  const fullName = clean(form, "full_name");
  const email = clean(form, "email");
  const phone = clean(form, "phone");
  const location = clean(form, "location");
  const studentType = clean(form, "student_type") || "self";
  const studentName = clean(form, "student_name");
  const studentAge = clean(form, "student_age");
  const program = clean(form, "program");
  const language = clean(form, "language") || "English";
  const level = clean(form, "level");
  const availability = clean(form, "availability");
  // Not run through `clean` — a note is prose, and collapsing every run of
  // whitespace would destroy the paragraphs someone typed.
  const note = String(form.get("note") ?? "").trim();

  if (!fullName) {
    return { status: "error", message: "Please tell us your name.", field: "full_name" };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "That email address does not look right.",
      field: "email",
    };
  }
  if (!phone || !/^[+()\d][\d\s()+-]{4,}$/.test(phone)) {
    return {
      status: "error",
      message: "Please give a phone number we can reach you on.",
      field: "phone",
    };
  }
  if (!STUDENT_TYPES.some((t) => t.value === studentType)) {
    return { status: "error", message: "Please say who the classes are for." };
  }
  // If it is not for themselves, we need to know who it is for.
  if (studentType !== "self" && !studentName) {
    return {
      status: "error",
      message: "Please give the student's name.",
      field: "student_name",
    };
  }
  if (!(LANGUAGES as readonly string[]).includes(language)) {
    return { status: "error", message: "Please choose a language of instruction." };
  }

  const values: Record<string, string> = {
    full_name: fullName,
    email,
    phone,
    location,
    student_name: studentName,
    student_age: studentAge,
    program,
    level,
    availability,
    note,
  };
  for (const [field, max] of Object.entries(LIMITS)) {
    if ((values[field] ?? "").length > max) {
      return {
        status: "error",
        message: `That ${field.replace(/_/g, " ")} is too long. Please keep it under ${max} characters.`,
        field,
      };
    }
  }

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message:
        "Registrations are not connected yet, so this form cannot save your details. Please email us instead and we will register you by hand.",
    };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("registrations").insert({
    full_name: fullName,
    email,
    phone,
    location: location || null,
    student_type: studentType,
    // Only meaningful when the student is someone else.
    student_name: studentType === "self" ? null : studentName || null,
    student_age: studentAge || null,
    program: program || null,
    language,
    level: level || null,
    availability: availability || null,
    note: note || null,
  });

  if (error) {
    console.error("[registration]", error.message);
    // The table is created by a separate migration, so this is the one error
    // worth naming. Verified against the live API: PostgREST answers a missing
    // table with 404 PGRST205 "Could not find the table 'public.registrations'
    // in the schema cache" — NOT the Postgres wording "relation ... does not
    // exist", which is what an obvious guess would have matched.
    const missing =
      /schema cache|could not find the table|does not exist/i.test(
        error.message,
      );
    return {
      status: "error",
      message: missing
        ? "The registration table has not been created yet. Please email us and we will register you by hand."
        : "Something went wrong saving your registration. Please email us instead so we do not lose you.",
    };
  }

  revalidatePath("/admin/registrations");
  return { status: "ok", name: fullName.split(" ")[0] ?? "" };
}

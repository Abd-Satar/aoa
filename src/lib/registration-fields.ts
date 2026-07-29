/**
 * The fixed choices on the registration form.
 *
 * These live here rather than in `registrations.ts` because that file is a
 * `"use server"` module, and such a module may only export async functions —
 * exporting a constant from it is a build error. Both the form (client) and
 * the action (server) import from here, so the options a visitor can pick and
 * the values the server will accept can never drift apart.
 */

export const STUDENT_TYPES = [
  { value: "self", label: "Myself" },
  { value: "child", label: "My child" },
  { value: "other", label: "Someone else" },
] as const;

export const LANGUAGES = ["English", "Arabic", "Yoruba"] as const;

// No dashes in any of these: they are visible text on the form.
export const LEVELS = [
  "Complete beginner, cannot read Arabic letters yet",
  "Knows the letters, reads slowly",
  "Reads fluently, wants tajwīd",
  "Memorising already",
  "Not sure, please assess me",
] as const;

/**
 * Maximum length per field, mirroring the CHECK constraints in
 * supabase/registrations.sql. The database is what guarantees these; the
 * server action checks them first only to give a readable message.
 */
export const LIMITS: Record<string, number> = {
  full_name: 120,
  email: 320,
  phone: 40,
  location: 120,
  student_name: 120,
  student_age: 40,
  program: 160,
  level: 80,
  availability: 400,
  note: 2000,
};

export const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "enrolled", label: "Enrolled" },
  { value: "declined", label: "Declined" },
] as const;

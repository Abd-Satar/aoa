/**
 * The fixed choices on the counselling form.
 *
 * Separate from `counselling.ts` because that is a `"use server"` module and
 * such a module may only export async functions. Both the form and the action
 * import from here, so what a visitor can pick and what the server accepts
 * cannot drift apart.
 *
 * No dashes in any visible string.
 */

export const TOPICS = [
  "A question about Islam",
  "Qur'an, prayer or worship",
  "Doubt, or struggling with faith",
  "Family, marriage or parenting",
  "School, work or direction in life",
  "Grief or a difficult time",
  "Something else",
] as const;

export const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

export const STATUSES = [
  { value: "new", label: "New" },
  { value: "answered", label: "Answered" },
  { value: "closed", label: "Closed" },
] as const;

/** Mirrors the CHECK constraints in supabase/counselling.sql. */
export const LIMITS: Record<string, number> = {
  name: 120,
  contact_detail: 320,
  topic: 120,
  message: 4000,
};

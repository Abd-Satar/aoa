/**
 * Supabase connection details.
 *
 * The site is designed to run with or without a database. Until these two
 * variables are set the public pages fall back to the static content in
 * `lib/nur-content.ts` and `content/stories/`, and the admin shows a setup
 * screen instead of erroring. That keeps the site deployable from the first
 * commit and makes a misconfigured deploy fail visibly rather than blankly.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

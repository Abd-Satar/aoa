import "server-only";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * The write client for the admin.
 *
 * Uses the service-role key, which bypasses row level security entirely.
 * That is necessary now that sign-in is an environment password rather than
 * a Supabase Auth user: without a Supabase JWT there is no `auth.uid()` for
 * the `is_admin()` policies to check, so the anon key is refused on every
 * write.
 *
 * The safety of this rests on two things:
 *
 *  1. SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix and this module
 *     is `server-only`, so the key is never sent to a browser. If it ever
 *     were, anyone could read and rewrite the whole database.
 *
 *  2. Every caller checks `getAdminSession()` first. This client performs no
 *     authorisation of its own — it is the thing being protected, not the
 *     protection.
 *
 * Public reads still go through the anon key in lib/content.ts, where RLS
 * continues to apply, so a bug here cannot expose unpublished content to
 * visitors.
 */

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isServiceRoleConfigured =
  isSupabaseConfigured && SERVICE_ROLE_KEY.length > 0;

export function getSupabaseAdminClient() {
  if (!isServiceRoleConfigured) return null;
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

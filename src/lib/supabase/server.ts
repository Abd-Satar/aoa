import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 *
 * Returns null when the project is not configured, so every caller has to
 * decide what to do without a database rather than throwing at import time.
 */
export async function getSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Session refresh is handled in proxy.ts instead, so this is safe
          // to swallow.
        }
      },
    },
  });
}

/**
 * The signed-in admin, or null.
 *
 * Two checks, both required: a valid session, and a row in `admins`. Being
 * able to authenticate is not the same as being allowed to edit — this is
 * the check that enforces the difference, and it runs on the server on every
 * admin page load and every mutation.
 *
 * Uses `getUser()` rather than `getSession()` deliberately: getUser
 * revalidates the token with Supabase, whereas getSession trusts whatever is
 * in the cookie.
 */
export async function getAdminUser() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) return null;

  return { id: user.id, email: user.email ?? "" };
}

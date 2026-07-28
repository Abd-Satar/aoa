import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Runs before every /admin request.
 *
 * Two jobs:
 *  1. Refresh the Supabase auth cookie. Server Components cannot write
 *     cookies, so without this the session would silently expire.
 *  2. Bounce signed-out visitors to the login page.
 *
 * The redirect is an *optimistic* check only — the Next.js docs are explicit
 * that proxy must not be relied on for authorisation. The real check is
 * `getAdminUser()` running server-side in the admin layout and again inside
 * every server action, and Postgres row level security behind that. This
 * exists so a signed-out visitor gets a login page instead of a flash of
 * empty admin furniture.
 *
 * (In Next.js 16 this file is `proxy.ts`; it was called `middleware.ts` in
 * earlier versions.)
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  // Not configured: let the request through so /admin can render its own
  // setup instructions rather than redirect-looping.
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");

  if (!user && !isLogin) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/admin/login";
    // Send them back where they were headed once signed in.
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }

  if (user && isLogin) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/admin";
    redirect.search = "";
    return NextResponse.redirect(redirect);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

import { NextResponse, type NextRequest } from "next/server";
import { readSessionValue, SESSION_COOKIE } from "@/lib/auth";

/**
 * Bounces signed-out visitors away from /admin.
 *
 * This is an *optimistic* check only — the Next.js docs are explicit that
 * proxy must not be relied on for authorisation. The real check is
 * `getAdminSession()` running server-side in the admin layout, in every
 * page, and again inside every server action. This exists so a signed-out
 * visitor gets the login page instead of a flash of empty admin furniture.
 *
 * It can verify the cookie itself because the signature is an HMAC over the
 * payload: no database call, no Supabase round trip, just the secret.
 *
 * (In Next.js 16 this file is `proxy.ts`; it was `middleware.ts` before.)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");

  const session = readSessionValue(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (!session && !isLogin) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/admin/login";
    return NextResponse.redirect(redirect);
  }

  if (session && isLogin) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/admin";
    redirect.search = "";
    return NextResponse.redirect(redirect);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

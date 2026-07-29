import "server-only";

import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin authentication, from environment variables.
 *
 * There is one administrator, so the credentials live in the environment
 * rather than in a users table. The session is a cookie carrying a payload
 * and an HMAC of that payload, so it cannot be forged without ADMIN_SECRET.
 *
 * SECURITY NOTES, all deliberate:
 *
 *  - None of these variables is prefixed NEXT_PUBLIC_. Anything with that
 *    prefix is inlined into the browser bundle; a password there would be
 *    readable by every visitor. `import "server-only"` makes importing this
 *    module from a Client Component a build error rather than a leak.
 *
 *  - The password is compared in constant time. A plain `===` on strings
 *    returns as soon as two characters differ, which leaks the length of the
 *    matching prefix to anyone who can measure it.
 *
 *  - The cookie is httpOnly (JavaScript cannot read it), sameSite=lax (it is
 *    not sent on cross-site POSTs, which blunts CSRF), and secure in
 *    production.
 *
 *  - Everything fails closed. A missing or short ADMIN_SECRET means nobody
 *    can sign in, rather than everybody being able to.
 */

const COOKIE = "aoa_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";

/** Are the three variables present and usable? */
export function isAuthConfigured() {
  return (
    ADMIN_EMAIL.length > 0 &&
    ADMIN_PASSWORD.length > 0 &&
    // Short secrets are trivially brute-forced; refuse them outright.
    ADMIN_SECRET.length >= 32
  );
}

/** Why sign-in is impossible, for the setup screen. Null when it is fine. */
export function authConfigProblem(): string | null {
  if (!ADMIN_EMAIL) return "ADMIN_EMAIL is not set.";
  if (!ADMIN_PASSWORD) return "ADMIN_PASSWORD is not set.";
  if (!ADMIN_SECRET) return "ADMIN_SECRET is not set.";
  if (ADMIN_SECRET.length < 32) {
    return "ADMIN_SECRET must be at least 32 characters.";
  }
  return null;
}

function sign(payload: string) {
  return createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
}

/** Constant-time string comparison that does not leak length either. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(sign(a));
  const bb = Buffer.from(sign(b));
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function verifyCredentials(email: string, password: string) {
  if (!isAuthConfigured()) return false;
  // Both compared, and both in constant time, so neither a wrong address nor
  // a wrong password can be told apart by timing.
  const okEmail = safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL.trim().toLowerCase());
  const okPassword = safeEqual(password, ADMIN_PASSWORD);
  return okEmail && okPassword;
}

type SessionPayload = { sub: string; exp: number; jti: string };

export async function createSession(email: string) {
  const payload: SessionPayload = {
    sub: email,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
    jti: randomUUID(),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const value = `${encoded}.${sign(encoded)}`;

  const jar = await cookies();
  jar.set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Verify a raw cookie value. Shared with proxy.ts, which has no `cookies()`. */
export function readSessionValue(value: string | undefined) {
  if (!value || !isAuthConfigured()) return null;

  const dot = value.lastIndexOf(".");
  if (dot < 1) return null;

  const encoded = value.slice(0, dot);
  const signature = value.slice(dot + 1);

  const expected = Buffer.from(sign(encoded));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!payload?.exp || payload.exp < Date.now()) return null;
    return { email: payload.sub };
  } catch {
    return null;
  }
}

/** The signed-in admin, or null. The single gate for every admin screen. */
export async function getAdminSession() {
  const jar = await cookies();
  return readSessionValue(jar.get(COOKIE)?.value);
}

export const SESSION_COOKIE = COOKIE;

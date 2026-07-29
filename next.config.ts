import type { NextConfig } from "next";

/**
 * Response headers applied to every route.
 *
 * These are the ones that are safe to set without knowing anything about the
 * page. A full Content-Security-Policy is deliberately NOT here: the theme
 * script in app/layout.tsx runs inline (it has to, to set the theme before
 * first paint and avoid a flash), so a useful CSP needs a per-request nonce.
 * A wrong CSP breaks the site silently, so it is better left off than guessed.
 */
const securityHeaders = [
  // Nobody should be able to frame this site — that is how clickjacking
  // works: your page loaded invisibly over someone else's buttons.
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers second-guessing a Content-Type and, say, running an
  // uploaded image as a script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Full URL to ourselves, origin only to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for none of these, so deny them outright.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Once a browser has seen this it refuses plain HTTP for this domain for
  // two years. Meaningful only over HTTPS, which is why it is inert locally.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

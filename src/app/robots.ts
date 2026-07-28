import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/nur-content";

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin is behind auth, but there is no reason for it to be crawled or
    // to surface in search results at all.
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}

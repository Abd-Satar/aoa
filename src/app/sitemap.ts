import type { MetadataRoute } from "next";
import { routes, siteUrl } from "@/lib/nur-content";
import { getStories } from "@/lib/stories";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const fixed = routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));

  // Story pages are generated from content/stories/, so the sitemap grows on
  // its own as files are added — nothing to remember to update here.
  const stories = getStories().map((story) => ({
    url: new URL(`/stories/${story.slug}`, siteUrl).toString(),
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...fixed, ...stories];
}

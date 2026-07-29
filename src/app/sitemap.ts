import type { MetadataRoute } from "next";
import { routes, siteUrl } from "@/lib/nur-content";
import { getLibraryStories } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const fixed = routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));

  // The same source the /stories pages read, so a story written in the admin
  // is listed here too. Reading the files directly — as this used to — meant
  // anything added through the admin was invisible to search engines.
  const stories = (await getLibraryStories()).map((story) => ({
    url: new URL(`/stories/${story.slug}`, siteUrl).toString(),
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...fixed, ...stories];
}

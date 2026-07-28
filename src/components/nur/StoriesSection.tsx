import { Stories } from "./Stories";
import { getTestimonials } from "@/lib/content";

/**
 * Server wrapper for the testimonial carousel. The carousel itself holds
 * client state, so the fetch has to happen out here.
 */
export async function StoriesSection() {
  const stories = await getTestimonials();
  if (stories.length === 0) return null;
  return <Stories stories={stories} />;
}

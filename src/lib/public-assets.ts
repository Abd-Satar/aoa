import fs from "node:fs";
import path from "node:path";

/**
 * Does this path exist in /public?
 *
 * Server-only: it touches the filesystem, so import it from Server
 * Components exactly. (`ImageSlot` cannot do this check itself — it is
 * pulled into the client bundle by the hero carousel, where `node:fs` does
 * not exist.)
 *
 * The point is that a photograph can be named in the content before the file
 * is added. A missing local `src` makes `next/image` request the optimizer
 * for a file that is not there, which renders a broken frame; this lets the
 * caller fall back to the labelled placeholder instead, so the site is never
 * worse off for having the path set in advance.
 */
export function publicAssetExists(assetPath: string | undefined): boolean {
  if (!assetPath) return false;
  // Remote images are somebody else's problem; assume they resolve.
  if (/^https?:\/\//.test(assetPath)) return true;
  if (!assetPath.startsWith("/")) return false;

  try {
    return fs.existsSync(path.join(process.cwd(), "public", assetPath));
  } catch {
    return false;
  }
}

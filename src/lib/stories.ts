import fs from "node:fs";
import path from "node:path";
import { parseStoryBody, type StoryBlock } from "./story-format";

export type { StoryBlock };

/**
 * The story library.
 *
 * Stories live as Markdown files in `content/stories/`. Adding one means
 * dropping a `.md` file in that folder — no code, no imports, no rebuild
 * config. This module reads and parses them at build time.
 *
 * It is deliberately a tiny hand-written parser rather than a Markdown
 * library. The format only needs headings, paragraphs and quotes, and doing
 * it this way means (a) no new dependencies, and (b) no
 * `dangerouslySetInnerHTML` — blocks are rendered as real React elements, so
 * a stray angle bracket in a story can never become markup.
 *
 * Files whose name starts with `_` are ignored, which is how
 * `_TEMPLATE.md` stays out of the library.
 */

const STORIES_DIR = path.join(process.cwd(), "content", "stories");

export const AUDIENCES = ["children", "adults", "everyone"] as const;
export type Audience = (typeof AUDIENCES)[number];

export type Story = {
  slug: string;
  title: string;
  audience: Audience;
  summary: string;
  /** Where the account is taken from, e.g. "Sūrat Yūsuf". Optional. */
  source?: string;
  /** Lower numbers sort first; unset sorts last, then alphabetically. */
  order: number;
  /** true keeps it out of the built site. */
  draft: boolean;
  readingMinutes: number;
  blocks: StoryBlock[];
};

function parseFrontmatter(raw: string): [Record<string, string>, string] {
  const normalised = raw.replace(/\r\n/g, "\n");
  if (!normalised.startsWith("---\n")) return [{}, normalised];

  const end = normalised.indexOf("\n---", 3);
  if (end === -1) return [{}, normalised];

  const head = normalised.slice(4, end);
  const body = normalised.slice(end + 4).replace(/^\n/, "");

  const data: Record<string, string> = {};
  for (const line of head.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const key = trimmed.slice(0, colon).trim();
    let value = trimmed.slice(colon + 1).trim();
    // Strip one layer of matching quotes if the author added them.
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1)
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return [data, body];
}

function toAudience(value: string | undefined): Audience {
  const v = (value || "").toLowerCase().trim();
  if (v === "children" || v === "kids" || v === "child") return "children";
  if (v === "adults" || v === "adult") return "adults";
  return "everyone";
}

function readAll(): Story[] {
  if (!fs.existsSync(STORIES_DIR)) return [];

  const files = fs
    .readdirSync(STORIES_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  const stories = files.map((file) => {
    const raw = fs.readFileSync(path.join(STORIES_DIR, file), "utf8");
    const [data, body] = parseFrontmatter(raw);
    const blocks = parseStoryBody(body);

    const words = blocks.reduce(
      (n, b) => n + b.text.split(/\s+/).filter(Boolean).length,
      0,
    );

    const slug = data.slug || file.replace(/\.md$/, "");

    return {
      slug,
      title: data.title || slug,
      audience: toAudience(data.audience),
      summary: data.summary || "",
      source: data.source || undefined,
      order: Number.isFinite(Number(data.order))
        ? Number(data.order)
        : Number.MAX_SAFE_INTEGER,
      draft: /^(true|yes)$/i.test(data.draft || ""),
      readingMinutes: Math.max(1, Math.round(words / 200)),
      blocks,
    } satisfies Story;
  });

  return stories
    .filter((s) => !s.draft)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getStories(): Story[] {
  return readAll();
}

export function getStory(slug: string): Story | undefined {
  return readAll().find((s) => s.slug === slug);
}

export const AUDIENCE_LABEL: Record<Audience, string> = {
  children: "For children",
  adults: "For adults",
  everyone: "For everyone",
};

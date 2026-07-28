/**
 * The story body format, shared by both sources.
 *
 * A story can come from a Markdown file in `content/stories/` or from the
 * `stories` table once Supabase is connected. Both store the body as the same
 * plain text, so the parser lives here — free of `node:fs` — and neither
 * source can drift from the other.
 *
 * Deliberately tiny rather than a Markdown library: the format only needs
 * headings, paragraphs and quotes, and parsing to React elements rather than
 * HTML means a stray angle bracket in a story can never become markup.
 */

export type StoryBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; text: string; cite?: string };

export function parseStoryBody(body: string): StoryBlock[] {
  const blocks: StoryBlock[] = [];

  // Paragraphs are separated by a blank line, exactly as in Markdown.
  for (const chunk of body.replace(/\r\n/g, "\n").split(/\n{2,}/)) {
    const lines = chunk
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) continue;

    if (lines[0].startsWith("## ")) {
      blocks.push({ kind: "heading", text: lines[0].slice(3).trim() });
      const rest = lines.slice(1).join(" ").trim();
      if (rest) blocks.push({ kind: "paragraph", text: rest });
      continue;
    }

    if (lines[0].startsWith(">")) {
      const quoteLines = lines
        .filter((l) => l.startsWith(">"))
        .map((l) => l.replace(/^>\s?/, "").trim());
      // A final line opening with an em dash is read as the attribution.
      let cite: string | undefined;
      if (quoteLines.length > 1 && /^—/.test(quoteLines[quoteLines.length - 1])) {
        cite = quoteLines.pop()!.replace(/^—\s*/, "");
      }
      blocks.push({ kind: "quote", text: quoteLines.join(" "), cite });
      continue;
    }

    blocks.push({ kind: "paragraph", text: lines.join(" ") });
  }

  return blocks;
}

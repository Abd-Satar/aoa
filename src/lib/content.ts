import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import * as fallback from "@/lib/nur-content";
import { getStories as getFileStories, type Story } from "@/lib/stories";
import { parseStoryBody } from "@/lib/story-format";

/**
 * What the public site reads.
 *
 * Every function here answers from Supabase when it is connected, and from
 * the checked-in files when it is not. That is what lets the repository be
 * cloned and run — and deployed — before anyone has created a database, and
 * it means a database outage degrades to the last known content rather than
 * an error page.
 *
 * Read failures are treated the same as "not configured": log and fall back.
 * A missing table should not take the marketing site down.
 */

/**
 * A cookie-free client for public reads.
 *
 * Deliberately NOT the cookie-bound server client: touching cookies opts a
 * route into dynamic rendering, which would make every marketing page
 * server-render on each request. Published content is the same for everyone,
 * so it is read anonymously, the pages stay static, and `revalidatePath` in
 * the admin actions is what refreshes them after an edit.
 */
function publicClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function query<T>(
  table: string,
  select = "*",
): Promise<T[] | null> {
  const supabase = publicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(table)
    .select(select)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.warn(`[content] ${table}: ${error.message} — using file content`);
    return null;
  }
  return (data ?? []) as T[];
}

export async function getPrograms(): Promise<typeof fallback.programs> {
  const rows = await query<Record<string, unknown>>("programs");
  if (!rows) return fallback.programs;
  return rows.map((r) => ({
    kicker: String(r.kicker ?? ""),
    title: String(r.title),
    body: String(r.body ?? ""),
    meta: String(r.meta ?? ""),
  }));
}

export async function getFaqs(): Promise<typeof fallback.faqs> {
  const rows = await query<Record<string, unknown>>("faqs");
  if (!rows) return fallback.faqs;
  return rows.map((r) => ({
    q: String(r.question),
    a: String(r.answer ?? ""),
  }));
}

export async function getTestimonials(): Promise<fallback.Story[]> {
  const rows = await query<Record<string, unknown>>("testimonials");
  if (!rows) return fallback.stories;
  return rows.map((r) => ({
    quote: String(r.quote),
    source: String(r.source ?? ""),
  }));
}

export async function getLibraryStories(): Promise<Story[]> {
  const rows = await query<Record<string, unknown>>("stories");
  if (!rows) return getFileStories();

  return rows.map((r) => {
    const blocks = parseStoryBody(String(r.content ?? ""));
    const words = blocks.reduce(
      (n, b) => n + b.text.split(/\s+/).filter(Boolean).length,
      0,
    );
    return {
      slug: String(r.slug),
      title: String(r.title),
      audience: (r.audience as Story["audience"]) ?? "everyone",
      summary: String(r.summary ?? ""),
      source: (r.source as string) || undefined,
      order: Number(r.sort_order ?? 0),
      draft: false,
      readingMinutes: Math.max(1, Math.round(words / 200)),
      blocks,
    };
  });
}

export async function getLibraryStory(slug: string): Promise<Story | undefined> {
  return (await getLibraryStories()).find((s) => s.slug === slug);
}

export type SiteSettings = {
  contact: { email: string; phone: string; phoneHref: string };
  youtube: { url: string; text: string; label: string };
  instagram: { url: string };
  ayah: { arabic: string; text: string; source: string };
};

export async function getSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = {
    contact: {
      email: fallback.contact.email,
      phone: fallback.contact.phone,
      phoneHref: fallback.contact.phoneHref,
    },
    youtube: {
      url: fallback.youtube.url,
      text: fallback.youtube.text,
      label: fallback.youtube.label,
    },
    instagram: { url: fallback.instagram.url },
    ayah: {
      arabic: fallback.ayah.arabic,
      text: fallback.ayah.text,
      source: fallback.ayah.source,
    },
  };

  const supabase = publicClient();
  if (!supabase) return defaults;

  const { data, error } = await supabase.from("settings").select("key, value");
  if (error || !data) return defaults;

  const v = Object.fromEntries(data.map((r) => [r.key, r.value])) as Record<
    string,
    string
  >;
  const pick = (key: string, or: string) => (v[key]?.trim() ? v[key] : or);

  return {
    contact: {
      email: pick("contact_email", defaults.contact.email),
      phone: pick("contact_phone", defaults.contact.phone),
      phoneHref: pick("contact_phone_href", defaults.contact.phoneHref),
    },
    youtube: {
      url: pick("youtube_url", defaults.youtube.url),
      text: pick("youtube_text", defaults.youtube.text),
      label: pick("youtube_label", defaults.youtube.label),
    },
    instagram: { url: pick("instagram_url", defaults.instagram.url) },
    ayah: {
      arabic: pick("ayah_arabic", defaults.ayah.arabic),
      text: pick("ayah_text", defaults.ayah.text),
      source: pick("ayah_source", defaults.ayah.source),
    },
  };
}

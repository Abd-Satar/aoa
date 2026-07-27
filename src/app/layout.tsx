import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";

import { SiteNav } from "@/components/nur/SiteNav";
import { SiteFooter } from "@/components/nur/SiteFooter";
import { PrintPlates } from "@/components/nur/PrintPlates";
import { ScrollEffects } from "@/components/nur/ScrollEffects";
import { siteUrl } from "@/lib/nur-content";

// One sans for headings and body. `latin-ext` is not optional here — the
// copy is full of transliteration diacritics (ḥ ṣ ā ī ū ʿ ẓ) that the
// base latin subset does not cover.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

// For the āyah, which is set right-to-left at display size.
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  // Without this, the OpenGraph and Twitter image URLs stay relative and
  // social scrapers cannot resolve them.
  metadataBase: new URL(siteUrl),
  title:
    "A.O.A — As-Sattar Online Academy | Learn the Qur'an in its own language",
  description:
    "Live classes in recitation, classical Arabic, Yoruba and Islamic studies — for adults and for children. Taught in English, Arabic and Yoruba, one-to-one or in circles of five, by teachers who hold a licence to teach it.",
  keywords: [
    "quran classes online",
    "as-sattar online academy",
    "tajweed",
    "hifz",
    "quranic arabic",
    "classical arabic",
    "yoruba classes online",
    "quran classes in yoruba",
    "islamic studies",
    "ijazah",
    "quran for kids",
  ],
  openGraph: {
    title: "A.O.A — As-Sattar Online Academy | Learn the Qur'an in its own language",
    description:
      "Live classes in recitation, classical Arabic and Islamic studies, taught by teachers who hold an ijāzah. First lesson free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Next 16 no longer overrides `scroll-behavior` during navigation
      // unless asked; the design sets `smooth` globally for its anchor nav.
      data-scroll-behavior="smooth"
      // The theme script below writes data-theme onto this element before
      // React hydrates, so the server and client markup differ by design.
      suppressHydrationWarning
      className={`${inter.variable} ${amiri.variable} antialiased`}
    >
      <head>
        {/* Runs before first paint: a stored choice wins, otherwise the OS
            preference. Without this the page paints light and then flips. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`,
          }}
        />
      </head>
      <body>
        {/* The shell is here rather than in each page: four routes were
            repeating it, and keeping the nav mounted across a client-side
            navigation stops it re-rendering (and re-measuring) on every
            route change. No overflow-x on this wrapper — it would become a
            scroll container and take the sticky masthead with it. */}
        <div id="top">
          <SiteNav />
          {children}
          <SiteFooter />
          {/* Filter defs sit outside every section, so no one section's
              removal can strand the references. */}
          <PrintPlates />
          <ScrollEffects />
        </div>
      </body>
    </html>
  );
}

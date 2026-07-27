# A.O.A — As-Sattar Online Academy

Marketing site for A.O.A, an online academy teaching Qur'an recitation,
Arabic, Yoruba and Islamic studies. Live classes in English, Arabic and
Yoruba.

Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS v4** and
TypeScript. Statically prerendered — no server or database.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npx eslint src   # lint
```

## Routes

| Route | Source |
| --- | --- |
| `/` | `src/app/page.tsx` |
| `/programs` | `src/app/programs/page.tsx` |
| `/teachers` | `src/app/teachers/page.tsx` |
| `/method` | `src/app/method/page.tsx` |
| `/stories` | `src/app/stories/page.tsx` |
| `/faq` | `src/app/faq/page.tsx` |

The masthead, footer, print filters and scroll effects live in
`src/app/layout.tsx`, so a page is only its `<main>`.

## Content

**Almost all copy lives in one file: `src/lib/nur-content.ts`.** Programs,
teachers, FAQs, stories, the ledger figures and contact details are typed
data — edit there, not in the components.

Two rules the content follows:

1. **No unverifiable claims.** Every figure on the site is checkable against
   something else on it (the programs list, a teacher profile) or is a stated
   policy. There are deliberately no student counts, review scores or country
   totals.
2. **No invented testimonials.** `stories` is empty. It previously held three
   quotes attributed to named people that came from a design mockup; those
   were fabricated and were removed. Add real, permissioned quotes and the
   stories page and the home carousel render themselves again.

### Adding a teacher

Append to `teachers` in `nur-content.ts`. The teachers page, the home teaser
and the "Teachers listed here" count all follow automatically.

### Adding photographs

Drop the file in `public/` and set `image` on the relevant entry:

```ts
{ id: "teacher-…", image: "/teachers/name.jpg", … }
```

It then renders through `next/image` and the print separation engages. Until
`image` is set, a labelled placeholder is shown instead.

## Design system

Ported from a Claude Design "Broadsheet" project and retuned to the academy
palette: `#F1F4FB #D5DEEE #B2CAF0 #8BAFE1 #628ECD #3B5987`.

Tokens, the light and dark themes and the component classes are all in
`src/app/globals.css`. Dark mode is switched by a `data-theme` attribute on
`<html>`, set before first paint by an inline script in the layout so there
is no flash; it follows the OS preference until the visitor uses the toggle.

The `.cmyk .print` treatment runs photographs through a four-plate CMYK
separation filter (`src/components/nur/PrintPlates.tsx`) that gathers into
register on hover. It only engages on real photographs, not placeholders.

## Before this goes live

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain (metadata, sitemap, OG).
- [ ] Confirm `contact.email` — the current address is derived from the name,
      not verified.
- [ ] Real Instagram and YouTube links (both are placeholders).
- [ ] Photographs — six slots are still placeholders.
- [ ] Wire up the enrolment form; it currently opens a `mailto:`.
- [ ] Privacy, Terms and Refunds pages — footer links point at `/#enroll`.
- [ ] Verify programme durations and scheduling policies; they came from the
      original design mockup, not from the academy.
- [ ] Pricing — the site currently states none.

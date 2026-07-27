/**
 * Page content for the A.O.A (As-Sattar Online Academy) landing.
 *
 * The design exposed most of this through its editor props panel; here it
 * is plain typed data so a section component stays layout and nothing else.
 */

export type HeroSlide = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  placeholder: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "nur-hero-1",
    kicker: "The circle, online",
    title: "Five students, one teacher, every session",
    body: "The ḥalaqah moved onto a screen and lost nothing. Live audio, live correction, and a teacher who knows your name and where you stopped last week.",
    placeholder: "Drop a photo: a student's circle on a video call",
  },
  {
    id: "nur-hero-2",
    kicker: "Licensed to teach",
    title: "Every recitation teacher holds an ijāzah",
    body: "An unbroken chain of transmission back to the Prophet ﷺ — verified, documented, and printed on the certificate you receive at the end of your track.",
    placeholder: "Drop a photo: a teacher with a muṣḥaf",
  },
  {
    id: "nur-hero-3",
    kicker: "For the children",
    title: "Twenty-five minutes, twice a week, finished",
    body: "Short sessions built around a child's attention, not an adult's calendar — with a weekly note home so parents can see exactly what was read.",
    placeholder: "Drop a photo: a child reading at a desk",
  },
];

// Everything below states a policy or a fact the roster can back. No student
// counts, review scores or country totals — those cannot be checked against
// anything on the site, and two named teachers cannot support them.
export const marqueeFacts = [
  "Enrolling now",
  "Classes in English, Arabic & Yoruba",
  "Taught live, never recorded",
  "Adults & children",
];

export const ledger: { label: string; value: string; accent?: boolean }[] = [
  { label: "Teachers listed by name", value: "2" },
  { label: "Students per circle, at most", value: "5" },
  { label: "Languages of instruction", value: "3" },
  { label: "Trial lesson, price of", value: "0", accent: true },
];

export const principles = [
  {
    icon: "link" as const,
    title: "Taught by chain, not by video",
    body: "Recitation cannot be learned from a recording — it is heard, imitated and corrected. Every session is live, and every correction comes from a teacher whose own licence is documented back through named students to the Prophet ﷺ.",
  },
  {
    icon: "users" as const,
    title: "Five students, never fifty",
    body: "Circles cap at five, and one-to-one is the default for ḥifẓ. You read aloud in every session — not once a month when the queue reaches you. Your teacher stays yours for the whole track.",
  },
  {
    icon: "calendar" as const,
    title: "The week you actually have",
    body: "Slots from five in the morning to midnight, across every timezone we teach in. Reschedule up to four hours before without losing the lesson, because the week does not always cooperate.",
  },
];

export const programs = [
  {
    kicker: "Recitation",
    title: "Tajwīd, from the letters up",
    body: "Makhārij, ṣifāt and the rules of stopping — until the page reads correctly without you thinking about it.",
    meta: "Beginner → advanced · 9 months · adults & children",
  },
  {
    kicker: "Memorisation",
    title: "Ḥifẓ, one-to-one",
    body: "A daily portion, a daily review and a teacher who hears both. Paced to your life, from one juzʾ to the whole muṣḥaf.",
    meta: "Requires fluent recitation · open-ended",
  },
  {
    kicker: "Language",
    title: "Qur'anic Arabic",
    body: "The eighty per cent of the text that eighty per cent of the vocabulary carries. Read a page and understand it by month four.",
    meta: "No Arabic needed · 6 months · adults",
  },
  {
    kicker: "Language",
    title: "Classical Arabic, full grammar",
    body: "Naḥw and ṣarf on the classical texts — Ājurrūmiyyah through to reading tafsīr unaided. The long road, properly walked.",
    meta: "Intermediate → advanced · 2 years",
  },
  {
    kicker: "Islamic studies",
    title: "ʿAqīdah, Fiqh & Sīrah",
    body: "Foundations taught from primary texts, with the differences of the schools presented fairly rather than quietly.",
    meta: "All levels · 12 months · adults",
  },
  {
    kicker: "Language",
    title: "Yoruba, spoken and written",
    body: "The written standard — tone marks, orthography and the vocabulary of the dīn — so the language of home can carry the lesson too.",
    meta: "All levels · 8 months · adults & children",
  },
  {
    kicker: "Children",
    title: "Kids' Foundations, ages 6–12",
    body: "Nūrānī Qāʿidah, short sūrahs and the daily duʿāʾs — twenty-five minutes at a time, with a note home each week.",
    meta: "Twice weekly · ongoing · parent report",
  },
];

export const ayah = {
  arabic: "وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
  text: "“And We have certainly made the Qur'an easy to remember. So is there any who will remember?”",
  source: "— Sūrat al-Qamar, 54:17",
};

export const youtube = {
  text: "Every Friday our teachers publish a short tafsīr of one page — free, no enrolment needed.",
  label: "Watch the weekly series",
  // TODO: confirm the real channel handle.
  url: "https://youtube.com/@aoacademy",
};

export type Stat = {
  to: number;
  suffix: string;
  dec?: number;
  label: string;
};

// Each of these is verifiable from the programs list, the teacher profiles
// or a stated policy — nothing here is a performance claim.
export const stats: Stat[] = [
  {
    to: 28,
    suffix: "",
    label: "links in the chain behind our recitation licence",
  },
  { to: 7, suffix: "", label: "tracks, each with a fixed syllabus and an end" },
  {
    to: 5,
    suffix: "",
    label: "students at most in a circle — one-to-one for ḥifẓ",
  },
  {
    to: 3,
    suffix: "",
    label: "languages of instruction: English, Arabic and Yoruba",
  },
];

export type Teacher = {
  id: string;
  /** Slug for the anchor on /teachers. */
  slug: string;
  name: string;
  /** Standing at the academy, e.g. "Founder & Proprietor". Optional. */
  title?: string;
  /** What they teach. */
  role: string;
  /** Pull-out facts, rendered as a rule-separated list on the profile. */
  credentials: string[];
  /** One paragraph per entry. */
  body: string[];
  placeholder: string;
  /** Drop a real photo path here and it renders through next/image. */
  image?: string;
};

// Real staff. Names and biographies are as supplied by the academy — do not
// re-transliterate or embellish them.
export const teachers: Teacher[] = [
  {
    id: "teacher-abdsattar",
    slug: "abdsattar-abdul-moyosore",
    name: "Ustaz AbdSattar Abdul Moyosore",
    title: "Founder & Proprietor",
    role: "Head of recitation",
    credentials: [
      "Ijāzah in Ḥafṣ ʿan ʿĀṣim",
      "28-link chain of transmission",
      "Student of Al-Azhar University",
      "11 years teaching",
    ],
    body: [
      "Ijāzah in Ḥafṣ ʿan ʿĀṣim with a 28-link chain; student of Al-Azhar University. 11 years teaching, mostly to adults who thought they had missed their chance.",
    ],
    placeholder: "Portrait — Ustaz AbdSattar Abdul Moyosore",
  },
  {
    id: "teacher-tijani",
    slug: "tijani-adeyemi",
    name: "Ustādh Tijani Adeyemi",
    role: "Arabic language",
    credentials: [
      "Student of Al-Azhar University",
      "Author of the Qur'anic Arabic syllabus",
    ],
    body: [
      "A student of Al-Azhar University. Wrote the academy's Qur'anic Arabic syllabus and teaches some of our students with compassion and care. Known for refusing to let a grammar term pass undefined.",
    ],
    placeholder: "Portrait — Ustādh Tijani Adeyemi",
  },
];

// ---------------------------------------------------------------------------
// Our method
//
// Nothing below introduces a new promise. Every line restates something the
// site already commits to elsewhere — the programs list, the principles, the
// FAQ or the enrolment copy — so the method page cannot drift out of step
// with the rest of the site.
// ---------------------------------------------------------------------------

export const methodSteps = [
  {
    title: "A free assessment, before anything is agreed",
    body: "Thirty minutes with a teacher. They listen to you read, or start you at the alphabet if that is where you are. No card, no obligation, and no pressure at the end of it.",
  },
  {
    title: "Placed where you actually are",
    body: "The assessment decides your starting point — not a form, and not the level the syllabus would prefer you were at. Roughly half of the people who begin with us start at the letters, adults included.",
  },
  {
    title: "A named teacher, for the whole track",
    body: "You are told who is teaching you before you enrol, and they do not rotate. Your teacher is the same person in month nine as in week one, and they remember where you stopped.",
  },
  {
    title: "Live sessions, one-to-one or in fives",
    body: "Circles cap at five and ḥifẓ is one-to-one by default, so you read aloud in every session rather than once a month when the queue reaches you. Nothing is a recording.",
  },
  {
    title: "A written record, every session",
    body: "What was read, what was corrected, and what comes next — written down after each class. For children a note goes home each week, so progress is a fact you can read rather than a feeling.",
  },
  {
    title: "An end, and a certificate",
    body: "Each track has a fixed syllabus and a finish. You are working toward a certificate, not a subscription that renews until you stop noticing it.",
  },
];

export const methodRefusals = [
  {
    title: "We don't teach recitation from video",
    body: "Recitation is heard, imitated and corrected. A recording can do the first of those three. Every session is live for that reason alone.",
  },
  {
    title: "We don't rotate teachers",
    body: "A teacher who does not know where you stopped last week cannot teach you efficiently, however well qualified they are.",
  },
  {
    title: "We don't run rooms of fifty",
    body: "A circle where you never read aloud is a lecture. Five is the cap, and it is a cap rather than an average.",
  },
  {
    title: "We don't sell an open-ended subscription",
    body: "A track that cannot end is a track you cannot finish. Every syllabus here has a last page.",
  },
];

export const methodSchedule = [
  "Slots from five in the morning to midnight, across every timezone we teach in.",
  "Reschedule up to four hours before a session at no cost.",
  "Beyond that, unused lessons bank for sixty days.",
  "Ramadan and travel pauses are free and unlimited — just tell your teacher.",
];

export type Story = { quote: string; source: string };

/**
 * Empty on purpose.
 *
 * This array previously held three testimonials attributed to named people
 * ("Imran Q., Manchester", "Fatima A., Toronto", "Yusuf B., Dubai") that came
 * from the design mockup. They were invented. Published on a real academy's
 * site they would be fabricated reviews, so they are gone.
 *
 * Add real ones here — with the student's permission — and the Stories
 * section renders itself again. It stays hidden while this is empty.
 */
export const stories: Story[] = [];

export const faqs = [
  {
    q: "Do I need any Arabic to start?",
    a: "None. Many students begin at the alphabet, adults included. The first lesson is an assessment, and you are placed where you actually are — not where the syllabus wishes you were.",
  },
  {
    q: "Which languages are classes taught in?",
    a: "English, Arabic and Yoruba. Tell admissions which you are most comfortable in and we will match you to a teacher who can teach in it — the Qur'an itself is always read in Arabic, but the explanation around it does not have to be.",
  },
  {
    q: "Can my child and I both enroll?",
    a: "Yes, and most families do. Children take the Kids' Foundations track in twenty-five-minute sessions; adults take theirs separately. Ask admissions about the household rate for a second and subsequent enrolment.",
  },
  {
    q: "Are there female teachers for sisters?",
    a: "Not yet. The two teachers currently listed are both men, and we would rather say so than let you find out after enrolling. We are recruiting female teachers for the sisters' circles, and they will appear on the teachers page by name before they take a class. If this decides it for you, write to admissions and we will tell you honestly where we are.",
  },
  {
    q: "What if I miss a week?",
    a: "Reschedule up to four hours before a session at no cost. Beyond that, unused lessons bank for sixty days. Ramadan and travel pauses are free and unlimited — just tell your teacher.",
  },
  {
    q: "How is the ijāzah verified?",
    a: "Every teacher is listed on the teachers page with their licence, the length of the chain it runs through and the institution that trained them. If you want the scanned certificate or the names in the chain, ask admissions and we will send them.",
  },
];

// Root-relative throughout: the nav renders on every route, so a bare "#faq"
// would only resolve on the home page.
export const navLinks = [
  { href: "/programs", label: "Programs" },
  { href: "/teachers", label: "Teachers" },
  { href: "/method", label: "Our method" },
  { href: "/stories", label: "Stories" },
  { href: "/faq", label: "FAQ" },
];

/**
 * Absolute base for metadata (OpenGraph images, canonical URLs, sitemap).
 *
 * TODO: this domain is a guess derived from the academy's name — set
 * NEXT_PUBLIC_SITE_URL in the deployment environment to the real one.
 * Social previews will not resolve correctly until it is right.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aoacademy.org";

/**
 * Every fixed route on the site, for the sitemap and for link checks.
 * Individual story pages are generated from `content/stories/` and appended
 * to the sitemap at build time — see app/sitemap.ts.
 */
export const routes = [
  "/",
  "/programs",
  "/teachers",
  "/method",
  "/stories",
  "/testimonials",
  "/faq",
] as const;

export const contact = {
  // TODO: point at the academy's real domain — this one is derived from the
  // name, not confirmed.
  email: "admissions@aoacademy.org",
  phone: "+234 703 522 6583",
  // E.164, for the tel: link — no spaces.
  phoneHref: "+2347035226583",
};

export const footerLinks = {
  Programs: [
    { href: "/programs", label: "Tajwīd" },
    { href: "/programs", label: "Ḥifẓ" },
    { href: "/programs", label: "Qur'anic Arabic" },
    { href: "/programs", label: "Yoruba" },
    { href: "/programs", label: "Kids' Foundations" },
  ],
  Academy: [
    { href: "/teachers", label: "Teachers" },
    { href: "/method", label: "Our method" },
    { href: "/stories", label: "Stories" },
    { href: "/testimonials", label: "Student voices" },
    { href: "/faq", label: "FAQ" },
  ],
};

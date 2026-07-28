/**
 * What the admin can edit, described once.
 *
 * Every list screen, every form, and every save action is generated from
 * these definitions. Adding a field to a content type means adding one entry
 * here — there is no matching form component to remember to update, and no
 * way for the two to drift apart.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "longform"
  | "list"
  | "number"
  | "boolean"
  | "select";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  /** Shown under the input. Say what good input looks like. */
  help?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  /** Half-width on wide screens, so short fields sit side by side. */
  half?: boolean;
};

export type Resource = {
  /** URL segment: /admin/<key> */
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  /** Column shown as the row heading in the list. */
  titleField: string;
  /** Smaller line under it. */
  subtitleField?: string;
  fields: Field[];
  /** Where this content appears on the public site. */
  publicPath?: string;
};

const SORT_FIELD: Field = {
  name: "sort_order",
  label: "Order",
  type: "number",
  help: "Lower numbers appear first. Ties fall back to alphabetical.",
  half: true,
};

const PUBLISHED_FIELD: Field = {
  name: "published",
  label: "Published",
  type: "boolean",
  help: "Turn this off to keep it here but hide it from the public site.",
  half: true,
};

export const RESOURCES: Resource[] = [
  {
    key: "programs",
    table: "programs",
    label: "Programs",
    singular: "program",
    description: "The tracks a student can enrol on.",
    titleField: "title",
    subtitleField: "kicker",
    publicPath: "/programs",
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        placeholder: "Tajwīd, from the letters up",
      },
      {
        name: "kicker",
        label: "Category",
        type: "text",
        half: true,
        placeholder: "Recitation",
        help: "The small label above the title.",
      },
      {
        name: "meta",
        label: "Details line",
        type: "text",
        half: true,
        placeholder: "Beginner → advanced · 9 months · adults & children",
      },
      {
        name: "body",
        label: "Description",
        type: "textarea",
        rows: 4,
        help: "Two or three sentences. What the student will actually be able to do.",
      },
      SORT_FIELD,
      PUBLISHED_FIELD,
    ],
  },
  {
    key: "stories",
    table: "stories",
    label: "Stories",
    singular: "story",
    description:
      "Stories of the prophets and other readings, for children and adults.",
    titleField: "title",
    subtitleField: "summary",
    publicPath: "/stories",
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        placeholder: "Prophet Yūnus ﷺ and the call from the darkness",
      },
      {
        name: "slug",
        label: "Web address",
        type: "text",
        required: true,
        half: true,
        placeholder: "prophet-yunus",
        help: "Lower-case, hyphens, no spaces.",
      },
      {
        name: "audience",
        label: "Written for",
        type: "select",
        half: true,
        options: [
          { value: "everyone", label: "Everyone" },
          { value: "children", label: "Children" },
          { value: "adults", label: "Adults" },
        ],
      },
      {
        name: "summary",
        label: "Summary",
        type: "textarea",
        rows: 3,
        help: "One or two sentences, shown on the card in the library.",
      },
      {
        name: "source",
        label: "Source",
        type: "text",
        placeholder: "Sūrat Yūsuf, 12",
        help: "Optional. Where the account is taken from.",
      },
      {
        name: "content",
        label: "The story",
        type: "longform",
        rows: 22,
        help:
          "Blank line between paragraphs. Start a line with ## for a heading, " +
          "or > for a quote (a final line starting with — becomes the attribution).",
      },
      SORT_FIELD,
      PUBLISHED_FIELD,
    ],
  },
  {
    key: "faqs",
    table: "faqs",
    label: "Questions",
    singular: "question",
    description: "The questions answered before someone enrols.",
    titleField: "question",
    publicPath: "/faq",
    fields: [
      {
        name: "question",
        label: "Question",
        type: "text",
        required: true,
        placeholder: "Do I need any Arabic to start?",
      },
      {
        name: "answer",
        label: "Answer",
        type: "textarea",
        rows: 6,
        help: "Answer it the way you would in person. Say so if the answer is no.",
      },
      SORT_FIELD,
      PUBLISHED_FIELD,
    ],
  },
  {
    key: "testimonials",
    table: "testimonials",
    label: "Student voices",
    singular: "testimonial",
    description:
      "Only publish these with the student's permission, under the name they chose.",
    titleField: "source",
    subtitleField: "quote",
    publicPath: "/testimonials",
    fields: [
      {
        name: "quote",
        label: "What they said",
        type: "textarea",
        rows: 5,
        required: true,
        help: "Their words, not yours. Include the quotation marks if you want them shown.",
      },
      {
        name: "source",
        label: "Attribution",
        type: "text",
        placeholder: "— Imran Q., Manchester · Tajwīd track, 2024",
        help: "The name they agreed to. Use initials or 'Anonymous' if they preferred.",
      },
      SORT_FIELD,
      {
        ...PUBLISHED_FIELD,
        help: "Off by default. Only turn this on once they have seen it and agreed.",
      },
    ],
  },
];

export function getResource(key: string): Resource | undefined {
  return RESOURCES.find((r) => r.key === key);
}

/** Site-wide values that are single fields rather than rows. */
export const SETTINGS_FIELDS: (Field & { name: string })[] = [
  {
    name: "contact_email",
    label: "Admissions email",
    type: "text",
    half: true,
  },
  { name: "contact_phone", label: "Phone (as shown)", type: "text", half: true },
  {
    name: "contact_phone_href",
    label: "Phone (for dialling)",
    type: "text",
    half: true,
    help: "Digits and a leading +, no spaces. Used by the tel: and WhatsApp links.",
  },
  {
    name: "youtube_url",
    label: "YouTube channel URL",
    type: "text",
    half: true,
    help: "Paste the plain channel address. Strip any ?si=… that a share link adds.",
  },
  {
    name: "instagram_url",
    label: "Instagram profile URL",
    type: "text",
    half: true,
    help: "Paste the plain profile address. Strip any ?igsh=… that a share link adds.",
  },
  {
    name: "youtube_text",
    label: "YouTube strip text",
    type: "textarea",
    rows: 3,
  },
  { name: "youtube_label", label: "YouTube link label", type: "text" },
  {
    name: "ayah_arabic",
    label: "Āyah (Arabic)",
    type: "textarea",
    rows: 3,
    help: "Shown right-to-left in Amiri.",
  },
  { name: "ayah_text", label: "Āyah (translation)", type: "textarea", rows: 3 },
  { name: "ayah_source", label: "Āyah reference", type: "text" },
];

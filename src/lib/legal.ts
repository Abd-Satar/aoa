/**
 * The legal pages.
 *
 * Wording supplied by the academy and kept as written. The only edits are:
 *   - "AOA" set as "A.O.A" to match how the name is styled everywhere else
 *     on the site,
 *   - `[Insert email address]` replaced by the `{email}` token, which each
 *     page fills from Site details so it can never drift from the footer,
 *   - `{refunds}` links the Refund Policy where the Terms mention it.
 *
 * Do not reword these without the academy's say-so. They are statements the
 * academy is legally held to, not marketing copy.
 */

/** Shown as "Last updated" on all three. Bump when the wording changes. */
export const LEGAL_UPDATED = "29 July 2026";

export type LegalDoc = {
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Standfirst. */
  intro: string;
  /** One paragraph per entry. */
  body: string[];
};

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    navLabel: "Privacy",
    eyebrow: "Privacy Policy",
    title: "How we handle your information.",
    description:
      "How A.O.A (As-Sattar Online Academy) collects, uses, shares and protects your personal information, and how to request access, correction or deletion.",
    intro:
      "A.O.A (As-Sattar Online Academy) respects your privacy and is committed to protecting your personal information.",
    body: [
      "We may collect your name, email address, phone number, and any information you provide through our enquiry or application forms. We use this information to respond to enquiries, provide information about our courses, process applications, and communicate with you.",
      "When you register for classes, we also collect the details you give us about the student, including the student's name and age where the classes are for a child, the programme and language you choose, your location, and your availability. We use these only to place the student and arrange lessons.",
      "If you write to us through our counselling form, we collect the name you give us, the email address or phone number you ask us to reply on, the topic you select, and the message itself. These messages are read only by the founder of A.O.A. They are never published on our website, never shown to other students, and are not shared with anyone else except where we are required to do so by law. We delete them within three weeks, and usually within two, of replying to you. If you would like your message deleted sooner than that, ask us at {email} and we will remove it.",
      "We do not sell your personal information. We may share it only with trusted service providers where necessary to operate our services or where required by law.",
      "We take reasonable steps to keep your information secure and retain it only for as long as necessary.",
      "You may request access to, correction of, or deletion of your personal information, subject to applicable law. You may also withdraw consent where consent is the basis for processing.",
      "For privacy questions or requests, contact us at {email}.",
      "We may update this policy from time to time. Any changes will be posted on this page.",
    ],
  },
  {
    slug: "terms",
    navLabel: "Terms",
    eyebrow: "Terms and Conditions",
    title: "The terms you agree to.",
    description:
      "The Terms and Conditions for using the A.O.A (As-Sattar Online Academy) website, submitting an enquiry, applying for a course, or enrolling in a programme.",
    intro:
      "By using the A.O.A (As-Sattar Online Academy) website, submitting an enquiry, applying for a course, or enrolling in a programme, you agree to these Terms and Conditions.",
    body: [
      "Course information, fees, schedules, and requirements may change. We will make reasonable efforts to keep information accurate but cannot guarantee that all website content is always complete or up to date.",
      "Submitting an enquiry or application does not guarantee admission or enrolment. A place may be confirmed only after all applicable requirements and payments have been completed.",
      "All students are expected to behave respectfully and follow A.O.A's academic and participation requirements. We may take appropriate action in cases of misconduct or serious breaches of these Terms.",
      "All website content and course materials belong to A.O.A or its licensors and may not be copied, shared, or used commercially without permission.",
      "Our courses are provided for educational purposes. We do not guarantee examination results, employment, income, or any other specific outcome.",
      "Refunds are governed by our {refunds}.",
      "These Terms are governed by the laws of the Federal Republic of Nigeria. We may update them from time to time by publishing a revised version on this page.",
      "For questions, contact us at {email}.",
    ],
  },
  {
    slug: "refunds",
    navLabel: "Refunds",
    eyebrow: "Refund Policy",
    title: "When fees can be refunded.",
    description:
      "How to request a refund from A.O.A (As-Sattar Online Academy), what makes a request eligible, and what happens if a course is cancelled.",
    intro:
      "Refund requests must be submitted in writing to {email} and should include the student's name, course name, proof of payment, and reason for the request.",
    body: [
      "Refund eligibility depends on the course, the date of the request, and whether the programme has started or services have already been provided.",
      "If a student cancels before a course begins, A.O.A may provide a full or partial refund, subject to any clearly stated non-refundable registration, administrative, or booking fees.",
      "Once a course has started, fees may be non-refundable. However, A.O.A may consider partial refunds in exceptional circumstances.",
      "If A.O.A cancels a course and cannot provide a suitable alternative, affected students may be offered a transfer, credit toward another course, or a refund of eligible fees paid.",
      "Approved refunds will normally be processed within 6 to 7 working days, using the original payment method.",
      "Nothing in this policy limits any rights that cannot legally be excluded under applicable law.",
      "For refund requests, contact {email}.",
    ],
  },
];

export function getLegalDoc(slug: string) {
  return legalDocs.find((d) => d.slug === slug);
}

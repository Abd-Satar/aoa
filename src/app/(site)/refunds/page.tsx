import type { Metadata } from "next";
import { LegalPage } from "@/components/nur/LegalPage";
import { getLegalDoc } from "@/lib/legal";
import { siteUrl } from "@/lib/nur-content";
import { getSettings } from "@/lib/content";

const doc = getLegalDoc("refunds")!;

export const metadata: Metadata = {
  title: `${doc.eyebrow} | A.O.A (As-Sattar Online Academy)`,
  description: doc.description,
  alternates: { canonical: new URL("/refunds", siteUrl).toString() },
};

export default async function RefundsPage() {
  const { contact } = await getSettings();
  return <LegalPage doc={doc} email={contact.email} />;
}

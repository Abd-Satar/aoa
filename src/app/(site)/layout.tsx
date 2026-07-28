import { SiteNav } from "@/components/nur/SiteNav";
import { SiteFooter } from "@/components/nur/SiteFooter";
import { PrintPlates } from "@/components/nur/PrintPlates";
import { ScrollEffects } from "@/components/nur/ScrollEffects";

/**
 * The public site's frame. A route group, so it adds no URL segment —
 * `(site)/programs/page.tsx` is still served at `/programs`.
 *
 * Keeping the nav mounted here rather than in each page means it survives
 * client-side navigation without re-rendering or re-measuring. No overflow-x
 * on this wrapper: it would become a scroll container and take the sticky
 * masthead with it.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div id="top">
      <SiteNav />
      {children}
      <SiteFooter />
      {/* Filter defs sit outside every section, so no one section's removal
          can strand the references. */}
      <PrintPlates />
      <ScrollEffects />
    </div>
  );
}

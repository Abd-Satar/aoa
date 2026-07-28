import { Hero } from "@/components/nur/Hero";
import { Principles } from "@/components/nur/Principles";
import { Programs } from "@/components/nur/Programs";
import { Method } from "@/components/nur/Method";
import { Ayah } from "@/components/nur/Ayah";
import { YoutubeStrip } from "@/components/nur/YoutubeStrip";
import { Stats } from "@/components/nur/Stats";
import { Founder } from "@/components/nur/Founder";
import { StoriesSection } from "@/components/nur/StoriesSection";
import { Faq } from "@/components/nur/Faq";
import { Enroll } from "@/components/nur/Enroll";

// The nav, footer and print/scroll machinery live in app/layout.tsx.
export default function Page() {
  return (
    <main>
      <Hero />
      <Principles />
      <Programs />
      <Method />
      <Ayah />
      <YoutubeStrip />
      <Stats />
      <Founder />
      <StoriesSection />
      <Faq />
      <Enroll />
    </main>
  );
}

import type { Metadata } from "next";
import { MissionHero } from "@/components/sections/mission/MissionHero";
import { StorySection } from "@/components/sections/mission/StorySection";
import { VisionSection } from "@/components/sections/mission/VisionSection";
import { CoreValuesSection } from "@/components/sections/mission/CoreValuesSection";
import { ClosingSection } from "@/components/sections/mission/ClosingSection";
import { SITE_NAME } from "@/lib/seo";

const SEO_TITLE = "백세미션 - 연세백세치과의원";
const SEO_DESCRIPTION =
  "부천 오정구 원종동·고강동 연세백세치과의원의 미션과 비전, 핵심가치. 치아를 치료하기 전에 환자분의 의구심과 불안을 먼저 치료하는 연세백세치과의 약속입니다.";
// mission.html's original <head> only had a bare og:url (no og:title/
// description/image), same as treatment.html — completing OG/Twitter here
// per stage 3-1/3-2/3-3's policy. hero-hands.jpg is an image this page
// already uses (mobile hero background), so it's reused as the OG image
// rather than referencing anything new.
const OG_IMAGE = "/images/hero-hands.jpg";

/**
 * Stage 3-4: mission.html full migration. Title/description/canonical/
 * robots/OpenGraph/Twitter completed per the established minimal-metadata
 * approach — this page's own JSON-LD stays stage 5 scope.
 */
export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/mission",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    locale: "ko_KR",
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function MissionPage() {
  return (
    <div className="mission-page">
      <MissionHero />
      <StorySection />
      <VisionSection />
      <CoreValuesSection />
      <ClosingSection />
    </div>
  );
}

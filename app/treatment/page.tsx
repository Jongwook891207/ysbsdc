import type { Metadata } from "next";
import { TreatmentHero } from "@/components/sections/treatment/TreatmentHero";
import { ImplantSection } from "@/components/sections/treatment/ImplantSection";
import { DentureSection } from "@/components/sections/treatment/DentureSection";
import { EndodonticsSection } from "@/components/sections/treatment/EndodonticsSection";
import { GeneralTreatmentSection } from "@/components/sections/treatment/GeneralTreatmentSection";
import { TreatmentModalProvider } from "@/components/sections/treatment/TreatmentModal";
import { TREATMENTS } from "@/components/sections/treatment/treatments.data";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

const SEO_TITLE = "전체 진료 안내";
const SEO_DESCRIPTION =
  "부천 오정구 원종동·고강동 연세백세치과의원의 전체 진료 안내. 치과보존과 전문의 미세 신경치료, 맞춤 가이드 임플란트, 어르신 맞춤 틀니 등 12개 진료 과목의 특징과 치료 과정을 확인하세요.";
// treatment.html's original <head> only had a bare og:url (no og:title/
// description/image) — completing OG/Twitter here per stage 3-1/3-2's
// policy. No photo exists for this page (icon/text-only in the source), so
// reusing the same existing clinic photo the homepage uses rather than
// referencing a file that doesn't exist.
const OG_IMAGE = "/images/consult.png";

/**
 * Stage 3-3: treatment.html full migration. Title/description/canonical/
 * robots/OpenGraph/Twitter completed per stage 3-1/3-2's minimal-metadata
 * approach — this page's own JSON-LD (Article/Service entities) stays
 * stage 5 scope.
 */
export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/treatment",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: absoluteUrl("/treatment"),
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

export default function TreatmentPage() {
  return (
    <div className="treatment-page">
      <TreatmentModalProvider treatments={TREATMENTS}>
        <TreatmentHero />
        <ImplantSection />
        <DentureSection />
        <EndodonticsSection />
        <GeneralTreatmentSection />
      </TreatmentModalProvider>
    </div>
  );
}

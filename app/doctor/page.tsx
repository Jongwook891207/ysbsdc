import type { Metadata } from "next";
import { DoctorHero } from "@/components/sections/doctor/DoctorHero";
import { TimelineSection } from "@/components/sections/doctor/TimelineSection";
import { ConservativeBackgroundSection } from "@/components/sections/doctor/ConservativeBackgroundSection";
import { JudgmentPrinciplesSection } from "@/components/sections/doctor/JudgmentPrinciplesSection";
import { InClinicSection } from "@/components/sections/doctor/InClinicSection";
import { TreatmentFocusSection } from "@/components/sections/doctor/TreatmentFocusSection";
import { ProfileSection } from "@/components/sections/doctor/ProfileSection";
import { ColumnNotesSection } from "@/components/sections/doctor/ColumnNotesSection";
import { ClosingSection } from "@/components/sections/doctor/ClosingSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { authorSource } from "@/lib/content/sources/authors";
import { buildGraph, buildPersonJsonLd, buildWebPageJsonLd, personId } from "@/lib/jsonld";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

const SEO_TITLE = "대표원장 김종욱";
const SEO_DESCRIPTION =
  "부천 오정구 원종동·고강동 연세백세치과의원 대표원장 김종욱을 소개합니다. 치과보존과 전문의로서 임플란트·틀니·신경치료를 진료하며, 치료 전 무엇이 필요한지부터 판단하는 진료 방식을 소개합니다.";
const OG_IMAGE = "/images/doctor1.jpg";

/**
 * Stage 3-2: doctor.html full migration. Stage 5-1: filled in the
 * robots/openGraph/twitter fields the metadata was missing (title/
 * description/canonical already existed) — no JSON-LD added here on
 * purpose. Renewed (doctor-page-renewal stage) into a WHO-focused editorial
 * profile — "대표원장 김종욱" — distinct from `/mission` (WHY) and
 * `/treatment` (WHAT/HOW). The canonical Person entity/profile lives at
 * /doctor/[slug] (stage 5-1), so this page still doesn't duplicate that
 * structured data. canonical/robots/openGraph.url structure unchanged from
 * before this renewal — only the title/description copy changed.
 */
export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/doctor",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: absoluteUrl("/doctor"),
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

// ProfilePage whose mainEntity must resolve to a typed Person *within this
// page's own graph*: Google's ProfilePage validation doesn't follow @id
// references across URLs, so a bare `{"@id": ...}` pointing at the entity
// emitted on /doctor/kim-jongwook fails with "mainEntity 개체 유형이
// 잘못되었습니다" in Search Console. The fix co-emits the same Person node
// (identical @id, built from the same content/authors frontmatter) here —
// not a second divergent declaration; consumers merging both pages still
// see one entity. No BreadcrumbList: this page renders no visible
// breadcrumb nav, so adding one would assert structure not on the page.
const doctorAuthor = authorSource.getBySlug("kim-jongwook");
if (!doctorAuthor) {
  throw new Error('DoctorStoryPage: authorSlug "kim-jongwook" does not match any file in content/authors/.');
}
const doctorJsonLd = buildGraph([
  buildWebPageJsonLd({
    type: "ProfilePage",
    canonicalUrl: absoluteUrl("/doctor"),
    name: SEO_TITLE,
    description: SEO_DESCRIPTION,
    mainEntityId: personId("kim-jongwook"),
  }),
  buildPersonJsonLd(doctorAuthor.frontmatter),
]);

export default function DoctorStoryPage() {
  return (
    <div className="doctor-page">
      <JsonLd data={doctorJsonLd} />
      <DoctorHero />
      <TimelineSection />
      <ConservativeBackgroundSection />
      <JudgmentPrinciplesSection />
      <InClinicSection />
      <TreatmentFocusSection />
      <ProfileSection />
      <ColumnNotesSection />
      <ClosingSection />
    </div>
  );
}

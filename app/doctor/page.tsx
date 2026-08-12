import type { Metadata } from "next";
import { DoctorHero } from "@/components/sections/doctor/DoctorHero";
import { StoryChapterSection } from "@/components/sections/doctor/StoryChapterSection";
import { ExpertiseSection } from "@/components/sections/doctor/ExpertiseSection";
import { PatientCareSection } from "@/components/sections/doctor/PatientCareSection";
import { ProfileSection } from "@/components/sections/doctor/ProfileSection";
import { FooterCtaSection } from "@/components/sections/doctor/FooterCtaSection";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

const SEO_TITLE = "대표원장 스토리";
const SEO_DESCRIPTION =
  "부천 오정구 원종동·고강동 연세백세치과의원 대표원장 김종욱의 진료 철학과 약력. 치과보존과 전문의, 2,000건 이상 미세 신경치료, 자연치아 보존을 최우선으로 하는 진료 이야기.";
const OG_IMAGE = "/images/doctor1.jpg";

/**
 * Stage 3-2: doctor.html full migration. Stage 5-1: filled in the
 * robots/openGraph/twitter fields the metadata was missing (title/
 * description/canonical already existed) — no JSON-LD added here on
 * purpose. This is the "대표원장 스토리" brand-narrative page; the
 * canonical Person entity/profile lives at /doctor/[slug] (stage 5-1),
 * so this page doesn't duplicate that structured data. Note: this page
 * doesn't currently link to /doctor/kim-jongwook (no cross-link exists
 * either direction) — out of scope for this stage's "SEO 기반만" brief,
 * left as a follow-up.
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

export default function DoctorStoryPage() {
  return (
    <div className="doctor-page">
      <DoctorHero />
      <StoryChapterSection />
      <ExpertiseSection />
      <PatientCareSection />
      <ProfileSection />
      <FooterCtaSection />
    </div>
  );
}

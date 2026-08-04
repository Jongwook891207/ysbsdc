import type { Metadata } from "next";
import { DoctorHero } from "@/components/sections/doctor/DoctorHero";
import { StoryChapterSection } from "@/components/sections/doctor/StoryChapterSection";
import { ExpertiseSection } from "@/components/sections/doctor/ExpertiseSection";
import { PatientCareSection } from "@/components/sections/doctor/PatientCareSection";
import { ProfileSection } from "@/components/sections/doctor/ProfileSection";
import { FooterCtaSection } from "@/components/sections/doctor/FooterCtaSection";

/**
 * Stage 3-2: doctor.html full migration. Title/description/canonical ported
 * from the original <head> as-is, same minimal approach as stage 3-1's
 * homepage — the generalized generateMetadata/JSON-LD system is still
 * stage 4/5 scope (this page's own Person/Article JSON-LD isn't added yet).
 * Note: this is the existing "대표원장 스토리" page — distinct from the
 * future generic /doctor/[slug] profile page the column system introduces.
 */
export const metadata: Metadata = {
  title: "대표원장 스토리 - 연세백세치과의원",
  description:
    "부천 오정구 원종동·고강동 연세백세치과의원 대표원장 김종욱의 진료 철학과 약력. 치과보존과 전문의, 2,000건 이상 미세 신경치료, 자연치아 보존을 최우선으로 하는 진료 이야기.",
  alternates: {
    canonical: "/doctor",
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

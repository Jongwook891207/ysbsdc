import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { CorePhilosophySection } from "@/components/sections/home/CorePhilosophySection";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { TreatmentTeaserSection } from "@/components/sections/home/TreatmentTeaserSection";
import { DoctorTeaserSection } from "@/components/sections/home/DoctorTeaserSection";
import { ColumnTeaserSection } from "@/components/sections/home/ColumnTeaserSection";
import { LocationSection } from "@/components/sections/home/LocationSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildDentistJsonLd, buildFaqJsonLd, buildGraph, buildWebSiteJsonLd } from "@/lib/jsonld";
import { HOME_FAQ_ITEMS } from "@/lib/homeFaq";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const CANONICAL_URL = `${SITE_URL}/`;

const SEO_TITLE = "부천 오정구 임플란트·틀니·신경치료 - 연세백세치과의원";
const SEO_DESCRIPTION =
  "부천 오정구 원종동·고강동 연세백세치과의원. 연세대 세브란스 출신 치과보존과 전문의 김종욱 대표원장 1:1 책임진료. 무통 신경치료, 어르신 맞춤 틀니, 고강동·원종동 임플란트, 과잉진료 없는 안심 치과.";
// og:description in the original <head> is a shorter, share-oriented blurb
// distinct from the SEO meta description above — kept as its own string.
const OG_DESCRIPTION =
  "연세대 세브란스 출신 치과보존과 전문의 김종욱 대표원장의 1:1 책임진료. 마음의 준비가 되실 때까지, 오늘은 설명만 들으셔도 괜찮습니다.";
// The original og:image (images/clinic-interior.webp) doesn't exist in
// public/images (confirmed missing from the source site's own images/
// folder too) — substituting an existing clinic photo so link previews
// aren't blank, rather than porting a broken reference.
const OG_IMAGE = "/images/consult.png";

/**
 * Stage 3-1: full metadata for the homepage — title/description/keywords
 * ported verbatim from index.html's <head>; canonical/robots/OpenGraph/
 * Twitter Card completed per stage 3-1's revision. The generalized
 * generateMetadata system for dynamic content routes is still stage 5.
 */
export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  keywords: [
    "부천 치과",
    "부천 오정구 치과",
    "부천 원종동 치과",
    "고강동 치과",
    "원종역 치과",
    "부천 임플란트",
    "원종동 임플란트",
    "고강동 임플란트",
    "부천 틀니",
    "고강동 틀니",
    "부천 신경치료",
    "치과보존과 전문의",
    "부천 안아픈 치과",
    "원종동 과잉진료 없는 치과",
    "고강동 과잉진료 없는 치과",
    "부천 어르신 맞춤 틀니",
    "부천 네비게이션 임플란트",
    "연세백세치과",
    "연세백세치과의원",
    "김종욱 원장",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: CANONICAL_URL,
    title: SEO_TITLE,
    description: OG_DESCRIPTION,
    locale: "ko_KR",
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const homeJsonLd = buildGraph([
  buildDentistJsonLd(),
  buildWebSiteJsonLd(),
  buildFaqJsonLd(HOME_FAQ_ITEMS, CANONICAL_URL),
]);

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <Hero />
      <CorePhilosophySection />
      <FaqSection />
      <TreatmentTeaserSection />
      <DoctorTeaserSection />
      <ColumnTeaserSection />
      <LocationSection />
    </>
  );
}

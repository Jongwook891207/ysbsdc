import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ContentListHeader } from "@/components/content/ContentListHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { BeforeAfterSlider } from "@/components/cases/BeforeAfterSlider";
import { CLINIC, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildGraph, buildWebPageJsonLd, DENTIST_ID } from "@/lib/jsonld";

const SEO_TITLE = "치료 사례 - 치료 전과 후를 직접 비교해 보세요";
const SEO_DESCRIPTION =
  "부천 오정구 원종동 연세백세치과의원에서 김종욱 대표원장이 치료한 실제 사례입니다. 치료 전후 사진을 슬라이더로 직접 비교하며, 각 사례에서 어떤 판단으로 치료를 계획했는지 설명합니다.";

/**
 * 치료 사례 페이지. 모든 사진은 본원에서 치료한 실제 증례이며 환자
 * 동의를 받아 게재한다. 전후 사진 짝은 게재 전에 정합 스크립트로
 * 구도를 맞춘다(원본 촬영본과 다른 임의 보정은 하지 않는다 — 배율·
 * 회전·위치 정렬만). docs/04 원칙: 효과 보장 표현 금지, 사례마다
 * 개인차·부작용 고지를 붙인다.
 */
export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/cases",
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
    url: absoluteUrl("/cases"),
    locale: "ko_KR",
    images: [{ url: "/images/consult.png" }],
  },
  twitter: {
    card: "summary",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
};

interface CaseItem {
  id: string;
  title: string;
  desc: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  width: number;
  height: number;
  relatedLink?: { href: string; label: string };
}

const CASES: CaseItem[] = [
  {
    id: "full-arch",
    title: "여러 개의 치아를 잃은 경우, 어디서부터 계획할까요?",
    desc: "남아 있는 치아 중 지킬 수 있는 치아를 먼저 구분한 뒤, 상실 부위를 임플란트로 회복한 사례입니다. 치아를 심는 위치와 개수는 잇몸뼈 상태와 남은 치아를 함께 보고 계획합니다.",
    beforeSrc: "/images/cases/full-arch-pano-before.webp",
    afterSrc: "/images/cases/full-arch-pano-after.webp",
    beforeAlt: "여러 치아가 상실된 치료 전 파노라마 방사선 사진",
    afterAlt: "임플란트로 회복한 치료 후 파노라마 방사선 사진",
    width: 1400,
    height: 686,
    relatedLink: { href: "/implant", label: "디지털 가이드 임플란트 안내 보기" },
  },
  {
    id: "multi-caries",
    title: "여러 개의 충치가 한꺼번에 진행된 경우, 어떻게 회복할까요?",
    desc: "여러 치아에 충치가 함께 진행되어, 남길 수 있는 치아 구조를 살리면서 크라운 등으로 단계적으로 수복한 사례입니다. 치료 범위와 방법은 치아마다의 상태를 확인한 뒤 결정합니다.",
    beforeSrc: "/images/cases/multi-caries-crown-before.webp",
    afterSrc: "/images/cases/multi-caries-crown-after.webp",
    beforeAlt: "여러 치아에 충치가 진행된 치료 전 구강 사진",
    afterAlt: "크라운 등으로 수복한 치료 후 구강 사진",
    width: 1400,
    height: 753,
    relatedLink: { href: "/treatment#general", label: "일반진료 안내 보기" },
  },
  {
    id: "front-implant",
    title: "앞니를 잃었을 때, 모양까지 함께 계획합니다",
    desc: "앞니는 씹는 기능과 함께 자연스러운 모양이 중요한 부위입니다. 잇몸 라인과 좌우 치아의 조화를 함께 계획해 임플란트로 회복한 사례입니다.",
    beforeSrc: "/images/cases/front-implant-before.webp",
    afterSrc: "/images/cases/front-implant-after.webp",
    beforeAlt: "앞니가 상실된 치료 전 구강 사진",
    afterAlt: "임플란트로 회복한 치료 후 구강 사진",
    width: 1400,
    height: 882,
    relatedLink: { href: "/implant", label: "디지털 가이드 임플란트 안내 보기" },
  },
];

export default function CasesPage() {
  const canonicalUrl = absoluteUrl("/cases");
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "치료 사례", href: "/cases" },
  ];

  const graph = buildGraph([
    buildWebPageJsonLd({
      type: "MedicalWebPage",
      canonicalUrl,
      name: SEO_TITLE,
      description: SEO_DESCRIPTION,
      aboutId: DENTIST_ID,
    }),
    buildBreadcrumbJsonLd(breadcrumbItems, canonicalUrl),
  ]);

  return (
    <div className="treatment-page implant-page cases-page">
      <JsonLd data={graph} />
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <ContentListHeader
        eyebrow="CASES — 부천 오정구 원종동"
        title="치료 전과 후를 직접 비교해 보세요"
        description="결과 사진 한 장보다, 무엇이 어떻게 달라졌는지가 더 중요하다고 생각합니다."
      />

      <section className="ip-section">
        <div className="container">
          <p>
            아래 사례는 모두 연세백세치과의원에서 김종욱 대표원장이 치료한 실제 사례입니다. 가운데 핸들을
            좌우로 움직이면 치료 전과 후를 같은 화면에서 비교하실 수 있습니다.
          </p>
          <p>
            사례를 보여드리는 이유는 결과를 자랑하기 위해서가 아닙니다. 어떤 상태에서 어떤 판단으로 치료를
            계획했는지를 보여드리기 위해서입니다. 같은 치료라도 구강 상태에 따라 과정과 결과는 달라질 수
            있습니다.
          </p>
        </div>
      </section>

      {CASES.map((c) => (
        <section key={c.id} className="ip-section case-item" id={c.id}>
          <div className="container">
            <h2>{c.title}</h2>
            <p>{c.desc}</p>
            <BeforeAfterSlider
              beforeSrc={c.beforeSrc}
              afterSrc={c.afterSrc}
              beforeAlt={c.beforeAlt}
              afterAlt={c.afterAlt}
              width={c.width}
              height={c.height}
            />
            <p className="case-hint">◂▸ 핸들을 좌우로 움직여 비교해 보세요</p>
            <p className="case-notice">
              치료 결과는 개인의 구강 상태에 따라 다를 수 있으며, 부작용이 발생할 수 있으므로 정확한 진단과
              상담이 필요합니다.
            </p>
            {c.relatedLink ? (
              <p className="ip-links">
                <Link href={c.relatedLink.href}>{c.relatedLink.label}</Link>
              </p>
            ) : null}
          </div>
        </section>
      ))}

      <section className="ip-section">
        <div className="container">
          <h2>사례가 내 상황과 같지 않을 수 있습니다</h2>
          <p>
            같은 진단명이라도 잇몸뼈 상태, 남은 치아, 전신 건강에 따라 치료 계획은 달라집니다. 그래서 저희는
            사례를 보고 치료를 결정하시기보다, 검사 결과를 근거로 가능한 선택지를 함께 확인하시기를
            권해드립니다. 당일 결정을 요구하지 않으니, 충분히 상의하신 뒤 결정하셔도 괜찮습니다.
          </p>
          <div className="ip-cta">
            <TrackedLink href={CLINIC.bookingUrl} event="naver_booking_click" location="cta" className="btn btn-navy" target="_self">
              간편 예약
            </TrackedLink>
            <TrackedLink href={`tel:${CLINIC.telephoneDisplay}`} event="phone_click" location="cta" className="btn btn-outline">
              전화 문의 {CLINIC.telephoneDisplay}
            </TrackedLink>
          </div>
        </div>
      </section>
    </div>
  );
}

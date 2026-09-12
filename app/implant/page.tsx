import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentListHeader } from "@/components/content/ContentListHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { CLINIC, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildGraph, buildWebPageJsonLd, DENTIST_ID } from "@/lib/jsonld";

const SEO_TITLE = "원종동 임플란트 - 3D CT로 계획하는 디지털 가이드 임플란트";
const SEO_DESCRIPTION =
  "부천 오정구 원종동 연세백세치과의원 김종욱 대표원장이 3D CT로 잇몸뼈와 신경관 위치를 확인하고, 컴퓨터에서 식립 위치·각도·깊이를 계획한 뒤 서지컬 가이드로 수술하는 디지털 가이드 임플란트를 안내합니다.";

/**
 * 임플란트 대표(canonical hub) 페이지. /treatment#implant(요약 섹션)는
 * 그대로 유지되고, 상세한 진단·계획·수술 워크플로 설명은 이 페이지가
 * 담당한다. 기존에 TreatmentModal(클라이언트 전용)에만 있던 워크플로
 * 내용을 근거로, 크롤러가 읽을 수 있는 정적 본문으로 재구성했다.
 *
 * JSON-LD는 /treatment와 같은 원칙: MedicalWebPage가 홈의 Dentist 엔티티를
 * about으로 참조하고, 눈에 보이는 breadcrumb과 짝을 이루는 BreadcrumbList만
 * 추가한다. 새 엔티티 타입(MedicalProcedure 등)은 만들지 않는다.
 */
export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/implant",
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
    url: absoluteUrl("/implant"),
    locale: "ko_KR",
    images: [{ url: "/images/consult.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: ["/images/consult.png"],
  },
};

const PROCESS_STEPS = [
  {
    title: "1. 3D CT 확인",
    desc: "잇몸뼈의 양과 질, 신경관·상악동 같은 해부학적 구조의 위치를 입체적으로 확인합니다.",
  },
  {
    title: "2. 대표원장의 컴퓨터 수술 계획",
    desc: "김종욱 대표원장이 CT 데이터를 직접 보며 임플란트가 들어갈 식립 위치·각도·깊이를 컴퓨터상에서 계획합니다.",
  },
  {
    title: "3. 디지털 가이드(서지컬 가이드) 설계·출력",
    desc: "세운 계획을 수술로 그대로 옮기기 위한 가이드를 대표원장이 직접 설계하고 출력합니다. 가이드 제작비는 따로 청구하지 않습니다.",
  },
  {
    title: "4. 계획한 위치로 식립",
    desc: "가이드를 활용해 계획한 위치에 임플란트를 식립합니다. 상태에 따라 절개를 최소화할 수 있는 경우도 있습니다.",
  },
];

const RELATED_COLUMNS = [
  { slug: "why-digital-guide-implant", title: "임플란트, 디지털 가이드는 언제 도움이 될까요?" },
  { slug: "bone-graft-amount-implant-success", title: "임플란트, 뼈이식을 많이 할수록 더 튼튼해질까요?" },
  { slug: "dental-implant-diabetes-hypertension", title: "고혈압, 당뇨 환자도 임플란트를 심을 수 있나요?" },
];

export default function ImplantPage() {
  const canonicalUrl = absoluteUrl("/implant");
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "임플란트", href: "/implant" },
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
    <div className="treatment-page implant-page">
      <JsonLd data={graph} />
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <ContentListHeader
        eyebrow="IMPLANT — 부천 오정구 원종동"
        title="3D CT로 미리 계획하는 디지털 가이드 임플란트"
        description="심고 나서 확인하는 것이 아니라, 심기 전에 계획합니다."
      />

      <section className="ip-section">
        <div className="container">
          <p>
            부천 오정구 원종동 연세백세치과의원은 임플란트를 심기 전에 계획부터 세웁니다. 김종욱 대표원장이
            3D CT로 잇몸뼈의 상태와 신경관 같은 해부학적 구조를 직접 확인하고, 컴퓨터상에서 임플란트가
            들어갈 위치·각도·깊이를 미리 결정합니다.
          </p>
          <p>
            이렇게 세운 수술 계획은 디지털 가이드(서지컬 가이드)로 만들어져 실제 수술에 그대로 적용됩니다.
            가이드는 대표원장이 직접 설계하고 출력하며, 제작비를 따로 청구하지 않습니다.
          </p>
        </div>
      </section>

      <section className="ip-section">
        <div className="container">
          <h2>왜 임플란트 전에 3D CT부터 확인하나요?</h2>
          <p>
            임플란트를 심을 자리 아래에는 신경관이나 상악동처럼 다치면 안 되는 구조물이 있습니다. 눈으로
            보이는 잇몸 표면만으로는 그 구조물이 어디에 있는지, 잇몸뼈가 얼마나 남아 있는지 알기 어렵습니다.
          </p>
          <p>
            그래서 저희는 겉으로 심을 자리가 넉넉해 보이는 경우에도 3D CT로 뼈 속 구조를 먼저 확인하는
            순서를 건너뛰지 않습니다. 임플란트 진단의 시작은 장비가 아니라, CT에서 확인한 사실을 근거로
            판단하는 일이라고 생각합니다.
          </p>
        </div>
      </section>

      <section className="ip-section">
        <div className="container">
          <h2>컴퓨터에서 위치·각도·깊이를 먼저 계획하는 이유</h2>
          <p>
            임플란트 수술에서 중요한 것은 심는 행위 자체가 아니라 <strong>어디에, 어떤 방향으로, 얼마나
            깊이 심을지를 판단하는 과정</strong>입니다. 저희는 이 판단을 수술 중이 아니라 수술 전에,
            CT 위에서 먼저 합니다.
          </p>
          <p>
            이때 심을 위치는 뼈 상태만 보고 정하지 않습니다. 나중에 그 위에 올라갈 보철물(인공 치아)의
            모양까지 고려해서, 보철적으로도 자연스러운 위치를 함께 계획합니다. 디지털 가이드는 이렇게
            미리 세운 계획을 입안에 그대로 옮길 수 있게 해주는 도구입니다. 가이드가 판단을 대신해 주는
            것은 아니기 때문에, 계획을 세우는 사람이 누구인지가 더 중요하다고 생각합니다.
          </p>
        </div>
      </section>

      <section className="key-treatment ip-process">
        <div className="container">
          <div className="kt-head">
            <span className="eyebrow on-navy">PROCESS</span>
            <h2 className="kt-title">진단부터 수술까지, 이렇게 진행합니다</h2>
          </div>
          <div className="kt-grid kt-grid-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.title} className="kt-card">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section">
        <div className="container">
          <h2>뼈이식이 필요한지는 어떻게 판단하나요?</h2>
          <p>
            <strong>뼈이식은 많이 할수록 좋은 치료가 아닙니다.</strong> 저희는 이식량을 먼저 정하지 않고,
            임플란트가 있어야 할 위치를 먼저 정합니다. 그다음 CT에서 그 자리에 부족한 뼈가 있는지 확인하고,
            실제로 필요한 경우에 필요한 만큼만 보완합니다.
          </p>
          <p>
            뼈이식량이 많았다는 것은 더 좋은 치료를 받았다는 뜻이 아니라, 그만큼 원래 뼈 조건이 어려웠다는
            뜻에 가깝습니다. 이 판단 기준은{" "}
            <Link href="/column/bone-graft-amount-implant-success">뼈이식량에 대한 칼럼</Link>에서 논문
            근거와 함께 자세히 설명드립니다.
          </p>
        </div>
      </section>

      <section className="ip-section">
        <div className="container">
          <h2>부모님 임플란트를 알아보고 계신다면</h2>
          <p>
            나이가 많다는 사실 자체가 임플란트를 막는 기준은 아닙니다. 그보다는 잇몸뼈 상태, 당뇨·고혈압
            같은 전신질환이 잘 관리되고 있는지, 복용 중인 약이 무엇인지가 더 중요합니다.
          </p>
          <p>상담 전에 다음을 준비하시면 판단에 도움이 됩니다.</p>
          <ul>
            <li>현재 치료 중인 질환과 복용 중인 약 목록</li>
            <li>이전 치과 치료 이력 (틀니, 발치 등)</li>
            <li>보호자가 함께 듣고 싶은 질문 — 치료 과정, 기간, 비용 등</li>
          </ul>
          <p>
            저희는 CT로 확인한 상태를 근거로 가능한 선택지들을 설명드리고, 당일 결정을 요구하지 않습니다.
            충분히 상의하신 뒤 결정하셔도 괜찮습니다.
          </p>
        </div>
      </section>

      <section className="ip-section">
        <div className="container">
          <h2>대표원장 김종욱</h2>
          <p>
            연세백세치과의 임플란트 진단과 수술 계획은 <strong>김종욱 대표원장이 직접 담당합니다.</strong>{" "}
            CT에서 확인한 내용과 실제 수술이 다르지 않도록, 수술 계획과 가이드 설계까지 직접 진행합니다.
          </p>
          <p className="ip-links">
            <Link href="/doctor/kim-jongwook">김종욱 대표원장의 학력·경력·전문분야 보기</Link>
            <Link href="/doctor">김종욱 원장의 진료 철학 보기</Link>
          </p>
        </div>
      </section>

      <section className="ip-section">
        <div className="container">
          <h2>더 자세한 내용이 궁금하시다면</h2>
          <p className="ip-links">
            <Link href="/faq/implant">임플란트 자주 묻는 질문 보기</Link>
            <Link href="/price">비급여 진료비 안내 보기</Link>
            <Link href="/treatment#implant">전체 진료 안내에서 보기</Link>
          </p>
          <p>원장이 직접 쓴 임플란트 칼럼도 함께 읽어보세요.</p>
          <ul className="ip-column-list">
            {RELATED_COLUMNS.map((column) => (
              <li key={column.slug}>
                <Link href={`/column/${column.slug}`}>{column.title}</Link>
              </li>
            ))}
          </ul>
          <div className="ip-cta">
            <a href={CLINIC.bookingUrl} className="btn btn-navy" target="_self">
              간편 예약
            </a>
            <a href={`tel:${CLINIC.telephoneDisplay}`} className="btn btn-outline">
              전화 문의 {CLINIC.telephoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { CLINIC } from "@/lib/seo";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ModalTriggerButton } from "./ModalTriggerButton";
import { RelatedColumnLinks } from "./RelatedColumnLinks";

const CARDS = [
  {
    title: "전국 2.5% 치과보존과 전문의 1:1 책임진료",
    sub: "연세대학교 세브란스병원 수련 출신의 정교한 보존 진료",
    desc: "전국 치과의사 중 2.5%에 불과한 보건복지부 인증 치과보존과 전문의로서, 2,000건 이상의 신경치료 경험을 통해 이 치아가 신경치료로 보존할 가치가 있는지, 치료 후 예후는 어떨지를 먼저 판단한 뒤 치료를 시작합니다.",
  },
  {
    title: "신경치료 · 재신경치료",
    sub: "예후를 함께 살펴보는 재신경치료 판단",
    desc: "재신경치료가 가능한 경우도 있지만, 모든 치아에서 같은 결과를 기대할 수 있는 것은 아닙니다. 남아 있는 치아 구조와 예상 예후를 함께 살펴본 뒤 재신경치료가 의미 있는 선택인지, 다른 치료가 더 나은지 설명해 드립니다.",
  },
  {
    title: "자연치아 고유의 '치주인대' 보호",
    sub: "씹는 충격을 흡수하고 세균을 막아주는 자연치아의 특권",
    desc: "인공치아에는 없는 '치주인대'는 씹는 쿠션 역할을 하고 뼈를 보호합니다. 당장의 시술 매출보다 환자분의 소중한 치아를 단 1년이라도 더 건강하게 쓰실 수 있도록 정직하게 진료합니다.",
  },
];

const PROCESS = [
  {
    title: "정밀 진단",
    desc: "증상과 방사선 사진으로 원인을 확인합니다. 신경치료를 반복했는데도 증상이 이어지고 일반 방사선사진만으로 원인을 확인하기 어려운 경우에는, 필요에 따라 3D CT로 추가로 확인하기도 합니다.",
  },
  {
    title: "치료 필요성 판단",
    desc: "신경치료가 꼭 필요한 상태인지, 조금 더 지켜볼 수 있는 상태인지를 먼저 판단합니다.",
  },
  {
    title: "예후 평가",
    desc: "치료 후 이 치아를 얼마나 오래, 어떻게 사용할 수 있을지를 함께 살펴봅니다.",
  },
  {
    title: "이후 계획 설명",
    desc: "충전이나 크라운 등 이후 수복 계획을 설명드립니다. 필요한 경우 재신경치료를 고려하고, 수술적 치료가 더 적절한 경우에는 치근단 수술이 가능한 기관으로 의뢰할 수 있으며, 치아의 보존이 어렵다고 판단되는 경우에는 발치를 함께 논의합니다.",
  },
];

/** Ports treatment.html's `<section class="key-treatment" id="endodontics">` (Key Treatment 03). Modal opens TREATMENTS[0]. */
export function EndodonticsSection() {
  return (
    <section className="key-treatment" id="endodontics">
      <div className="container">
        <div className="kt-head">
          <span className="eyebrow on-navy">KEY TREATMENT 03 — CONSERVATIVE DENTISTRY &amp; TOOTH PRESERVATION</span>
          <h2 className="kt-title">
            임플란트를 고민하기 전에,
            <br />
            먼저 살릴 수 있는 치아인지 확인합니다.
          </h2>
          <p className="kt-lede">
            부천 오정구 원종동에 위치한 연세백세치과 김종욱 대표원장은 치과보존과 전문의로서, 2,000건 이상의
            신경치료 경험을 바탕으로 이 치아에 신경치료가 꼭 필요한지, 치료 후에도 자연치아로 오래 쓸 수 있는지를
            먼저 판단합니다.
          </p>
        </div>
        <div className="kt-grid kt-grid-3">
          {CARDS.map((c) => (
            <div key={c.title} className="kt-card">
              <h3>{c.title}</h3>
              <div className="kt-card-sub">{c.sub}</div>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="kt-head">
          <span className="eyebrow on-navy">진단부터 치료 이후까지, 이렇게 판단합니다</span>
        </div>
        <div className="kt-grid kt-grid-4">
          {PROCESS.map((p) => (
            <div key={p.title} className="kt-card">
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="kt-cta">
          <ModalTriggerButton index={0} className="btn btn-gold">
            신경치료 &amp; 보존 진료 상세 Q&amp;A 보기
          </ModalTriggerButton>
          <TrackedLink href={`tel:${CLINIC.telephoneDisplay}`} event="phone_click" location="cta" className="btn btn-outline-light">
            전화 상담 문의 ({CLINIC.telephoneDisplay})
          </TrackedLink>
          <Link href="/doctor/kim-jongwook" className="btn btn-outline-light">
            치과보존과 전문의 김종욱 원장 소개
          </Link>
        </div>
        <RelatedColumnLinks treatmentSlug="endodontics" />
      </div>
    </section>
  );
}

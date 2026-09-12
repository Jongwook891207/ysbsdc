import Link from "next/link";
import { CLINIC } from "@/lib/seo";
import { ModalTriggerButton } from "./ModalTriggerButton";
import { RelatedColumnLinks } from "./RelatedColumnLinks";

const CARDS = [
  {
    num: "01",
    title: "환자분의 상태에 맞춘 가이드 수술",
    desc: "디지털 가이드를 대표원장이 직접 3D로 디자인하며, 별도 제작비를 청구하지 않습니다.",
  },
  {
    num: "02",
    title: "3D CT 사전 컴퓨터 분석",
    desc: "잇몸 속 뼈의 상태와 신경관 위치를 미리 확인하여, 환자분의 상태에 맞는 임플란트 위치를 계획합니다.",
  },
  {
    num: "03",
    title: "최소 절개로 수술 시간 대폭 단축",
    desc: "잇몸을 크게 칼로 째지 않고 딱 필요한 자리에만 시술하여 수술 시간을 획기적으로 줄입니다.",
  },
  {
    num: "04",
    title: "마취가 풀려도 편안한 통증·붓기 최소화",
    desc: "불필요한 잇몸 손상을 줄여 시술 중은 물론, 수술 후 마취가 풀려도 아픔과 붓기가 대폭 줄어듭니다.",
  },
];

/** Ports treatment.html's `<section class="key-treatment" id="implant">` (Key Treatment 01). Modal opens TREATMENTS[1]. */
export function ImplantSection() {
  return (
    <section className="key-treatment" id="implant">
      <div className="container">
        <div className="kt-head">
          <span className="eyebrow on-navy">KEY TREATMENT 01 — IMPLANT</span>
          <h2 className="kt-title">
            단 한 개의 임플란트도 감에 의존하지 않습니다.
            <br />
            CT와 디지털 가이드를 활용해 수술 위치와 방향을 미리 계획합니다.
          </h2>
          <p className="kt-lede">
            김종욱 대표원장이 3D CT로 잇몸뼈와 신경관 위치를 확인하고, 컴퓨터에서 식립 위치·각도·깊이를
            계획한 뒤 직접 설계한 디지털 가이드(서지컬 가이드)로 수술합니다. 진단부터 수술까지의 자세한
            과정은 임플란트 안내 페이지에서 확인하실 수 있습니다.
          </p>
        </div>
        <div className="kt-grid">
          {CARDS.map((c) => (
            <div key={c.num} className="kt-card">
              <div className="kt-num">{c.num}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="kt-cta">
          <Link href="/implant" className="btn btn-gold">
            디지털 가이드 임플란트 자세히 보기
          </Link>
          <ModalTriggerButton index={1} className="btn btn-outline-light">
            상세 Q&amp;A 보기
          </ModalTriggerButton>
          <Link href="/doctor/kim-jongwook" className="btn btn-outline-light">
            대표원장 김종욱 소개
          </Link>
          <a href={`tel:${CLINIC.telephoneDisplay}`} className="btn btn-outline-light">
            전화 상담 예약하기
          </a>
        </div>
        <RelatedColumnLinks treatmentSlug="implant" />
      </div>
    </section>
  );
}

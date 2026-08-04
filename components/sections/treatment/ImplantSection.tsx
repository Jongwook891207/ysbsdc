import { CLINIC } from "@/lib/seo";
import { ModalTriggerButton } from "./ModalTriggerButton";

const CARDS = [
  {
    num: "01",
    title: "모든 케이스 100% 맞춤 가이드 기본 적용",
    desc: "타 병원 상당 비용의 디지털 가이드를 대표원장이 직접 3D로 디자인하여 모든 환자분께 100% 제공합니다.",
  },
  {
    num: "02",
    title: "3D CT 사전 컴퓨터 분석",
    desc: "잇몸 속 뼈의 정밀한 상태와 신경관 위치를 미리 다 파악하여 가장 안전하고 정교한 위치를 선정합니다.",
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
            100% 맞춤 길잡이(가이드)로 오차 없이, 통증 걱정 없이 심습니다.
          </h2>
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
          <ModalTriggerButton index={1} className="btn btn-gold">
            가이드 임플란트 상세 Q&amp;A 보기
          </ModalTriggerButton>
          <a href={`tel:${CLINIC.telephoneDisplay}`} className="btn btn-outline-light">
            전화 상담 예약하기
          </a>
        </div>
      </div>
    </section>
  );
}

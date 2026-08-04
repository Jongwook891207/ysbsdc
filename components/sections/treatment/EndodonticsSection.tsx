import { CLINIC } from "@/lib/seo";
import { ModalTriggerButton } from "./ModalTriggerButton";

const CARDS = [
  {
    title: "전국 2.5% 치과보존과 전문의 1:1 책임진료",
    sub: "연세대학교 세브란스병원 수련 출신의 정교한 보존 진료",
    desc: "전국 치과의사 중 2.5%에 불과한 보건복지부 인증 치과보존과 전문의로서, 2,000건 이상의 신경치료 경험을 바탕으로 소중한 자연치아를 쉽게 포기하지 않고 끝까지 살려냅니다.",
  },
  {
    title: "고난도 미세 신경치료 & 재신경치료",
    sub: "발치 진단을 받은 치아도 한 번 더 살리는 기회",
    desc: "미세 정밀 기구로 좁고 복잡한 신경관 속 오염 원인을 제거하고 정교하게 소독하여, 통증을 근본적으로 해결하고 재발률을 낮춥니다.",
  },
  {
    title: "자연치아 고유의 '치주인대' 보호",
    sub: "씹는 충격을 흡수하고 세균을 막아주는 자연치아의 특권",
    desc: "인공치아에는 없는 '치주인대'는 씹는 쿠션 역할을 하고 뼈를 보호합니다. 당장의 시술 매출보다 환자분의 소중한 치아를 단 1년이라도 더 건강하게 쓰실 수 있도록 정직하게 진료합니다.",
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
            임플란트를 가장 잘 심는 치과의 진짜 실력은,
            <br />
            자연치아를 함부로 뽑지 않는 데서 나옵니다.
          </h2>
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
        <div className="kt-cta">
          <ModalTriggerButton index={0} className="btn btn-gold">
            미세 신경치료 &amp; 보존 진료 상세 Q&amp;A 보기
          </ModalTriggerButton>
          <a href={`tel:${CLINIC.telephoneDisplay}`} className="btn btn-outline-light">
            전화 상담 문의 ({CLINIC.telephoneDisplay})
          </a>
        </div>
      </div>
    </section>
  );
}

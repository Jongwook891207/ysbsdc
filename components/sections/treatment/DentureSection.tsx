import { CLINIC } from "@/lib/seo";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ModalTriggerButton } from "./ModalTriggerButton";
import { RelatedColumnLinks } from "./RelatedColumnLinks";

/** Ports treatment.html's `<section class="key-denture" id="denture">` (Key Treatment 02). Modal opens TREATMENTS[2]. */
export function DentureSection() {
  return (
    <section className="key-denture" id="denture">
      <div className="container">
        <div className="kt-head">
          <span className="eyebrow">KEY TREATMENT 02 — DENTURE &amp; IARPD</span>
          <h2 className="kt-title-light">
            잇몸에 가해지는 부담을 줄이는 방향으로,
            <br />
            건강보험 혜택으로 완성하는 1:1 맞춤 틀니 솔루션
          </h2>
        </div>
        <div className="kd-grid">
          <div className="kd-card">
            <h3 className="kd-card-title">정밀 흡착 완전 틀니</h3>
            <div className="kd-card-sub">잇몸 구조에 정교하게 밀착되는 안심 틀니</div>
            <p>
              잇몸 음영과 구조를 정밀 인상채득으로 측정하여 음식이 잘 끼지 않고, 덜커덕거리거나 잇몸이 아픈
              불편함을 최소화한 1:1 맞춤 완전 틀니입니다.
            </p>
          </div>
          <div className="kd-card">
            <h3 className="kd-card-title">잔존치 보호 부분 틀니</h3>
            <div className="kd-card-sub">남은 소중한 자연치아를 오래 지키는 설계</div>
            <p>
              남아있는 치아에 가해지는 자극과 씹는 힘을 정밀하게 분산시켜, 소중한 자연치아를 안전하게 오래
              보호하면서 자연스러운 저작력을 복원해 드립니다.
            </p>
          </div>
          <div className="kd-card kd-highlight">
            <h3 className="kd-card-title">임플란트 오버덴처 (임플란트 2개 고정 틀니)</h3>
            <div className="kd-card-sub">자꾸 들뜨는 아래 완전틀니를 임플란트로 붙잡는 방식</div>
            <p>
              아래 완전틀니가 계속 들뜨거나 움직이는 경우, 임플란트 2개를 심고 로케이터(연결 부품)로 틀니를
              고정해 유지력을 높이는 방식입니다.
            </p>
            <p className="kd-card-note">
              전체 임플란트 대비 수술 범위와 비용 부담을 낮추면서, 일반 틀니보다 안정적인 유지력을 기대할 수
              있습니다.
            </p>
          </div>
        </div>
        <div className="kt-cta">
          <ModalTriggerButton index={2} className="btn btn-navy">
            틀니 &amp; IARPD 상세 Q&amp;A 보기
          </ModalTriggerButton>
          <TrackedLink href={`tel:${CLINIC.telephoneDisplay}`} event="phone_click" location="cta" className="btn btn-outline">
            전화 상담 문의 ({CLINIC.telephoneDisplay})
          </TrackedLink>
        </div>
        <RelatedColumnLinks treatmentSlug="denture" />
      </div>
    </section>
  );
}

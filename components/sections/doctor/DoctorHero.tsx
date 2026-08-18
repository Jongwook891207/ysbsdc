import { CLINIC } from "@/lib/seo";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

/**
 * Renewed for the "대표원장 김종욱" WHO-focused editorial profile page —
 * H1 carries both halves of the intended impression at once (careful
 * treatment judgment + staying current), the badges above it establish
 * role + the three core treatment areas up front, and the hierarchy below
 * the H1 is deliberately 3 tiers: `.hero-desc` (the supporting explanation,
 * still clearly present) then `.hero-sub` (credential, smaller/muted —
 * backs the message, isn't the headline).
 *
 * The H1 and the first `.hero-desc` sentence each get a `br.mobile-only`
 * at their meaning-unit boundary — the same responsive-`<br>` utility
 * already used elsewhere on this site (≤768px only, see globals.css).
 * Above 768px those `<br>`s are `display:none`, so desktop/tablet keep
 * exactly the natural wrap they had before; only mobile gets the
 * guaranteed break, instead of leaving it to whatever the viewport width
 * happens to wrap at.
 */
export function DoctorHero() {
  return (
    <section className="hero">
      <div className="container hero-split">
        <div className="hero-visual" data-aos="fade-up">
          <ImageWithFallback
            src="/images/doctor1.jpg"
            alt="가운을 입고 미소 짓는 부천 오정구 원종동 고강동 연세백세치과의원 대표원장 김종욱"
            width={480}
            height={600}
            placeholderText="대표원장 김종욱 사진"
          />
        </div>
        <div className="hero-content" data-aos="fade-up" data-aos-delay={100}>
          <div className="hero-badges">
            <span className="badge-pill">연세백세치과 대표원장 · 치과보존과 전문의</span>
            <span className="hero-focus">임플란트 · 틀니 · 신경치료</span>
          </div>
          <h1>
            필요한 치료만 권하고,
            <br className="mobile-only" /> 더 나은 방법은 계속 배웁니다.
          </h1>
          <div className="hero-desc">
            <p>
              치료를 서두르기보다 한 번 더 확인합니다.
              <br className="mobile-only" /> 디지털 진단과 새로운 치료 기술도 환자분께 도움이 된다면
              적극적으로 받아들입니다.
            </p>
          </div>
          <div className="hero-sub">
            <p>연세대학교 · 원주세브란스병원 수련 · 치과보존과 전문의 · 임상 14년</p>
          </div>
          <div className="hero-cta">
            <a href={`tel:${CLINIC.telephoneDisplay}`} className="btn btn-navy">
              전화 문의하기 ({CLINIC.telephoneDisplay})
            </a>
            <a href="#judgment" className="btn btn-outline">
              김종욱 원장 더 알아보기 ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

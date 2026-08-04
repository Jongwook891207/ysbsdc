import { CLINIC } from "@/lib/seo";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

/** Ports doctor.html's `<section class="hero">` (split layout: photo + copy). */
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
          <span className="badge-pill">연세백세치과의원 | 대표원장 김종욱</span>
          <h1>
            치과를 헤매던 환자분들의
            <br />
            마지막 안심 종착지가 되겠습니다.
          </h1>
          <div className="hero-sub">
            <p>치아를 치료하기 전에, 환자분들의 의구심과 불안을 먼저 치료하는 것이 연세백세치과의 첫 번째 미션입니다.</p>
            <p>제 가족에게 권하지 않을 치료라면 환자분께도 절대로 말씀드리지 않습니다.</p>
            <p>
              3D CT와 구강 사진으로 현재 상태를 정직하게 보여드리고, 안심하고 고민하실 수 있는 &apos;마음의
              시간&apos;을 먼저 드리겠습니다.
            </p>
          </div>
          <div className="hero-cta">
            <a href={`tel:${CLINIC.telephoneDisplay}`} className="btn btn-navy">
              전화 문의하기 ({CLINIC.telephoneDisplay})
            </a>
            <a href="#chapter2" className="btn btn-outline">
              약력 및 전문성 보기 ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

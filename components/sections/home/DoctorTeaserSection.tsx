import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

/** Ports index.html's `<section class="doctor-teaser" id="doctor">`. */
export function DoctorTeaserSection() {
  return (
    <section className="doctor-teaser" id="doctor">
      <div className="container dt-grid">
        <div className="dt-photo" data-aos="fade-up">
          <ImageWithFallback
            src="/images/doctor1.jpg"
            alt="가운을 입고 미소 짓는 부천 오정구 원종동 고강동 연세백세치과의원 대표원장 김종욱"
            width={360}
            height={480}
            placeholderText="대표원장 김종욱 사진"
          />
        </div>
        <div data-aos="fade-up" data-aos-delay={100}>
          <span className="eyebrow" style={{ color: "var(--point-2)" }}>
            DOCTOR STORY
          </span>
          <h2>당신의 마지막 치과 종착지가 되겠습니다.</h2>
          <p>
            &quot;과장된 광고나 자극적인 문구로
            <br className="mobile-only" /> 오시는 치과가 아닙니다.
            <br />
            제 가족에게 권하지 않을 치료라면
            <br className="mobile-only" /> 환자분께도 권하지 않습니다.
            <br />
            첫 상담부터 치료 후 관리까지,
            <br className="mobile-only" /> 같은 의사가 계속 함께합니다.
            <br />
            <br />
            과잉진료 걱정 없이,
            <br />
            치과를 헤매던 환자분들이
            <br className="mobile-only" /> 안심하고 정착할 수 있도록
            <br />
            정직하게 진료할 것을 약속드립니다.
            <br />
            언제든 편안하게 들러 문의해 주세요.&quot;
            <br />
            <br />
            — 대표원장 김종욱
          </p>
          <ul className="dt-career">
            <li>연세대학교 치과대학 치의예과 및 치의학과 졸업</li>
            <li>연세대학교 원주세브란스병원 치과보존과 레지던트 수료</li>
            <li>대한치과보존학회 인증 치과보존과 인정의</li>
            <li>전) 국군의무사령부 국군고양병원 치과부장 (중령 보직)</li>
          </ul>
          <Link href="/doctor" className="btn btn-gold">
            대표원장 김종욱 소개 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}

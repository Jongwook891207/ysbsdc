import Link from "next/link";
import { CLINIC } from "@/lib/seo";

/** Ports index.html's `<section class="hero">` — desktop PC redesign + separate mobile-only content block. */
export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <span className="badge-pill" data-aos="fade-up">
          SINCE 2024 · 부천 원종동
        </span>
        <h1 data-aos="fade-up" data-aos-delay={80}>
          마음의 준비가
          <br className="mobile-only" /> 되실 때까지,
          <br />
          <span className="hero-accent">오늘은</span> 설명만
          <br className="mobile-only" /> 들으셔도
          <br className="mobile-only" /> 괜찮습니다.
        </h1>
        <div className="hero-sub" data-aos="fade-up" data-aos-delay={140}>
          <p>
            치과 치료 앞의 불안과 무게감을 잘 알기에,
            <br />
            당일 치료를 성급히 강요하지 않습니다.
            <br />
            3D CT와 고화질 사진으로 현재 상태를 솔직하게 보여드리고,
            <br />
            안심하고 고민하실 수 있는 <span className="highlight-pen">&apos;마음의 시간&apos;</span>을 먼저
            드리겠습니다.
          </p>
        </div>
        <div className="hero-cta" data-aos="fade-up" data-aos-delay={220}>
          <a href={`tel:${CLINIC.telephoneDisplay}`} className="btn btn-navy">
            간편한 진료 예약
          </a>
          <a href="#doctor" className="btn btn-outline">
            대표원장 진료 철학 보기
          </a>
        </div>

        {/* ===== 모바일 전용 Hero 콘텐츠 (PC에서는 숨김) ===== */}
        <div className="mobile-hero-only">
          <span className="mobile-since-badge">SINCE 2024 · 부천 원종동</span>
          <p className="mobile-hero-title">
            마음의 준비가
            <br />
            되실 때까지,
            <br />
            <span className="highlight-gold">오늘은</span> 설명만 들으셔도 괜찮습니다.
          </p>
          <p className="mobile-hero-sub">
            치과 치료 앞의 두려움과 부담감을 잘 알기에,
            <br />
            오늘 당장 결정하지 않으셔도 괜찮습니다.
            <br />
            안심하고 고민하실 수 있는
            <br />
            <span className="highlight-marker">&apos;마음의 시간&apos;</span>을 먼저 드리겠습니다.
          </p>
          <Link href="/mission" className="mobile-hero-cta">
            우리의 이야기 →
          </Link>
        </div>
      </div>
    </section>
  );
}

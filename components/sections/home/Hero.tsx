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
          <span className="hero-accent">오늘은</span> 결정하지
          <br className="mobile-only" /> 않으셔도
          <br className="mobile-only" /> 됩니다.
        </h1>
        <div className="hero-sub" data-aos="fade-up" data-aos-delay={140}>
          <p>
            지금 치료가 필요한 치아와,
            <br />
            조금 더 지켜봐도 되는 치아를 나누어 설명드리겠습니다.
            <br />
            3D CT와 사진으로 함께 확인한 뒤,
            <br />
            <span className="highlight-pen">치료 결정은 천천히</span> 하셔도 괜찮습니다.
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
            <span className="highlight-gold">오늘은</span> 결정하지 않으셔도 됩니다.
          </p>
          <p className="mobile-hero-sub">
            지금 치료가 필요한 치아와,
            <br />
            조금 더 지켜봐도 되는 치아를 나누어 설명드리겠습니다.
            <br />
            3D CT와 사진으로 함께 확인한 뒤,
            <br />
            <span className="highlight-marker">치료 결정은 천천히</span> 하셔도 괜찮습니다.
          </p>
          <Link href="/mission" className="mobile-hero-cta">
            우리의 이야기 →
          </Link>
        </div>
      </div>
    </section>
  );
}

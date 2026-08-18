import Link from "next/link";

/**
 * Formerly FooterCtaSection (navy band, tel + booking buttons). Renewal
 * brief explicitly asks for a quiet close, not a conversion push — the
 * doctor's own line (already used verbatim in the old Hero's hero-sub, not
 * newly invented here) plus his name, then two small secondary text links
 * instead of `.btn-navy`/`.btn-gold` buttons.
 */
export function ClosingSection() {
  return (
    <section className="doctor-closing-section" data-aos="fade-up">
      <div className="container">
        <p className="doctor-closing-text">
          치과의사로 오래 일할수록
          <br />
          치료 기술만큼 중요한 것이
          <br />
          어떤 치료를 선택할지 판단하는 일이라는 생각을 합니다.
        </p>
        <p className="doctor-closing-text">
          제 가족에게 권하지 않을 치료라면
          <br />
          환자분께도 권하지 않습니다.
        </p>
        <p className="doctor-closing-sign">
          연세백세치과 대표원장
          <br />
          김종욱
        </p>
        <div className="doctor-closing-links">
          <Link href="/treatment">진료 안내 보기 →</Link>
          <Link href="/column">원장 칼럼 보기 →</Link>
        </div>
      </div>
    </section>
  );
}

/**
 * The page's "killer section" — still the same 3 large centered
 * statements on the dark full-bleed band (unchanged per explicit
 * instruction), each now paired with one small supporting line so the
 * section isn't just three sentences floating in whitespace. Support
 * lines are visually a full step down (smaller, muted gold) so the big
 * statement stays the one thing a skimming reader remembers. Only the
 * quoted phrase-pairs inside each statement get the gold accent — never
 * the whole sentence, per the explicit "문장 전체를 gold로 만들지 않는다"
 * constraint.
 */
export function JudgmentPrinciplesSection() {
  return (
    <section className="judgment-section" id="judgment">
      <div className="container">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">14년 동안 진료하면서 생긴 기준</span>
        </div>
        <div className="judgment-list">
          <div className="judgment-item" data-aos="fade-up" data-aos-delay={0}>
            <span className="judgment-num">01</span>
            <p className="judgment-text">
              <span className="judgment-highlight">“할 수 있는 치료”</span>와{" "}
              <span className="judgment-highlight">“해야 하는 치료”</span>는 다릅니다.
            </p>
            <p className="judgment-support">가능하다는 이유만으로 치료를 권하지 않습니다.</p>
          </div>
          <div className="judgment-item" data-aos="fade-up" data-aos-delay={70}>
            <span className="judgment-num">02</span>
            <p className="judgment-text">
              <span className="judgment-highlight">“빨리 하는 치료”</span>와{" "}
              <span className="judgment-highlight">“좋은 시기에 하는 치료”</span>도 다릅니다.
            </p>
            <p className="judgment-support">치료 기간보다 치료하기 좋은 조건을 먼저 봅니다.</p>
          </div>
          <div className="judgment-item" data-aos="fade-up" data-aos-delay={140}>
            <span className="judgment-num">03</span>
            <p className="judgment-text">
              <span className="judgment-highlight">“치아를 살리는 것”</span>과{" "}
              <span className="judgment-highlight">“오래 쓸 수 있는 치료를 선택하는 것”</span>도 항상 같은
              뜻은 아닙니다.
            </p>
            <p className="judgment-support">보존 가능성뿐 아니라 치료 후 예후까지 함께 판단합니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

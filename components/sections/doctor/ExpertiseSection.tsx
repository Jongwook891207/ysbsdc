const NUMBERS = [
  { value: "34,000", unit: "명", label: "전국 치과의사 수" },
  { value: "~800", unit: "명", label: "치과보존과 전문의" },
  { value: "2.5", unit: "%", label: "전체 대비 비율" },
  { value: "4", unit: "년", label: "세브란스병원 전공의 수련" },
];

/** Ports doctor.html's `<section class="chapter-alt" id="chapter2">` (전문성과 소신). */
export function ExpertiseSection() {
  return (
    <section className="chapter-alt" id="chapter2">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <span className="eyebrow">WHY CONSERVATIVE DENTISTRY</span>
          <h2 className="section-title">치과보존과, 치아를 살리는 전문 분야</h2>
        </div>
        <div className="chapter-body" data-aos="fade-up" data-aos-delay={100}>
          <p>
            치과보존과는 많은 분들에게 생소한 전문과목입니다.
            <br />
            쉽게 말씀드리면 충치, 신경치료, 치아 균열 등 다양한 원인으로 손상된 치아를 최대한 살려내는 전문
            분야입니다.
          </p>
          <p>
            전국 치과의사 약 34,000명 중 치과보존과 전문의는 800명 남짓, 전체의 2.5%에 불과합니다.
            <br />
            저는 연세대학교 세브란스병원에서 4년간의 정식 전공의 수련 과정을 마친 치과보존과 전문의입니다.
          </p>
        </div>

        <div className="number-grid" data-aos="fade-up" data-aos-delay={150}>
          {NUMBERS.map((n) => (
            <div key={n.label} className="number-card">
              <div className="number-value">
                {n.value}
                <span>{n.unit}</span>
              </div>
              <div className="number-label">{n.label}</div>
            </div>
          ))}
        </div>

        <div className="highlight-box" data-aos="fade-up" data-aos-delay={200}>
          <p>
            왜 보존과를 선택했냐고 물어보시는 분들이 있습니다. 이유는 단순합니다. 자연치아는 한번 잃으면 절대
            되돌릴 수 없기 때문입니다.
          </p>
          <p>
            자연치아에는 <strong>치주인대</strong>라는 구조물이 있어 씹는 힘을 흡수하고, 세균 침입을 방어하며,
            뼈와 긴밀하게 소통합니다. 아무리 좋은 임플란트도 이 구조물이 없습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

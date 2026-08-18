interface ClinicMoment {
  num: string;
  verb: string;
  text: string;
}

/**
 * Reduced from 5 flat lines to 4 verb-led items ("봅니다 / 함께 봅니다 /
 * 나눕니다 / 기다립니다") so the verbs themselves create a visual rhythm
 * down the section, per the explicit renewal instruction. Content is the
 * same real, already-established consultation behavior (matches
 * DoctorHero's existing "3D CT와 구강 사진으로 정직하게 보여드리고" and
 * Brand Bible §8/§10) — not new claims.
 *
 * Deliberately still text-only (no image slot) — doctor1.jpg/doctor2.jpg
 * are already used in Hero/Profile; a future two-column image+list upgrade
 * would follow the same `.hero-split`/`.profile-grid` pattern.
 */
const MOMENTS: ClinicMoment[] = [
  { num: "01", verb: "봅니다", text: "CT, 방사선사진, 구강 사진 등을 통해 현재 상태를 먼저 확인합니다." },
  {
    num: "02",
    verb: "함께 봅니다",
    text: "제가 본 것을 환자분도 함께 볼 수 있도록 사진과 자료를 보여드리며 설명합니다.",
  },
  {
    num: "03",
    verb: "나눕니다",
    text: "지금 치료할 것, 지켜볼 수 있는 것, 선택할 수 있는 치료 방법을 구분해 설명합니다.",
  },
  {
    num: "04",
    verb: "기다립니다",
    text: "여러 방법이 있다면 각각의 장단점을 설명하고, 환자분이 충분히 이해한 뒤 결정할 수 있도록 합니다.",
  },
];

export function InClinicSection() {
  return (
    <section className="inclinic-section" id="inclinic">
      <div className="container">
        <div className="inclinic-layout">
          <div className="section-head" data-aos="fade-up">
            <div className="rule"></div>
            <span className="eyebrow">진료실에서의 김종욱</span>
          </div>
          <div className="inclinic-list">
            {MOMENTS.map((m, i) => (
              <div key={m.num} className="inclinic-item" data-aos="fade-up" data-aos-delay={i * 70}>
                <span className="inclinic-num">{m.num}</span>
                <span className="inclinic-verb">{m.verb}</span>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

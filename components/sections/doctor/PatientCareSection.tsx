interface CareItem {
  title: string;
  desc: string;
  delay?: number;
}

const CARE_ITEMS: CareItem[] = [
  {
    title: "아프지 않은 단계별 마취",
    desc: "치료할 때 아플까 봐 참거나 두려워하실 필요가 전혀 없습니다. 작은 기척도 세심하게 살피며, 충분히 쉬어가면서 안 아프게 치료해 드립니다.",
  },
  {
    title: "미리 길을 찾아두고 시작하는 맞춤 임플란트",
    desc: "임플란트 수술 전 컴퓨터 3D 화면으로 잇몸 속 뼈와 신경 위치를 미리 살펴보고 맞춤 길잡이 틀을 만듭니다. 잇몸을 크게 째지 않고 딱 필요한 자리에만 쏙 심기 때문에 수술 시간이 훨씬 짧아지고, 수술 후 붓거나 아픈 느낌이 대폭 줄어듭니다.",
    delay: 100,
  },
];

/** Ports doctor.html's `<section id="chapter3">` (환자 배려 노하우). */
export function PatientCareSection() {
  return (
    <section id="chapter3">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <span className="eyebrow">CHAPTER THREE — 환자 배려 노하우</span>
          <h2 className="section-title">
            환자의 마음까지 배려하는
            <br />
            안심 진료
          </h2>
        </div>
        <div className="care-grid">
          {CARE_ITEMS.map((item) => (
            <div key={item.title} className="care-card" data-aos="fade-up" data-aos-delay={item.delay}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

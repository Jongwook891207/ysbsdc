interface Principle {
  num: string;
  title: string;
  desc: string;
  delay?: number;
}

const PRINCIPLES: Principle[] = [
  {
    num: "01",
    title: "보여드리고 시작합니다",
    desc: '"눈으로 직접 보고 납득하기 전에는 기구를 들지 않습니다." DSLR 구강 사진과 3D CT 영상을 함께 확인한 후 치료를 시작합니다.',
  },
  {
    num: "02",
    title: "자연치아를 최우선으로 지킵니다",
    desc: '"이 치아는 치료하지 말고 좀 더 지켜보시죠." 당장의 치료보다, 지켜볼 치아와 치료할 치아를 정직하게 구분해 드립니다.',
    delay: 100,
  },
  {
    num: "03",
    title: "대표원장이 끝까지 책임집니다",
    desc: "담당의가 바뀌거나 도망가지 않는 1:1 책임 진료. 첫 상담부터 사후 관리까지 함께합니다.",
    delay: 200,
  },
];

/** Ports index.html's `<section class="figures" id="philosophy">` — 3대 안심 진료 원칙. */
export function CorePhilosophySection() {
  return (
    <section className="figures" id="philosophy">
      <div className="container">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">OUR PRINCIPLE</span>
          <h2 className="section-title">3대 안심 진료 원칙</h2>
          <p className="section-desc">
            치아를 치료하기 전에,
            <br className="mobile-only" /> 환자분의 의구심과 불안을
            <br className="mobile-only" /> 먼저 치료하기 위해 존재합니다.
          </p>
        </div>
        <div className="principle-grid">
          {PRINCIPLES.map((p) => (
            <div key={p.num} className="principle-card" data-aos="fade-up" data-aos-delay={p.delay}>
              <div className="principle-num">{p.num}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

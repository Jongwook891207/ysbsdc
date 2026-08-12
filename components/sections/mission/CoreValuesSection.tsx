interface Value {
  num: string;
  title: string;
  titleSub: string;
  quote: string;
  actions: string[];
  delay?: number;
}

const VALUES: Value[] = [
  {
    num: "CARD 01",
    title: "보여드리고 시작한다",
    titleSub: "(눈으로 확인시키는 정직함)",
    quote: '"우리는 환자가 눈으로 직접 보고 납득하기 전에는 치료를 시작하지 않는다."',
    actions: [
      "치료 전 DSLR 사진 촬영 및 동영상 시각화 자료 제시",
      "현재 상태와 치료계획을 완전히 이해하셨는지 확인 후 동의 절차 진행",
    ],
  },
  {
    num: "CARD 02",
    title: "신뢰를 끝까지 확인한다",
    titleSub: "(의구심을 남기지 않는 소통)",
    quote: '"우리는 치료 과정 중이나 끝난 후에도, 조금의 의구심이나 불편함을 남기지 않도록 끝까지 묻고 듣는다."',
    actions: [
      '진료 종료 시 \'의구심 제로\' 피드백 설문 진행 ("저희 미션은 불안을 치료하는 것입니다. 혹시 과잉진료로 느껴지신 부분이 있으셨나요?")',
      "수집된 환자 피드백을 신뢰를 증명하는 투명한 자산으로 축적",
    ],
    delay: 100,
  },
  {
    num: "CARD 03",
    title: "끝까지 책임진다",
    titleSub: "(도망가지 않는 약속)",
    quote: '"우리는 치료가 끝났다고 해서 책임을 끝내지 않는다. 환자가 안심할 수 있도록 끝까지 함께 해결한다."',
    actions: [
      "'끝까지 책임지는 안심 케어 제도' 운영 및 정기 검진 프로그램",
      "치료 후 문제 발생 시 즉각 대응을 약속하는 '책임 안내장' 제공",
    ],
    delay: 200,
  },
];

/** Ports mission.html's `<section class="values-section">` (연세백세치과의 3대 약속). */
export function CoreValuesSection() {
  return (
    <section className="values-section">
      <div className="container">
        <div className="promise-head">
          <div className="rule"></div>
          <span className="eyebrow">연세백세치과의 3대 약속</span>
          <h2>
            말뿐인 정직함이 아닌,
            <br className="desktop-only promise-head-break" />
            시스템으로 증명하는 진료
          </h2>
          <p className="promise-body promise-lead">
            <strong className="promise-emphasis">
              저희가 말하는 정직한 진료는 환자분이 직접 확인할 수 있어야 한다고 생각합니다.
            </strong>
          </p>
          <p className="promise-body promise-bridge">
            그래서 진료 전에는 충분히 보여드리고, 치료 과정에서는 궁금함이 남지 않도록 설명하며, 치료가 끝난
            뒤에도 책임을 다하는 세 가지 원칙을 세웠습니다.
          </p>
        </div>

        <div className="values-grid">
          {VALUES.map((v) => (
            <div key={v.num} className="value-card" data-aos="fade-up" data-aos-delay={v.delay}>
              <div>
                <div className="value-num">{v.num}</div>
                <h3>
                  {v.title}
                  <br />
                  {v.titleSub}
                </h3>
              </div>
              <div className="value-quote">
                <p>{v.quote}</p>
              </div>
              <ul className="value-actions">
                {v.actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

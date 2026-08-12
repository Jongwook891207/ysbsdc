/**
 * Ports mission.html's `<section class="story-section">` (Why We Exist / Doctor Story).
 * Single vertical flow, patient-first: heading (speaks to the patient, not
 * the clinic) → the 6 questions actually in a patient's head (2x3 editorial
 * card grid on desktop, one column on mobile) → a short turning-point line
 * → the doctor's own reflection. Read order is intentionally
 * patient's-thoughts → doctor's-thoughts, never the reverse.
 */
const PATIENT_QUESTIONS = [
  { no: "01", text: "필요 없는 치료까지 하라고 하면 어떡하지?" },
  { no: "02", text: "설명을 들어도 잘 모르겠는데, 그냥 믿어야 하나?" },
  { no: "03", text: "이 치아, 정말 지금 치료해야 하는 걸까?" },
  { no: "04", text: "다른 치과에 가면 또 다른 이야기를 듣는 건 아닐까?" },
  { no: "05", text: "치료를 시작했다가 비용이 계속 늘어나면 어떡하지?" },
  { no: "06", text: "이 치아, 정말 살릴 수 없는 걸까?" },
];

export function StorySection() {
  return (
    <section className="story-section">
      <div className="container">
        <div className="story-head" data-aos="fade-up">
          <div className="rule"></div>
          <span className="eyebrow">우리가 존재하는 이유</span>
          <h2>
            치과에 오기 전,
            <br className="desktop-only" />
            이런 생각을 해보신 적 있으신가요?
          </h2>
        </div>

        <div className="patient-questions">
          {PATIENT_QUESTIONS.map((q, i) => (
            <div
              key={q.no}
              className="patient-question-card"
              data-aos="fade-up"
              data-aos-delay={i % 2 === 1 ? 70 : undefined}
            >
              <span className="pq-number" aria-hidden="true">
                {q.no}
              </span>
              <p>{q.text}</p>
            </div>
          ))}
        </div>

        <div className="story-turning-point" data-aos="fade-up">
          <div className="rule center"></div>
          <p>저희는 이 질문들에서 출발했습니다.</p>
        </div>

        <div className="story-doctor-thought" data-aos="fade-up">
          <p>치과 의사로서 수많은 환자분을 만나며 깨달은 것이 있습니다.</p>
          <p>
            환자분들이 문을 열고 들어오실 때 느끼시는 가장 큰 감정은 &apos;치료의 통증&apos;에 대한
            두려움보다, <strong>&apos;과잉진료에 대한 의구심과 불안&apos;</strong>이었습니다.
          </p>
          <p>
            치아를 정확히 치료하는 기술도 중요하지만,{" "}
            <strong>환자분이 마음을 놓고 의지할 수 있는 신뢰를 만드는 것이 진료의 시작</strong>이라고
            믿습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

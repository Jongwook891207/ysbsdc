/**
 * Ports mission.html's `<section class="story-section">` (Why We Exist / Doctor Story).
 * Restructured into a 2-column layout on desktop (quote left, body right) and
 * two separate "anxiety" cards for the two patient-worry lines — content/
 * wording unchanged from the original single-column version, only the
 * grouping and visual weight changed. The desktop/mobile duplicate-avoidance
 * pattern (`.desktop-only-text` full explanation vs `.story-final`
 * simplified restatement) is preserved as-is, just moved into the right
 * column.
 */
export function StorySection() {
  return (
    <section className="story-section">
      <div className="container">
        <div className="story-head">
          <div className="rule"></div>
          <span className="eyebrow">우리가 존재하는 이유</span>
          <h2>
            치료 기술보다 먼저 필요했던 것은,
            <br className="desktop-only" />
            <span className="story-highlight">환자분의 두려움을 다독이는 일</span>이었습니다.
          </h2>
        </div>

        <div className="story-columns">
          <div className="story-col-quote" data-aos="fade-up">
            <p className="story-quote-text">
              <strong className="story-lead-emphasis">연세백세치과는 이 질문에서 출발했습니다.</strong>
            </p>
          </div>
          <div className="story-col-body">
            <p>
              치과 의사로서 수많은 환자분을 만나며 깨달은 것이 있습니다. 환자분들이 문을 열고 들어오실 때 느끼는
              가장 큰 감정은 &apos;치료의 통증&apos;에 대한 두려움보다{" "}
              <strong>&apos;과잉진료에 대한 의구심과 불안&apos;</strong>이라는 사실입니다.
            </p>
            <p className="desktop-only-text">
              치아를 정확히 깎아내고 메우는 기술도 중요하지만,{" "}
              <strong>환자분이 마음을 놓고 의지할 수 있는 신뢰를 만드는 것이 진료의 시작</strong>이어야 한다고
              믿습니다.
            </p>
            <p className="story-final">
              치아를 정확하게 깎아내고 메우는 기술도 중요하지만,
              <br />
              환자분이 마음을 놓고 의지할 수 있는 신뢰를 만드는 것이
              <br />
              진료의 시작이어야 한다고 믿습니다.
            </p>
          </div>
        </div>

        <div className="anxiety-cards">
          <div className="anxiety-card" data-aos="fade-up">
            <span className="anxiety-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <p>필요 없는 치료까지 하라고 하면 어쩌지?</p>
          </div>
          <div className="anxiety-card" data-aos="fade-up" data-aos-delay={80}>
            <span className="anxiety-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <p>설명을 들어도 잘 모르겠는데 그냥 믿어야 하나?</p>
          </div>
        </div>
      </div>
    </section>
  );
}

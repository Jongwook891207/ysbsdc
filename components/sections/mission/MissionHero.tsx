/** Ports mission.html's `<section class="mission-hero">` — desktop headline + separate mobile-only headline/scroll cue. */
export function MissionHero() {
  return (
    <section className="mission-hero">
      <div className="container">
        <span className="eyebrow">연세백세치과의 사명</span>
        <h1 className="desktop-only">
          우리는 치아를 치료하기 전에,
          <br />
          환자분의 <span className="highlight-gold">의구심과 불안을 먼저 치료하기 위해</span> 존재합니다.
        </h1>
        <p className="mission-hero-mobile-title">
          우리는 치아를 치료하기 전에,
          <br />
          환자분의 <span className="highlight-marker">의구심과 불안</span>을
          <br />
          <span className="highlight-marker">먼저 치료</span>하기 위해 존재합니다.
        </p>
      </div>
      <span className="mission-scroll-cue">
        <span className="mission-scroll-cue-label">SCROLL</span>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </section>
  );
}

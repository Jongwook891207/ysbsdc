/**
 * Ports mission.html's `<section class="mission-hero">`. A single <h1>
 * holds both the desktop and mobile wording (as two inner spans toggled by
 * CSS at the same 768px breakpoint the old desktop-only h1 / mobile-only
 * <p> pair used) — previously the desktop headline was a real <h1> that
 * got `display:none` on mobile and the visible mobile headline was a
 * plain <p>, which meant the page had zero H1 in the mobile accessibility
 * tree/DOM. Visual output at each breakpoint is unchanged; only the
 * underlying element semantics moved from h1-vs-p to h1-vs-span.
 */
export function MissionHero() {
  return (
    <section className="mission-hero">
      <div className="container">
        <span className="eyebrow">연세백세치과의 사명</span>
        <h1>
          <span className="mission-hero-title-desktop">
            우리는 치아를 치료하기 전에,
            <br />
            환자분의 <span className="highlight-gold">의구심과 불안을 먼저 치료하기 위해</span> 존재합니다.
          </span>
          <span className="mission-hero-title-mobile">
            우리는 치아를 치료하기 전에,
            <br />
            환자분의 <span className="highlight-marker">의구심과 불안</span>을
            <br />
            <span className="highlight-marker">먼저 치료</span>하기 위해 존재합니다.
          </span>
        </h1>
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

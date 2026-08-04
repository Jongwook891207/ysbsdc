/** Ports mission.html's `<section class="vision-section">`. Mobile-only grayscale photo background (vision-hallway.jpg) is pure CSS on the section's `::before`/`::after`. */
export function VisionSection() {
  return (
    <section className="vision-section" data-aos="fade-up">
      <div className="container">
        <div className="section-head center">
          <div className="rule center"></div>
          <span className="eyebrow">연세백세치과의 지향점</span>
        </div>
        <div className="vision-card">
          <p>
            과잉진료를 걱정하며 치과를 헤매는 환자분이
            <br />
            안심하고 안착하는 <strong>&apos;마지막 종착지&apos;</strong>가 됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}

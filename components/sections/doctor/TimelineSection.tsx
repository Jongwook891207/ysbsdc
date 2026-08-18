interface TimelineEntry {
  year: string;
  title: string;
  desc: string;
}

/**
 * Real chronology, not a resume list — every fact here is either already
 * in content/authors/kim-jongwook.mdx / ProfileSection's CAREER_GROUPS
 * (education, "국군고양병원 치과부장" military role) or was confirmed
 * directly by the user in-session (years, the post-military 지역 치과
 * period, the 2024-01-09 opening date). No invented workplaces, titles,
 * or personal-meaning claims beyond what's confirmed.
 */
const TIMELINE: TimelineEntry[] = [
  {
    year: "2008",
    title: "연세대학교 치과대학 입학",
    desc: "치의학의 기초를 배우며 치과의사로서의 첫걸음을 시작했습니다.",
  },
  {
    year: "2014",
    title: "원주세브란스병원 치과보존과 수련 시작",
    desc: "인턴과 레지던트 과정을 거치며 치아를 진단하고 치료하는 과정을 깊이 배웠습니다.",
  },
  {
    year: "2018",
    title: "수련 종료, 군의관 복무",
    desc: "국군고양병원 치과부장으로 복무하며, 다양한 군 장병들의 치과 진료를 담당했습니다.",
  },
  {
    year: "이후",
    title: "지역 치과 진료",
    desc: "다양한 환자분들을 만나 임플란트, 틀니, 신경치료를 비롯한 여러 진료로 실제 임상 경험을 쌓았습니다.",
  },
  {
    year: "2024.01.09",
    title: "연세백세치과의원 개원",
    desc: "부천 원종동에서, 제 이름을 걸고 진단부터 치료 이후까지 제가 세운 기준에 책임지는 진료를 시작했습니다.",
  },
];

export function TimelineSection() {
  return (
    <section className="doctor-timeline">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="rule"></div>
          <span className="eyebrow">지금의 김종욱이 되기까지</span>
        </div>
        <div className="timeline-list">
          {TIMELINE.map((entry, i) => (
            <div key={entry.year} className="timeline-item" data-aos="fade-up" data-aos-delay={i * 70}>
              <span className="timeline-year">{entry.year}</span>
              <span className="timeline-dot" aria-hidden="true"></span>
              <div className="timeline-body">
                <h3>{entry.title}</h3>
                <p>{entry.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

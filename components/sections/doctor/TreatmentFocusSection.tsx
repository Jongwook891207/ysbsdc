import Link from "next/link";

interface FocusItem {
  num: string;
  name: string;
  judgment: string;
  href: string;
}

/**
 * The three core treatment areas shown as equal, without explaining
 * technique/indications — that belongs to /treatment. Each card carries
 * one line on what he personally judges/is responsible for in that
 * treatment (still not a how-to), kept to equal length/weight across all
 * three so none reads as more "expert" than the others. hrefs point at
 * the real anchors in lib/treatmentAnchors.ts.
 */
const FOCUS_ITEMS: FocusItem[] = [
  {
    num: "01",
    name: "임플란트",
    judgment: "치아를 빼야 하는 상황부터 식립 시기와 전체 치료 흐름까지 함께 판단합니다.",
    href: "/treatment#implant",
  },
  {
    num: "02",
    name: "틀니",
    judgment: "남아 있는 치아, 잇몸 상태, 씹는 관계와 기존 틀니의 불편함을 함께 살핍니다.",
    href: "/treatment#denture",
  },
  {
    num: "03",
    name: "신경치료",
    judgment: "치아를 살릴 가능성과 치료 후 예후를 함께 판단하고, 언제 다른 선택이 필요한지도 함께 봅니다.",
    href: "/treatment#endodontics",
  },
];

export function TreatmentFocusSection() {
  return (
    <section className="treatment-focus-section" id="treatments">
      <div className="container">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">제가 주로 진료하는 분야</span>
        </div>
        <div className="treatment-focus-grid" data-aos="fade-up" data-aos-delay={100}>
          {FOCUS_ITEMS.map((item) => (
            <Link key={item.num} href={item.href} className="treatment-focus-card">
              <span className="treatment-focus-num">{item.num}</span>
              <h3>{item.name}</h3>
              <p className="treatment-focus-judgment">{item.judgment}</p>
              <span className="treatment-focus-link">자세히 보기 →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

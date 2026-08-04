import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

interface ColumnTeaser {
  src: string;
  alt: string;
  title: string;
  desc: string;
  delay?: number;
}

const COLUMN_TEASERS: ColumnTeaser[] = [
  {
    src: "/images/equipment.webp",
    alt: "과잉진료 걱정을 확인하는 방법을 소개하는 부천 오정구 원종동 고강동 원장 칼럼 대표 이미지",
    title: "과잉진료 걱정, 이렇게 확인하세요",
    desc: "치과마다 진단이 다르게 느껴지는 이유와, 정직한 진단을 확인하는 방법을 알려드립니다.",
  },
  {
    src: "/images/clinic-interior.webp",
    alt: "디지털 가이드 임플란트 수술을 설명하는 부천 오정구 원종동 고강동 원장 칼럼 대표 이미지",
    title: "디지털 가이드 임플란트란 무엇인가요?",
    desc: "수술 시간과 술후 불편감을 줄여주는 가이드 수술의 원리를 쉽게 설명해 드립니다.",
    delay: 80,
  },
  {
    src: "/images/doctor-kim.webp",
    alt: "틀니 덜그럭거림 해결법을 소개하는 부천 오정구 원종동 고강동 원장 칼럼 대표 이미지",
    title: "틀니가 자꾸 덜그럭거린다면",
    desc: "맞지 않는 틀니로 불편을 겪는 어르신들을 위한, 맞춤 틀니 점검 체크리스트입니다.",
    delay: 160,
  },
];

/**
 * Ports index.html's `<section id="column">` (Director's Column teaser).
 * The three column articles aren't implemented yet (stage 4), so the
 * "자세히 보기" links stay `href="#"` placeholders exactly like the source.
 */
export function ColumnTeaserSection() {
  return (
    <section id="column">
      <div className="container">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">DIRECTOR&apos;S COLUMN</span>
          <h2 className="section-title">원장님이 직접 전하는 안심 칼럼</h2>
        </div>
        <div className="column-grid">
          {COLUMN_TEASERS.map((c) => (
            <article key={c.title} className="column-card" data-aos="fade-up" data-aos-delay={c.delay}>
              <div className="column-thumb">
                <ImageWithFallback
                  src={c.src}
                  alt={c.alt}
                  width={400}
                  height={250}
                  placeholderText="칼럼 대표 이미지"
                />
              </div>
              <div className="column-body">
                <div className="column-date">DIRECTOR COLUMN</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <a href="#" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 13 }}>
                  자세히 보기 →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

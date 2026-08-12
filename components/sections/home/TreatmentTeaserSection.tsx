import Link from "next/link";
import { TreatmentTopCard } from "@/components/cards/TreatmentTopCard";

interface TopTreatment {
  href: string;
  badge: string;
  icon: string;
  title: string;
  desc: string;
  delay?: number;
}

const TOP_TREATMENTS: TopTreatment[] = [
  {
    href: "/treatment#implant",
    badge: "TOP 01",
    icon: "fa-solid fa-bullseye",
    title: "디지털 가이드 임플란트",
    desc: "3D 디지털 가이드로 환자분의 상태를 확인하고 계획하는 임플란트",
  },
  {
    href: "/treatment#denture",
    badge: "TOP 02",
    icon: "fa-solid fa-teeth",
    title: "1:1 맞춤 틀니 & IARPD",
    desc: "덜컥거림과 잇몸 통증을 최소화한 정밀 맞춤 보철",
    delay: 80,
  },
  {
    href: "/treatment#endodontics",
    badge: "TOP 03",
    icon: "fa-solid fa-syringe",
    title: "미세 신경치료 & 보존치료",
    desc: "치과보존과 전문의의 자연치아 살리기 노하우",
    delay: 160,
  },
];

interface BasicTreatment {
  icon: string;
  title: string;
  delay?: number;
}

const BASIC_TREATMENTS: BasicTreatment[] = [
  { icon: "fa-solid fa-tooth", title: "최소 삭제 충치 치료" },
  { icon: "fa-solid fa-crown", title: "크라운 · 브릿지", delay: 60 },
  { icon: "fa-solid fa-crosshairs", title: "고난도 사랑니 발치", delay: 120 },
  { icon: "fa-solid fa-hand-holding-medical", title: "잇몸치료 & 뼈이식", delay: 180 },
];

/** Ports index.html's `<section id="treatment">` teaser (top 3 + basic 4). */
export function TreatmentTeaserSection() {
  return (
    <section id="treatment">
      <div className="container">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">TREATMENT MENU</span>
          <h2 className="section-title">어떤 치료가 필요하신가요?</h2>
        </div>
        <div className="treat-top3">
          {TOP_TREATMENTS.map((t) => (
            <TreatmentTopCard key={t.href} {...t} />
          ))}
        </div>
        <div className="treat-basic">
          {BASIC_TREATMENTS.map((t) => (
            <Link
              key={t.title}
              href="/treatment"
              className="treat-card"
              data-aos="fade-up"
              data-aos-delay={t.delay}
            >
              <div className="treat-icon-box">
                <i className={t.icon}></i>
              </div>
              <h3>{t.title}</h3>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <Link href="/treatment" className="btn btn-outline">
            전체 진료 안내 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}

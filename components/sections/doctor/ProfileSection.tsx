import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

const CAREER_GROUPS = [
  {
    title: "학력 및 자격",
    items: [
      "연세대학교 치과대학 치의예과 및 치의학과 졸업",
      "연세대학교 원주세브란스병원 치과보존과 인턴 및 레지던트 수료",
      "보건복지부 인증 치과보존과 전문의",
      "대한치과보존학회 인증 인정의",
    ],
  },
  {
    title: "주요 경력",
    items: ["전) 국군의무사령부 국군고양병원 치과부장 (중령 보직)", "현) 연세백세치과의원 대표원장"],
  },
  {
    title: "학회 및 연구 활동",
    items: [
      "대한치과보존학회 평생회원",
      "대한치과근관치료학회 정회원",
      "대한심미치과학회 정회원",
      "대한통합치과학회 정회원",
    ],
  },
  {
    title: "임상 성과",
    items: ["2,000건 이상 미세 신경치료 및 자연치아 보존 케이스", "100건 이상 어르신 맞춤 틀니 및 IARPD 성공 증례"],
  },
];

/**
 * Ports doctor.html's `<section class="chapter-alt" id="profile">`
 * (Doctor Profile & Full History). Now that TimelineSection carries the
 * chronology as narrative, this section is de-emphasized on purpose —
 * `.profile-highlights` gives the 4 headline credentials a quick objective
 * summary, and `.doctor-page .profile-*` CSS shrinks the typographic scale
 * (see globals.css) — but no career data is removed; the full
 * CAREER_GROUPS list stays intact, just visually quieter.
 */
const PROFILE_HIGHLIGHTS = ["연세대학교", "원주세브란스병원 수련", "치과보존과 전문의", "임상 14년"];

export function ProfileSection() {
  return (
    <section className="chapter-alt" id="profile">
      <div className="container">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">DOCTOR PROFILE</span>
          <h2 className="section-title">대표원장 김종욱 약력</h2>
        </div>
        <div className="profile-grid">
          <div data-aos="fade-up">
            <div className="profile-photo">
              <ImageWithFallback
                src="/images/doctor2.jpg"
                alt="진료실에서 팔짱을 끼고 서 있는 부천 오정구 원종동 고강동 대표원장 김종욱 프로필 사진"
                width={360}
                height={480}
                placeholderText="대표원장 김종욱 사진"
              />
            </div>
            <div className="profile-name">
              <div className="role">대표원장 · 치과보존과 전문의</div>
              <h2>김종욱</h2>
            </div>
          </div>
          <div className="career-groups" data-aos="fade-up" data-aos-delay={100}>
            <ul className="profile-highlights">
              {PROFILE_HIGHLIGHTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {CAREER_GROUPS.map((group) => (
              <div key={group.title} className="career-group">
                <h3>{group.title}</h3>
                <ul className="career-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <Link href="/doctor/kim-jongwook" className="profile-detail-link">
              김종욱 대표원장의 학력·경력·전문분야 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

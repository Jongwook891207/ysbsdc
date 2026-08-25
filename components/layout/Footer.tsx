import Link from "next/link";
import { CLINIC } from "@/lib/seo";

/**
 * Ports the shared `<footer>` from index.html / doctor.html / treatment.html
 * / mission.html. Stage 4-6 adds one "바로가기" block with a link to
 * /column — the original static footer had no column link at all (the
 * column feature didn't exist yet); `.footer-grid` is already a wrapping
 * flexbox (`display:flex; flex-wrap:wrap`), so a 4th item needs no CSS
 * changes to fit.
 */
export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-notice">
          <strong>과잉진료 안심 케어 책임 안내</strong>
          연세백세치과의원은 치료 전 DSLR 사진과 3D CT 영상을 통해 환자분과 함께 상태를 확인하며, 당장
          치료가 필요한 부분과 지켜볼 수 있는 부분을 정직하게 안내해 드립니다. 치료 후에도 담당의가 바뀌지
          않는 1:1 책임 진료로 문제 발생 시 끝까지 함께 해결해 드립니다.
        </div>
        <div className="footer-grid">
          <div>
            <div className="fname">{CLINIC.name}</div>
            {CLINIC.addressFull}
            <br />
            대표원장 {CLINIC.founder} (치과보존과 전문의)
            <br />
            전화 {CLINIC.telephoneDisplay}
          </div>
          <div>
            <div className="fname">진료시간</div>
            {CLINIC.hours.weekday}
            <br />
            {CLINIC.hours.saturday}
            <br />
            {CLINIC.hours.closed}
          </div>
          <div>
            <div className="fname">오시는 길</div>
            {CLINIC.directions}
            <br />
            {CLINIC.parking}
          </div>
          <div>
            <div className="fname">바로가기</div>
            <Link href="/column" className="footer-link">
              원장 칼럼 보기
            </Link>
            <br />
            <Link href="/price" className="footer-link">
              비급여 진료비 안내
            </Link>
          </div>
        </div>
        <div className="footer-copy">© 2026 {CLINIC.name}. All rights reserved.</div>
      </div>
    </footer>
  );
}

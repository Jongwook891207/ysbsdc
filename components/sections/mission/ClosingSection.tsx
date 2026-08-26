import Link from "next/link";

/** Ports mission.html's `<section class="closing-section">`. */
export function ClosingSection() {
  return (
    <section className="closing-section">
      <div className="container closing-inner">
        <span className="closing-badge closing-badge-desktop">OUR LAST PROMISE</span>
        <span className="closing-badge closing-badge-mobile">우리의 마지막 약속</span>
        <h2>
          환자분의 고민과 헤맴이 끝나는 곳,
          <br />
          연세백세치과입니다.
        </h2>
        <div className="closing-body" data-aos="fade-up">
          <p>치과 문을 열기까지 오래 망설이셨을 그 마음을 잘 알고 있습니다.</p>
          <p>
            더 이상 과잉진료를 걱정하며 여러 치과를 헤매지 않으시도록,
            <br className="desktop-only closing-break" />
            연세백세치과가 환자분의 <strong>마지막 종착지</strong>가 되어 드리겠습니다.
          </p>
          <p>
            오늘 결정하지 않으셔도 됩니다.
            <br className="desktop-only closing-break" />
            첫 상담은 설명을 듣는 자리로 삼으셔도 괜찮습니다.
          </p>
          <p className="closing-sign">연세백세치과 김종욱 원장</p>
        </div>
        <Link href="/#location" className="btn btn-outline closing-cta">
          진료 예약 / 오시는 길 안내 →
        </Link>
      </div>
    </section>
  );
}

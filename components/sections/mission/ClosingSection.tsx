import Link from "next/link";

/** Ports mission.html's `<section class="closing-section">`. */
export function ClosingSection() {
  return (
    <section className="closing-section" data-aos="fade-up">
      <div className="container closing-inner">
        <span className="closing-badge closing-badge-desktop">OUR LAST PROMISE</span>
        <span className="closing-badge closing-badge-mobile">우리의 마지막 약속</span>
        <h2>
          환자분의 고민과 헤맴이 끝나는 곳,
          <br />
          연세백세치과입니다.
        </h2>
        <div className="closing-body">
          <p>치과 문을 열기까지 오래 망설이셨을 그 마음을 잘 알고 있습니다.</p>
          <p>
            더 이상 과잉진료를 걱정하며 여러 치과를 헤매지 않으시도록,
            <br className="desktop-only closing-break" />
            연세백세치과가 환자분의 <strong>마지막 종착지</strong>가 되어 드리겠습니다.
          </p>
          <p>
            마음의 준비가 되셨을 때, 편안하게 방문해 주세요.
            <br className="desktop-only closing-break" />
            진심을 담아, 따뜻하게 맞이하겠습니다.
          </p>
        </div>
        <p className="closing-sign">연세백세치과 의료진 일동</p>
        <Link href="/#location" className="btn btn-gold">
          진료 예약 / 오시는 길 안내 →
        </Link>
      </div>
    </section>
  );
}

import { CLINIC } from "@/lib/seo";

const SEO_TAGS = [
  "#부천원종동치과",
  "#고강동임플란트",
  "#부천어르신틀니",
  "#원종역신경치료전문의",
  "#부천과잉진료없는치과",
];

/** Ports index.html's `<section class="location" id="location">`. */
export function LocationSection() {
  return (
    <section className="location" id="location">
      <div className="container loc-grid">
        <div data-aos="fade-up">
          <span className="eyebrow">LOCATION</span>
          <h2 className="section-title">오시는 길 및 진료시간</h2>
          <table className="info-table">
            <tbody>
              <tr>
                <th>주소</th>
                <td>{CLINIC.addressFull} 연세백세치과의원</td>
              </tr>
              <tr>
                <th>전화</th>
                <td>
                  <a href={`tel:${CLINIC.telephoneDisplay}`}>{CLINIC.telephoneDisplay}</a>
                </td>
              </tr>
              <tr>
                <th>주차</th>
                <td>건물 내 무료 주차 가능 (편안한 자차 방문 권장)</td>
              </tr>
              <tr>
                <th>대중교통</th>
                <td>서해선 원종역 하차 후 도보 약 15분</td>
              </tr>
              <tr>
                <th>진료시간</th>
                <td>평일 09:00~18:00 (화 야간 18:00~20:00) · 토 09:00~13:00</td>
              </tr>
              <tr>
                <th>점심시간</th>
                <td>12:30~14:00 · 일·공휴일 휴진</td>
              </tr>
            </tbody>
          </table>
          <a href={`tel:${CLINIC.telephoneDisplay}`} className="btn btn-navy">
            📞 전화 문의하기
          </a>
          <div className="seo-tags">
            {SEO_TAGS.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <a
          href={CLINIC.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="loc-map"
          data-aos="fade-up"
          data-aos-delay={100}
        >
          <span className="loc-map-pin">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
            </svg>
          </span>
          <span className="loc-map-name">{CLINIC.name}</span>
          <span className="loc-map-addr">{CLINIC.addressFull}</span>
          <span className="loc-map-btn">네이버지도에서 크게 보기 →</span>
        </a>
      </div>
    </section>
  );
}

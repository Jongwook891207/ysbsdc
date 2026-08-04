import { CLINIC } from "@/lib/seo";

/** Ports doctor.html's `<section class="footer-cta">`. */
export function FooterCtaSection() {
  return (
    <section className="footer-cta" data-aos="fade-up">
      <div className="container">
        <p>
          치아 고민이 있으시다면 언제든 편안한 마음으로 찾아주세요.
          <br />
          진심을 다해 듣겠습니다.
        </p>
        <div className="btn-row">
          <a href={`tel:${CLINIC.telephoneDisplay}`} className="btn btn-gold">
            전화 문의하기 ({CLINIC.telephoneDisplay})
          </a>
          <a href={CLINIC.bookingUrl} target="_self" className="btn btn-outline-light">
            네이버 안심 예약
          </a>
        </div>
      </div>
    </section>
  );
}

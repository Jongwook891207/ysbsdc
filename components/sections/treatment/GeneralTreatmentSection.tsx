import { TreatmentCardGrid } from "./TreatmentCardGrid";
import { RelatedColumnLinks } from "./RelatedColumnLinks";
import { TREATMENTS } from "./treatments.data";

/** Ports treatment.html's `<section id="general">` (일반 진료, `#treatGrid`). */
export function GeneralTreatmentSection() {
  return (
    <section id="general">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">GENERAL TREATMENT</span>
          <h2 className="section-title">일반 진료 안내</h2>
        </div>
        <TreatmentCardGrid treatments={TREATMENTS} />
        <RelatedColumnLinks treatmentSlug="general" />
      </div>
    </section>
  );
}

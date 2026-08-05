/**
 * Single source of truth mapping a column's `relatedTreatmentSlugs` entries
 * to real anchors on `/treatment` (verified against the actual `id="..."`
 * attributes in components/sections/treatment/*Section.tsx — stage 3-3).
 * Deliberately separate from treatments.data.ts's much larger `TREATMENTS`
 * array (that backs the treatment page's card grid/modal content; this is
 * just the 4 stable section anchors a column can link into).
 */
export interface TreatmentAnchor {
  label: string;
  href: string;
}

export const TREATMENT_ANCHORS: Record<string, TreatmentAnchor> = {
  implant: { label: "임플란트", href: "/treatment#implant" },
  denture: { label: "틀니", href: "/treatment#denture" },
  endodontics: { label: "신경치료", href: "/treatment#endodontics" },
  general: { label: "일반 진료", href: "/treatment#general" },
};

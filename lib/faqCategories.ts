import { FAQ_CATEGORY_SLUGS } from "./content/schemas";

/**
 * Patient-facing FAQ category labels (Phase 3 design doc §E) — deliberately
 * more granular than the column taxonomy's "일반진료" for UI purposes only.
 * `treatmentSlug` still routes through the same 4 stable anchors in
 * lib/treatmentAnchors.ts (unchanged) — e.g. caries/gum-checkup/
 * prosthodontics/wisdom-tooth all map back to "general". `treatmentSlug` is
 * `null` for the two non-clinical categories (philosophy/clinic-info),
 * which have no treatment to link to by design.
 */
export interface FaqCategoryDef {
  slug: (typeof FAQ_CATEGORY_SLUGS)[number];
  label: string;
  description: string;
  treatmentSlug: string | null;
}

export const FAQ_CATEGORIES: FaqCategoryDef[] = [
  {
    slug: "implant",
    label: "임플란트",
    description: "수술 조건, 회복, 관리에 대해 자주 받는 질문입니다.",
    treatmentSlug: "implant",
  },
  {
    slug: "denture",
    label: "틀니",
    description: "완전틀니·부분틀니, IARPD, 관리에 대해 자주 받는 질문입니다.",
    treatmentSlug: "denture",
  },
  {
    slug: "endodontics",
    label: "신경치료",
    description: "통증, 크라운 시기, 재신경치료에 대해 자주 받는 질문입니다.",
    treatmentSlug: "endodontics",
  },
  {
    slug: "caries",
    label: "충치·치아보존",
    description: "충치와 치아 균열(크랙) 진단·치료에 대해 자주 받는 질문입니다.",
    treatmentSlug: "general",
  },
  {
    slug: "gum-checkup",
    label: "잇몸·정기검진",
    description: "잇몸 건강과 정기검진에 대해 자주 받는 질문입니다.",
    treatmentSlug: "general",
  },
  {
    slug: "prosthodontics",
    label: "보철·기타진료",
    description: "크라운·인레이 등 보철 치료에 대해 자주 받는 질문입니다.",
    treatmentSlug: "general",
  },
  {
    slug: "wisdom-tooth",
    label: "사랑니·발치",
    description: "사랑니 발치 여부와 과정에 대해 자주 받는 질문입니다.",
    treatmentSlug: "general",
  },
  {
    slug: "philosophy",
    label: "진료철학",
    description: "연세백세치과가 진료를 판단하는 기준에 대한 질문입니다.",
    treatmentSlug: null,
  },
  {
    slug: "clinic-info",
    label: "병원이용안내",
    description: "예약, 진료시간 등 병원 이용에 대한 실용 정보입니다.",
    treatmentSlug: null,
  },
];

export function getFaqCategoryDef(slug: string): FaqCategoryDef | null {
  return FAQ_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/**
 * Non-covered ("비급여") price list — source of truth is
 * "연세백세치과_웹공개용_비급여수가표_정제안_v2.xlsx" (사용자 제공, Phase C).
 * Every name/condition/price below is transcribed verbatim from that
 * spreadsheet's "웹 공개용 수가표" sheet — nothing estimated, nothing
 * pulled from another clinic. Do not add, remove, or reword a row without
 * going back to that spreadsheet first (see its own "정제 기준" sheet for
 * why certain items were already excluded — e.g. lateral-window sinus
 * lift, which this clinic doesn't perform).
 *
 * `price: null` means the spreadsheet itself left the price blank (only
 * "자가 미백"). Per the user's naming-cleanup pass, a price-less row is not
 * shown on the public price table at all ("가격 없는 진료를 굳이 가격표에
 * 넣을 필요는 없다") — but the row itself stays in this file (`unpublished:
 * true`, not deleted) so it's ready the moment a real price is confirmed.
 */
export interface PriceItem {
  name: string;
  condition: string | null;
  price: number | null;
  note?: string;
  /** True only for "자가 미백" — real price not yet confirmed, so it's excluded from the rendered table without deleting the row. */
  unpublished?: boolean;
}

export interface PriceCategory {
  slug: string;
  label: string;
  /** Section-level link only — never per-row (Phase C brief §8). Omitted where no real anchor/category exists. */
  relatedTreatmentAnchor?: "implant" | "denture" | "general";
  relatedFaqCategory?: string;
  /** One short line under the category heading, shown once instead of repeating the same note on every row (e.g. 임플란트's "제품별로 가격이 다릅니다"). */
  categoryNote?: string;
  items: PriceItem[];
}

export const PRICE_CATEGORIES: PriceCategory[] = [
  {
    slug: "implant",
    label: "임플란트",
    relatedTreatmentAnchor: "implant",
    relatedFaqCategory: "implant",
    // 사용자 지시(Phase C 명칭 정리): "제품별 가격을 구분하여 안내합니다."를
    // 세 행마다 반복하지 않고, 이 카테고리 헤더 아래 한 번만 표시한다.
    categoryNote: "임플란트는 사용 제품에 따라 비용이 다릅니다. 아래에 제품별 비용을 구분해 안내합니다.",
    items: [
      { name: "포인트 임플란트 일반(SA)", condition: "1개", price: 650000 },
      { name: "포인트 임플란트 UV", condition: "1개", price: 750000 },
      // 사용자 지시: 이 세 행은 절대 하나의 가격 범위(예: 65~90만원)로 합치지 않는다.
      { name: "오스템 임플란트(BA)", condition: "1개", price: 900000 },
      { name: "간단 골이식", condition: "부위당", price: 300000 },
      { name: "상악동 거상술", condition: "치조정 접근, 부위당", price: 400000 },
      { name: "임시틀니", condition: "악당", price: 200000 },
      // "Flipper"(치기공 업계 용어)를 환자 언어로 교체 — 가격은 원본과 동일.
      { name: "임시 부분틀니(앞니 6개까지)", condition: null, price: 150000 },
      { name: "소형 임시 부분틀니", condition: null, price: 100000 },
      { name: "타치과 임플란트 어버트먼트 및 크라운 재제작", condition: "치아당", price: 600000 },
    ],
  },
  {
    slug: "caries",
    label: "충치·보존",
    relatedTreatmentAnchor: "general",
    relatedFaqCategory: "caries",
    items: [
      { name: "레진", condition: "치경부", price: 70000 },
      { name: "레진", condition: "전치부 단순", price: 50000 },
      { name: "레진", condition: "전치부 인접면(Proximal)", price: 100000 },
      { name: "레진", condition: "전치부 치간공간(Diastema), 1면", price: 150000 },
      { name: "레진", condition: "소구치·대구치 1~2면", price: 100000 },
      { name: "레진", condition: "협면 소와·임플란트 홀 충전·인접면 초기 충치", price: 50000 },
      { name: "골드 인레이", condition: "1~2면", price: 500000 },
      { name: "하이브리드 인레이", condition: "1~2면", price: 250000 },
      { name: "레진 코어", condition: "치아당", price: 50000 },
      { name: "포스트 + 코어", condition: "치아당", price: 100000 },
      { name: "임시치아", condition: "치아당", price: 100000 },
    ],
  },
  {
    slug: "pediatric",
    label: "소아·예방",
    items: [
      { name: "유치 레진", condition: "구치부", price: 100000, note: "치아 상태와 치료 범위에 따라 달라질 수 있습니다." },
      { name: "유치 기성금속관(SS Crown)", condition: "치아당", price: 200000 },
      { name: "공간유지장치", condition: "장치당", price: 250000 },
      { name: "실란트", condition: "비보험, 치아당", price: 30000 },
      { name: "불소도포", condition: "바니쉬", price: 30000 },
    ],
  },
  {
    slug: "prosthodontics",
    label: "보철",
    relatedTreatmentAnchor: "general",
    relatedFaqCategory: "prosthodontics",
    items: [
      { name: "골드 크라운", condition: null, price: 750000 },
      { name: "지르코니아 크라운", condition: "심미 전치부", price: 600000 },
      { name: "지르코니아 크라운", condition: "심미 무관 전치·구치부", price: 450000 },
      { name: "PFM 크라운", condition: "치아당", price: 350000 },
      { name: "메탈 크라운", condition: "치아당", price: 300000 },
      { name: "라미네이트", condition: "치아당", price: 650000 },
    ],
  },
  {
    slug: "denture",
    label: "틀니",
    relatedTreatmentAnchor: "denture",
    relatedFaqCategory: "denture",
    items: [
      { name: "전체틀니", condition: "악당", price: 1500000 },
      { name: "부분틀니", condition: "악당", price: 1300000 },
      // "Over denture"를 한글 환자 언어로 교체 — 가격은 원본과 동일.
      // 확인 필요 항목 해소: 이 1,500,000원은 임플란트 식립 비용을 포함하지 않는다는
      // 확인을 받아 note로 명시했다(사용자 지시, 2026-08-25).
      { name: "임플란트 오버덴처", condition: "악당", price: 1500000, note: "임플란트 식립 비용 별도" },
      { name: "오버덴처 로케이터", condition: "개당", price: 250000 },
    ],
  },
  {
    slug: "etc",
    label: "기타",
    items: [
      { name: "스플린트", condition: "악당", price: 500000 },
      { name: "자가 미백", condition: "미백 tray + 미백제", price: null, note: "상담 후 안내", unpublished: true },
      { name: "비급여 스케일링", condition: "전악", price: 60000 },
    ],
  },
  {
    slug: "certificate",
    label: "제증명",
    items: [
      { name: "치료확인서", condition: null, price: 5000 },
      { name: "일반진단서", condition: null, price: 20000 },
      { name: "상해진단서", condition: "3주 미만", price: 100000 },
      { name: "상해진단서", condition: "3주 이상", price: 150000 },
    ],
  },
];

/** Same note as the spreadsheet's row 2 — reused verbatim as this page's top-level disclaimer. */
export const PRICE_TOP_NOTE =
  "임플란트는 제품별 수가를 구분해 공개합니다. 실제 치료비는 필요한 추가 치료(예: 골이식) 및 치료 범위에 따라 달라질 수 있으며, 진료 전 치료계획과 함께 안내드립니다.";

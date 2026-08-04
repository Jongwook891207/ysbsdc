import type { FaqItem } from "./jsonld";

/**
 * Single source for the homepage FAQ content — shared by
 * components/sections/home/FaqSection.tsx (renders it) and app/page.tsx
 * (feeds it to buildFaqJsonLd() for the FAQPage entity), so the visible
 * Q&A and the structured data can never drift apart.
 */
export const HOME_FAQ_ITEMS: FaqItem[] = [
  {
    question: "다른 치과에서 이를 뽑아야 한다는데, 당일 바로 시술을 시작해야 하나요?",
    answer:
      "절대 강요하지 않습니다. 3D CT 입체 화면으로 상태를 정밀하게 확인시켜 드린 후, 환자분이 충분히 고민하고 마음의 준비가 되셨을 때 치료를 시작합니다.",
  },
  {
    question: "치과 치료받을 때 통증이나 아픔이 너무 무서운데, 안 아프게 치료받을 수 있나요?",
    answer:
      "시술 중 아프시면 언제든 말씀하세요. 체어 타임이 길어지더라도 즉시 멈추고 단계별 무통 마취를 충분히 더 진행한 뒤 휴식을 드립니다.",
  },
  {
    question: "디지털 네비게이션(가이드) 임플란트는 추가 비용이 많이 드나요?",
    answer:
      "아닙니다. 타 병원에서 30만 원 상당 받기도 하는 디지털 가이드 제작비를 연세백세치과에서는 대표원장이 직접 디자인하여 무료로 해드립니다.",
  },
  {
    question: "안 해도 될 과잉진료를 받게 될까 봐 걱정되는데, 어떻게 믿을 수 있나요?",
    answer:
      "말로만 설명하지 않고 DSLR 구강 사진과 CT 영상을 대형 모니터로 함께 확인합니다. 당장 치료할 치아와 경과를 지켜볼 치아를 정직하게 구분해 드립니다.",
  },
  {
    question: "어르신 틀니를 만들면 자꾸 덜커덕거리고 잇몸이 아프지 않을까 걱정입니다.",
    answer:
      "개원 후 100개가 넘는 틀니 케이스를 진행한 노하우로 잇몸 구조를 세심하게 측정하여, 잇몸 통증과 흔들림을 최소화한 1:1 맞춤 틀니를 제작합니다.",
  },
];

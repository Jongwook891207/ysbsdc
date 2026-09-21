import { SITE_URL } from "@/lib/seo";
import { columnSource } from "@/lib/content/sources/columns";
import { getIndexableCategories } from "@/lib/taxonomy";
import { FAQ_CATEGORIES } from "@/lib/faqCategories";

/**
 * /llms.txt — AI 시스템을 위한 큐레이션된 사이트 색인 (llms.txt 제안 규약의
 * 최소 형태: H1 사이트명 + 인용구 요약 + 섹션별 링크 목록).
 *
 * sitemap.xml의 복제가 아니다: sitemap은 크롤 가능한 전체 URL(37+)을
 * 나열하지만, 이 파일은 "무엇부터 읽어야 하는가"만 답한다 — 대표 허브
 * 페이지와 카테고리 허브만 싣고 개별 칼럼 20여 편은 나열하지 않는다
 * (칼럼은 카테고리 허브가 대신 안내한다).
 *
 * 정적 파일 대신 route handler인 이유: 칼럼 카테고리 허브 목록을
 * sitemap.ts와 동일한 소스(getIndexableCategories — noindex 문턱 미달
 * 카테고리 자동 제외)에서 뽑아, 콘텐츠가 늘어도 이 파일이 낡지 않게
 * 하기 위해서다. 설명 문구는 각 페이지의 기존 metadata description
 * 범위를 벗어나는 새 주장을 만들지 않는다. 비표준 확장 문법 없음.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const published = columnSource.getPublished();
  const columnCategories = getIndexableCategories(published)
    .map(({ category }) => `- [${category} 칼럼](${SITE_URL}/column/category/${encodeURIComponent(category)})`)
    .join("\n");

  const faqCategories = FAQ_CATEGORIES.map(
    ({ slug, label, description }) => `- [${label} 자주 묻는 질문](${SITE_URL}/faq/${slug}): ${description}`,
  ).join("\n");

  const body = `# 연세백세치과의원

> 경기도 부천시 오정구(원종동) 성지로 101 3층의 치과의원. 치과보존과 전문의 김종욱 대표원장이 임플란트·틀니·신경치료를 진료하며, 치료 전 3D CT와 구강 사진으로 상태를 함께 확인하고 필요한 치료부터 판단하는 진료 방식을 따릅니다.

## 병원 소개

- [홈페이지](${SITE_URL}/): 병원 소개, 핵심 진료, 오시는 길과 진료시간
- [백세미션](${SITE_URL}/mission): 연세백세치과의 미션과 진료 철학
- [대표원장 김종욱](${SITE_URL}/doctor): 치과보존과 전문의 김종욱 대표원장의 진료 철학과 이력
- [김종욱 원장 프로필](${SITE_URL}/doctor/kim-jongwook): 학력·경력·진료 분야

## 진료 안내

- [전체 진료 안내](${SITE_URL}/treatment): 임플란트·틀니·신경치료 등 12개 진료 과목
- [디지털 가이드 임플란트](${SITE_URL}/implant): 3D CT로 식립 위치·각도·깊이를 계획하고 서지컬 가이드로 수술하는 임플란트 안내 (임플란트 대표 페이지)
- [비급여 진료비 안내](${SITE_URL}/price): 임플란트·틀니·보철 등 항목별 비용 공개

## 자주 묻는 질문

- [FAQ 전체 보기](${SITE_URL}/faq)
${faqCategories}

## 원장 칼럼

- [원장 칼럼 전체 보기](${SITE_URL}/column): 김종욱 원장이 직접 쓰는 근거 기반 치과 지식 칼럼
${columnCategories}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

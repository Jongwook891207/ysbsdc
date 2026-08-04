# yonsei100-web

연세백세치과의원 Next.js(App Router) 프로젝트. `작업 폴더/web` 아래에 기존 정적 사이트(`index.html` 등)와 분리해서 만들었습니다.

## 2단계 완료 — 공통 Layout / Header / Footer / Navigation / Smart Floating Bar

```
web/
  app/
    page.tsx                  / (홈)
    doctor/page.tsx           /doctor        (대표원장 스토리 — doctor.html 이전)
    doctor/[slug]/page.tsx    /doctor/[slug] (컬럼 작성자 프로필, 신규)
    treatment/page.tsx        /treatment     (treatment.html 이전)
    mission/page.tsx          /mission       (mission.html 이전)
    column/page.tsx           /column        (칼럼 목록, 신규)
    column/[slug]/page.tsx    /column/[slug] (칼럼 상세, 신규)
    robots.ts, sitemap.ts, rss.xml/route.ts
    layout.tsx                 Header/Footer/SmartFloatingBar + 공통 JSON-LD + 메타데이터
    globals.css                GNB/모바일 아코디언/footer/floating bar/버튼/공통 리셋 전부 이식
  components/
    layout/                    Header.tsx · DesktopNav.tsx(client) · MobileNav.tsx(client) ·
                               Footer.tsx · SmartFloatingBar.tsx(client)
    ui/                        Button.tsx · Logo.tsx
    seo/                       JsonLd.tsx
    (그 외 Section/Card/ColumnCard/DoctorCard/Hero/ReservationCTA/
     Breadcrumb/RelatedColumns/ShareButtons — 3~4단계에서 사용)
  lib/                        types.ts · seo.ts · nav.ts · utils.ts (모두 완성)
                               columns.ts/doctors.ts/metadata.ts/jsonld.ts
                               (jsonld.ts#buildDentistJsonLd()만 구현, 나머지는 4·5단계)
  content/
    columns/implant-guide.mdx (샘플 1개 — frontmatter 형태 확인용)
    doctors/kim-jongwook.mdx  (샘플 1개)
  public/images/              기존 images/ 폴더 전체 복사
  public/google637faaa5e7b42ccd.html
```

**2단계에서 한 일**: `index.html`의 GNB(로고/데스크톱 메뉴/드롭다운/전화버튼/간편예약)·모바일
햄버거+아코디언·footer·Smart Floating Bar를 색상/여백/폰트 크기/버튼 스타일까지 그대로
`globals.css` + 컴포넌트로 옮겼습니다. 병원 정보(주소/전화/진료시간/지도 링크)와 메뉴 구조는
각각 `lib/seo.ts`, `lib/nav.ts` 한 곳에서만 관리하고, 컴포넌트는 그 값을 참조만 합니다.

기존 정적 사이트에는 없던 것(요청하신 접근성 강화 항목): 모바일 메뉴 body 스크롤 락,
바깥 클릭/Escape로 닫기, 라우트 변경 시 자동 닫기, 닫을 때 햄버거 버튼으로 포커스 복귀,
`aria-current`/`aria-expanded`/`aria-controls`/`aria-haspopup`. 데스크톱 드롭다운은 원본과
동일하게 `:hover`/`:focus-within` CSS로 열리고, React 상태는 `aria-expanded` 값과
Escape 닫기만 담당합니다.

폰트는 S-Core Dream이 로컬 배포용 폰트 파일이 없는 CDN 전용 웹폰트라 `next/font/local`을
쓸 수 없어서, 기존과 동일한 CDN `<link>`를 `layout.tsx`의 `<head>`에 그대로 유지했습니다.
AOS/Font Awesome은 2단계 공통 UI(GNB/footer/floating bar)에서 쓰지 않아 넣지 않았습니다 —
전화/예약/지도 아이콘은 원본처럼 인라인 SVG를 그대로 사용합니다.

`next.config.ts`에 기존 URL → 신규 URL 301 리다이렉트를 이미 넣어뒀습니다
(`/doctor.html → /doctor`, `/treatment.html → /treatment`, `/mission.html → /mission`,
`/index.html → /`). 이 리다이렉트는 `next start`(서버 실행) 기준으로 동작하며, 완전
정적 export(`output: "export"`)로는 바꾸지 않았습니다 — 나중에 배포 방식을 정할 때
Node 서버 기반(예: Vercel, 자체 Node 서버)을 전제로 한 설정이라는 점을 참고해 주세요.

## 실행 환경

- **Node.js 20 LTS 이상 권장** (Next.js 15는 최소 18.18+ 필요). `node -v`로 확인하세요.
- 패키지 매니저는 npm 기준으로 안내합니다.

### 설치

```bash
cd web
npm install
```

PowerShell에서도 동일합니다 (bash 문법 아님, 그대로 입력):

```powershell
cd web
npm install
```

### 정적 점검 (dev 서버 없이)

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

### 빌드

```bash
npm run build        # next build
```

### 프로덕션 서버 실행 (빌드 후)

```bash
npm run start         # next start, 기본 http://localhost:3000
```

### 개발 서버

```bash
npm run dev            # next dev, 기본 http://localhost:3000
```

브라우저에서 `http://localhost:3000` 으로 접속하면 됩니다. 이제 GNB/모바일 메뉴/footer/
플로팅 바는 실제 디자인이 보이고, 각 페이지 본문(`<h1>`만 있는 부분)은 여전히 3단계에서
이식할 placeholder입니다.

### 빌드가 실패하면

아래를 캡처해서 전달해 주세요 — 이 정보 없이는 원격으로 원인을 짚기 어렵습니다.

1. 실행한 명령 전체 (`npm run build` 등)
2. 터미널에 출력된 에러 메시지 **전체** (마지막 줄만 X, 스택 트레이스 포함)
3. `node -v`, `npm -v` 출력
4. 에러가 특정 파일 경로를 가리키면 그 경로

## 아직 구현되지 않은 것 (정상)

- 각 페이지 본문은 `<h1>`만 있는 placeholder (3단계에서 실제 디자인/카피 이식)
- `lib/columns.ts` / `lib/doctors.ts` / `lib/metadata.ts`의 모든 함수, 그리고
  `lib/jsonld.ts`의 `buildPersonJsonLd`/`buildArticleJsonLd`/`buildBreadcrumbJsonLd`는
  여전히 `throw new Error("Not implemented until stage N")`입니다.
- `sitemap.ts` / `rss.xml/route.ts`는 정적 라우트만 포함하고, 컬럼·원장 개별 페이지는
  아직 없습니다 (`TODO(stage 5)` 주석으로 표시).
- 진료 안내 드롭다운의 `#implant`/`#denture`/`#endodontics`/`#general`, GNB의
  `#column`/`#location` 앵커는 아직 해당 섹션이 없어 3단계에서 본문이 이식되기 전까지는
  스크롤 대상이 없습니다 (링크 구조/URL 자체는 기존과 동일하게 이미 맞춰뒀습니다).

## 다음 단계

- **3단계**: 기존 4개 페이지 디자인/카피 이식
- **4단계**: 컬럼 시스템 (`lib/columns.ts`, `lib/doctors.ts` 실제 구현 — MDX 로더)
- **5단계**: SEO/AEO (Metadata API, JSON-LD, sitemap/robots/RSS 실데이터 연결)
- **6단계**: 성능 최적화

로컬에서 `npm install && npm run typecheck && npm run lint && npm run build`가 모두
통과하는지, `npm run dev`로 GNB/모바일 메뉴/footer/플로팅 바가 기존 사이트와 동일하게
보이고 동작하는지 확인하신 뒤 알려주시면 3단계로 넘어가겠습니다.

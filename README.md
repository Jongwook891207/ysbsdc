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

## IndexNow

새 칼럼/FAQ가 발행되거나 기존 발행 콘텐츠가 의미 있게 바뀌었을 때, Bing 등 IndexNow
참여 검색엔진에게 "이 URL이 바뀌었다"고 알려서 재크롤을 앞당기는 기능입니다. 기존
`sitemap.xml`(검색엔진이 스스로 도는 지도)을 대체하지 않고 보완합니다.

**Key 관리**: IndexNow key는 비밀값이 아닙니다 — `https://ysbsdc.com/{key}.txt`에 그대로
공개해서 "이 도메인 소유자가 맞다"는 걸 검색엔진에게 증명하는 용도입니다. 그래서 환경변수가
아니라 `public/00770b51e6314d84b08b46c8159b5158.txt`라는 정적 파일(IndexNow 공식 문서가
권장하는 방식 그대로)로 커밋되어 있고, `lib/indexnow.ts`에도 같은 값이 상수로 적혀 있습니다.
**이 두 곳(파일명·내용 + `lib/indexnow.ts`의 상수)은 항상 같은 값이어야 합니다** — key를
교체할 일이 생기면 둘을 함께 바꾸세요. Vercel에 별도로 설정할 환경변수는 없습니다.

**자동 제출이 발생하는 시점**: 없습니다 — 이 스크립트는 `next build`/`next dev`/Vercel
빌드 어디에도 연결돼 있지 않습니다. `/칼럼발행`으로 콘텐츠를 배포하고 production 확인까지
끝난 뒤, **사람(또는 이 저장소를 다루는 에이전트)이 `npm run indexnow`를 직접 실행**하는
것이 유일한 트리거입니다. dev 서버 실행이나 Vercel Preview 배포로는 결코 저절로 호출되지
않습니다.

**제출 대상 판별 방식**: 상태를 담은 파일을 커밋하지 않습니다. 대신 `indexnow-state`라는
git 브랜치가 "마지막으로 성공 제출한 시점의 HEAD"를 가리키고, 매 실행마다
`git diff --name-status origin/indexnow-state..HEAD -- content/columns content/faq`로
**실제 바뀐 파일 목록**을 구합니다. 각 파일에 대해 신규/수정이면 HEAD(현재 워킹트리) 기준,
삭제면 `git show origin/indexnow-state:<path>`로 옛 리비전 기준 frontmatter를 읽어 발행
여부(`draft`)를 확인하고, 옛 상태나 새 상태 어느 한쪽이라도 공개 상태였다면 그 URL을
제출 대상에 포함합니다. 칼럼은 파일 하나당 `/column/{slug}` URL 하나, FAQ는 질문 단위
URL이 없어(카테고리 허브 페이지만 존재) 같은 카테고리에서 여러 파일이 바뀌어도
`/faq/{category}` URL 하나로 합쳐 제출합니다(dedupe). **`updatedAt` 필드에 의존하지
않고 git이 추적하는 실제 파일 변경을 보기 때문에, 사람이 `updatedAt`을 갱신하는 걸
깜빡해도 놓치지 않습니다** — 실제로 이 저장소의 `content/faq/*.mdx` 대부분이 `updatedAt`을
아예 안 쓰는데도 정상 감지됩니다(구현 중 직접 검증함). `indexnow-state` 브랜치가
아직 없으면(최초 실행) 현재 발행된 전체 URL을 한 번 baseline으로 제출합니다.
제출이 **완전히 성공했을 때만** `git push origin HEAD:refs/heads/indexnow-state`로
브랜치를 앞으로 이동시킵니다(항상 fast-forward, `--force` 없음) — 실패하면 브랜치를
움직이지 않으므로 다음 실행에서 그 변경분이 자동으로 다시 잡힙니다. 여러 커밋을 한 번에
푸시했더라도 `origin/indexnow-state..HEAD` 범위가 그 사이 전부를 포괄합니다.

**삭제 신호**: 칼럼 파일 삭제, 또는 발행된 콘텐츠가 `draft: true`로 되돌아가는 경우
모두 위 로직에서 "옛 상태는 공개였다"로 잡혀 그 URL이 다시 제출됩니다. IndexNow에는
별도의 "삭제" 신호가 없어서, 이제 그 URL이 404/변경된 내용을 반환한다는 사실 자체를
검색엔진이 재크롤로 알게 하는 것이 삭제를 알리는 정석적인 방법입니다.

**draft 제외 방식**: 최초 baseline 제출에는 사이트가 실제로 쓰는
`columnSource.getPublished()`를 그대로 재사용합니다. 이후의 diff 기반 판단은 각 파일의
frontmatter를 직접 읽어 `draft !== true`로 판정합니다(스키마의 `draft` 기본값이 `false`인
것과 동일한 규칙).

**수동 제출**:

```bash
npm run indexnow -- /column/some-slug /faq/implant
```

인자로 받은 경로는 항상 `SITE_URL`(`https://ysbsdc.com`) 기준으로만 절대 URL을 만들고,
그 결과가 production origin과 다르면(다른 호스트 URL을 통째로 넣은 경우 등) 조용히
무시하지 않고 그 URL을 건너뛴다는 메시지를 출력합니다 — localhost나 다른 도메인을
실수로 제출할 방법이 없습니다. `--dry-run`을 붙이면 실제 API 호출과 매니페스트 갱신 없이
"무엇을 제출했을지"만 출력합니다(수동/자동 모드 둘 다 지원).

> Windows Git Bash에서 `/column/...`처럼 `/`로 시작하는 인자를 쓰면 MSYS가 이를 로컬
> 파일 경로로 오인해 변환해버릴 수 있습니다(예: `C:/Program Files/Git/column/...`). 이때는
> PowerShell을 쓰거나 `MSYS_NO_PATHCONV=1 npx tsx scripts/indexnow.ts ...`로 실행하세요.
> 스크립트 자체의 문제가 아니라 Git Bash의 경로 변환 동작입니다.

**로그·오류 확인**: 실행하면 제출한 URL 목록, 개수, HTTP status, 실패 사유가 그대로
터미널에 출력됩니다. Key 값은 어떤 로그에도 출력하지 않습니다. 429/4xx/5xx는 각각의
사유를 한 줄로 설명만 하고 재시도하지 않습니다(무한 재시도 없음). 제출이 실패하면
`indexnow-state` 브랜치를 이동시키지 않으므로, 원인을 고치고 다시 실행하면 실패했던
URL이 자동으로 다시 잡힙니다.

**문제가 생기면**:
- `npm run indexnow -- --dry-run`으로 지금 무엇이 잡히는지 먼저 확인
- `curl https://ysbsdc.com/00770b51e6314d84b08b46c8159b5158.txt`로 key 파일이 실제로
  응답하는지 확인(내용이 안 나오면 `public/`의 그 파일이 실제로 배포됐는지 확인)
- 터미널에 출력된 `status`/`reason` 줄이 실패 원인을 그대로 알려줍니다
- `git branch -r | grep indexnow-state`로 상태 브랜치가 원격에 있는지, 어느 커밋을
  가리키는지(`git log origin/indexnow-state -1`) 확인 가능

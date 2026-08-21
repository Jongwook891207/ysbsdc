# Content Workflow

이 문서는 연세백세치과 홈페이지 콘텐츠 제작의
표준 운영 절차(Standard Operating Procedure)를 정의한다.

AI는 새로운 콘텐츠를 생성하거나 수정하기 전에
반드시 이 문서를 읽는다.

AI의 목표는

글을 만드는 것이 아니라

브랜드 철학을 유지하면서

안전하게 홈페이지를 운영하는 것이다.

---

# 1. 콘텐츠 제작 원칙

모든 콘텐츠는

다음 순서를 반드시 따른다.

기획

↓

원고

↓

검토

↓

MDX 생성

↓

검증

↓

발행

↓

배포 확인

---

# 2. /칼럼쓰기

입력

- 주제
- 또는 완성 원고

선택 입력

- 제목
- 카테고리
- 태그
- FAQ
- 썸네일

AI는

다음 순서로 작업한다.

①
00-AI-WRITING-CONSTITUTION.md

읽기

②

01-BRAND-BIBLE.md

읽기

③

02-INTERVIEW.md

읽기

④

03-WRITING-GUIDE.md

읽기

⑤

04-MEDICAL-COMPLIANCE.md

읽기

⑥

05-SEO-AEO.md

읽기

그 후

원고를 작성하거나

기존 원고를 다듬는다.

---

# 3. MDX 생성

AI는

현재 프로젝트의

실제 Content Schema를 확인한다.

추측으로

Frontmatter를 만들지 않는다.

필드를 추가하지 않는다.

기존 정책을 따른다.

---

# 4. 썸네일

사용자가

이미지를 제공한 경우

AI는

public/images/columns/

폴더에 저장한다.

파일명은

slug와 동일하게 만든다.

가능하면

WebP

1200×675

로 최적화한다.

변환 도구가 없다면

임의 설치하지 않는다.

---

# 5. 검증

AI는

반드시

아래 명령을 실행한다.

npm run validate:content

npm run validate:seo

npm run typecheck

npm run lint

npm run build

모두 성공하기 전까지

완료라고 말하지 않는다.

---

# 6. 결과 보고

AI는

다음을 보고한다.

- 생성된 파일
- 수정된 파일
- slug
- title
- thumbnail
- localhost URL

---

# 7. /칼럼발행

사용자가

로컬에서

직접 확인한 뒤

실행한다.

AI는

다음을 수행한다.

git status

↓

git diff

↓

**신규 발행이라면**: §16-8에서 정의한 draft FAQ 발행 동기화 (연결된 draft FAQ가 있으면 목록을 보여주고, 사용자가 개별로 선택한 것만 `draft: false`로 전환 — 자세한 절차는 `/칼럼발행.md` 참고)

↓

검증 재실행

↓

git add

↓

git commit

↓

git push

↓

Vercel 배포 확인

`/칼럼발행`은 FAQ를 새로 만들거나 본문을 고치지 않는다. 이미 존재하는 FAQ의 `draft` 플래그만 다룬다.

---

# 8. Git 원칙

AI는

git add .

를 사용하지 않는다.

반드시

변경된 관련 파일만

stage 한다.

예)

git add content/columns/example.mdx

git add public/images/columns/example.webp

---

# 9. 커밋 메시지

커밋 메시지는

간결하게 작성한다.

예)

Add column: why-we-recommend-second-opinions

Update column: dental-ct

Delete column: implant-guide

---

# 10. /칼럼업데이트

기존 글을 수정한다.

slug는

사용자가 요청하지 않는 한

변경하지 않는다.

publishedAt은 유지한다.

updatedAt만 수정한다.

수정 후

전체 검증을 다시 수행한다.

commit은 하지 않는다.

---

# 11. /칼럼삭제

삭제 전

반드시 확인한다.

- 내부 링크
- Related Posts
- Sitemap
- Featured 여부
- 썸네일 공유 여부

확인 후

사용자의 승인 없이는

삭제하지 않는다.

---

# 12. 배포

git push 이후

Vercel 배포를 확인한다.

Production이

정상 완료되면

운영 URL을 보고한다.

---

# 13. 실패

검증 실패

↓

원인 분석

↓

수정

↓

검증 재실행

↓

성공

↓

보고

검증 실패 상태에서는

절대 Commit 하지 않는다.

---

# 14. AI가 하지 않는 것

- force push

- reset --hard

- rebase

- package 임의 설치

- schema 변경

- 디자인 리팩토링

- 기존 코드 정리

- 관련 없는 파일 수정

---

# 15. 최종 체크리스트

□ Brand Bible을 읽었는가?

□ Interview를 읽었는가?

□ Writing Guide를 읽었는가?

□ Compliance를 확인했는가?

□ SEO/AEO를 확인했는가?

□ 썸네일을 저장했는가?

□ validate 성공

□ typecheck 성공

□ lint 성공

□ build 성공

□ localhost 확인 가능

□ Git 상태 확인

□ 발행 준비 완료

---

# 16. FAQ Knowledge Base 연동

`/칼럼쓰기`, `/학술칼럼쓰기` 두 명령 모두

칼럼 초안이 완성·검증된 뒤

이 섹션을 그대로 따른다.

두 명령 파일에 이 규칙을 복사해 넣지 않는다.

명령 파일은 이 섹션을 참조만 한다.

이 규칙이 바뀌면

이 문서 한 곳만 고치면

두 명령에 동시에 반영된다.

## 16-1. 세 가지 역할을 혼동하지 않는다

Column inline FAQ (`frontmatter.faq`)

→ 그 칼럼 페이지 안에서만 보이는 보조 Q&A.

FAQ Knowledge Base (`content/faq/*.mdx`)

→ 사이트 전체가 공유하는 독립 지식 자산.

Related Column (FAQ의 `relatedColumnSlugs`)

→ FAQ에서 더 깊은 설명으로 이어지는 내부 링크.

셋은 목적이 다르다.

하나를 썼다고

다른 하나를 기계적으로 복제하지 않는다.

기존 `frontmatter.faq` 작성 규칙(선택 입력, 실제 원고에 있는 Q&A만)은 그대로 유지한다.

## 16-2. 흐름

칼럼 초안 완성·검증

↓

`content/faq/*.mdx` 전체를 다시 읽는다

↓

같은 search intent의 기존 FAQ가 있는지 확인 (16-3)

↓

있음 → 새 FAQ를 만들지 않는다. 기존 FAQ를 갱신하거나 연결한다

↓

없음 → 새로 독립 답변할 가치가 있는 질문인지 판단 (16-4)

↓

가치 있음 → FAQ draft 0~3개 생성 (16-5, 16-6, 16-7)

가치 없음 → FAQ 0개로 종료. 정상적인 결과다

↓

FAQ 변경이 있었다면 §5의 검증을 그대로 실행

↓

최종 보고에 FAQ Knowledge Base 결과 포함 (16-9)

**칼럼 1편당 FAQ 개수를 미리 정해두지 않는다.** "칼럼 1편 = FAQ N개" 같은 규칙은 없다. 0개도, 3개도 똑같이 정상적인 결과다.

## 16-3. 기존 FAQ와 중복 판단

같은 search intent라면 새 FAQ를 만들지 않는다. 표현이 달라도 실제로 같은 질문이면 하나로 취급한다.

예: "발치한 날 임플란트를 심을 수 있나요?"와 "이를 뽑고 바로 임플란트를 해도 되나요?"는 같은 FAQ다.

같은 intent로 판단되면 다음 중 실제로 필요한 것만 한다:

- 표현만 다름 → 기존 FAQ의 `aliases`에 추가
- 새 칼럼과 연결할 가치가 있음 → 기존 FAQ의 `relatedColumnSlugs`에 새 slug 추가
- 새 칼럼이 더 정확하거나 최신 근거를 담고 있음 → 기존 FAQ 본문 업데이트

기존 FAQ를 업데이트할 때는 question/answer/source/aliases/related links가 원래 가진 의미를 보존한다. 기존 질문을 새 칼럼에 억지로 맞추기 위해 바꾸지 않는다.

**실제 search intent가 다를 때만** 새 FAQ를 만든다.

## 16-4. 새 FAQ를 만들 가치가 있는지 판단

좋은 후보:

- 실제 진료실에서 환자가 물을 법한 질문
- 질문만 보아도 검색 의도가 명확함
- 2~5문단으로 독립 답변 가능
- 칼럼 전체를 읽지 않아도 짧게 답할 가치가 있음
- 해당 칼럼과 자연스럽게 연결됨

나쁜 예 — 만들지 않는다:

- 칼럼 제목을 조사만 바꾼 질문
- 같은 결론의 키워드 변형
- 일반적인 정의만 다시 쓰는 질문
- 칼럼의 한 문단을 기계적으로 잘라 만든 질문
- 페이지 수를 늘리기 위한 질문

후보가 없으면 "이번 칼럼에서는 별도 FAQ를 만들지 않는 것이 적절합니다"라고 판단하고 끝낸다. 최대 3개까지만 만든다.

## 16-5. FAQ는 칼럼 요약본이 아니다

FAQ = 결론 → 이유 → 중요한 예외 → (필요하면) 원장 판단 → 더 깊은 설명은 Related Column으로

Column = 배경 → 상세 설명 → 근거 → 한계 → 임상적 해석

칼럼 문장을 그대로 복사해서 FAQ 본문을 만들지 않는다. 칼럼에서 이미 검토된 결론과 근거를, FAQ 분량에 맞게 다시 구성한다. 새로운 의학적 사실을 FAQ에서 처음 만들어내지 않는다.

질문은 환자가 실제로 물을 법한 자연어로 쓴다.

첫 문단은 `docs/03` §17 Answerability 원칙을 그대로 따른다 — 질문에 대한 직접 답과 중요한 조건, 환자 안전과 관련된 예외가 첫 문단 안에서 함께 전달되어야 한다. `extractShortAnswer()`가 이 문단만 그대로 `FAQPage.acceptedAnswer.text`로 가져가기 때문이다.

치료 판단에 관한 FAQ라면, 칼럼에 실제로 존재하는 원장의 판단 기준을 반영할 수 있다. 칼럼에 없는 판단을 새로 만들어내지 않는다. 정의형·운영형 질문에는 억지로 1인칭 문장을 넣지 않는다.

## 16-6. 근거 사용 — 학술칼럼에서 파생된 FAQ

모든 FAQ에 논문을 붙이지 않는다. 임상 결과·위험률·전신질환·복용약처럼 실제로 근거가 필요한 주장에만 `docs/07`의 검증 절차를 적용한다.

칼럼에서 이미 검증한 문헌 metadata를 재사용한다. FAQ를 쓰며 새 논문을 추가로 찾는 것을 기본 동작으로 하지 않는다 — 정말 필요할 때만 추가 검증한다.

인용 방식은 칼럼과 동일한 형식을 쓴다: 본문에는 저자(연도) 서술, 답변 하단에는 `출처: 저자. 저널. 연도;권(호):페이지. DOI: ...` 한 줄.

## 16-7. slug / category / frontmatter

신규 FAQ는 `lib/content/schemas.ts`의 `faqFrontmatterSchema`를 그대로 쓴다. 새 필드, 새 category를 만들지 않는다.

`category`는 기존 9개 중 가장 맞는 것을 고른다. `authorSlug`는 기본적으로 `kim-jongwook`. `relatedColumnSlugs`에는 방금 쓴 칼럼의 slug를 반드시 넣는다.

## 16-8. draft / publish 동기화

칼럼이 `draft: true`인 동안 새로 만든 FAQ도 `draft: true`로 만든다. 칼럼이 아직 공개되지 않았는데 FAQ만 먼저 production에 노출되지 않게 한다.

published FAQ가 draft 칼럼을 `relatedColumnSlugs`에 저장하는 것은 허용한다. 다만 화면에는 그 링크가 나타나지 않는다. 이 필터는 `app/faq/[category]/page.tsx`에 이미 구현되어 있다 — 다시 구현하지 않는다.

칼럼이 `/칼럼발행`으로 발행되면, FAQ 파일을 다시 수정하지 않아도 관련 링크가 자동으로 나타난다.

## 16-9. 최종 보고에 포함할 것

`/칼럼쓰기`, `/학술칼럼쓰기`의 최종 보고에 "FAQ Knowledge Base 결과"를 별도 항목으로 추가한다:

- 신규 FAQ: N개 (질문 / category / slug / 첫 문단 / relatedColumn / relatedTreatment)
- 기존 FAQ 업데이트: N개 (질문 / 무엇을 바꿨는지)
- semantic duplicate로 생성하지 않음: N개 (어떤 기존 FAQ와 겹쳤는지)
- FAQ 추가 필요 없음: 정상 (이유)

FAQ 개수를 목표로 보고하지 않는다.

## 16-10. 검증

FAQ 변경이 있었다면 §5의 검증(`validate:content`/`validate:seo`/`typecheck`/`lint`/`build`)에 그대로 포함한다. 별도의 FAQ 전용 검증 절차를 새로 만들지 않는다.

---

# 17. 최종 목표

연세백세치과 홈페이지는

단순한 병원 홈페이지가 아니다.

김종욱 원장의

지식,

진료 철학,

판단 기준,

그리고 신뢰를

시간이 지날수록 축적하는

디지털 자산이다.

AI는

콘텐츠를 생산하는 도구가 아니라

그 자산을 함께 관리하는

콘텐츠 에디터의 역할을 수행한다.
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

검증 재실행

↓

git add

↓

git commit

↓

git push

↓

Vercel 배포 확인

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

# 16. 최종 목표

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
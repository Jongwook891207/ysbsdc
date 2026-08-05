import Link from "next/link";

/**
 * Global 404 boundary — Next renders this for every `notFound()` call site
 * (nonexistent /column/[slug], /column/page/[N] out of range,
 * /column/category/[category] that doesn't exist, or any unmatched route)
 * since no more specific `not-found.tsx` exists under app/column/. Renders
 * inside the root layout's `<main>`, so Header/Footer/FloatingBar already
 * wrap it — no separate chrome needed here.
 */
export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <p className="not-found-eyebrow">404</p>
        <h1>페이지를 찾을 수 없습니다</h1>
        <p className="not-found-desc">
          요청하신 페이지가 존재하지 않거나, 다른 주소로 이동했을 수 있습니다.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="btn btn-navy">
            홈으로 이동
          </Link>
          <Link href="/column" className="btn btn-outline">
            원장 칼럼 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Stage 1: placeholder. Client Component (needs navigator.share /
 * clipboard) — kept intentionally small per the "Client Component 최소화"
 * requirement; everything else on /column/[slug] stays a Server Component.
 */
"use client";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  return (
    <div>
      <button type="button" onClick={() => navigator.clipboard?.writeText(url)}>
        링크 복사
      </button>
      <span className="sr-only">{title}</span>
    </div>
  );
}

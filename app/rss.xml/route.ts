import { NextResponse } from "next/server";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

/**
 * STAGE 1 PLACEHOLDER — no package added for this yet.
 * TODO(stage 5): read all published columns from lib/columns.ts
 * (getPublishedColumns, newest first) and emit one <item> per column
 * (title/link/pubDate/description), hand-rolled as XML template literals
 * (same approach as below, just with real data) — no `rss` npm package is
 * needed for this and none is installed.
 *
 * The channel-level fields below are real; only the <item> list is missing.
 */
export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME} 원장 칼럼</title>
    <link>${SITE_URL}/column</link>
    <description>연세백세치과의원 김종욱 원장의 치과 지식 칼럼</description>
    <language>ko</language>
    <!-- TODO(stage 5): <item> entries from getPublishedColumns() -->
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

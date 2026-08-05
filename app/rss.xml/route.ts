import { NextResponse } from "next/server";
import { columnSource } from "@/lib/content/sources/columns";
import { authorSource } from "@/lib/content/sources/authors";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";
import { escapeXml } from "@/lib/xml";

const MAX_ITEMS = 20;

function toRfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

/**
 * Stage 5-1: real feed from columnSource — published only, newest first
 * (columnSource.getPublished() already sorts that way per COLUMN_CONFIG),
 * capped at MAX_ITEMS so the feed doesn't grow unbounded as content does.
 * Summary only (frontmatter.summary), never the full MDX body — an RSS
 * reader linking back to the real article is the point, not a full mirror
 * of it. No `rss` npm package needed or installed — this is plain XML
 * template literals, same approach the stage-1 placeholder already used.
 */
export async function GET() {
  const columns = columnSource.getPublished().slice(0, MAX_ITEMS);
  const selfUrl = `${SITE_URL}/rss.xml`;
  const columnUrl = `${SITE_URL}/column`;

  const items = columns
    .map((column) => {
      const { frontmatter } = column;
      const link = absoluteUrl(`/column/${frontmatter.slug}`);
      const author = authorSource.getBySlug(frontmatter.authorSlug);

      return `    <item>
      <title>${escapeXml(frontmatter.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRfc822(frontmatter.publishedAt)}</pubDate>
      <description>${escapeXml(frontmatter.summary)}</description>
      <category>${escapeXml(frontmatter.category)}</category>${
        author ? `\n      <dc:creator>${escapeXml(author.frontmatter.name)}</dc:creator>` : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${SITE_NAME} 원장 칼럼</title>
    <link>${columnUrl}</link>
    <description>연세백세치과의원 김종욱 원장의 치과 지식 칼럼</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

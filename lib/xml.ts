/**
 * Escapes the 5 XML-reserved characters — every piece of real content
 * (title/summary/author name/category) going into app/rss.xml/route.ts's
 * feed goes through this first. Pulled out of route.ts itself because
 * Next.js's route-file type checking rejects any export from a
 * `route.ts` other than the recognized HTTP-method handlers
 * (GET/POST/etc.) and a small set of route config options — this needs
 * its own module so both the route and scripts/validate-seo.ts can import
 * it.
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

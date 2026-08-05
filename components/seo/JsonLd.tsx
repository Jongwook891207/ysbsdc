/**
 * Every literal "<" is escaped to its Unicode form after JSON.stringify —
 * without this, a field value containing the substring "</script>" (an
 * article title, summary, or any other free-text field pulled from
 * content) would close this <script> tag early and the rest could be
 * interpreted as HTML. JSON.parse treats the Unicode-escaped form and the
 * literal character identically, so this is purely a serialization-safety
 * escape — it doesn't change the data.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

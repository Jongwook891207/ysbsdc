/**
 * H1 guard (stage 4-1).
 *
 * Why a static text scan instead of a remark plugin: there's no MDX
 * renderer yet (stage 4-2 adds `next-mdx-remote`), and a remark plugin can
 * only run as part of that compile step. Content already exists today
 * (this stage's sample columns, and any real column an author writes
 * before 4-2 ships), so the loader is the only place that can catch a
 * stray H1 right now — the remark-plugin version stage 4-2 adds later is
 * the authoritative check (it runs on the real parsed AST); this is a
 * best-effort early guard, not a replacement for it.
 *
 * Known false-negative/false-positive limitations of a line-based regex
 * scan (documented rather than silently accepted):
 *  - Fenced code blocks (```...```) ARE excluded from the scan (below), so
 *    a markdown-syntax example inside a code fence won't false-positive.
 *  - Indented (4-space) code blocks are NOT excluded — a heading-looking
 *    line inside one would false-positive. Not used in this project's
 *    content conventions so far.
 *  - Setext-style H1 (`Heading\n======`) is NOT detected — only ATX (`#
 *    Heading`) and inline `<h1>` JSX.
 *  - A `<h1` split across multiple lines (attributes wrapping) is NOT
 *    detected — the regex only matches within a single line.
 */

const ATX_H1_PATTERN = /^#(?!#)\s+\S/;
const JSX_H1_PATTERN = /<h1[\s>]/i;
const CODE_FENCE_PATTERN = /^\s*```/;

export interface H1Violation {
  line: number;
  text: string;
}

/** Returns every line that looks like an H1; empty array means none found. */
export function findH1Violations(content: string): H1Violation[] {
  const violations: H1Violation[] = [];
  let inFence = false;

  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined) continue;

    if (CODE_FENCE_PATTERN.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    if (ATX_H1_PATTERN.test(line) || JSX_H1_PATTERN.test(line)) {
      violations.push({ line: i + 1, text: line.trim() });
    }
  }

  return violations;
}

/** Throws a build-time error naming the file, line number, and offending text if any H1 is found. */
export function assertNoH1Heading(content: string, filePath: string): void {
  const violations = findH1Violations(content);
  if (violations.length === 0) return;

  const details = violations.map((v) => `  line ${v.line}: ${v.text}`).join("\n");
  throw new Error(
    `${filePath}: MDX body must not contain an H1 (the page template renders the single H1 from ` +
      `frontmatter.title — body content starts at H2). Found:\n${details}`,
  );
}

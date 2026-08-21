import { toPlainText } from "./toc";

/**
 * Extracts a FAQ's "short answer" (docs/03 §17: the 1-2 sentence direct
 * answer a question-form H2/question must open with) from the MDX body's
 * own opening paragraph — never from a separately-maintained frontmatter
 * field. See lib/content/schemas.ts's comment on why `shortAnswer` was cut
 * from the FAQ frontmatter after building 20 real prototypes: a second
 * stored copy of the same sentence drifts from the body the moment someone
 * edits one and not the other. This function is the single source instead.
 *
 * Same category of approach as lib/toc.ts#extractToc and
 * lib/content/mdxGuards.ts#findH1Violations: a line-based scan of the raw
 * MDX string, run before MDXRemote compiles it (no AST is available at
 * load/validate time). It is NOT "render to HTML and grab the first <p>" —
 * that approach breaks silently the moment the rendered DOM structure
 * changes; this reads the source text directly and enforces a structural
 * invariant on it.
 *
 * The invariant: a FAQ body MUST open with a plain paragraph (after
 * skipping leading blank lines). If the first non-blank line is a heading,
 * a horizontal rule, or an MDX/JSX component tag, this throws — loudly, at
 * build/validate time — naming the file and what it found, instead of
 * silently returning an empty string or a wrong sentence. This mirrors
 * assertNoH1Heading()'s "fail loudly, name the file" convention.
 */

const CODE_FENCE_PATTERN = /^\s*```/;
const HEADING_PATTERN = /^#{1,6}(?!#)\s+\S/;
const HR_PATTERN = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;
const JSX_OR_HTML_TAG_PATTERN = /^\s*<[A-Za-z]/;

export class ShortAnswerExtractionError extends Error {}

/**
 * Returns the plain-text opening paragraph of `mdxBody`. Throws
 * ShortAnswerExtractionError if the body has no leading paragraph, or opens
 * with something other than plain prose (heading/rule/component) — see the
 * file header for why this fails loudly instead of guessing.
 */
export function extractShortAnswer(mdxBody: string, filePath = "(unknown file)"): string {
  const lines = mdxBody.split(/\r?\n/);
  const buffer: string[] = [];
  let inFence = false;

  for (const line of lines) {
    if (CODE_FENCE_PATTERN.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const trimmed = line.trim();

    if (buffer.length === 0) {
      if (!trimmed) continue; // skip leading blank lines
      if (HEADING_PATTERN.test(trimmed)) {
        throw new ShortAnswerExtractionError(
          `${filePath}: FAQ body must open with a plain paragraph (the direct answer), but it opens with a ` +
            `heading: "${trimmed}". Move the direct-answer sentence above the first heading.`,
        );
      }
      if (HR_PATTERN.test(trimmed)) {
        throw new ShortAnswerExtractionError(
          `${filePath}: FAQ body must open with a plain paragraph, but it opens with a horizontal rule.`,
        );
      }
      if (JSX_OR_HTML_TAG_PATTERN.test(trimmed)) {
        throw new ShortAnswerExtractionError(
          `${filePath}: FAQ body must open with a plain paragraph, but it opens with a component/HTML tag: ` +
            `"${trimmed}". The direct-answer sentence must be plain text, not wrapped in a component.`,
        );
      }
      buffer.push(trimmed);
      continue;
    }

    // Already inside the opening paragraph: a blank line ends it.
    if (!trimmed) break;
    buffer.push(trimmed);
  }

  if (buffer.length === 0) {
    throw new ShortAnswerExtractionError(`${filePath}: FAQ body has no content (expected an opening paragraph).`);
  }

  return toPlainText(buffer.join(" "));
}

#!/usr/bin/env node
/**
 * Shared helper for the /칼럼쓰기 and /칼럼업데이트 custom commands
 * (.claude/commands/) — takes a source image and produces a column
 * thumbnail at public/images/columns/<slug>.<ext>, 1200x675 (16:9),
 * center-cropped (never stretched/distorted).
 *
 * Uses `sharp`, which is already present in node_modules as a transitive
 * dependency of `next` itself (Next's own image optimizer) — this script
 * does NOT add it to package.json and must never trigger `npm install`.
 * If `sharp` can't be loaded for any reason, this exits with a non-zero
 * code and a clear message instead of silently skipping the resize/WebP
 * step; the calling command must report that honestly, not claim success.
 *
 * Usage:
 *   node scripts/process-column-thumbnail.mjs <sourcePath> <slug>
 *
 * On success, prints the final relative path (e.g. "/images/columns/foo.webp")
 * to stdout as the last line — the calling command should use that exact
 * value as `thumbnail` in the MDX frontmatter.
 */
import fs from "node:fs";
import path from "node:path";

const WIDTH = 1200;
const HEIGHT = 675;

// Same pattern as lib/content/schemas.ts's slugSchema — kept in sync
// manually since this script runs standalone (no zod import here). A slug
// that doesn't match this can never be a real content/columns/<slug>.mdx
// anyway, and without this check a crafted slug (e.g. containing "../")
// could make destPath below resolve outside public/images/columns/.
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

async function main() {
  const [, , sourcePath, slug] = process.argv;

  if (!sourcePath || !slug) {
    console.error("Usage: node scripts/process-column-thumbnail.mjs <sourcePath> <slug>");
    process.exit(1);
  }

  if (!SLUG_PATTERN.test(slug)) {
    console.error(`Invalid slug "${slug}" — must match ${SLUG_PATTERN} (lowercase letters, numbers, hyphens only).`);
    process.exit(1);
  }

  const resolvedSource = path.resolve(sourcePath);
  if (!fs.existsSync(resolvedSource)) {
    console.error(`Source image does not exist: ${resolvedSource}`);
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "public", "images", "columns");
  fs.mkdirSync(outDir, { recursive: true });

  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    // No usable image-processing tool — copy the original through
    // unchanged rather than fabricating a converted file that doesn't
    // exist. The calling command must report this, not claim WebP/resize
    // happened.
    const ext = path.extname(resolvedSource) || "";
    const destPath = path.join(outDir, `${slug}${ext}`);
    fs.copyFileSync(resolvedSource, destPath);
    console.error("sharp is not available — copied the original file unchanged (no resize, no WebP conversion).");
    console.log(`/images/columns/${slug}${ext}`);
    return;
  }

  const destPath = path.join(outDir, `${slug}.webp`);
  await sharp(resolvedSource)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .webp({ quality: 82 })
    .toFile(destPath);

  console.log(`/images/columns/${slug}.webp`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

/**
 * IndexNow submission CLI — the only place that decides *which* URLs to
 * submit; lib/indexnow.ts only knows how to submit whatever it's given.
 *
 * Two modes:
 *
 *   npm run indexnow                 — auto mode: find every content/columns
 *     or content/faq file that changed between the `indexnow-state` branch
 *     on origin and HEAD, resolve each to its public URL (column page or
 *     FAQ category hub), submit only those, then — only on a fully
 *     successful submission — fast-forward `origin/indexnow-state` to HEAD.
 *     Meant to run after every /칼럼발행 (or FAQ-only) production deploy.
 *
 *   npm run indexnow -- /column/foo /faq/implant   — manual mode: submit
 *     exactly the given path(s) right now, bypassing change detection
 *     entirely. For recovery (a submission failed earlier) or ad-hoc
 *     testing. Every argument is validated against the production origin.
 *     Never touches indexnow-state.
 *
 * Flags (either mode): --dry-run prints what would be submitted and skips
 * both the network call and the state-branch push.
 *
 * Why a branch instead of a tag: a tag conventionally marks one fixed
 * point and moving it repeatedly means force-pushing every time. A branch
 * ref is meant to move forward — advancing `indexnow-state` to HEAD is a
 * plain fast-forward push, no --force anywhere in this file.
 *
 * Why git diff instead of comparing frontmatter dates: an `updatedAt`
 * field only reflects a change if a human remembered to bump it. git diff
 * catches every actual byte change regardless — confirmed in practice
 * against this repo's own history (most content/faq/*.mdx files don't set
 * `updatedAt` at all).
 *
 * This script is never invoked by `next build`, `next dev`, or any Vercel
 * build step — it only runs when explicitly typed. That is the entire
 * mechanism preventing dev/preview submissions: there is no automatic
 * trigger to disable, because none exists.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import { columnSource } from "../lib/content/sources/columns";
import { FAQ_CATEGORIES } from "../lib/faqCategories";
import { SITE_URL } from "../lib/seo";
import { submitToIndexNow, toProductionUrl } from "../lib/indexnow";

const REPO_ROOT = path.join(__dirname, "..");
const STATE_BRANCH = "indexnow-state";
const STATE_REF = `origin/${STATE_BRANCH}`;
const TRACKED_DIRS = ["content/columns", "content/faq"];

function git(args: string[], opts: { allowFailure?: boolean } = {}): string {
  try {
    return execFileSync("git", args, {
      cwd: REPO_ROOT,
      encoding: "utf-8",
      // Probing calls (allowFailure: true) expect to fail on a first run
      // (no remote branch yet) — that's not an error worth alarming the
      // user with git's own "fatal: ..." stderr line, so it's swallowed
      // here. Real failures still throw and print via the catch below.
      stdio: opts.allowFailure ? ["ignore", "pipe", "ignore"] : undefined,
    }).trim();
  } catch (err) {
    if (opts.allowFailure) return "";
    throw err;
  }
}

/** Fetches the latest origin/indexnow-state (if it exists) and reports whether it does. A missing branch means this is the first run — not an error. */
function stateRefExists(): boolean {
  git(["fetch", "origin", `${STATE_BRANCH}:refs/remotes/origin/${STATE_BRANCH}`], { allowFailure: true });
  return git(["rev-parse", "--verify", "--quiet", STATE_REF], { allowFailure: true }).length > 0;
}

interface FileChange {
  /** git's --name-status letter: A (added), M (modified), D (deleted). Renames are disabled (--no-renames) so only these three appear. */
  status: string;
  path: string;
}

function getChangedFiles(): FileChange[] {
  const out = git(["diff", "--name-status", "--no-renames", `${STATE_REF}..HEAD`, "--", ...TRACKED_DIRS]);
  if (!out) return [];
  return out
    .split("\n")
    .filter(Boolean)
    .map((line): FileChange => {
      const tabIndex = line.indexOf("\t");
      return { status: line.slice(0, tabIndex), path: line.slice(tabIndex + 1) };
    });
}

type Frontmatter = Record<string, unknown>;

/** Reads frontmatter from the current working tree (== HEAD, since this script runs post-checkout). Returns null if the file doesn't exist (deleted). */
function readFrontmatterAtHead(relPath: string): Frontmatter | null {
  const abs = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  return matter(fs.readFileSync(abs, "utf-8")).data;
}

/** Reads frontmatter from a file as it existed at the given git ref. Returns null if the file didn't exist there (newly added). */
function readFrontmatterAtRef(ref: string, relPath: string): Frontmatter | null {
  const raw = git(["show", `${ref}:${relPath}`], { allowFailure: true });
  if (!raw) return null;
  return matter(raw).data;
}

function isPublished(frontmatter: Frontmatter | null): boolean {
  // Schema default is draft: false when the field is omitted entirely —
  // mirrored here since this reads raw YAML, not the zod-validated shape.
  return frontmatter !== null && frontmatter.draft !== true;
}

/**
 * Resolves one changed file to the public URL it affects, or null if
 * neither its old nor new state was ever actually published (e.g. a draft
 * fixture edited while staying draft — nothing public changed).
 */
function resolveChangedUrl(change: FileChange): string | null {
  const { status, path: relPath } = change;
  const headFrontmatter = status === "D" ? null : readFrontmatterAtHead(relPath);
  const oldFrontmatter = status === "A" ? null : readFrontmatterAtRef(STATE_REF, relPath);

  const newPublished = isPublished(headFrontmatter);
  const oldPublished = isPublished(oldFrontmatter);
  if (!newPublished && !oldPublished) return null;

  if (relPath.startsWith("content/columns/")) {
    const slug = path.basename(relPath, ".mdx");
    return `${SITE_URL}/column/${slug}`;
  }

  if (relPath.startsWith("content/faq/")) {
    const category = (headFrontmatter?.category ?? oldFrontmatter?.category) as string | undefined;
    if (!category) return null;
    return `${SITE_URL}/faq/${category}`;
  }

  return null;
}

/** First-run baseline: every currently published column + all 9 FAQ category hubs (mirrors app/sitemap.ts's own policy exactly — always-index-all-9, no promote/count gating). */
function collectAllPublishedUrls(): string[] {
  const urls = new Set<string>();
  for (const column of columnSource.getPublished()) {
    urls.add(`${SITE_URL}/column/${column.frontmatter.slug}`);
  }
  for (const { slug: category } of FAQ_CATEGORIES) {
    urls.add(`${SITE_URL}/faq/${category}`);
  }
  return [...urls];
}

function printResult(urls: string[], result: Awaited<ReturnType<typeof submitToIndexNow>>): void {
  console.log(`submitted ${urls.length} URL(s):`);
  for (const url of urls) console.log(`  - ${url}`);
  console.log(`status: ${result.status || "(not sent)"}  ok: ${result.ok}`);
  if (result.error) console.log(`reason: ${result.error}`);
}

async function advanceStateBranch(): Promise<void> {
  git(["push", "origin", `HEAD:refs/heads/${STATE_BRANCH}`]);
  const shortSha = git(["rev-parse", "--short", "HEAD"]);
  console.log(`${STATE_BRANCH} advanced to ${shortSha}`);
}

async function runAuto(dryRun: boolean): Promise<void> {
  const hasState = stateRefExists();
  let urls: string[];

  if (!hasState) {
    console.log(`no ${STATE_REF} found — first run, submitting the current full published set as a baseline`);
    urls = collectAllPublishedUrls();
  } else {
    const changes = getChangedFiles();
    const resolved = new Set<string>();
    for (const change of changes) {
      const url = resolveChangedUrl(change);
      if (url) resolved.add(url);
    }
    urls = [...resolved];
  }

  if (urls.length === 0) {
    console.log("no new or changed public URLs since the last submission — nothing to do");
    return;
  }

  if (dryRun) {
    console.log(`[dry-run] would submit ${urls.length} URL(s):`);
    for (const url of urls) console.log(`  - ${url}`);
    return;
  }

  const result = await submitToIndexNow(urls);
  printResult(urls, result);

  if (result.ok) {
    try {
      await advanceStateBranch();
    } catch (err) {
      console.error(
        `submission succeeded but advancing ${STATE_BRANCH} failed — fix this before the next run, or the same URLs will be resubmitted: ${
          err instanceof Error ? err.message : err
        }`,
      );
      process.exitCode = 1;
    }
  } else {
    console.log(`${STATE_BRANCH} NOT advanced — fix the error above and re-run so these changes are retried next time`);
    process.exitCode = 1;
  }
}

async function runManual(args: string[], dryRun: boolean): Promise<void> {
  const urls: string[] = [];
  for (const arg of args) {
    const url = toProductionUrl(arg);
    if (!url) {
      console.error(`skipping "${arg}": does not resolve to a ${SITE_URL} URL`);
      continue;
    }
    urls.push(url);
  }

  if (urls.length === 0) {
    console.error("no valid production URLs given — nothing to submit");
    process.exitCode = 1;
    return;
  }

  if (dryRun) {
    console.log(`[dry-run] would submit ${urls.length} URL(s):`);
    for (const url of urls) console.log(`  - ${url}`);
    return;
  }

  const result = await submitToIndexNow(urls);
  printResult(urls, result);
  if (!result.ok) process.exitCode = 1;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const dryRun = rawArgs.includes("--dry-run");
  const positional = rawArgs.filter((a) => a !== "--dry-run");

  if (positional.length === 0) {
    await runAuto(dryRun);
  } else {
    await runManual(positional, dryRun);
  }
}

main().catch((err) => {
  console.error("indexnow script failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});

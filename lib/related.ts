import type { ColumnEntry } from "@/lib/content/types";

const CATEGORY_MATCH_SCORE = 3;
const TAG_MATCH_SCORE = 1;
const MAX_RELATED = 3;

/**
 * Simple, explainable related-article scoring: same category outweighs any
 * number of shared tags, each shared tag adds a point, self is excluded,
 * and anything scoring 0 (nothing in common) is dropped entirely rather
 * than padded in to fill 3 slots — with only 1 published article, or none
 * sharing category/tags, this naturally returns an empty array and the
 * caller (RelatedArticles.tsx) renders nothing.
 *
 * `candidates` must already be draft-excluded (callers pass
 * `columnSource.getPublished()`) — this function doesn't re-filter drafts.
 */
export function getRelatedColumns(current: ColumnEntry, candidates: ColumnEntry[]): ColumnEntry[] {
  const currentTags = new Set(current.frontmatter.tags);

  return candidates
    .filter((candidate) => candidate.frontmatter.slug !== current.frontmatter.slug)
    .map((candidate) => {
      let score = 0;
      if (candidate.frontmatter.category === current.frontmatter.category) score += CATEGORY_MATCH_SCORE;
      for (const tag of candidate.frontmatter.tags) {
        if (currentTags.has(tag)) score += TAG_MATCH_SCORE;
      }
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.candidate.frontmatter.publishedAt.localeCompare(a.candidate.frontmatter.publishedAt);
    })
    .slice(0, MAX_RELATED)
    .map(({ candidate }) => candidate);
}

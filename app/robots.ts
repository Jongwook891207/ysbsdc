import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Stage 5-1: explicit per-bot rules. `/admin` and `/api/admin` don't exist
 * yet (no admin page/API in this app — that's explicitly out of scope for
 * every stage so far), but disallowing them now costs nothing and matches
 * this stage's brief. This is NOT a security boundary — a real admin
 * surface, whenever it's built, still needs real authentication; a
 * robots.txt disallow only asks well-behaved crawlers not to visit, it
 * can't stop anyone.
 *
 * Every named bot gets the identical public-content policy — no reason to
 * treat Googlebot/Bingbot/OAI-SearchBot differently, since every page on
 * this site is meant to be publicly indexed. GPTBot is deliberately left
 * unmentioned rather than lumped in with OAI-SearchBot: GPTBot (training
 * data collection) and OAI-SearchBot (ChatGPT's search/browsing/citation
 * feature) serve different OpenAI purposes, and this stage's goal is AI
 * search/citation visibility specifically (OAI-SearchBot), not a decision
 * about training-data opt-in/out — that's a separate policy call this
 * stage doesn't make. Leaving GPTBot unlisted means it falls under the
 * `"*"` rule below (same public access as everyone), not blocked.
 *
 * `host` (a legacy Yandex-only extension, deprecated by Yandex itself
 * since 2018 and ignored by Google/Bing) is left out — sitemap +
 * canonical URLs already do the job an official field would.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api/admin"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: "Googlebot", allow: "/", disallow },
      { userAgent: "Bingbot", allow: "/", disallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

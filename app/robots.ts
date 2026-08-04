import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * STAGE 1 PLACEHOLDER — single allow-all rule.
 * TODO(stage 5): split into explicit per-bot rules (Googlebot, Bingbot,
 * OAI-SearchBot, and any other AI crawlers the client wants indexed) since
 * a single "*" rule can't express "allow these specific bots" semantics —
 * each needs its own { userAgent, allow } entry in the `rules` array.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

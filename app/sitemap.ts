import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * STAGE 1 PLACEHOLDER — static routes only.
 * TODO(stage 5): append one entry per published column
 * (getAllColumnSlugs() from lib/columns.ts → /column/[slug], lastModified
 * from each column's updatedAt ?? publishedAt) and one entry per doctor
 * (getAllDoctorSlugs() from lib/doctors.ts → /doctor/[slug]).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/doctor", "/treatment", "/mission", "/column"];

  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}

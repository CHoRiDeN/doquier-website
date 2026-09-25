import type { MetadataRoute } from "next";
import { COMPARE_UPDATED, COMPETITORS } from "@/lib/compare";
import { LEGAL, LEGAL_LINKS, SITE_URL } from "@/lib/site";

/** When the homepage content last changed. Bump it with meaningful content updates, not every deploy. */
const HOME_UPDATED = "2026-09-25";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: HOME_UPDATED, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/compare`, lastModified: COMPARE_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    ...COMPETITORS.map((c) => ({
      url: `${SITE_URL}/compare/${c.slug}`,
      lastModified: COMPARE_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...LEGAL_LINKS.map((link) => ({
      url: `${SITE_URL}${link.href}`,
      lastModified: LEGAL.updatedISO,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}

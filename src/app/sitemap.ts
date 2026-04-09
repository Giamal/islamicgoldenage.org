/**
 * Sitemap configuration
 *
 * Generates a small starter sitemap from the supported locales and placeholder content.
 * This gives search engines a solid foundation and can later be swapped to database-backed generation.
 */
import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { getLocalizedEntities } from "@/lib/content/repository";
import { getSiteUrl } from "@/lib/site-config";

/**
 * Builds sitemap entries for the locale homepages and current placeholder content routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const staticEntries = locales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/${locale}/entities`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]);

  const entityEntries = locales.flatMap((locale) =>
    getLocalizedEntities(locale).map((entity) => ({
      url: `${siteUrl}/${locale}/entities/${entity.slug}`,
      lastModified: new Date(entity.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticEntries, ...entityEntries];
}

/**
 * Sitemap configuration
 *
 * Generates sitemap entries from locale routes and published database content.
 */
import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { getPublishedLocalizedSitemapEntitiesFromDb } from "@/lib/db/content-entity-list";
import { getSiteUrl } from "@/lib/site-config";

type SitemapEntry = MetadataRoute.Sitemap[number];

function dedupeSitemapEntries(entries: SitemapEntry[]): SitemapEntry[] {
  const byUrl = new Map<string, SitemapEntry>();

  for (const entry of entries) {
    const existing = byUrl.get(entry.url);

    if (!existing) {
      byUrl.set(entry.url, entry);
      continue;
    }

    const existingTime = existing.lastModified
      ? new Date(existing.lastModified).getTime()
      : 0;
    const incomingTime = entry.lastModified
      ? new Date(entry.lastModified).getTime()
      : 0;

    if (incomingTime > existingTime) {
      byUrl.set(entry.url, entry);
    }
  }

  return [...byUrl.values()];
}

/**
 * Builds sitemap entries for the locale homepages and published entity routes.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const records = await getPublishedLocalizedSitemapEntitiesFromDb();
  const staticLastModified =
    records.length > 0
      ? records.reduce(
          (latest, record) =>
            record.lastModified > latest ? record.lastModified : latest,
          records[0].lastModified,
        )
      : undefined;

  const staticEntries: SitemapEntry[] = locales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}`,
      lastModified: staticLastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/${locale}/entities`,
      lastModified: staticLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]);

  const entityEntries: SitemapEntry[] = records.map((record) => ({
    url: `${siteUrl}/${record.locale}/entities/${encodeURIComponent(record.slug)}`,
    lastModified: record.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return dedupeSitemapEntries([...staticEntries, ...entityEntries]);
}

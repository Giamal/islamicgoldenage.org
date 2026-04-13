/**
 * Sitemap configuration
 *
 * Generates sitemap entries from locale routes and published database content.
 */
import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-config";

/**
 * Builds sitemap entries for the locale homepages and published entity routes.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const records = await prisma.contentEntityLocalization.findMany({
    where: {
      locale: { in: [...locales] },
      entity: { status: "published" },
    },
    select: {
      locale: true,
      slug: true,
      entity: {
        select: {
          updatedAt: true,
        },
      },
    },
    orderBy: [{ entity: { importanceScore: "desc" } }, { title: "asc" }],
  });

  const entityEntries = records.map((record) => ({
      url: `${siteUrl}/${record.locale}/entities/${record.slug}`,
      lastModified: record.entity.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...entityEntries];
}

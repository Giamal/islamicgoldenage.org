/**
 * Minimal Prisma listing helper for locale-scoped entity cards.
 */
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type EntityListItem = {
  id: string;
  canonicalSlug: string;
  entityType: "person" | "work" | "topic" | "event" | "place" | "source";
  featuredYear?: number;
  updatedAt: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyParagraphs: string[];
};

export type SitemapEntityLocalizationGroup = {
  entityId: string;
  lastModified: Date;
  localizations: Array<{
    locale: Locale;
    slug: string;
  }>;
};

/**
 * Returns locale-specific, published entities for the main listing page.
 *
 * Ordered by:
 * 1) canonical importance descending
 * 2) localized title ascending
 */
async function getPublishedLocalizedEntitiesFromDbUncached(
  locale: Locale,
): Promise<EntityListItem[]> {
  const queryStartedAt = Date.now();
  const records = await prisma.contentEntityLocalization.findMany({
    where: {
      locale,
      entity: {
        status: "published",
      },
    },
    include: {
      entity: {
        select: {
          id: true,
          canonicalSlug: true,
          entityType: true,
          updatedAt: true,
          importanceScore: true,
        },
      },
    },
    orderBy: [{ entity: { importanceScore: "desc" } }, { title: "asc" }],
  });
  const queryDurationMs = Date.now() - queryStartedAt;
  console.info(
    `[perf][entities-list][db] locale=${locale} rows=${records.length} duration_ms=${queryDurationMs}`,
  );

  return records.map((record) => ({
    id: record.entity.id,
    canonicalSlug: record.entity.canonicalSlug,
    entityType: record.entity.entityType,
    featuredYear: undefined,
    updatedAt: record.entity.updatedAt.toISOString(),
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt || record.summary,
    bodyParagraphs: [record.summary],
  }));
}

export const getPublishedLocalizedEntitiesFromDb = unstable_cache(
  async (locale: Locale) => getPublishedLocalizedEntitiesFromDbUncached(locale),
  ["content-entities-list-by-locale"],
  { revalidate: 3600 },
);

/**
 * Returns published entities with all available localized slugs for sitemap generation.
 *
 * Notes:
 * - constrained to supported app locales from i18n config
 * - excludes empty slugs
 * - keeps all localizations grouped by entity to build hreflang alternates
 */
async function getPublishedSitemapEntityLocalizationGroupsFromDbUncached(): Promise<
  SitemapEntityLocalizationGroup[]
> {
  const queryStartedAt = Date.now();
  const records = await prisma.contentEntity.findMany({
    where: {
      status: "published",
    },
    select: {
      id: true,
      updatedAt: true,
      importanceScore: true,
      localizations: {
        where: {
          locale: { in: [...locales] },
          slug: { not: "" },
        },
        select: {
          locale: true,
          slug: true,
          updatedAt: true,
        },
      },
    },
    orderBy: [{ importanceScore: "desc" }, { updatedAt: "desc" }],
  });
  const queryDurationMs = Date.now() - queryStartedAt;
  console.info(
    `[perf][sitemap-entities][db] entities=${records.length} duration_ms=${queryDurationMs}`,
  );

  return records
    .filter((record) => record.localizations.length > 0)
    .map((record) => {
      const lastModified = record.localizations.reduce(
        (latest, localization) =>
          localization.updatedAt > latest ? localization.updatedAt : latest,
        record.updatedAt,
      );

      return {
        entityId: record.id,
        lastModified,
        localizations: record.localizations.map((localization) => ({
          locale: localization.locale as Locale,
          slug: localization.slug,
        })),
      };
    });
}

export const getPublishedSitemapEntityLocalizationGroupsFromDb = unstable_cache(
  async () => getPublishedSitemapEntityLocalizationGroupsFromDbUncached(),
  ["content-entities-sitemap-localization-groups"],
  { revalidate: 3600 },
);


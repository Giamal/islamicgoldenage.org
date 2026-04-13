/**
 * Minimal Prisma listing helper for locale-scoped entity cards.
 */
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
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

export type SitemapEntityItem = {
  locale: Locale;
  slug: string;
  lastModified: Date;
};

/**
 * Returns locale-specific, published entities for the main listing page.
 *
 * Ordered by:
 * 1) canonical importance descending
 * 2) localized title ascending
 */
export async function getPublishedLocalizedEntitiesFromDb(
  locale: Locale,
): Promise<EntityListItem[]> {
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

/**
 * Returns published localized entities for sitemap generation.
 *
 * Notes:
 * - constrained to supported app locales from i18n config
 * - excludes empty slugs
 * - uses localization.updatedAt first, then entity.updatedAt as fallback
 */
export async function getPublishedLocalizedSitemapEntitiesFromDb(): Promise<
  SitemapEntityItem[]
> {
  const records = await prisma.contentEntityLocalization.findMany({
    where: {
      locale: { in: [...locales] },
      slug: { not: "" },
      entity: {
        status: "published",
      },
    },
    select: {
      locale: true,
      slug: true,
      updatedAt: true,
      entity: {
        select: {
          updatedAt: true,
          importanceScore: true,
        },
      },
    },
    orderBy: [{ entity: { importanceScore: "desc" } }, { title: "asc" }],
  });

  return records
    .filter((record) => record.slug.trim().length > 0)
    .map((record) => ({
      locale: record.locale as Locale,
      slug: record.slug,
      lastModified: record.updatedAt ?? record.entity.updatedAt,
    }));
}


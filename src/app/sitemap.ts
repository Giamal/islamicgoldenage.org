/**
 * Sitemap configuration
 *
 * Generates sitemap entries from locale routes and published database content.
 */
import type { MetadataRoute } from "next";

import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getPublishedSitemapEntityLocalizationGroupsFromDb } from "@/lib/db/content-entity-list";
import { getSiteUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type SitemapEntry = MetadataRoute.Sitemap[number];

function buildLocaleAlternates(
  localizedUrls: Partial<Record<Locale, string>>,
): Record<string, string> {
  const alternates: Record<string, string> = {};

  for (const locale of locales) {
    const url = localizedUrls[locale];
    if (url) {
      alternates[locale] = url;
    }
  }

  const xDefaultUrl =
    localizedUrls[defaultLocale] ?? Object.values(alternates)[0];

  if (xDefaultUrl) {
    alternates["x-default"] = xDefaultUrl;
  }

  return alternates;
}

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

  const entityGroups = await getPublishedSitemapEntityLocalizationGroupsFromDb();
  const staticLastModified =
    entityGroups.length > 0
      ? entityGroups.reduce(
          (latest, record) =>
            record.lastModified > latest ? record.lastModified : latest,
          entityGroups[0].lastModified,
        )
      : undefined;

  const staticHomeUrls = Object.fromEntries(
    locales.map((locale) => [locale, `${siteUrl}/${locale}`]),
  ) as Partial<Record<Locale, string>>;
  const staticEntityIndexUrls = Object.fromEntries(
    locales.map((locale) => [locale, `${siteUrl}/${locale}/entities`]),
  ) as Partial<Record<Locale, string>>;

  const staticEntries: SitemapEntry[] = locales.flatMap((locale) => {
    const homeUrl = staticHomeUrls[locale];
    const entityIndexUrl = staticEntityIndexUrls[locale];

    if (!homeUrl || !entityIndexUrl) {
      return [];
    }

    return [
      {
        url: homeUrl,
        lastModified: staticLastModified,
        changeFrequency: "weekly" as const,
        priority: 1,
        alternates: { languages: buildLocaleAlternates(staticHomeUrls) },
      },
      {
        url: entityIndexUrl,
        lastModified: staticLastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: { languages: buildLocaleAlternates(staticEntityIndexUrls) },
      },
    ];
  });

  const entityEntries: SitemapEntry[] = entityGroups.flatMap((group) => {
    const localizedUrls = Object.fromEntries(
      group.localizations.map((localization) => [
        localization.locale,
        `${siteUrl}/${localization.locale}/entities/${encodeURIComponent(
          localization.slug,
        )}`,
      ]),
    ) as Partial<Record<Locale, string>>;

    const alternates = buildLocaleAlternates(localizedUrls);

    return group.localizations.reduce<SitemapEntry[]>((entries, localization) => {
      const url = localizedUrls[localization.locale];

      if (!url) {
        return entries;
      }

      entries.push({
        url,
        lastModified: group.lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages: alternates },
      });

      return entries;
    }, []);
  });

  return dedupeSitemapEntries([...staticEntries, ...entityEntries]);
}

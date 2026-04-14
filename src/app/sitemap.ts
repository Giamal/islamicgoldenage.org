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

function getCanonicalLocaleForAlternates(
  localizedUrls: Partial<Record<Locale, string>>,
): Locale | null {
  if (localizedUrls[defaultLocale]) {
    return defaultLocale;
  }

  for (const locale of locales) {
    if (localizedUrls[locale]) {
      return locale;
    }
  }

  return null;
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

  const staticEntries: SitemapEntry[] = [];

  const canonicalHomeLocale = getCanonicalLocaleForAlternates(staticHomeUrls);
  if (canonicalHomeLocale) {
    staticEntries.push({
      url: staticHomeUrls[canonicalHomeLocale] as string,
      lastModified: staticLastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: { languages: buildLocaleAlternates(staticHomeUrls) },
    });
  }

  const canonicalEntityIndexLocale =
    getCanonicalLocaleForAlternates(staticEntityIndexUrls);
  if (canonicalEntityIndexLocale) {
    staticEntries.push({
      url: staticEntityIndexUrls[canonicalEntityIndexLocale] as string,
      lastModified: staticLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: buildLocaleAlternates(staticEntityIndexUrls) },
    });
  }

  const entityEntries: SitemapEntry[] = entityGroups.reduce<SitemapEntry[]>(
    (entries, group) => {
    const localizedUrls = Object.fromEntries(
      group.localizations.map((localization) => [
        localization.locale,
        `${siteUrl}/${localization.locale}/entities/${encodeURIComponent(
          localization.slug,
        )}`,
      ]),
    ) as Partial<Record<Locale, string>>;

    const canonicalLocale = getCanonicalLocaleForAlternates(localizedUrls);
    if (!canonicalLocale) {
      return entries;
    }

    const alternates = buildLocaleAlternates(localizedUrls);
    entries.push({
      url: localizedUrls[canonicalLocale] as string,
      lastModified: group.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: alternates },
    });

    return entries;
  }, []);

  return [...staticEntries, ...entityEntries];
}

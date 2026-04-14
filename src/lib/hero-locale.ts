import { publicLocales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

type HeroLocaleOptions = {
  pinnedLocale?: Locale;
  defaultSecondaryLocale?: Locale;
};

/**
 * Computes the primary locales shown in hero language bars.
 *
 * Rules:
 * - one pinned locale is always visible (default: "ar")
 * - when current locale is pinned, the second locale is inferred from Accept-Language
 * - falls back to a default secondary locale (default: "en")
 */
export function getHeroPrimaryLocales(
  currentLocale: Locale,
  acceptLanguageHeader: string,
  options: HeroLocaleOptions = {},
): Locale[] {
  const pinnedLocale = options.pinnedLocale ?? "ar";
  const defaultSecondaryLocale = options.defaultSecondaryLocale ?? "en";
  const preferredLanguageTag = acceptLanguageHeader
    .split(",")[0]
    ?.trim()
    .toLowerCase();
  const preferredLocale = publicLocales.find(
    (supportedLocale) =>
      preferredLanguageTag === supportedLocale ||
      preferredLanguageTag?.startsWith(`${supportedLocale}-`),
  );
  const secondaryLocale =
    currentLocale === pinnedLocale
      ? preferredLocale && preferredLocale !== pinnedLocale
        ? preferredLocale
        : defaultSecondaryLocale
      : currentLocale;

  return Array.from(new Set<Locale>([pinnedLocale, secondaryLocale]));
}

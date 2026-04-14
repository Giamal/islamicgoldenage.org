/**
 * SEO helpers
 *
 * Centralizes metadata generation for locale-aware pages.
 * This keeps canonical URLs, hreflang data, and descriptions consistent as the route surface grows.
 */
import type { Metadata } from "next";

import {
  defaultPublicLocale,
  localeDirections,
  publicLocales,
  type Locale,
} from "@/i18n/config";
import { getSiteUrl } from "@/lib/site-config";

type LocaleMetadataInput = {
  title: string;
  description: string;
  path: string;
};

/**
 * Returns the text direction used by the locale-aware document root.
 */
export function getLocaleDirection(locale: Locale) {
  return localeDirections[locale];
}

/**
 * Builds a locale-prefixed absolute URL for metadata and sitemap generation.
 */
function buildAbsoluteLocaleUrl(locale: Locale, path: string) {
  const normalizedPath =
    path.startsWith("/") || path === "" ? path : `/${path}`;
  return `${getSiteUrl()}/${locale}${normalizedPath}`;
}

/**
 * Builds a shared metadata object with canonical and hreflang alternates.
 */
export function buildLocaleMetadata(
  locale: Locale,
  input: LocaleMetadataInput,
): Metadata {
  const alternates = Object.fromEntries(
    publicLocales.map((supportedLocale) => [
      supportedLocale,
      buildAbsoluteLocaleUrl(supportedLocale, input.path),
    ]),
  );

  return {
    metadataBase: new URL(getSiteUrl()),
    title: input.title,
    description: input.description,
    alternates: {
      canonical: buildAbsoluteLocaleUrl(locale, input.path),
      languages: {
        ...alternates,
        "x-default": buildAbsoluteLocaleUrl(defaultPublicLocale, input.path),
      },
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: buildAbsoluteLocaleUrl(locale, input.path),
      siteName: "Islamic Golden Age",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}


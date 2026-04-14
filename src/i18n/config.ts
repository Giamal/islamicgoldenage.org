/**
 * Internationalization configuration
 *
 * Defines the supported locales and locale-specific helpers for routing and future translation work.
 * Keeping the contract centralized prevents string drift across pages, SEO helpers, and data access.
 */
export type Locale = "en" | "it" | "ar";

/**
 * Full locale set kept for internal/editorial workflows.
 * Italian is intentionally kept here so content and admin workflows remain intact.
 */
export const allLocales: readonly Locale[] = ["en", "it", "ar"];

/**
 * Public locale set currently exposed to users.
 * Italian ("it") is temporarily disabled on the public frontend.
 */
export const publicLocales: readonly Locale[] = ["en", "ar"];

/**
 * Backward-compatible alias used by existing admin and internal logic.
 */
export const locales: readonly Locale[] = allLocales;

export const defaultLocale: Locale = "en";
export const defaultPublicLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  it: "IT",
  ar: "AR",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  it: "ltr",
  ar: "rtl",
};

/**
 * Guards runtime values before they enter the typed locale-aware parts of the app.
 */
export function isLocale(value: string | undefined): value is Locale {
  return allLocales.includes(value as Locale);
}

/**
 * Guards runtime values for public-facing locale resolution only.
 */
export function isPublicLocale(value: string | undefined): value is Locale {
  return publicLocales.includes(value as Locale);
}

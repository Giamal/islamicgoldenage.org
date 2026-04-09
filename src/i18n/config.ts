/**
 * Internationalization configuration
 *
 * Defines the supported locales and locale-specific helpers for routing and future translation work.
 * Keeping the contract centralized prevents string drift across pages, SEO helpers, and data access.
 */
export const locales = ["en", "it", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

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
  return locales.includes(value as Locale);
}

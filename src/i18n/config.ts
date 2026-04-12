/**
 * Internationalization configuration
 *
 * Defines the supported locales and locale-specific helpers for routing and future translation work.
 * Keeping the contract centralized prevents string drift across pages, SEO helpers, and data access.
 */
import type { Locale as SharedLocale } from "@/lib/types/i18n";

export type Locale = SharedLocale;

export const locales: readonly Locale[] = ["en", "it", "ar"];

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

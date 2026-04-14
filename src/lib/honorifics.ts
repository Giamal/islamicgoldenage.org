import type { Locale } from "@/i18n/config";

/**
 * Adds honorifics for references to Prophet Muhammad in public-facing text.
 *
 * Rules:
 * - English: "Muhammad" -> "Muhammad (PBUH)"
 * - Arabic: "محمد" -> "محمد ﷺ"
 * - Avoids common false positives like "Muhammad ibn ..." / "محمد بن ..."
 * - Idempotent when honorific already exists
 */
export function applyMuhammadHonorific(text: string, locale: Locale): string {
  if (!text) {
    return text;
  }

  if (locale === "en") {
    return text.replace(
      /\bMuhammad\b(?!\s*(?:\(PBUH\)|ibn\b|bin\b))/g,
      "Muhammad (PBUH)",
    );
  }

  if (locale === "ar") {
    return text.replace(/محمد(?!\s*(?:ﷺ|بن))/g, "محمد ﷺ");
  }

  return text;
}

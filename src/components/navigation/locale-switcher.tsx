/**
 * Locale switcher
 *
 * Gives visitors a direct way to move between supported locales while preserving the current route context.
 * This keeps multilingual navigation predictable on nested pages without adding extra routing complexity.
 */
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { UrlObject } from "url";

import { localeLabels, locales, type Locale } from "@/i18n/config";

type LocaleSwitcherProps = {
  currentLocale: Locale;
  localizedEntityLinks?: Partial<Record<Locale, string>>;
};

/**
 * Renders supported locale links and highlights the active locale.
 */
export function LocaleSwitcher({
  currentLocale,
  localizedEntityLinks,
}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Replaces only the leading locale segment and preserves the rest of the path plus query parameters.
   * This returns a plain pathname string because the value is computed at runtime and cannot be proven
   * against Next.js generated route unions without an unsafe cast.
   */
  function buildLocalizedPath(targetLocale: Locale) {
    if (localizedEntityLinks) {
      return localizedEntityLinks[targetLocale] ?? `/${targetLocale}/entities`;
    }

    const segments = pathname.split("/");

    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      segments[1] = targetLocale;
    } else {
      segments.splice(1, 0, targetLocale);
    }

    return segments.join("/") || `/${targetLocale}`;
  }

  /**
   * Uses a UrlObject so Link stays fully typed while preserving the computed pathname and query parameters.
   */
  function buildLocalizedHref(targetLocale: Locale): UrlObject {
    return {
      pathname: buildLocalizedPath(targetLocale),
      query: Object.fromEntries(searchParams.entries()),
    };
  }

  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={buildLocalizedHref(locale)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              isActive
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]"
            }`}
            hrefLang={locale}
            lang={locale}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}

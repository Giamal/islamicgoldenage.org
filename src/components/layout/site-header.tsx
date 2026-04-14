/**
 * Site header
 *
 * Provides consistent top-level navigation across all locale pages.
 * Keeping this as a server component keeps the shell simple and avoids unnecessary client bundles.
 */
import Link from "next/link";
import { Suspense } from "react";
import type { Route } from "next";

import { LocaleSwitcher } from "@/components/navigation/locale-switcher";
import type { Locale } from "@/i18n/config";
import { localeLabels, locales } from "@/i18n/config";
import { getNavigationCopy } from "@/lib/ui-copy";

type SiteHeaderProps = {
  locale: Locale;
  localizedEntityLinks?: Partial<Record<Locale, string>>;
};

function LocaleSwitcherFallback({
  currentLocale,
  localizedEntityLinks,
}: {
  currentLocale: Locale;
  localizedEntityLinks?: Partial<Record<Locale, string>>;
}) {
  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={
              (localizedEntityLinks?.[locale] ?? `/${locale}`) as Route
            }
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

/**
 * Renders the shared site header with primary navigation and locale switching.
 */
export function SiteHeader({ locale, localizedEntityLinks }: SiteHeaderProps) {
  const copy = getNavigationCopy(locale);

  return (
    <header className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-[var(--shadow)] backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href={`/${locale}`}
            className="text-lg font-semibold tracking-[0.08em] text-[var(--foreground)]"
          >
            Islamic Golden Age
          </Link>
          <p className="mt-1 text-sm text-[var(--muted)]">{copy.tagline}</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-[var(--muted)]">
            <Link href={`/${locale}`}>{copy.home}</Link>
            <Link href={`/${locale}/entities`}>{copy.explore}</Link>
          </nav>
          <Suspense
            fallback={
              <LocaleSwitcherFallback
                currentLocale={locale}
                localizedEntityLinks={localizedEntityLinks}
              />
            }
          >
            <LocaleSwitcher
              currentLocale={locale}
              localizedEntityLinks={localizedEntityLinks}
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

/**
 * Locale switcher
 *
 * Gives visitors a direct way to move between supported locales.
 * The implementation stays stateless so routing logic remains easy to follow for a solo-maintained project.
 */
import Link from "next/link";

import { localeLabels, locales, type Locale } from "@/i18n/config";

type LocaleSwitcherProps = {
  currentLocale: Locale;
};

/**
 * Renders supported locale links and highlights the active locale.
 */
export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={`/${locale}`}
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

import Link from "next/link";
import type { Route } from "next";

import type { Locale } from "@/i18n/config";
import { localeLabels, locales } from "@/i18n/config";

type HeroLanguageBarProps = {
  currentLocale: Locale;
  hrefForLocale: (locale: Locale) => string;
  primaryLocales: Locale[];
};

export function HeroLanguageBar({
  currentLocale,
  hrefForLocale,
  primaryLocales,
}: HeroLanguageBarProps) {
  const uniquePrimaryLocales = Array.from(new Set(primaryLocales)).filter(
    (localeOption): localeOption is Locale => locales.includes(localeOption),
  );
  const secondaryLocales = locales.filter(
    (localeOption) => !uniquePrimaryLocales.includes(localeOption),
  );
  const isCurrentLocalePrimary = uniquePrimaryLocales.includes(currentLocale);

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/55 bg-black/45 px-3 py-1.5 backdrop-blur-sm">
      <span className="inline-flex h-5 w-5 items-center justify-center text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M12 3a14 14 0 0 0 0 18" />
        </svg>
      </span>
      <div className="flex items-center gap-2">
        {uniquePrimaryLocales.map((localeOption) => {
          const isActive = localeOption === currentLocale;
          return (
            <Link
              key={localeOption}
              href={hrefForLocale(localeOption) as Route}
              hrefLang={localeOption}
              lang={localeOption}
              className={`rounded-full px-2 py-0.5 text-xs font-semibold transition ${
                isActive ? "bg-sky-500 text-white" : "text-white hover:bg-white/20"
              }`}
            >
              {localeLabels[localeOption]}
            </Link>
          );
        })}
        {secondaryLocales.length > 0 ? (
          <details className="relative">
            <summary
              className="cursor-pointer list-none rounded-full p-1 text-white transition hover:bg-white/20 [&::-webkit-details-marker]:hidden"
              aria-label="Open language menu"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M5 8l5 5 5-5" />
              </svg>
            </summary>
            <div className="absolute right-0 z-20 mt-2 min-w-28 rounded-xl border border-white/50 bg-black/70 p-1.5 shadow-xl backdrop-blur-sm">
              {!isCurrentLocalePrimary ? (
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/80">
                  {localeLabels[currentLocale]}
                </p>
              ) : null}
              {secondaryLocales.map((localeOption) => {
                const isActive = localeOption === currentLocale;

                return (
                  <Link
                    key={localeOption}
                    href={hrefForLocale(localeOption) as Route}
                    hrefLang={localeOption}
                    lang={localeOption}
                    className={`block rounded-lg px-2 py-1 text-xs font-semibold ${
                      isActive ? "bg-sky-500 text-white" : "text-white hover:bg-white/20"
                    }`}
                  >
                    {localeLabels[localeOption]}
                  </Link>
                );
              })}
            </div>
          </details>
        ) : null}
      </div>
    </div>
  );
}

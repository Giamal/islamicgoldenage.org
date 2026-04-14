import { HeroLanguageBar } from "@/components/navigation/hero-language-bar";
import type { Locale } from "@/i18n/config";
import { getHeroNavigationCopy } from "@/lib/ui-copy";
import Link from "next/link";
import type { ReactNode } from "react";

type PublicHeroProps = {
  locale: Locale;
  primaryLocales: Locale[];
  hrefForLocale: (locale: Locale) => string;
  kicker: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PublicHero({
  locale,
  primaryLocales,
  hrefForLocale,
  kicker,
  title,
  description,
  children,
}: PublicHeroProps) {
  const heroNavCopy = getHeroNavigationCopy(locale);

  return (
    <header className="relative w-screen overflow-hidden [margin-inline:calc(50%-50vw)]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,16,24,0.52) 0%, rgba(20,14,10,0.72) 100%), radial-gradient(120% 80% at 50% 5%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 50%), url('/images/hero/home-hero.png') center/cover no-repeat, linear-gradient(120deg, #4f6f8d 0%, #8a6a42 58%, #a56f2d 100%)",
        }}
      />
      <div className="relative z-10 px-5 py-6 text-white sm:px-8 sm:py-10">
        <nav className="absolute left-5 right-5 top-5 flex items-center justify-between text-sm font-semibold sm:left-8 sm:right-8 sm:top-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}`}
              className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] hover:text-white/85"
            >
              {heroNavCopy.home}
            </Link>
            <Link
              href={`/${locale}/entities`}
              className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] hover:text-white/85"
            >
              {heroNavCopy.archive}
            </Link>
          </div>
          <HeroLanguageBar
            currentLocale={locale}
            primaryLocales={primaryLocales}
            hrefForLocale={hrefForLocale}
          />
        </nav>

        <div className="mx-auto max-w-3xl space-y-5 pt-6 text-center sm:pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
            {kicker}
          </p>
          <h1 className="text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-[4rem]">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
            {description}
          </p>
          {children}
        </div>
      </div>
    </header>
  );
}

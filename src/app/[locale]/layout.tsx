/**
 * Locale root layout
 *
 * Serves as the HTML root for every locale-prefixed page.
 * This keeps language and direction metadata close to routing, which is important for SEO and future Arabic RTL support.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

import "@/app/globals.css";

import { isLocale, publicLocales, type Locale } from "@/i18n/config";
import { buildLocaleMetadata, getLocaleDirection } from "@/lib/seo";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Prebuilds the supported locale roots so the routing contract stays explicit.
 */
export function generateStaticParams() {
  return publicLocales.map((locale) => ({ locale }));
}

/**
 * Provides locale-aware metadata at the layout level for consistent SEO defaults.
 */
export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return buildLocaleMetadata(locale, {
    title: "Islamic Golden Age",
    description:
      "A multilingual educational reference platform for scholars, books, events, discoveries, and timelines from the Islamic Golden Age.",
    path: "",
  });
}

/**
 * Validates the locale and applies the correct language and text direction to the document root.
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const googleAnalyticsId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-8717L66F73";

  return (
    <html lang={typedLocale} dir={getLocaleDirection(typedLocale)}>
      <body className="min-h-screen bg-transparent text-[var(--foreground)] antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
        <div className="mx-auto flex min-h-screen w-full max-w-[76rem] flex-col px-4 pb-6 sm:px-6 lg:px-10">
          <main className="flex-1">{children}</main>
          <footer className="mt-12 border-t border-[var(--border)] pt-6 pb-8">
            <div className="flex flex-col gap-3 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
              <p>Islamic Golden Age Archive</p>
              <div className="flex items-center gap-4">
                <Link href={`/${typedLocale}`} className="hover:text-[var(--accent)]">
                  Home
                </Link>
                <Link
                  href={`/${typedLocale}/entities`}
                  className="hover:text-[var(--accent)]"
                >
                  Entities
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

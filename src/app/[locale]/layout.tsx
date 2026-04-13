/**
 * Locale root layout
 *
 * Serves as the HTML root for every locale-prefixed page.
 * This keeps language and direction metadata close to routing, which is important for SEO and future Arabic RTL support.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import "@/app/globals.css";

import { isLocale, locales, type Locale } from "@/i18n/config";
import { buildLocaleMetadata, getLocaleDirection } from "@/lib/seo";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Prebuilds the supported locale roots so the routing contract stays explicit.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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

  return (
    <html lang={typedLocale} dir={getLocaleDirection(typedLocale)}>
      <body className="min-h-screen bg-transparent text-[var(--foreground)] antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <main className="flex-1 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}

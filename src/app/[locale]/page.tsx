/**
 * Locale homepage
 *
 * Introduces the platform and gives search engines a strong landing page per language.
 * The content is intentionally small while the product foundation is still being established.
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { isLocale } from "@/i18n/config";
import { buildLocaleMetadata } from "@/lib/seo";
import { getHomepageCopy } from "@/lib/ui-copy";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Generates homepage-specific metadata with locale-aware canonical and hreflang values.
 */
export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return buildLocaleMetadata(locale, {
    title: "Islamic Golden Age",
    description:
      "Explore scholars, books, events, and discoveries through a multilingual educational platform designed for reliable reference and future growth.",
    path: "",
  });
}

/**
 * Renders the locale homepage with a concise value proposition and clear navigation.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getHomepageCopy(locale);

  return (
    <div className="space-y-10">
      <SiteHeader locale={locale} />
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur sm:p-10">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--warm)]">
            {copy.kicker}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
            {copy.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/entities`}
              className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            >
              {copy.primaryCta}
            </Link>
            <Link
              href={`/${locale}/entities/al-khwarizmi`}
              className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
            >
              {copy.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {copy.highlights.map((highlight) => (
          <article
            key={highlight.title}
            className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6"
          >
            <h2 className="text-xl font-semibold">{highlight.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {highlight.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

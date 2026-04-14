/**
 * Entity listing page
 *
 * Provides the first browseable directory of content in the application.
 * Reads published records directly from Prisma.
 */
import { notFound } from "next/navigation";

import { EntityCard } from "@/components/content/entity-card";
import { SiteHeader } from "@/components/layout/site-header";
import { isLocale } from "@/i18n/config";
import { getPublishedLocalizedEntitiesFromDb } from "@/lib/db/content-entity-list";
import { buildLocaleMetadata } from "@/lib/seo";
import { getEntityIndexCopy } from "@/lib/ui-copy";

export const revalidate = 3600;

type EntityIndexPageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Generates metadata for the first public content directory.
 */
export async function generateMetadata({ params }: EntityIndexPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return buildLocaleMetadata(locale, {
    title: "Explore Content",
    description:
      "Browse scholars, books, events, categories, and articles from the Islamic Golden Age in a multilingual content index.",
    path: "/entities",
  });
}

/**
 * Renders the locale content index from database data.
 */
export default async function EntityIndexPage({
  params,
}: EntityIndexPageProps) {
  const renderStartedAt = Date.now();
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getEntityIndexCopy(locale);
  const entities = await getPublishedLocalizedEntitiesFromDb(locale);
  const renderDurationMs = Date.now() - renderStartedAt;
  console.info(
    `[perf][entities-list][render] locale=${locale} rows=${entities.length} duration_ms=${renderDurationMs}`,
  );

  return (
    <div className="space-y-10">
      <SiteHeader locale={locale} />
      <header className="public-surface space-y-4 p-7 sm:p-8">
        <p className="public-kicker">
          {copy.kicker}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-[2.8rem]">
          {copy.title}
        </h1>
        <p className="max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
          {copy.description}
        </p>
      </header>

      {entities.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {entities.map((entity) => (
            <EntityCard key={entity.id} entity={entity} locale={locale} />
          ))}
        </div>
      ) : (
        <section className="public-surface p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">No entries yet</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Published content will appear here once the first entries are available
            in this locale.
          </p>
        </section>
      )}
    </div>
  );
}

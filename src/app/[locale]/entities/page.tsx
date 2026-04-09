/**
 * Entity listing page
 *
 * Provides the first browseable directory of content in the application.
 * Uses repository helpers so the UI can later switch from placeholder data to Prisma without large route rewrites.
 */
import { notFound } from "next/navigation";

import { EntityCard } from "@/components/content/entity-card";
import { isLocale } from "@/i18n/config";
import { getLocalizedEntities } from "@/lib/content/repository";
import { buildLocaleMetadata } from "@/lib/seo";
import { getEntityIndexCopy } from "@/lib/ui-copy";

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
 * Renders the placeholder content index for the selected locale.
 */
export default async function EntityIndexPage({
  params,
}: EntityIndexPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getEntityIndexCopy(locale);
  const entities = getLocalizedEntities(locale);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--warm)]">
          {copy.kicker}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
          {copy.description}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {entities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} locale={locale} />
        ))}
      </div>
    </div>
  );
}

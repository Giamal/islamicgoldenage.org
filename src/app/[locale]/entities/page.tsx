/**
 * Entity listing page
 *
 * Provides a type-driven browsing experience where each entity type is presented
 * with a distinct visual rhythm while keeping the same editorial language of the homepage.
 */
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { PublicHero } from "@/components/layout/public-hero";
import { isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getPublishedLocalizedEntitiesFromDb } from "@/lib/db/content-entity-list";
import type { EntityListItem } from "@/lib/db/content-entity-list";
import { getHeroPrimaryLocales } from "@/lib/hero-locale";
import { buildLocaleMetadata } from "@/lib/seo";
import {
  getEntityIndexCopy,
  getEntityTypeLabel,
} from "@/lib/ui-copy";
import type { ContentEntityType } from "@prisma/client";

export const revalidate = 3600;

type EntityIndexPageProps = {
  params: Promise<{ locale: string }>;
};

const entityTypeOrder: ContentEntityType[] = [
  "person",
  "work",
  "topic",
  "event",
  "place",
  "source",
];

function getEntityPageLabels(locale: Locale) {
  const dictionary = {
    en: {
      archiveEyebrow: "Editorial Directory",
      heroTitle: "Entities Archive",
      heroDescription:
        "Browse the published corpus through six editorial lenses. Every section adapts its layout to the nature of the content.",
      emptySection: "No published entries in this section yet.",
      emptyPageTitle: "No entries yet",
      emptyPageDescription:
        "Published entities will appear here as soon as the first records are available in this locale.",
      updated: "Updated",
      sectionDescription: {
        person: "Biographical profiles and intellectual trajectories.",
        work: "Texts, treatises, compilations, and written legacies.",
        topic: "Disciplines, concepts, and thematic pathways.",
        event: "Moments and milestones in historical context.",
        place: "Cities, regions, and geographies of knowledge.",
        source: "Primary and secondary reference materials.",
      },
    },
    it: {
      archiveEyebrow: "Indice Editoriale",
      heroTitle: "Archivio delle Entita",
      heroDescription:
        "Esplora il corpus pubblicato attraverso sei prospettive editoriali. Ogni sezione adotta un layout adatto alla tipologia dei contenuti.",
      emptySection: "Nessuna voce pubblicata in questa sezione.",
      emptyPageTitle: "Nessuna voce disponibile",
      emptyPageDescription:
        "Le entita pubblicate appariranno qui non appena saranno disponibili in questa lingua.",
      updated: "Aggiornato",
      sectionDescription: {
        person: "Profili biografici e traiettorie intellettuali.",
        work: "Testi, trattati, compilazioni e tradizioni scritte.",
        topic: "Discipline, concetti e percorsi tematici.",
        event: "Momenti e snodi storici nel loro contesto.",
        place: "Citta, regioni e geografie della conoscenza.",
        source: "Materiali di riferimento primari e secondari.",
      },
    },
    ar: {
      archiveEyebrow: "Editorial Directory",
      heroTitle: "Entities Archive",
      heroDescription:
        "Browse the published corpus through six editorial lenses. Every section adapts its layout to the nature of the content.",
      emptySection: "No published entries in this section yet.",
      emptyPageTitle: "No entries yet",
      emptyPageDescription:
        "Published entities will appear here as soon as the first records are available in this locale.",
      updated: "Updated",
      sectionDescription: {
        person: "Biographical profiles and intellectual trajectories.",
        work: "Texts, treatises, compilations, and written legacies.",
        topic: "Disciplines, concepts, and thematic pathways.",
        event: "Moments and milestones in historical context.",
        place: "Cities, regions, and geographies of knowledge.",
        source: "Primary and secondary reference materials.",
      },
    },
  } as const;

  return dictionary[locale];
}

function formatDateLabel(locale: Locale, isoDate: string): string {
  const formattedLocale = locale === "ar" ? "ar" : locale;

  return new Intl.DateTimeFormat(formattedLocale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(isoDate));
}

function renderPersonLayout(
  locale: Locale,
  entities: EntityListItem[],
  labels: ReturnType<typeof getEntityPageLabels>,
) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {entities.map((entity) => (
        <Link
          key={entity.id}
          href={`/${locale}/entities/${encodeURIComponent(entity.slug)}`}
          className="group rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-sm font-semibold text-[var(--warm)]">
              {entity.title.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl font-semibold tracking-tight transition group-hover:text-[var(--accent)]">
                {entity.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{entity.excerpt}</p>
              <p className="mt-3 text-xs font-medium text-[var(--muted)]">
                {labels.updated}: {formatDateLabel(locale, entity.updatedAt)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function renderWorkLayout(locale: Locale, entities: EntityListItem[]) {
  return (
    <ol className="relative space-y-4 border-s border-[var(--border)] ps-4">
      {entities.map((entity) => (
        <li key={entity.id} className="relative rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-5">
          <span className="absolute -start-[1.45rem] top-6 h-3 w-3 rounded-full border border-[var(--accent)] bg-white" />
          <Link
            href={`/${locale}/entities/${encodeURIComponent(entity.slug)}`}
            className="group block"
          >
            <h3 className="text-2xl font-semibold tracking-tight transition group-hover:text-[var(--accent)]">
              {entity.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{entity.excerpt}</p>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function renderTopicLayout(locale: Locale, entities: EntityListItem[]) {
  return (
    <div className="flex flex-wrap gap-3">
      {entities.map((entity) => (
        <Link
          key={entity.id}
          href={`/${locale}/entities/${encodeURIComponent(entity.slug)}`}
          className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          {entity.title}
        </Link>
      ))}
    </div>
  );
}

function renderEventLayout(
  locale: Locale,
  entities: EntityListItem[],
  labels: ReturnType<typeof getEntityPageLabels>,
) {
  return (
    <div className="space-y-3">
      {entities.map((entity, index) => (
        <Link
          key={entity.id}
          href={`/${locale}/entities/${encodeURIComponent(entity.slug)}`}
          className="group grid gap-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:grid-cols-[74px_minmax(0,1fr)]"
        >
          <div className="rounded-xl bg-[var(--surface-muted)] px-2 py-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[var(--warm)]">
            {entity.featuredYear ?? new Date(entity.updatedAt).getFullYear() ?? index + 1}
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight transition group-hover:text-[var(--accent)]">
              {entity.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{entity.excerpt}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              {labels.updated}: {formatDateLabel(locale, entity.updatedAt)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function renderPlaceLayout(locale: Locale, entities: EntityListItem[]) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {entities.map((entity) => (
        <Link
          key={entity.id}
          href={`/${locale}/entities/${encodeURIComponent(entity.slug)}`}
          className="group overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)]"
        >
          <div className="h-2 bg-gradient-to-r from-[#b67a39] via-[#0f766e] to-[#2f4f73]" />
          <div className="p-5">
            <h3 className="text-2xl font-semibold tracking-tight transition group-hover:text-[var(--accent)]">
              {entity.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{entity.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function renderSourceLayout(
  locale: Locale,
  entities: EntityListItem[],
  labels: ReturnType<typeof getEntityPageLabels>,
) {
  return (
    <ul className="divide-y divide-[var(--border)] rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)]">
      {entities.map((entity) => (
        <li key={entity.id}>
          <Link
            href={`/${locale}/entities/${encodeURIComponent(entity.slug)}`}
            className="group block px-5 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-[var(--accent)]">
                {entity.title}
              </h3>
              <span className="text-xs text-[var(--muted)]">
                {labels.updated}: {formatDateLabel(locale, entity.updatedAt)}
              </span>
            </div>
            <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{entity.excerpt}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function renderLayoutByEntityType(
  locale: Locale,
  entityType: ContentEntityType,
  entities: EntityListItem[],
  labels: ReturnType<typeof getEntityPageLabels>,
) {
  if (entityType === "person") {
    return renderPersonLayout(locale, entities, labels);
  }

  if (entityType === "work") {
    return renderWorkLayout(locale, entities);
  }

  if (entityType === "topic") {
    return renderTopicLayout(locale, entities);
  }

  if (entityType === "event") {
    return renderEventLayout(locale, entities, labels);
  }

  if (entityType === "place") {
    return renderPlaceLayout(locale, entities);
  }

  return renderSourceLayout(locale, entities, labels);
}

/**
 * Generates metadata for the public entities directory.
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
 * Renders the locale content index grouped by type, with a distinct layout per type.
 */
export default async function EntityIndexPage({
  params,
}: EntityIndexPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const requestHeaders = await headers();
  const acceptLanguageHeader = requestHeaders.get("accept-language") ?? "";
  const primaryHeroLocales = getHeroPrimaryLocales(
    typedLocale,
    acceptLanguageHeader,
  );
  const copy = getEntityIndexCopy(typedLocale);
  const labels = getEntityPageLabels(typedLocale);
  const entities = await getPublishedLocalizedEntitiesFromDb(typedLocale);

  const entitiesByType = new Map<ContentEntityType, EntityListItem[]>();
  for (const entity of entities) {
    const current = entitiesByType.get(entity.entityType) ?? [];
    current.push(entity);
    entitiesByType.set(entity.entityType, current);
  }

  return (
    <div className="space-y-10">
      <PublicHero
        locale={typedLocale}
        primaryLocales={primaryHeroLocales}
        hrefForLocale={(localeOption) => `/${localeOption}/entities`}
        kicker={labels.archiveEyebrow}
        title={copy.title || labels.heroTitle}
        description={labels.heroDescription || copy.description}
      />

      {entities.length > 0 ? (
        <div className="space-y-10">
          {entityTypeOrder.map((entityType) => {
            const typedEntities = entitiesByType.get(entityType) ?? [];

            return (
              <section
                key={entityType}
                className="space-y-5 border-t border-[var(--border)] pt-8"
              >
                <div className="space-y-2">
                  <p className="public-kicker">{getEntityTypeLabel(typedLocale, entityType)}</p>
                  <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
                    {labels.sectionDescription[entityType]}
                  </p>
                </div>

                {typedEntities.length > 0 ? (
                  renderLayoutByEntityType(
                    typedLocale,
                    entityType,
                    typedEntities,
                    labels,
                  )
                ) : (
                  <p className="rounded-[var(--radius-card)] border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm text-[var(--muted)]">
                    {labels.emptySection}
                  </p>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <section className="public-surface p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">{labels.emptyPageTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            {labels.emptyPageDescription}
          </p>
        </section>
      )}
    </div>
  );
}


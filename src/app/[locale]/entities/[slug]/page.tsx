/**
 * Entity detail page
 *
 * Reads locale-specific entity content directly from Prisma.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Route } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import { isLocale } from "@/i18n/config";
import { getContentEntityBySlugFromDb } from "@/lib/db/content-entity-read";
import { buildLocaleMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import type { ContentEntityType, TopicType } from "@prisma/client";

type EntityDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function getEntityPageLabels(locale: Locale) {
  const dictionary = {
    en: {
      entityTypeLabel: "Content type",
      works: "Works",
      authors: "Authors",
      topics: "Topics",
      related: "Related",
    },
    it: {
      entityTypeLabel: "Tipo di contenuto",
      works: "Opere",
      authors: "Autori",
      topics: "Temi",
      related: "Correlati",
    },
    ar: {
      entityTypeLabel: "نوع المحتوى",
      works: "الأعمال",
      authors: "المؤلفون",
      topics: "الموضوعات",
      related: "مرتبط",
    },
  } as const;

  return dictionary[locale];
}

function getTopicTypeLabel(locale: Locale, topicType: TopicType) {
  const labels = {
    en: {
      discipline: "Discipline",
      concept: "Concept",
      method: "Method",
      institution: "Institution",
    },
    it: {
      discipline: "Disciplina",
      concept: "Concetto",
      method: "Metodo",
      institution: "Istituzione",
    },
    ar: {
      discipline: "تخصص",
      concept: "مفهوم",
      method: "منهج",
      institution: "مؤسسة",
    },
  } as const;

  return labels[locale][topicType];
}

function getEntityTypeLabel(locale: Locale, entityType: ContentEntityType) {
  const labels = {
    en: {
      person: "Person",
      work: "Work",
      topic: "Topic",
      event: "Event",
      place: "Place",
      source: "Source",
    },
    it: {
      person: "Persona",
      work: "Opera",
      topic: "Tema",
      event: "Evento",
      place: "Luogo",
      source: "Fonte",
    },
    ar: {
      person: "شخصية",
      work: "عمل",
      topic: "موضوع",
      event: "حدث",
      place: "مكان",
      source: "مصدر",
    },
  } as const;

  return labels[locale][entityType];
}

type RelatedLink = {
  id: string;
  title: string;
  href: Route;
};

function buildRelatedLink(
  locale: Locale,
  entity: {
    id: string;
    localizations: Array<{ slug: string; title: string }>;
  },
): RelatedLink | null {
  const localization = entity.localizations[0];
  if (!localization) {
    return null;
  }

  return {
    id: entity.id,
    title: localization.title,
    href: `/${locale}/entities/${localization.slug}` as Route,
  };
}

function uniqueLinks(links: Array<RelatedLink | null>): RelatedLink[] {
  const map = new Map<string, RelatedLink>();
  for (const link of links) {
    if (!link) {
      continue;
    }
    map.set(link.id, link);
  }
  return [...map.values()];
}

/**
 * Generates metadata for localized entity detail pages under the generic route.
 */
export async function generateMetadata({ params }: EntityDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dbEntity = await getContentEntityBySlugFromDb(locale, slug);
  if (!dbEntity) {
    return {};
  }

  return buildLocaleMetadata(locale, {
    title: dbEntity.localization.title,
    description: dbEntity.localization.excerpt,
    path: `/entities/${dbEntity.localization.slug}`,
  });
}

/**
 * Renders a localized entity entry with related people, works, and topics.
 */
export default async function EntityDetailPage({ params }: EntityDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const dbEntity = await getContentEntityBySlugFromDb(typedLocale, slug);
  if (!dbEntity) {
    notFound();
  }

  const labels = getEntityPageLabels(typedLocale);
  const orderedSections = dbEntity.localization.sections;
  const topicType =
    dbEntity.profile.kind === "topic" ? dbEntity.profile.data?.topicType : null;

  const authoredWorks =
    dbEntity.entity.entityType === "person"
      ? uniqueLinks(
          dbEntity.entity.outgoingRelationships
            .filter(
              (relationship) =>
                relationship.relationType === "authored" &&
                relationship.toEntity.entityType === "work",
            )
            .map((relationship) =>
              buildRelatedLink(typedLocale, relationship.toEntity),
            ),
        )
      : [];

  const authors =
    dbEntity.entity.entityType === "work"
      ? uniqueLinks(
          dbEntity.entity.incomingRelationships
            .filter(
              (relationship) =>
                relationship.relationType === "authored" &&
                relationship.fromEntity.entityType === "person",
            )
            .map((relationship) =>
              buildRelatedLink(typedLocale, relationship.fromEntity),
            ),
        )
      : [];

  const relatedTopics =
    dbEntity.entity.entityType === "work"
      ? uniqueLinks(
          dbEntity.entity.outgoingRelationships
            .filter(
              (relationship) =>
                (relationship.relationType === "about" ||
                  relationship.relationType === "associated_with" ||
                  relationship.relationType === "related_to") &&
                relationship.toEntity.entityType === "topic",
            )
            .map((relationship) =>
              buildRelatedLink(typedLocale, relationship.toEntity),
            ),
        )
      : [];

  const topicWorks =
    dbEntity.entity.entityType === "topic"
      ? uniqueLinks(
          dbEntity.entity.incomingRelationships
            .filter(
              (relationship) =>
                (relationship.relationType === "about" ||
                  relationship.relationType === "associated_with" ||
                  relationship.relationType === "related_to") &&
                relationship.fromEntity.entityType === "work",
            )
            .map((relationship) =>
              buildRelatedLink(typedLocale, relationship.fromEntity),
            ),
        )
      : [];

  const topicPeople =
    dbEntity.entity.entityType === "topic"
      ? uniqueLinks(
          dbEntity.entity.incomingRelationships
            .filter(
              (relationship) =>
                (relationship.relationType === "associated_with" ||
                  relationship.relationType === "influenced" ||
                  relationship.relationType === "about") &&
                relationship.fromEntity.entityType === "person",
            )
            .map((relationship) =>
              buildRelatedLink(typedLocale, relationship.fromEntity),
            ),
        )
      : [];

  const consumedRelatedIds = new Set<string>([
    ...authoredWorks.map((item) => item.id),
    ...authors.map((item) => item.id),
    ...relatedTopics.map((item) => item.id),
    ...topicWorks.map((item) => item.id),
    ...topicPeople.map((item) => item.id),
  ]);

  const genericRelated = uniqueLinks([
    ...dbEntity.entity.outgoingRelationships.map((relationship) =>
      buildRelatedLink(typedLocale, relationship.toEntity),
    ),
    ...dbEntity.entity.incomingRelationships.map((relationship) =>
      buildRelatedLink(typedLocale, relationship.fromEntity),
    ),
  ]).filter((item) => !consumedRelatedIds.has(item.id));

  const localizedEntityLinks = Object.fromEntries(
    dbEntity.entity.localizations.map((item) => [
      item.locale,
      `/${item.locale}/entities/${item.slug}`,
    ]),
  ) as Partial<Record<Locale, string>>;

  return (
    <article className="mx-auto w-full max-w-6xl space-y-8">
      <SiteHeader locale={typedLocale} localizedEntityLinks={localizedEntityLinks} />
      <header className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--warm)]">
            {getEntityTypeLabel(typedLocale, dbEntity.entity.entityType)}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            {dbEntity.localization.title}
          </h1>
          <p className="text-lg text-[var(--muted)]">
            {dbEntity.localization.summary}
          </p>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          {orderedSections.map((section) => (
            <section
              key={section.sectionKey}
              className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-2"
            >
              <h2 className="text-2xl font-semibold">{section.heading}</h2>
              <p className="leading-8 text-[var(--muted)]">{section.content}</p>
            </section>
          ))}
        </div>

        <aside className="space-y-6">
          <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-2">
            <h2 className="text-2xl font-semibold">{labels.entityTypeLabel}</h2>
            <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
              <li>{getEntityTypeLabel(typedLocale, dbEntity.entity.entityType)}</li>
              {topicType ? (
                <li>{getTopicTypeLabel(typedLocale, topicType as TopicType)}</li>
              ) : null}
            </ul>
          </section>

          {authoredWorks.length > 0 ? (
            <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-2">
              <h2 className="text-2xl font-semibold">{labels.works}</h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {authoredWorks.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {authors.length > 0 ? (
            <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-2">
              <h2 className="text-2xl font-semibold">{labels.authors}</h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {authors.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {(relatedTopics.length > 0 || topicPeople.length > 0) ? (
            <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-2">
              <h2 className="text-2xl font-semibold">{labels.topics}</h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {relatedTopics.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
                {topicPeople.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {topicWorks.length > 0 ? (
            <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-2">
              <h2 className="text-2xl font-semibold">{labels.works}</h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {topicWorks.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {genericRelated.length > 0 ? (
            <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-2">
              <h2 className="text-2xl font-semibold">{labels.related}</h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {genericRelated.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </section>
    </article>
  );
}

/**
 * Entity detail page
 *
 * Reads locale-specific entity content directly from Prisma.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Route } from "next";
import { cache } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getContentEntityBySlugFromDb } from "@/lib/db/content-entity-read";
import { getSiteUrl } from "@/lib/site-config";
import type { Locale } from "@/i18n/config";
import type { ContentEntityType, TopicType } from "@prisma/client";

export const revalidate = 3600;

const getEntityDetailForRequest = cache(
  async (locale: Locale, slug: string) =>
    getContentEntityBySlugFromDb(locale, slug),
);

type EntityDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function getEntityPageLabels(locale: Locale) {
  const dictionary = {
    en: {
      entityTypeLabel: "Content type",
      works: "Works",
      topicWorks: "Related works",
      authors: "Authors",
      topics: "Topics",
      scholars: "Scholars",
      related: "Related",
    },
    it: {
      entityTypeLabel: "Tipo di contenuto",
      works: "Opere",
      topicWorks: "Opere correlate",
      authors: "Autori",
      topics: "Temi",
      scholars: "Studiosi",
      related: "Correlati",
    },
    ar: {
      entityTypeLabel: "نوع المحتوى",
      works: "الأعمال",
      topicWorks: "أعمال ذات صلة",
      authors: "المؤلفون",
      topics: "الموضوعات",
      scholars: "العلماء",
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
    localizations: Array<{ locale: string; slug: string; title: string }>;
  },
): RelatedLink | null {
  const localization =
    entity.localizations.find((item) => item.locale === locale) ??
    entity.localizations[0];

  if (!localization) {
    return null;
  }

  return {
    id: entity.id,
    title: localization.title,
    href: `/${locale}/entities/${encodeURIComponent(localization.slug)}` as Route,
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

function buildEntityAbsoluteUrl(siteUrl: string, locale: string, slug: string) {
  return `${siteUrl}/${locale}/entities/${encodeURIComponent(slug)}`;
}

/**
 * Generates metadata for localized entity detail pages under the generic route.
 */
export async function generateMetadata({
  params,
}: EntityDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dbEntity = await getEntityDetailForRequest(locale, slug);
  if (!dbEntity) {
    return {};
  }

  const siteUrl = getSiteUrl();
  const siteName = "Islamic Golden Age";
  const canonicalUrl = buildEntityAbsoluteUrl(
    siteUrl,
    locale,
    dbEntity.localization.slug,
  );
  const localizedSeoTitle = dbEntity.localization.seoTitle?.trim();
  const pageTitle = localizedSeoTitle
    ? localizedSeoTitle
    : `${dbEntity.localization.title} | ${siteName}`;
  const pageDescription =
    dbEntity.localization.seoDescription?.trim() ||
    dbEntity.localization.summary ||
    dbEntity.localization.excerpt;

  const localeAlternates = Object.fromEntries(
    dbEntity.entity.localizations
      .filter((item) => item.slug.trim().length > 0)
      .map((item) => [
        item.locale,
        buildEntityAbsoluteUrl(siteUrl, item.locale, item.slug),
      ]),
  );
  const xDefaultAlternate =
    localeAlternates[defaultLocale] ??
    localeAlternates[locale] ??
    canonicalUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...localeAlternates,
        "x-default": xDefaultAlternate,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName,
      locale,
      type: "website",
    },
  };
}

/**
 * Renders a localized entity entry with related people, works, and topics.
 */
export default async function EntityDetailPage({ params }: EntityDetailPageProps) {
  const renderStartedAt = Date.now();
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const dbEntity = await getEntityDetailForRequest(typedLocale, slug);
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
      `/${item.locale}/entities/${encodeURIComponent(item.slug)}`,
    ]),
  ) as Partial<Record<Locale, string>>;
  const renderDurationMs = Date.now() - renderStartedAt;
  console.info(
    `[perf][entity-detail][render] locale=${typedLocale} slug=${slug} entityType=${dbEntity.entity.entityType} duration_ms=${renderDurationMs}`,
  );

  return (
    <article className="mx-auto w-full max-w-[72rem] space-y-8">
      <SiteHeader locale={typedLocale} localizedEntityLinks={localizedEntityLinks} />
      <header className="public-surface p-7 sm:p-9">
        <div className="space-y-4">
          <p className="public-kicker">
            {getEntityTypeLabel(typedLocale, dbEntity.entity.entityType)}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {dbEntity.localization.title}
          </h1>
          <p className="max-w-4xl text-lg leading-8 text-[var(--muted)]">
            {dbEntity.localization.summary}
          </p>
        </div>
      </header>

      <section className="grid gap-7 lg:grid-cols-[minmax(0,2.1fr)_minmax(280px,1fr)] lg:items-start">
        <div className="space-y-5">
          {orderedSections.map((section) => (
            <section
              key={section.sectionKey}
              className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-6 sm:px-7"
            >
              <h2 className="text-[1.9rem] font-semibold tracking-tight">
                {section.heading}
              </h2>
              <p className="mt-3 leading-8 text-[var(--muted)]">{section.content}</p>
            </section>
          ))}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8">
          <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6">
            <h2 className="text-[1.7rem] font-semibold tracking-tight">
              {labels.entityTypeLabel}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
              <li>{getEntityTypeLabel(typedLocale, dbEntity.entity.entityType)}</li>
              {topicType ? (
                <li>{getTopicTypeLabel(typedLocale, topicType as TopicType)}</li>
              ) : null}
            </ul>
          </section>

          {authoredWorks.length > 0 ? (
            <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6">
              <h2 className="text-[1.6rem] font-semibold tracking-tight">{labels.works}</h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {authoredWorks.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      className="hover:text-[var(--accent)] hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {authors.length > 0 ? (
            <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6">
              <h2 className="text-[1.6rem] font-semibold tracking-tight">{labels.authors}</h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {authors.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      className="hover:text-[var(--accent)] hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {relatedTopics.length > 0 ? (
            <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6">
              <h2 className="text-[1.6rem] font-semibold tracking-tight">{labels.topics}</h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {relatedTopics.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      className="hover:text-[var(--accent)] hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {topicPeople.length > 0 ? (
            <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6">
              <h2 className="text-[1.6rem] font-semibold tracking-tight">
                {labels.scholars}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {topicPeople.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      className="hover:text-[var(--accent)] hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {topicWorks.length > 0 ? (
            <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6">
              <h2 className="text-[1.6rem] font-semibold tracking-tight">
                {labels.topicWorks}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {topicWorks.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      className="hover:text-[var(--accent)] hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {genericRelated.length > 0 ? (
            <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6">
              <h2 className="text-[1.6rem] font-semibold tracking-tight">
                {labels.related}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {genericRelated.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      className="hover:text-[var(--accent)] hover:underline"
                    >
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

/**
 * Entity detail page
 *
 * Uses the current generic entity route to render localized entities.
 * This keeps routing stable while validating cross-entity content behavior.
 */
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import {
  getDerivedConnections,
  getEntityBySlug,
  getEntityById,
  getLocalizedEntity,
} from "@/lib/content/repository";
import { buildLocaleMetadata } from "@/lib/seo";
import type { ContentEntityType, TopicType } from "@/lib/content/types";
import type { Locale } from "@/i18n/config";

type EntityDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type RelatedItem = {
  id: string;
  title: string;
  href: Route;
};

function buildEntityHref(
  locale: Locale,
  _entityType: ContentEntityType,
  slug: string,
) {
  return `/${locale}/entities/${slug}`;
}

function getEntityPageLabels(locale: Locale) {
  const dictionary = {
    en: {
      entityTypeLabel: "Content type",
      relatedContent: "Related Content",
      noRelatedEntries: "No related entries yet.",
    },
    it: {
      entityTypeLabel: "Tipo di contenuto",
      relatedContent: "Contenuti correlati",
      noRelatedEntries: "Nessuna voce correlata al momento.",
    },
    ar: {
      entityTypeLabel: "نوع المحتوى",
      relatedContent: "محتوى مرتبط",
      noRelatedEntries: "لا توجد عناصر مرتبطة حتى الآن.",
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

/**
 * Generates metadata for localized entity detail pages under the generic route.
 */
export async function generateMetadata({ params }: EntityDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const typedLocale: Locale = locale;
  const entity = getEntityBySlug(typedLocale, slug);

  if (!entity) {
    return {};
  }

  const localizedEntity = getLocalizedEntity(entity, typedLocale);

  if (!localizedEntity) {
    return {};
  }

  return buildLocaleMetadata(typedLocale, {
    title: localizedEntity.localization.title,
    description: localizedEntity.localization.excerpt,
    path: `/entities/${localizedEntity.localization.slug}`,
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
  const entity = getEntityBySlug(typedLocale, slug);

  if (!entity) {
    notFound();
  }

  const localizedEntity = getLocalizedEntity(entity, typedLocale);

  if (!localizedEntity) {
    notFound();
  }

  const labels = getEntityPageLabels(typedLocale);
  const derivedConnections = getDerivedConnections(entity.id);

  const relatedReferences = [
    ...derivedConnections.primaryConnections.relatedPeople,
    ...derivedConnections.primaryConnections.relatedWorks,
    ...derivedConnections.primaryConnections.relatedTopics,
  ];

  const relatedItems = relatedReferences
    .map((reference) => getEntityById(reference.entityId))
    .filter((entity): entity is NonNullable<ReturnType<typeof getEntityById>> =>
      Boolean(entity),
    )
    .map((entity) => {
      const localized = getLocalizedEntity(entity, typedLocale);

      if (!localized) {
        return null;
      }

      return {
        id: entity.id,
        title: localized.localization.title,
        href: buildEntityHref(
          typedLocale,
          entity.entityType,
          localized.localization.slug,
        ) as Route,
      };
    })
    .filter((item): item is RelatedItem => Boolean(item));

  const orderedSections = localizedEntity.localization.sections
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <article className="mx-auto w-full max-w-6xl space-y-8">
      <header className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--warm)]">
            {getEntityTypeLabel(typedLocale, entity.entityType)}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            {localizedEntity.localization.title}
          </h1>
          <p className="text-lg text-[var(--muted)]">
            {localizedEntity.localization.excerpt}
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
              <li>{getEntityTypeLabel(typedLocale, entity.entityType)}</li>
              {entity.entityType === "topic" ? (
                <li>{getTopicTypeLabel(typedLocale, entity.topicType as TopicType)}</li>
              ) : null}
            </ul>
          </section>

          <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-3">
            <h2 className="text-2xl font-semibold">{labels.relatedContent}</h2>
            {relatedItems.length === 0 ? (
              <p className="text-[var(--muted)]">{labels.noRelatedEntries}</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {relatedItems.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </section>
    </article>
  );
}

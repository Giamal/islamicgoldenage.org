/**
 * Topic detail page
 *
 * Uses the current generic entity route to render localized topic entries.
 * This keeps routing stable while validating topic-specific content behavior.
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
import type { Locale } from "@/lib/types/i18n";

type TopicPageProps = {
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

function getTopicPageLabels(locale: Locale) {
  const dictionary = {
    en: {
      topicTypeLabel: "Topic type",
      relatedContent: "Related Content",
      noRelatedEntries: "No related entries yet.",
    },
    it: {
      topicTypeLabel: "Tipo di tema",
      relatedContent: "Contenuti correlati",
      noRelatedEntries: "Nessuna voce correlata al momento.",
    },
    ar: {
      topicTypeLabel: "Naw al-mawdu",
      relatedContent: "Al-Muhtawa al-Murtabit",
      noRelatedEntries: "La tujad madkhalat murtabita hatta al-an.",
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
      discipline: "Takhasus",
      concept: "Mafhum",
      method: "Manhaj",
      institution: "Muassasa",
    },
  } as const;

  return labels[locale][topicType];
}

/**
 * Generates metadata for localized topic detail pages under the generic entity route.
 */
export async function generateMetadata({ params }: TopicPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const typedLocale: Locale = locale;
  const topic = getEntityBySlug(typedLocale, slug);

  if (!topic) {
    return {};
  }

  const localizedTopic = getLocalizedEntity(topic, typedLocale);

  if (!localizedTopic) {
    return {};
  }

  return buildLocaleMetadata(typedLocale, {
    title: localizedTopic.localization.title,
    description: localizedTopic.localization.excerpt,
    path: `/entities/${localizedTopic.localization.slug}`,
  });
}

/**
 * Renders a localized topic entry with related people, works, and topics.
 */
export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const topic = getEntityBySlug(typedLocale, slug);

  if (!topic) {
    notFound();
  }

  const localizedTopic = getLocalizedEntity(topic, typedLocale);

  if (!localizedTopic) {
    notFound();
  }

  const labels = getTopicPageLabels(typedLocale);
  const derivedConnections = getDerivedConnections(topic.id);

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

  const orderedSections = localizedTopic.localization.sections
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <article className="mx-auto w-full max-w-6xl space-y-8">
      <header className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            {localizedTopic.localization.title}
          </h1>
          <p className="text-lg text-[var(--muted)]">
            {localizedTopic.localization.excerpt}
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
            <h2 className="text-2xl font-semibold">{labels.topicTypeLabel}</h2>
            <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
              <li>
                {topic.entityType === "topic"
                  ? getTopicTypeLabel(typedLocale, topic.topicType as TopicType)
                  : topic.entityType}
              </li>
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

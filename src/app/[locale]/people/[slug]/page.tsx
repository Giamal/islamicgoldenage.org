/**
 * Person detail page
 *
 * Renders a localized person entry from the in-memory content model.
 * This validates the repository, localization, SEO, and relationship foundations end to end.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Route } from "next";

import {
  type Locale,
  isLocale,
} from "@/i18n/config";
import {
  getDerivedConnections,
  getEntityById,
  getLocalizedEntity,
  getPersonBySlug,
} from "@/lib/content/repository";
import { buildLocaleMetadata } from "@/lib/seo";
import type { ContentEntityType } from "@/lib/content/types";

type PersonPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function buildEntityHref(
  locale: string,
  _entityType: ContentEntityType,
  slug: string,
) {
  return `/${locale}/entities/${slug}`;
}

function getPersonPageLabels(locale: Locale) {
  const dictionary = {
    en: {
      entityTag: "Person",
      relatedContent: "Related Content",
      noRelatedEntries: "No related entries yet.",
    },
    it: {
      entityTag: "Persona",
      relatedContent: "Contenuti correlati",
      noRelatedEntries: "Nessuna voce correlata al momento.",
    },
    ar: {
      entityTag: "شخصية",
      relatedContent: "محتوى مرتبط",
      noRelatedEntries: "لا توجد عناصر مرتبطة حتى الآن.",
    },
  } as const;

  return dictionary[locale];
}

/**
 * Generates metadata with locale-aware canonical and hreflang alternates.
 */
export async function generateMetadata({ params }: PersonPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const typedLocale: Locale = locale;
  const person = getPersonBySlug(locale, slug);

  if (!person) {
    return {};
  }

  const localizedPerson = getLocalizedEntity(person, typedLocale);

  if (!localizedPerson) {
    return {};
  }

  return buildLocaleMetadata(typedLocale, {
    title: localizedPerson.localization.title,
    description: localizedPerson.localization.excerpt,
    path: `/entities/${localizedPerson.localization.slug}`,
  });
}

/**
 * Renders the localized person content and direct related entities.
 */
export default async function PersonDetailPage({ params }: PersonPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const person = getPersonBySlug(typedLocale, slug);

  if (!person) {
    notFound();
  }

  const localizedPerson = getLocalizedEntity(person, typedLocale);

  if (!localizedPerson) {
    notFound();
  }

  const labels = getPersonPageLabels(typedLocale);
  const derivedConnections = getDerivedConnections(person.id);

  const relatedReferences = [
    ...derivedConnections.primaryConnections.relatedPeople,
    ...derivedConnections.primaryConnections.relatedWorks,
    ...derivedConnections.primaryConnections.relatedTopics,
    ...derivedConnections.primaryConnections.relatedEvents,
    ...derivedConnections.primaryConnections.relatedPlaces,
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
    .filter((item): item is { id: string; title: string; href: Route } =>
      Boolean(item),
    );

  const orderedSections = localizedPerson.localization.sections
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <article className="mx-auto w-full max-w-3xl space-y-6">
      <header className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--warm)]">
            {labels.entityTag}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            {localizedPerson.localization.title}
          </h1>
          <p className="text-lg text-[var(--muted)]">
            {localizedPerson.localization.excerpt}
          </p>
        </div>
      </header>

      <section className="space-y-6">
        {orderedSections.map((section) => (
          <section
            key={section.sectionKey}
            className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-2"
          >
            <h2 className="text-2xl font-semibold">{section.heading}</h2>
            <p className="leading-8 text-[var(--muted)]">{section.content}</p>
          </section>
        ))}
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
    </article>
  );
}

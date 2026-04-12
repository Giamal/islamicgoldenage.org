/**
 * Work detail page
 *
 * Renders a localized work entry from the in-memory content model.
 * This validates work-specific rendering with localization, metadata, and derived connections.
 */
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import {
  getDerivedConnections,
  getEntityById,
  getLocalizedEntity,
  getWorkBySlug,
} from "@/lib/content/repository";
import { buildLocaleMetadata } from "@/lib/seo";
import type { ContentEntityType, WorkContributorRole } from "@/lib/content/types";
import type { Locale } from "@/lib/types/i18n";

type WorkPageProps = {
  params: { locale: string; slug: string };
};

type ContributorItem = {
  id: string;
  roleLabel: string;
  name: string;
  href: Route;
};

function buildEntityHref(
  locale: Locale,
  _entityType: ContentEntityType,
  slug: string,
) {
  return `/${locale}/entities/${slug}`;
}

function getWorkPageLabels(locale: Locale) {
  const dictionary = {
    en: {
      entityTag: "Work",
      typeLabel: "Work type",
      yearLabel: "Composition year",
      languageLabel: "Original language",
      contributorsLabel: "Contributors",
      relatedContent: "Related Content",
      noRelatedEntries: "No related entries yet.",
    },
    it: {
      entityTag: "Opera",
      typeLabel: "Tipo di opera",
      yearLabel: "Anno di composizione",
      languageLabel: "Lingua originale",
      contributorsLabel: "Contributori",
      relatedContent: "Contenuti correlati",
      noRelatedEntries: "Nessuna voce correlata al momento.",
    },
    ar: {
      entityTag: "عمل",
      typeLabel: "نوع العمل",
      yearLabel: "سنة التأليف",
      languageLabel: "اللغة الأصلية",
      contributorsLabel: "المساهمون",
      relatedContent: "محتوى مرتبط",
      noRelatedEntries: "لا توجد عناصر مرتبطة حتى الآن.",
    },
  } as const;

  return dictionary[locale];
}

function getContributorRoleLabel(locale: Locale, role: WorkContributorRole) {
  const labels = {
    en: {
      author: "Author",
      translator: "Translator",
      commentator: "Commentator",
      editor: "Editor",
      compiler: "Compiler",
    },
    it: {
      author: "Autore",
      translator: "Traduttore",
      commentator: "Commentatore",
      editor: "Curatore",
      compiler: "Compilatore",
    },
    ar: {
      author: "مؤلف",
      translator: "مترجم",
      commentator: "شارح",
      editor: "محرر",
      compiler: "جامع",
    },
  } as const;

  return labels[locale][role];
}

function getWorkTypeLabel(locale: Locale, workType: string) {
  const labels = {
    en: {
      book: "Book",
      treatise: "Treatise",
      manuscript: "Manuscript",
      commentary: "Commentary",
      translation: "Translation",
    },
    it: {
      book: "Libro",
      treatise: "Trattato",
      manuscript: "Manoscritto",
      commentary: "Commento",
      translation: "Traduzione",
    },
    ar: {
      book: "كتاب",
      treatise: "رسالة",
      manuscript: "مخطوط",
      commentary: "شرح",
      translation: "ترجمة",
    },
  } as const;

  return labels[locale][workType as keyof (typeof labels)["en"]] ?? workType;
}

/**
 * Generates metadata with locale-aware canonical and hreflang alternates.
 */
export async function generateMetadata({ params }: WorkPageProps) {
  const { locale, slug } = params;

  if (!isLocale(locale)) {
    return {};
  }

  const typedLocale: Locale = locale;
  const work = getWorkBySlug(typedLocale, slug);

  if (!work) {
    return {};
  }

  const localizedWork = getLocalizedEntity(work, typedLocale);

  if (!localizedWork) {
    return {};
  }

  return buildLocaleMetadata(typedLocale, {
    title: localizedWork.localization.title,
    description: localizedWork.localization.excerpt,
    path: `/entities/${localizedWork.localization.slug}`,
  });
}

/**
 * Renders the localized work content, key metadata fields, and direct related entities.
 */
export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { locale, slug } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const work = getWorkBySlug(typedLocale, slug);

  if (!work) {
    notFound();
  }

  const localizedWork = getLocalizedEntity(work, typedLocale);

  if (!localizedWork) {
    notFound();
  }

  const labels = getWorkPageLabels(typedLocale);
  const derivedConnections = getDerivedConnections(work.id);

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

  const contributorItems = work.contributors.reduce<ContributorItem[]>(
    (accumulator, contributor) => {
      const person = getEntityById(contributor.personId);

      if (!person || person.entityType !== "person") {
        return accumulator;
      }

      const localizedPerson = getLocalizedEntity(person, typedLocale);

      if (!localizedPerson) {
        return accumulator;
      }

      accumulator.push({
        id: contributor.personId,
        roleLabel: getContributorRoleLabel(typedLocale, contributor.role),
        name: localizedPerson.localization.title,
        href: buildEntityHref(
          typedLocale,
          "person",
          localizedPerson.localization.slug,
        ) as Route,
      });

      return accumulator;
    },
    [],
  );

  const orderedSections = localizedWork.localization.sections
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
            {localizedWork.localization.title}
          </h1>
          <p className="text-lg text-[var(--muted)]">
            {localizedWork.localization.excerpt}
          </p>
        </div>
      </header>

      <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-2">
        <h2 className="text-2xl font-semibold">{labels.typeLabel}</h2>
        <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
          <li>{getWorkTypeLabel(typedLocale, work.workType)}</li>
          {work.compositionYear ? (
            <li>
              {labels.yearLabel}: {work.compositionYear}
            </li>
          ) : null}
          {work.languageOriginal ? (
            <li>
              {labels.languageLabel}: {work.languageOriginal}
            </li>
          ) : null}
        </ul>
      </section>

      <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 space-y-2">
        <h2 className="text-2xl font-semibold">{labels.contributorsLabel}</h2>
        {contributorItems.length === 0 ? (
          <p className="text-[var(--muted)]">-</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {contributorItems.map((contributor) => (
              <li key={contributor.id}>
                {contributor.roleLabel}:{" "}
                <Link href={contributor.href} className="hover:underline">
                  {contributor.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

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

/**
 * Entity detail page
 *
 * Reads locale-specific entity content directly from Prisma.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Route } from "next";
import { cache } from "react";

import { RichContentRenderer } from "@/components/content/rich-content-renderer";
import { PublicHero } from "@/components/layout/public-hero";
import {
  defaultPublicLocale,
  isLocale,
  publicLocales,
} from "@/i18n/config";
import { getContentEntityBySlugFromDb } from "@/lib/db/content-entity-read";
import { getHeroPrimaryLocales } from "@/lib/hero-locale";
import { getSiteUrl } from "@/lib/site-config";
import {
  getEntityDetailCopy,
  getEntityTypeLabel,
} from "@/lib/ui-copy";
import type { Locale } from "@/i18n/config";
import type { TopicType } from "@prisma/client";

export const revalidate = 3600;

const getEntityDetailForRequest = cache(
  async (locale: Locale, slug: string) =>
    getContentEntityBySlugFromDb(locale, slug),
);

type EntityDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function getTopicTypeLabel(locale: Locale, topicType: TopicType) {
  return getEntityDetailCopy(locale).topicType[topicType];
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

const localizedSectionKeys = {
  body: "body",
  intro: "intro",
  imageAlt: "media_image_alt",
  imageCaption: "media_image_caption",
} as const;

function getSectionHeadingLabel(
  locale: Locale,
  sectionKey: string,
  fallbackHeading: string,
) {
  const sectionLabels = getEntityDetailCopy(locale).sectionLabels;

  if (sectionKey === localizedSectionKeys.body) {
    return sectionLabels.body;
  }

  if (sectionKey === localizedSectionKeys.intro) {
    return sectionLabels.intro;
  }

  return fallbackHeading;
}

function formatYearLabel(value: number | null | undefined) {
  if (typeof value !== "number") {
    return null;
  }

  return `${value} CE`;
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
      .filter(
        (item) =>
          item.slug.trim().length > 0 && publicLocales.includes(item.locale),
      )
      .map((item) => [
        item.locale,
        buildEntityAbsoluteUrl(siteUrl, item.locale, item.slug),
      ]),
  );
  const xDefaultAlternate =
    localeAlternates[defaultPublicLocale] ??
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
  const { locale, slug } = await params;

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
  const dbEntity = await getEntityDetailForRequest(typedLocale, slug);
  if (!dbEntity) {
    notFound();
  }

  const labels = getEntityDetailCopy(typedLocale);
  const orderedSections = dbEntity.localization.sections;
  const hasBodySection = orderedSections.some(
    (section) =>
      section.sectionKey === localizedSectionKeys.body &&
      section.content.trim().length > 0,
  );
  const visibleSections = orderedSections.filter(
    (section) =>
      section.sectionKey !== localizedSectionKeys.imageAlt &&
      section.sectionKey !== localizedSectionKeys.imageCaption &&
      !(hasBodySection && section.sectionKey === localizedSectionKeys.intro),
  );
  const heroSubtitle = dbEntity.localization.subtitle || dbEntity.localization.excerpt;
  const imageAlt =
    orderedSections.find(
      (section) => section.sectionKey === localizedSectionKeys.imageAlt,
    )?.content || dbEntity.entity.heroImageAlt || dbEntity.localization.title;
  const imageCaption = orderedSections.find(
    (section) => section.sectionKey === localizedSectionKeys.imageCaption,
  )?.content;
  const personProfile =
    dbEntity.entity.entityType === "person" && dbEntity.profile.kind === "person"
      ? dbEntity.profile.data
      : null;
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
  const heroHrefForLocale = (localeOption: Locale) =>
    localizedEntityLinks[localeOption] ?? `/${localeOption}/entities`;

  if (dbEntity.entity.entityType === "person" && personProfile) {
    const born = formatYearLabel(personProfile.birthYear);
    const died = formatYearLabel(personProfile.deathYear);

    return (
      <article className="mx-auto w-full max-w-[72rem] space-y-8">
        <PublicHero
          locale={typedLocale}
          primaryLocales={primaryHeroLocales}
          hrefForLocale={heroHrefForLocale}
          kicker={getEntityTypeLabel(typedLocale, dbEntity.entity.entityType)}
          title={dbEntity.localization.title}
          subtitle={heroSubtitle}
        />

        <section className="grid gap-7 lg:grid-cols-[minmax(0,2.1fr)_minmax(280px,1fr)] lg:items-start">
          <div className="space-y-5">
            {visibleSections.map((section) => (
              <section
                key={section.sectionKey}
                className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-6 sm:px-7"
              >
                {section.sectionKey === localizedSectionKeys.body ? null : (
                  <h2 className="text-[1.9rem] font-semibold tracking-tight">
                    {getSectionHeadingLabel(
                      typedLocale,
                      section.sectionKey,
                      section.heading,
                    )}
                  </h2>
                )}
                <div className="mt-4">
                  <RichContentRenderer content={section.content} locale={typedLocale} />
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-8">
            <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[#f4efe5] text-[var(--foreground)] shadow-[var(--shadow)]">
              <div className="h-72 border-b border-[var(--border)] bg-[var(--surface-muted)] sm:h-80">
                {dbEntity.entity.heroImageUrl ? (
                  <div
                    role="img"
                    aria-label={imageAlt}
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${dbEntity.entity.heroImageUrl}')` }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-5 text-sm text-[var(--muted)]">
                    {labels.personNoImage}
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <h2 className="text-xl font-semibold tracking-tight">
                  {labels.personInfoboxTitle}
                </h2>
                {imageCaption ? (
                  <p className="text-xs leading-6 text-[var(--muted)]">{imageCaption}</p>
                ) : null}
                <dl className="space-y-2 text-sm">
                  {born ? (
                    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2 border-t border-[var(--border)] pt-2">
                      <dt className="font-semibold">{labels.personBorn}</dt>
                      <dd>{born}</dd>
                    </div>
                  ) : null}
                  {died ? (
                    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2 border-t border-[var(--border)] pt-2">
                      <dt className="font-semibold">{labels.personDied}</dt>
                      <dd>{died}</dd>
                    </div>
                  ) : null}
                  {personProfile.eraLabel ? (
                    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2 border-t border-[var(--border)] pt-2">
                      <dt className="font-semibold">{labels.personEra}</dt>
                      <dd>{personProfile.eraLabel}</dd>
                    </div>
                  ) : null}
                  {personProfile.roles.length > 0 ? (
                    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2 border-t border-[var(--border)] pt-2">
                      <dt className="font-semibold">{labels.personRoles}</dt>
                      <dd>{personProfile.roles.join(", ")}</dd>
                    </div>
                  ) : null}
                  {personProfile.domains.length > 0 ? (
                    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2 border-t border-[var(--border)] pt-2">
                      <dt className="font-semibold">{labels.personDomains}</dt>
                      <dd>{personProfile.domains.join(", ")}</dd>
                    </div>
                  ) : null}
                  {personProfile.associatedPlaces.length > 0 ? (
                    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2 border-t border-[var(--border)] pt-2">
                      <dt className="font-semibold">{labels.personPlaces}</dt>
                      <dd>{personProfile.associatedPlaces.join(", ")}</dd>
                    </div>
                  ) : null}
                  {personProfile.nameVariants.length > 0 ? (
                    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2 border-t border-[var(--border)] pt-2">
                      <dt className="font-semibold">{labels.personAliases}</dt>
                      <dd>{personProfile.nameVariants.join(", ")}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
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

  return (
    <article className="mx-auto w-full max-w-[72rem] space-y-8">
      <PublicHero
        locale={typedLocale}
        primaryLocales={primaryHeroLocales}
        hrefForLocale={heroHrefForLocale}
        kicker={getEntityTypeLabel(typedLocale, dbEntity.entity.entityType)}
        title={dbEntity.localization.title}
        subtitle={heroSubtitle}
      />

      <section className="grid gap-7 lg:grid-cols-[minmax(0,2.1fr)_minmax(280px,1fr)] lg:items-start">
        <div className="space-y-5">
          {visibleSections.map((section) => (
            <section
              key={section.sectionKey}
              className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-6 sm:px-7"
            >
              {section.sectionKey === localizedSectionKeys.body ? null : (
                <h2 className="text-[1.9rem] font-semibold tracking-tight">
                  {getSectionHeadingLabel(
                    typedLocale,
                    section.sectionKey,
                    section.heading,
                  )}
                </h2>
              )}
              <div className="mt-4">
                <RichContentRenderer content={section.content} locale={typedLocale} />
              </div>
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


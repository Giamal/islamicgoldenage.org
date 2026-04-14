/**
 * Locale homepage
 *
 * Introduces the platform and gives search engines a strong landing page per language.
 * The content is intentionally small while the product foundation is still being established.
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { EntityCard } from "@/components/content/entity-card";
import { SiteHeader } from "@/components/layout/site-header";
import { isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getPublishedLocalizedEntitiesFromDb } from "@/lib/db/content-entity-list";
import { buildLocaleMetadata } from "@/lib/seo";
import { getHomepageCopy } from "@/lib/ui-copy";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

const featuredEntitySlugByLocale: Record<Locale, string> = {
  en: "al-khwarizmi",
  it: "al-khwarizmi",
  ar: "الخوارزمي",
};

const homeSectionCopy: Record<
  Locale,
  {
    missionKicker: string;
    missionTitle: string;
    missionText: string;
    featuredKicker: string;
    featuredTitle: string;
    featuredText: string;
    emptyText: string;
  }
> = {
  en: {
    missionKicker: "Archive Mission",
    missionTitle: "Curated historical context, not noise.",
    missionText:
      "Each entry connects people, works, and ideas through verified relationships and multilingual access.",
    featuredKicker: "Featured",
    featuredTitle: "Featured Entries",
    featuredText: "A small curated set for exploration while the archive grows.",
    emptyText: "No published entries are available yet.",
  },
  it: {
    missionKicker: "Missione Archivio",
    missionTitle: "Contesto storico curato, senza rumore.",
    missionText:
      "Ogni voce collega persone, opere e idee tramite relazioni verificate e accesso multilingue.",
    featuredKicker: "In evidenza",
    featuredTitle: "Voci in Evidenza",
    featuredText: "Una selezione iniziale curata mentre l'archivio si espande.",
    emptyText: "Non sono ancora disponibili voci pubblicate.",
  },
  ar: {
    missionKicker: "رسالة الأرشيف",
    missionTitle: "سياق تاريخي محرر بدقة، دون ضوضاء.",
    missionText:
      "تربط كل مدخلة بين الأشخاص والأعمال والأفكار عبر علاقات موثقة وإتاحة متعددة اللغات.",
    featuredKicker: "مداخل مميزة",
    featuredTitle: "مداخل مميزة",
    featuredText: "مجموعة أولية منتقاة للاستكشاف بينما يتوسع الأرشيف.",
    emptyText: "لا توجد مداخل منشورة بعد.",
  },
};

/**
 * Generates homepage-specific metadata with locale-aware canonical and hreflang values.
 */
export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return buildLocaleMetadata(locale, {
    title: "Islamic Golden Age",
    description:
      "Explore scholars, books, events, and discoveries through a multilingual educational platform designed for reliable reference and future growth.",
    path: "",
  });
}

/**
 * Renders the locale homepage with a concise value proposition and clear navigation.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const copy = getHomepageCopy(locale);
  const sectionCopy = homeSectionCopy[typedLocale];
  const featuredEntities = (await getPublishedLocalizedEntitiesFromDb(typedLocale)).slice(
    0,
    3,
  );

  return (
    <div className="space-y-12">
      <SiteHeader locale={locale} />

      <section className="public-surface p-7 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end">
          <div className="space-y-6">
            <p className="public-kicker">
              {copy.kicker}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.35rem]">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              {copy.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/entities`}
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                {copy.primaryCta}
              </Link>
              <Link
                href={`/${typedLocale}/entities/${encodeURIComponent(
                  featuredEntitySlugByLocale[typedLocale],
                )}`}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
              >
                {copy.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)] p-5 sm:p-6">
            <p className="public-kicker">{sectionCopy.missionKicker}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {sectionCopy.missionTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {sectionCopy.missionText}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="public-kicker">{sectionCopy.featuredKicker}</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {sectionCopy.featuredTitle}
          </h2>
          <p className="text-sm leading-7 text-[var(--muted)]">
            {sectionCopy.featuredText}
          </p>
        </div>

        {featuredEntities.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredEntities.map((entity) => (
              <EntityCard key={entity.id} entity={entity} locale={typedLocale} />
            ))}
          </div>
        ) : (
          <div className="public-surface p-6 text-sm leading-7 text-[var(--muted)]">
            {sectionCopy.emptyText}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="public-subtle-divider" />
        <div className="grid gap-5 md:grid-cols-3">
          {copy.highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-6"
            >
              <h2 className="text-xl font-semibold">{highlight.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {highlight.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

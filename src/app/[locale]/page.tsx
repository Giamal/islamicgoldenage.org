/**
 * Locale homepage
 *
 * Introduces the platform and gives search engines a strong landing page per language.
 * The content is intentionally small while the product foundation is still being established.
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getPublishedLocalizedEntitiesFromDb } from "@/lib/db/content-entity-list";
import { buildLocaleMetadata } from "@/lib/seo";
import { getEntityTypeLabel, getHomepageCopy } from "@/lib/ui-copy";

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
    archiveLabel: string;
    introTitle: string;
    introText: string;
    featuredLabel: string;
    featuredTitle: string;
    featuredText: string;
    listMore: string;
    knowledgeLabel: string;
    knowledgeTitle: string;
    scholarsTitle: string;
    scholarsText: string;
    worksTitle: string;
    worksText: string;
    topicsTitle: string;
    topicsText: string;
    emptyText: string;
  }
> = {
  en: {
    archiveLabel: "Digital Cultural Archive",
    introTitle: "An editorial archive of the Islamic Golden Age.",
    introText:
      "This project is designed as a long-term reference system where scholars, works, and topics are connected through multilingual, verifiable entries.",
    featuredLabel: "In Focus",
    featuredTitle: "Featured Entries",
    featuredText: "A concise reading list from the current published catalog.",
    listMore: "Browse full archive",
    knowledgeLabel: "Knowledge Structure",
    knowledgeTitle: "The archive is organized around three core entry points.",
    scholarsTitle: "Scholars",
    scholarsText:
      "Biographical profiles of key figures with contextual links to works and disciplines.",
    worksTitle: "Works",
    worksText:
      "Primary and secondary texts, treated as connected historical artifacts.",
    topicsTitle: "Topics",
    topicsText:
      "Disciplines and concepts that map the intellectual landscape of the period.",
    emptyText: "No published entries are available yet.",
  },
  it: {
    archiveLabel: "Archivio Culturale Digitale",
    introTitle: "Un archivio editoriale sull'età dell'oro islamica.",
    introText:
      "Il progetto nasce come sistema di riferimento a lungo termine, in cui studiosi, opere e temi sono collegati tramite voci multilingue verificabili.",
    featuredLabel: "In primo piano",
    featuredTitle: "Voci in Evidenza",
    featuredText: "Una lista di lettura essenziale tratta dal catalogo pubblicato.",
    listMore: "Vai all'archivio completo",
    knowledgeLabel: "Struttura della Conoscenza",
    knowledgeTitle: "L'archivio si articola in tre accessi principali.",
    scholarsTitle: "Studiosi",
    scholarsText:
      "Profili biografici delle figure chiave, collegati a opere e discipline.",
    worksTitle: "Opere",
    worksText:
      "Testi primari e secondari letti come oggetti storici connessi tra loro.",
    topicsTitle: "Temi",
    topicsText:
      "Discipline e concetti che descrivono il paesaggio intellettuale del periodo.",
    emptyText: "Non sono ancora disponibili voci pubblicate.",
  },
  ar: {
    archiveLabel: "أرشيف ثقافي رقمي",
    introTitle: "أرشيف تحريري عن العصر الذهبي الإسلامي.",
    introText:
      "يُبنى هذا المشروع كنظام مرجعي طويل المدى يربط العلماء والأعمال والموضوعات عبر مداخل موثقة ومتعددة اللغات.",
    featuredLabel: "مختارات",
    featuredTitle: "مداخل مميزة",
    featuredText: "قائمة قراءة موجزة من المحتوى المنشور حاليًا.",
    listMore: "تصفح الأرشيف الكامل",
    knowledgeLabel: "بنية المعرفة",
    knowledgeTitle: "ينظَّم الأرشيف حول ثلاثة مسارات أساسية.",
    scholarsTitle: "العلماء",
    scholarsText: "ملفات تعريفية لشخصيات محورية مرتبطة بالأعمال والحقول العلمية.",
    worksTitle: "الأعمال",
    worksText: "نصوص أساسية وثانوية تُعرض بوصفها مواد تاريخية مترابطة.",
    topicsTitle: "الموضوعات",
    topicsText: "تخصصات ومفاهيم ترسم المشهد الفكري لتلك الحقبة.",
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
    <div className="space-y-16">
      <SiteHeader locale={locale} />

      <section className="space-y-7 pt-3 sm:pt-6">
        <p className="public-kicker">{sectionCopy.archiveLabel}</p>
        <h1 className="max-w-5xl text-[2.85rem] font-semibold leading-[1.08] tracking-tight sm:text-[4.2rem]">
          {sectionCopy.introTitle}
        </h1>
        <p className="max-w-3xl text-lg leading-9 text-[var(--muted)]">
          {sectionCopy.introText}
        </p>
        <div className="flex flex-wrap items-center gap-5 text-sm font-semibold">
          <Link href={`/${locale}/entities`} className="text-[var(--accent)] hover:underline">
            {copy.primaryCta}
          </Link>
          <Link
            href={`/${typedLocale}/entities/${encodeURIComponent(
              featuredEntitySlugByLocale[typedLocale],
            )}`}
            className="text-[var(--foreground)] hover:text-[var(--accent)] hover:underline"
          >
            {copy.secondaryCta}
          </Link>
        </div>
      </section>

      <section className="space-y-5 border-t border-[var(--border)] pt-9">
        <div className="space-y-3">
          <p className="public-kicker">{sectionCopy.featuredLabel}</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {sectionCopy.featuredTitle}
          </h2>
          <p className="text-sm leading-7 text-[var(--muted)]">
            {sectionCopy.featuredText}
          </p>
        </div>

        {featuredEntities.length > 0 ? (
          <ol className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {featuredEntities.map((entity) => (
              <li key={entity.id} className="py-5">
                <Link
                  href={`/${typedLocale}/entities/${encodeURIComponent(entity.slug)}`}
                  className="group block"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--warm)]">
                    {getEntityTypeLabel(typedLocale, entity.entityType)}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight transition group-hover:text-[var(--accent)]">
                    {entity.title}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                    {entity.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm leading-7 text-[var(--muted)]">
            {sectionCopy.emptyText}
          </p>
        )}

        <Link
          href={`/${typedLocale}/entities`}
          className="inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          {sectionCopy.listMore}
        </Link>
      </section>

      <section className="space-y-5 border-t border-[var(--border)] pt-9">
        <div className="space-y-3">
          <p className="public-kicker">{sectionCopy.knowledgeLabel}</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {sectionCopy.knowledgeTitle}
          </h2>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          <article className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              {sectionCopy.scholarsTitle}
            </h3>
            <p className="text-sm leading-7 text-[var(--muted)]">
              {sectionCopy.scholarsText}
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              {sectionCopy.worksTitle}
            </h3>
            <p className="text-sm leading-7 text-[var(--muted)]">
              {sectionCopy.worksText}
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              {sectionCopy.topicsTitle}
            </h3>
            <p className="text-sm leading-7 text-[var(--muted)]">
              {sectionCopy.topicsText}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

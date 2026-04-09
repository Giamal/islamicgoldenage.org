/**
 * Entity detail page
 *
 * Displays a single localized entity entry and its internal links.
 * Mirrors the future shape of a reference page without committing to a heavy CMS before it is needed.
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import {
  getLocalizedEntityBySlug,
  getRelatedLocalizedEntities,
} from "@/lib/content/repository";
import { buildEntityMetadata } from "@/lib/seo";
import { getEntityDetailCopy, getKindLabel } from "@/lib/ui-copy";

type EntityDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Generates entity-specific metadata so detail pages are ready for search indexing and sharing.
 */
export async function generateMetadata({ params }: EntityDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const entity = getLocalizedEntityBySlug(locale, slug);

  if (!entity) {
    return {};
  }

  return buildEntityMetadata(locale, entity);
}

/**
 * Renders a localized entity entry along with linked knowledge graph connections.
 */
export default async function EntityDetailPage({
  params,
}: EntityDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const entity = getLocalizedEntityBySlug(locale, slug);

  if (!entity) {
    notFound();
  }

  const relatedEntities = getRelatedLocalizedEntities(locale, entity.id);
  const copy = getEntityDetailCopy(locale);

  return (
    <article className="space-y-10">
      <header className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--warm)]">
          {getKindLabel(locale, entity.kind)}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {entity.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          {entity.excerpt}
        </p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="prose-content rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-7 text-base">
          {entity.bodyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <aside className="space-y-6">
          <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6">
            <h2 className="text-xl font-semibold">{copy.aboutTitle}</h2>
            <dl className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <div>
                <dt className="font-semibold text-[var(--foreground)]">
                  {copy.typeLabel}
                </dt>
                <dd>{getKindLabel(locale, entity.kind)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--foreground)]">
                  {copy.canonicalLabel}
                </dt>
                <dd>{entity.canonicalSlug}</dd>
              </div>
              {entity.featuredYear ? (
                <div>
                  <dt className="font-semibold text-[var(--foreground)]">
                    {copy.yearLabel}
                  </dt>
                  <dd>{entity.featuredYear}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6">
            <h2 className="text-xl font-semibold">{copy.relatedTitle}</h2>
            <div className="mt-4 space-y-3">
              {relatedEntities.map((related) => (
                <Link
                  key={related.id}
                  href={`/${locale}/entities/${related.slug}`}
                  className="block rounded-2xl border border-[var(--border)] px-4 py-3 transition hover:border-[var(--accent)]"
                >
                  <p className="font-semibold">{related.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </article>
  );
}

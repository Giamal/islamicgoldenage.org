/**
 * Entity card
 *
 * Presents a summarized content entry inside listing views.
 * The card shape mirrors the canonical-plus-translation model so later database wiring stays straightforward.
 */
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { getEntityTypeLabel } from "@/lib/ui-copy";

type EntityCardData = {
  id: string;
  canonicalSlug: string;
  entityType: "person" | "work" | "topic" | "event" | "place" | "source";
  featuredYear?: number;
  updatedAt: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyParagraphs: string[];
};

type EntityCardProps = {
  entity: EntityCardData;
  locale: Locale;
};

/**
 * Renders a single entity preview with type and excerpt.
 */
export function EntityCard({ entity, locale }: EntityCardProps) {
  return (
    <Link
      href={`/${locale}/entities/${encodeURIComponent(entity.slug)}`}
      prefetch={true}
      className="group rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-strong)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--warm)]">
        {getEntityTypeLabel(locale, entity.entityType)}
      </p>
      <h2 className="mt-3 text-[1.65rem] font-semibold leading-tight tracking-tight transition group-hover:text-[var(--accent)]">
        {entity.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        {entity.excerpt}
      </p>
    </Link>
  );
}

/**
 * Entity card
 *
 * Presents a summarized content entry inside listing views.
 * The card shape mirrors the canonical-plus-translation model so later database wiring stays straightforward.
 */
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { LocalizedEntitySummary } from "@/lib/content/repository";
import { getKindLabel } from "@/lib/ui-copy";

type EntityCardProps = {
  entity: LocalizedEntitySummary;
  locale: Locale;
};

/**
 * Renders a single entity preview with type and excerpt.
 */
export function EntityCard({ entity, locale }: EntityCardProps) {
  return (
    <Link
      href={`/${locale}/entities/${entity.slug}`}
      className="group rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--warm)]">
        {getKindLabel(locale, entity.kind)}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight transition group-hover:text-[var(--accent)]">
        {entity.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        {entity.excerpt}
      </p>
    </Link>
  );
}

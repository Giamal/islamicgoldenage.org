/**
 * Editorial completeness checks
 *
 * Computes lightweight readiness signals for admin editors before publication.
 */
import type { Locale } from "@/i18n/config";
import type { AdminEntityEditorData } from "@/lib/db/admin-entity-read";

export type CompletenessSeverity = "ok" | "warn";

export type CompletenessItem = {
  key: string;
  severity: CompletenessSeverity;
  message: string;
};

export type CompletenessReport = {
  scorePercent: number;
  items: CompletenessItem[];
};

function isActiveLocaleEntry(entry: {
  title: string;
  slug: string;
  summary: string;
  bodyMarkdown: string;
}) {
  return (
    entry.title.trim().length > 0 ||
    entry.slug.trim().length > 0 ||
    entry.summary.trim().length > 0 ||
    entry.bodyMarkdown.trim().length > 0
  );
}

function localeLabel(locale: Locale) {
  return locale.toUpperCase();
}

export function buildEditorialCompletenessReport(
  entity: AdminEntityEditorData,
): CompletenessReport {
  const items: CompletenessItem[] = [];

  const activeLocalizations = entity.localizations.filter((entry) =>
    isActiveLocaleEntry(entry),
  );

  for (const loc of activeLocalizations) {
    if (loc.slug.trim().length === 0) {
      items.push({
        key: `${loc.locale}-slug`,
        severity: "warn",
        message: `${localeLabel(loc.locale)} is missing a slug.`,
      });
    }

    if (loc.summary.trim().length === 0) {
      items.push({
        key: `${loc.locale}-summary`,
        severity: "warn",
        message: `${localeLabel(loc.locale)} is missing a summary.`,
      });
    }

    if (loc.bodyMarkdown.trim().length === 0) {
      items.push({
        key: `${loc.locale}-body`,
        severity: "warn",
        message: `${localeLabel(loc.locale)} is missing body markdown.`,
      });
    }
  }

  const totalRelationships =
    entity.outgoingRelationships.length + entity.incomingRelationships.length;
  if (totalRelationships === 0) {
    items.push({
      key: "relationships",
      severity: "warn",
      message: "No relationships connected yet.",
    });
  }

  const hasHeroImage = entity.heroImageUrl.trim().length > 0;
  if (hasHeroImage) {
    for (const loc of activeLocalizations) {
      if (loc.imageAlt.trim().length === 0) {
        items.push({
          key: `${loc.locale}-image-alt`,
          severity: "warn",
          message: `${localeLabel(loc.locale)} is missing image alt text.`,
        });
      }

      if (loc.imageCaption.trim().length === 0) {
        items.push({
          key: `${loc.locale}-image-caption`,
          severity: "warn",
          message: `${localeLabel(loc.locale)} is missing image caption.`,
        });
      }
    }
  }

  if (items.length === 0) {
    items.push({
      key: "ready",
      severity: "ok",
      message: "Core editorial checks are complete.",
    });
  }

  const warnings = items.filter((item) => item.severity === "warn").length;
  const scorePercent = Math.max(0, 100 - warnings * 10);

  return {
    scorePercent,
    items,
  };
}

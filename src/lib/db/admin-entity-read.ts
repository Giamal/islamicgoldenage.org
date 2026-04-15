/**
 * Admin read helpers
 *
 * Provides small Prisma queries for the private editorial area.
 * These helpers keep admin route files focused on UI and workflow.
 */
import { locales, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import type {
  ContentEntityType,
  ContentStatus,
  RelationType,
} from "@prisma/client";

export type AdminEntityListItem = {
  id: string;
  entityType: ContentEntityType;
  status: ContentStatus;
  updatedAt: Date;
  localizations: Array<{
    locale: Locale;
    title: string;
    slug: string;
  }>;
};

export type AdminEntityEditorLocalization = {
  locale: Locale;
  title: string;
  subtitle: string;
  slug: string;
  summary: string;
  bodyMarkdown: string;
  imageAlt: string;
  imageCaption: string;
  videoUrl: string;
  audioUrl: string;
};

export type AdminEntityEditorData = {
  id: string;
  entityType: ContentEntityType;
  status: ContentStatus;
  heroImageUrl: string;
  heroImageCredit: string;
  localizations: AdminEntityEditorLocalization[];
  outgoingRelationships: AdminEntityRelationshipRow[];
  incomingRelationships: AdminEntityRelationshipRow[];
  relationshipCandidates: AdminRelationshipCandidate[];
};

export type AdminEntityRelationshipRow = {
  id: string;
  relationType: RelationType;
  direction: "outgoing" | "incoming";
  entity: {
    id: string;
    entityType: ContentEntityType;
    label: string;
  };
};

export type AdminRelationshipCandidate = {
  id: string;
  entityType: ContentEntityType;
  label: string;
};

const localizedSectionKeys = {
  body: "body",
  intro: "intro",
  imageAlt: "media_image_alt",
  imageCaption: "media_image_caption",
  videoUrl: "media_video_url",
  audioUrl: "media_audio_url",
} as const;

function getSectionValue(
  sections: Array<{ sectionKey: string; content: string }>,
  key: string,
) {
  return sections.find((section) => section.sectionKey === key)?.content ?? "";
}

function getBodySectionValue(sections: Array<{ sectionKey: string; content: string }>) {
  const canonicalBody = getSectionValue(sections, localizedSectionKeys.body);
  if (canonicalBody.trim().length > 0) {
    return canonicalBody;
  }

  // Backward compatibility for legacy curated records.
  return getSectionValue(sections, localizedSectionKeys.intro);
}

function pickBestLocalizedLabel(
  localizations: Array<{ locale: Locale; title: string; slug: string }>,
): string {
  const preferred = localizations.find((item) => item.locale === "en");
  if (preferred) {
    return preferred.title || preferred.slug;
  }

  const fallback = localizations[0];
  if (fallback) {
    return fallback.title || fallback.slug;
  }

  return "Untitled entity";
}

export async function getAdminEntityListFromDb(): Promise<AdminEntityListItem[]> {
  const records = await prisma.contentEntity.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      entityType: true,
      status: true,
      updatedAt: true,
      localizations: {
        where: {
          locale: { in: [...locales] },
        },
        orderBy: { locale: "asc" },
        select: {
          locale: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  return records.map((record) => ({
    id: record.id,
    entityType: record.entityType,
    status: record.status,
    updatedAt: record.updatedAt,
    localizations: record.localizations.map((item) => ({
      locale: item.locale as Locale,
      title: item.title,
      slug: item.slug,
    })),
  }));
}

export async function getAdminEntityListByStatusFromDb(
  status: ContentStatus | "all",
): Promise<AdminEntityListItem[]> {
  const records = await prisma.contentEntity.findMany({
    where: status === "all" ? undefined : { status },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      entityType: true,
      status: true,
      updatedAt: true,
      localizations: {
        where: {
          locale: { in: [...locales] },
        },
        orderBy: { locale: "asc" },
        select: {
          locale: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  return records.map((record) => ({
    id: record.id,
    entityType: record.entityType,
    status: record.status,
    updatedAt: record.updatedAt,
    localizations: record.localizations.map((item) => ({
      locale: item.locale as Locale,
      title: item.title,
      slug: item.slug,
    })),
  }));
}

export async function getAdminEntityByIdFromDb(
  id: string,
): Promise<AdminEntityEditorData | null> {
  const record = await prisma.contentEntity.findUnique({
    where: { id },
    select: {
      id: true,
      entityType: true,
      status: true,
      heroImageUrl: true,
      heroImageCredit: true,
      localizations: {
        where: {
          locale: { in: [...locales] },
        },
        select: {
          locale: true,
          title: true,
          subtitle: true,
          slug: true,
          summary: true,
          sections: {
            where: {
              sectionKey: {
                in: [
                  localizedSectionKeys.body,
                  localizedSectionKeys.intro,
                  localizedSectionKeys.imageAlt,
                  localizedSectionKeys.imageCaption,
                  localizedSectionKeys.videoUrl,
                  localizedSectionKeys.audioUrl,
                ],
              },
            },
            orderBy: { sortOrder: "asc" },
            select: {
              sectionKey: true,
              content: true,
            },
          },
        },
      },
      outgoingRelationships: {
        select: {
          id: true,
          relationType: true,
          toEntity: {
            select: {
              id: true,
              entityType: true,
              localizations: {
                where: {
                  locale: { in: [...locales] },
                },
                select: {
                  locale: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: [{ relationType: "asc" }, { createdAt: "desc" }],
      },
      incomingRelationships: {
        select: {
          id: true,
          relationType: true,
          fromEntity: {
            select: {
              id: true,
              entityType: true,
              localizations: {
                where: {
                  locale: { in: [...locales] },
                },
                select: {
                  locale: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: [{ relationType: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!record) {
    return null;
  }

  const byLocale = new Map<Locale, AdminEntityEditorLocalization>();
  for (const locale of locales) {
    byLocale.set(locale, {
      locale,
      title: "",
      subtitle: "",
      slug: "",
      summary: "",
      bodyMarkdown: "",
      imageAlt: "",
      imageCaption: "",
      videoUrl: "",
      audioUrl: "",
    });
  }

  for (const item of record.localizations) {
    const locale = item.locale as Locale;
    byLocale.set(locale, {
      locale,
      title: item.title,
      subtitle: item.subtitle,
      slug: item.slug,
      summary: item.summary,
      bodyMarkdown: getBodySectionValue(item.sections),
      imageAlt: getSectionValue(item.sections, localizedSectionKeys.imageAlt),
      imageCaption: getSectionValue(
        item.sections,
        localizedSectionKeys.imageCaption,
      ),
      videoUrl: getSectionValue(item.sections, localizedSectionKeys.videoUrl),
      audioUrl: getSectionValue(item.sections, localizedSectionKeys.audioUrl),
    });
  }

  const candidateRecords = await prisma.contentEntity.findMany({
    where: {
      id: { not: record.id },
    },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      entityType: true,
      localizations: {
        where: {
          locale: { in: [...locales] },
        },
        select: {
          locale: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  const outgoingRelationships = record.outgoingRelationships.map(
    (relationship) => ({
      id: relationship.id,
      relationType: relationship.relationType,
      direction: "outgoing" as const,
      entity: {
        id: relationship.toEntity.id,
        entityType: relationship.toEntity.entityType,
        label: pickBestLocalizedLabel(
          relationship.toEntity.localizations.map((item) => ({
            locale: item.locale as Locale,
            title: item.title,
            slug: item.slug,
          })),
        ),
      },
    }),
  );

  const incomingRelationships = record.incomingRelationships.map(
    (relationship) => ({
      id: relationship.id,
      relationType: relationship.relationType,
      direction: "incoming" as const,
      entity: {
        id: relationship.fromEntity.id,
        entityType: relationship.fromEntity.entityType,
        label: pickBestLocalizedLabel(
          relationship.fromEntity.localizations.map((item) => ({
            locale: item.locale as Locale,
            title: item.title,
            slug: item.slug,
          })),
        ),
      },
    }),
  );

  const relationshipCandidates = candidateRecords.map((candidate) => ({
    id: candidate.id,
    entityType: candidate.entityType,
    label: pickBestLocalizedLabel(
      candidate.localizations.map((item) => ({
        locale: item.locale as Locale,
        title: item.title,
        slug: item.slug,
      })),
    ),
  }));

  return {
    id: record.id,
    entityType: record.entityType,
    status: record.status,
    heroImageUrl: record.heroImageUrl ?? "",
    heroImageCredit: record.heroImageCredit ?? "",
    localizations: locales.map((locale) => byLocale.get(locale)!),
    outgoingRelationships,
    incomingRelationships,
    relationshipCandidates,
  };
}

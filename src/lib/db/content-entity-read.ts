/**
 * Minimal Prisma read helper for entity detail lookup by localized slug.
 *
 * This intentionally bypasses repository abstractions to prove direct DB reads
 * end-to-end while the project is still transitioning from in-memory data.
 */
import type { Locale } from "@/i18n/config";
import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import { applyMuhammadHonorific } from "@/lib/honorifics";
import { prisma } from "@/lib/prisma";

type LocalizationWithEntity = Prisma.ContentEntityLocalizationGetPayload<{
  include: {
    sections: true;
    entity: {
      include: {
        personProfile: true;
        workProfile: true;
        topicProfile: true;
        localizations: {
          select: {
            locale: true;
            slug: true;
          };
        };
        outgoingRelationships: {
          include: {
            toEntity: {
              select: {
                id: true;
                entityType: true;
                localizations: {
                  select: {
                    locale: true;
                    slug: true;
                    title: true;
                  };
                };
              };
            };
          };
        };
        incomingRelationships: {
          include: {
            fromEntity: {
              select: {
                id: true;
                entityType: true;
                localizations: {
                  select: {
                    locale: true;
                    slug: true;
                    title: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

type RelevantProfile =
  | {
      kind: "person";
      data: LocalizationWithEntity["entity"]["personProfile"];
    }
  | {
      kind: "work";
      data: LocalizationWithEntity["entity"]["workProfile"];
    }
  | {
      kind: "topic";
      data: LocalizationWithEntity["entity"]["topicProfile"];
    }
  | {
      kind: "none";
      data: null;
    };

export type ContentEntityBySlugResult = {
  entity: LocalizationWithEntity["entity"];
  localization: Omit<LocalizationWithEntity, "entity">;
  profile: RelevantProfile;
};

function canonicalizeSlugForCache(slug: string): string {
  let decodedSlug = slug;

  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    // Keep the raw slug when decoding fails.
  }

  return decodedSlug.normalize("NFC");
}

function pickRelevantProfile(
  entity: LocalizationWithEntity["entity"],
): RelevantProfile {
  if (entity.entityType === "person") {
    return { kind: "person", data: entity.personProfile };
  }

  if (entity.entityType === "work") {
    return { kind: "work", data: entity.workProfile };
  }

  if (entity.entityType === "topic") {
    return { kind: "topic", data: entity.topicProfile };
  }

  return { kind: "none", data: null };
}

/**
 * Fetches one entity by localized slug and locale.
 * Includes:
 * - matched localization
 * - sorted content sections
 * - entity core record
 * - relevant profile for person/work/topic
 */
async function getContentEntityBySlugFromDbUncached(
  locale: Locale,
  slug: string,
): Promise<ContentEntityBySlugResult | null> {
  const queryStartedAt = Date.now();
  const record = await prisma.contentEntityLocalization.findUnique({
    where: {
      locale_slug: {
        locale,
        slug,
      },
    },
    include: {
      sections: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      entity: {
        include: {
          personProfile: true,
          workProfile: true,
          topicProfile: true,
          localizations: {
            select: {
              locale: true,
              slug: true,
            },
          },
          outgoingRelationships: {
            include: {
              toEntity: {
                select: {
                  id: true,
                  entityType: true,
                  localizations: {
                    where: { locale },
                    select: {
                      locale: true,
                      slug: true,
                      title: true,
                    },
                  },
                },
              },
            },
            orderBy: { importanceScore: "desc" },
          },
          incomingRelationships: {
            include: {
              fromEntity: {
                select: {
                  id: true,
                  entityType: true,
                  localizations: {
                    where: { locale },
                    select: {
                      locale: true,
                      slug: true,
                      title: true,
                    },
                  },
                },
              },
            },
            orderBy: { importanceScore: "desc" },
          },
        },
      },
    },
  });
  const queryDurationMs = Date.now() - queryStartedAt;
  console.info(
    `[perf][entity-detail][db] locale=${locale} slug=${slug} found=${Boolean(record)} duration_ms=${queryDurationMs}`,
  );

  if (!record) {
    return null;
  }

  if (record.entity.status !== "published") {
    return null;
  }

  const { entity, ...localization } = record;
  const normalizedLocalization = {
    ...localization,
    title: applyMuhammadHonorific(localization.title, locale),
    subtitle: applyMuhammadHonorific(localization.subtitle, locale),
    summary: applyMuhammadHonorific(localization.summary, locale),
    excerpt: applyMuhammadHonorific(localization.excerpt, locale),
    sections: localization.sections.map((section) => ({
      ...section,
      heading: applyMuhammadHonorific(section.heading, locale),
      content: applyMuhammadHonorific(section.content, locale),
    })),
  };
  const normalizedEntity = {
    ...entity,
    outgoingRelationships: entity.outgoingRelationships.map((relationship) => ({
      ...relationship,
      toEntity: {
        ...relationship.toEntity,
        localizations: relationship.toEntity.localizations.map((item) => ({
          ...item,
          title: applyMuhammadHonorific(item.title, locale),
        })),
      },
    })),
    incomingRelationships: entity.incomingRelationships.map((relationship) => ({
      ...relationship,
      fromEntity: {
        ...relationship.fromEntity,
        localizations: relationship.fromEntity.localizations.map((item) => ({
          ...item,
          title: applyMuhammadHonorific(item.title, locale),
        })),
      },
    })),
  };

  return {
    entity: normalizedEntity,
    localization: normalizedLocalization,
    profile: pickRelevantProfile(normalizedEntity),
  };
}

const getContentEntityBySlugFromDbCached = unstable_cache(
  async (locale: Locale, slug: string) =>
    getContentEntityBySlugFromDbUncached(locale, slug),
  ["content-entity-detail-by-locale-slug"],
  { revalidate: 3600, tags: ["content-entity-detail"] },
);

export async function getContentEntityBySlugFromDb(
  locale: Locale,
  slug: string,
): Promise<ContentEntityBySlugResult | null> {
  const canonicalLocale = locale.toLowerCase() as Locale;
  const canonicalSlug = canonicalizeSlugForCache(slug);
  const isArabicLocale = canonicalLocale === "ar";

  console.info(
    `[perf][entity-detail][slug] locale=${canonicalLocale} isArabicLocale=${isArabicLocale} rawSlug=${slug} canonicalSlug=${canonicalSlug}`,
  );

  return getContentEntityBySlugFromDbCached(canonicalLocale, canonicalSlug);
}

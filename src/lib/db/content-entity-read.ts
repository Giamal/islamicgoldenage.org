/**
 * Minimal Prisma read helper for entity detail lookup by localized slug.
 *
 * This intentionally bypasses repository abstractions to prove direct DB reads
 * end-to-end while the project is still transitioning from in-memory data.
 */
import type { Locale } from "@/i18n/config";
import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
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
  const slugCandidates = new Set<string>();
  const addCandidate = (value: string) => {
    if (!value) {
      return;
    }
    slugCandidates.add(value);
    slugCandidates.add(value.normalize("NFC"));
  };

  addCandidate(slug);
  try {
    addCandidate(decodeURIComponent(slug));
  } catch {
    // Ignore malformed URI input and keep the raw slug candidate only.
  }

  const queryStartedAt = Date.now();
  const record = await prisma.contentEntityLocalization.findFirst({
    where: {
      locale,
      slug: { in: [...slugCandidates] },
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

  const { entity, ...localization } = record;

  return {
    entity,
    localization,
    profile: pickRelevantProfile(entity),
  };
}

export const getContentEntityBySlugFromDb = unstable_cache(
  async (locale: Locale, slug: string) =>
    getContentEntityBySlugFromDbUncached(locale, slug),
  ["content-entity-detail-by-locale-slug"],
  { revalidate: 3600 },
);

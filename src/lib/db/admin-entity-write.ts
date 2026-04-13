/**
 * Admin write helpers
 *
 * Implements minimal editorial create/update operations for entities and localized content.
 * Long-form localized body content is stored in ContentSection using sectionKey="body".
 */
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import type {
  ContentEntityType,
  ContentStatus,
  RelationType,
} from "@prisma/client";

export type AdminLocalizedInput = {
  locale: Locale;
  title: string;
  slug: string;
  summary: string;
  bodyMarkdown: string;
};

export type AdminEntityUpsertInput = {
  entityType: ContentEntityType;
  status: ContentStatus;
  localizations: AdminLocalizedInput[];
};

function normalizeLocalizationInput(localization: AdminLocalizedInput) {
  return {
    ...localization,
    title: localization.title.trim(),
    slug: localization.slug.trim(),
    summary: localization.summary.trim(),
    bodyMarkdown: localization.bodyMarkdown.trim(),
  };
}

function getActiveLocalizations(localizations: AdminLocalizedInput[]) {
  return localizations
    .map(normalizeLocalizationInput)
    .filter((item) => item.title.length > 0 && item.slug.length > 0);
}

function pickCanonicalSlug(localizations: AdminLocalizedInput[]) {
  const first = getActiveLocalizations(localizations)[0];
  return first?.slug;
}

export async function createAdminEntityInDb(input: AdminEntityUpsertInput) {
  const activeLocalizations = getActiveLocalizations(input.localizations);
  if (activeLocalizations.length === 0) {
    throw new Error("At least one locale must include both title and slug.");
  }

  const canonicalSlug = pickCanonicalSlug(input.localizations);
  if (!canonicalSlug) {
    throw new Error("Unable to derive canonical slug.");
  }

  const entity = await prisma.contentEntity.create({
    data: {
      entityType: input.entityType,
      status: input.status,
      canonicalSlug,
    },
    select: {
      id: true,
    },
  });

  for (const localization of activeLocalizations) {
    await prisma.contentEntityLocalization.create({
      data: {
        entityId: entity.id,
        locale: localization.locale,
        slug: localization.slug,
        title: localization.title,
        summary: localization.summary,
        excerpt: localization.summary || localization.title,
        seoTitle: localization.title,
        seoDescription: localization.summary || localization.title,
        sections:
          localization.bodyMarkdown.length > 0
            ? {
                create: {
                  sectionKey: "body",
                  heading: "Body",
                  content: localization.bodyMarkdown,
                  sortOrder: 100,
                },
              }
            : undefined,
      },
    });
  }

  return entity.id;
}

export async function updateAdminEntityInDb(
  entityId: string,
  input: AdminEntityUpsertInput,
) {
  const activeLocalizations = getActiveLocalizations(input.localizations);
  if (activeLocalizations.length === 0) {
    throw new Error("At least one locale must include both title and slug.");
  }

  const canonicalSlug = pickCanonicalSlug(input.localizations);
  if (!canonicalSlug) {
    throw new Error("Unable to derive canonical slug.");
  }

  await prisma.contentEntity.update({
    where: { id: entityId },
    data: {
      entityType: input.entityType,
      status: input.status,
      canonicalSlug,
    },
  });

  for (const localization of activeLocalizations) {
    const savedLocalization = await prisma.contentEntityLocalization.upsert({
      where: {
        entityId_locale: {
          entityId,
          locale: localization.locale,
        },
      },
      create: {
        entityId,
        locale: localization.locale,
        slug: localization.slug,
        title: localization.title,
        summary: localization.summary,
        excerpt: localization.summary || localization.title,
        seoTitle: localization.title,
        seoDescription: localization.summary || localization.title,
      },
      update: {
        slug: localization.slug,
        title: localization.title,
        summary: localization.summary,
        excerpt: localization.summary || localization.title,
        seoTitle: localization.title,
        seoDescription: localization.summary || localization.title,
      },
      select: {
        id: true,
      },
    });

    if (localization.bodyMarkdown.length > 0) {
      await prisma.contentSection.upsert({
        where: {
          localizationId_sectionKey: {
            localizationId: savedLocalization.id,
            sectionKey: "body",
          },
        },
        create: {
          localizationId: savedLocalization.id,
          sectionKey: "body",
          heading: "Body",
          content: localization.bodyMarkdown,
          sortOrder: 100,
        },
        update: {
          content: localization.bodyMarkdown,
        },
      });
    } else {
      await prisma.contentSection.deleteMany({
        where: {
          localizationId: savedLocalization.id,
          sectionKey: "body",
        },
      });
    }
  }

  return entityId;
}

type AddRelationshipInput = {
  currentEntityId: string;
  direction: "outgoing" | "incoming";
  relationType: RelationType;
  otherEntityId: string;
};

export async function addAdminRelationshipInDb(input: AddRelationshipInput) {
  const fromEntityId =
    input.direction === "outgoing" ? input.currentEntityId : input.otherEntityId;
  const toEntityId =
    input.direction === "outgoing" ? input.otherEntityId : input.currentEntityId;

  if (fromEntityId === toEntityId) {
    throw new Error("Cannot create a relationship to the same entity.");
  }

  await prisma.contentRelationship.upsert({
    where: {
      fromEntityId_toEntityId_relationType: {
        fromEntityId,
        toEntityId,
        relationType: input.relationType,
      },
    },
    update: {},
    create: {
      fromEntityId,
      toEntityId,
      relationType: input.relationType,
      sourceEntityIds: [],
    },
  });
}

export async function removeAdminRelationshipInDb(
  currentEntityId: string,
  relationshipId: string,
) {
  const relationship = await prisma.contentRelationship.findUnique({
    where: { id: relationshipId },
    select: {
      id: true,
      fromEntityId: true,
      toEntityId: true,
    },
  });

  if (!relationship) {
    return;
  }

  if (
    relationship.fromEntityId !== currentEntityId &&
    relationship.toEntityId !== currentEntityId
  ) {
    throw new Error("Relationship does not belong to this entity.");
  }

  await prisma.contentRelationship.delete({
    where: { id: relationshipId },
  });
}

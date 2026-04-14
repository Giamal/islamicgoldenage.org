/**
 * Admin write helpers
 *
 * Implements minimal editorial create/update operations for entities and localized content.
 * Long-form and media-localized fields are stored in ContentSection with stable section keys.
 */
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import type {
  ContentEntityType,
  ContentStatus,
  RelationType,
} from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminLocalizedInput = {
  locale: Locale;
  title: string;
  slug: string;
  summary: string;
  bodyMarkdown: string;
  imageAlt: string;
  imageCaption: string;
  videoUrl: string;
  audioUrl: string;
};

export type AdminEntityUpsertInput = {
  entityType: ContentEntityType;
  status: ContentStatus;
  heroImageUrl: string;
  heroImageCredit: string;
  localizations: AdminLocalizedInput[];
};

const localizedSectionKeys = {
  body: "body",
  imageAlt: "media_image_alt",
  imageCaption: "media_image_caption",
  videoUrl: "media_video_url",
  audioUrl: "media_audio_url",
} as const;

function normalizeLocalizationInput(localization: AdminLocalizedInput) {
  return {
    ...localization,
    title: localization.title.trim(),
    slug: localization.slug.trim(),
    summary: localization.summary.trim(),
    bodyMarkdown: localization.bodyMarkdown.trim(),
    imageAlt: localization.imageAlt.trim(),
    imageCaption: localization.imageCaption.trim(),
    videoUrl: localization.videoUrl.trim(),
    audioUrl: localization.audioUrl.trim(),
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

async function upsertOrDeleteSection(
  localizationId: string,
  sectionKey: string,
  heading: string,
  sortOrder: number,
  value: string,
) {
  if (value.length === 0) {
    await prisma.contentSection.deleteMany({
      where: {
        localizationId,
        sectionKey,
      },
    });
    return;
  }

  await prisma.contentSection.upsert({
    where: {
      localizationId_sectionKey: {
        localizationId,
        sectionKey,
      },
    },
    create: {
      localizationId,
      sectionKey,
      heading,
      content: value,
      sortOrder,
    },
    update: {
      content: value,
    },
  });
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
      heroImageUrl: input.heroImageUrl.trim() || null,
      heroImageCredit: input.heroImageCredit.trim() || null,
    },
    select: {
      id: true,
    },
  });

  for (const localization of activeLocalizations) {
    const savedLocalization = await prisma.contentEntityLocalization.create({
      data: {
        entityId: entity.id,
        locale: localization.locale,
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

    await upsertOrDeleteSection(
      savedLocalization.id,
      localizedSectionKeys.body,
      "Body",
      100,
      localization.bodyMarkdown,
    );
    await upsertOrDeleteSection(
      savedLocalization.id,
      localizedSectionKeys.imageAlt,
      "Image alt",
      110,
      localization.imageAlt,
    );
    await upsertOrDeleteSection(
      savedLocalization.id,
      localizedSectionKeys.imageCaption,
      "Image caption",
      120,
      localization.imageCaption,
    );
    await upsertOrDeleteSection(
      savedLocalization.id,
      localizedSectionKeys.videoUrl,
      "Video URL",
      130,
      localization.videoUrl,
    );
    await upsertOrDeleteSection(
      savedLocalization.id,
      localizedSectionKeys.audioUrl,
      "Audio URL",
      140,
      localization.audioUrl,
    );
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
      heroImageUrl: input.heroImageUrl.trim() || null,
      heroImageCredit: input.heroImageCredit.trim() || null,
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

    await upsertOrDeleteSection(
      savedLocalization.id,
      localizedSectionKeys.body,
      "Body",
      100,
      localization.bodyMarkdown,
    );
    await upsertOrDeleteSection(
      savedLocalization.id,
      localizedSectionKeys.imageAlt,
      "Image alt",
      110,
      localization.imageAlt,
    );
    await upsertOrDeleteSection(
      savedLocalization.id,
      localizedSectionKeys.imageCaption,
      "Image caption",
      120,
      localization.imageCaption,
    );
    await upsertOrDeleteSection(
      savedLocalization.id,
      localizedSectionKeys.videoUrl,
      "Video URL",
      130,
      localization.videoUrl,
    );
    await upsertOrDeleteSection(
      savedLocalization.id,
      localizedSectionKeys.audioUrl,
      "Audio URL",
      140,
      localization.audioUrl,
    );
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

export type AdminEntityDeleteResult =
  | {
      ok: true;
      entityId: string;
      localizations: Array<{ locale: Locale; slug: string }>;
    }
  | {
      ok: false;
      code:
        | "INVALID_ID"
        | "NOT_FOUND"
        | "REFERENCED_AS_SOURCE"
        | "REFERENCED_BY_PROFILE_LINKS"
        | "UNKNOWN";
      message: string;
    };

function isValidEntityId(entityId: string) {
  const trimmed = entityId.trim();
  return trimmed.length >= 10 && trimmed.length <= 100 && !/\s/.test(trimmed);
}

/**
 * Deletes one content entity when it is safe to do so.
 *
 * Safety note:
 * - relational records are removed via Prisma onDelete: Cascade
 * - sourceEntityIds is an array field without FK enforcement, so deletion is blocked
 *   when the entity is still referenced there to avoid dangling evidence references
 */
export async function deleteAdminEntityInDb(
  entityId: string,
): Promise<AdminEntityDeleteResult> {
  const normalizedId = entityId.trim();

  if (!isValidEntityId(normalizedId)) {
    return {
      ok: false,
      code: "INVALID_ID",
      message: "Invalid entity ID.",
    };
  }

  const existingEntity = await prisma.contentEntity.findUnique({
    where: { id: normalizedId },
    select: {
      id: true,
      canonicalSlug: true,
      localizations: {
        select: {
          locale: true,
          slug: true,
        },
      },
    },
  });

  if (!existingEntity) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "Entity not found.",
    };
  }

  const sourceReferenceCount = await prisma.contentRelationship.count({
    where: {
      sourceEntityIds: { has: normalizedId },
    },
  });

  if (sourceReferenceCount > 0) {
    return {
      ok: false,
      code: "REFERENCED_AS_SOURCE",
      message:
        "This entity is still referenced as a source in relationships. Remove those references first.",
    };
  }

  const canonicalSlug = existingEntity.canonicalSlug;
  const [
    topicParentReferenceCount,
    topicRelatedReferenceCount,
    personPlaceReferenceCount,
    workPlaceReferenceCount,
  ] = await Promise.all([
    prisma.topicProfile.count({
      where: { parentTopicCanonicalSlug: canonicalSlug },
    }),
    prisma.topicProfile.count({
      where: { relatedTopicCanonicalSlugs: { has: canonicalSlug } },
    }),
    prisma.personProfile.count({
      where: { associatedPlaces: { has: canonicalSlug } },
    }),
    prisma.workProfile.count({
      where: { manuscriptPlaces: { has: canonicalSlug } },
    }),
  ]);

  const profileLinkReferenceCount =
    topicParentReferenceCount +
    topicRelatedReferenceCount +
    personPlaceReferenceCount +
    workPlaceReferenceCount;

  if (profileLinkReferenceCount > 0) {
    return {
      ok: false,
      code: "REFERENCED_BY_PROFILE_LINKS",
      message:
        "This entity is still referenced by profile slug links. Remove those references first.",
    };
  }

  try {
    await prisma.contentEntity.delete({
      where: { id: normalizedId },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        ok: false,
        code: "NOT_FOUND",
        message: "Entity not found.",
      };
    }

    return {
      ok: false,
      code: "UNKNOWN",
      message: "Failed to delete entity. Please try again.",
    };
  }

  return {
    ok: true,
    entityId: normalizedId,
    localizations: existingEntity.localizations.map((item) => ({
      locale: item.locale as Locale,
      slug: item.slug,
    })),
  };
}

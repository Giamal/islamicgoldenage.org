/**
 * In-memory content repository
 *
 * Provides typed read helpers over in-memory content entities and relationships.
 * This is intentionally simple and can be replaced by a database-backed layer later.
 */
import type { Locale } from "@/lib/types/i18n";
import { defaultLocale } from "@/config/site";
import { people } from "@/lib/content/data/people";
import { relationships } from "@/lib/content/data/relationships";
import { topics } from "@/lib/content/data/topics";
import { works } from "@/lib/content/data/works";
import type {
  ContentEntity,
  ContentEntityType,
  DerivedConnections,
  DerivedConnectionGroup,
  EntityRelationship,
  EntityReference,
  EventEntity,
  EventLocalizedContent,
  LocalizedContentBase,
  PersonEntity,
  PersonLocalizedContent,
  PlaceEntity,
  PlaceLocalizedContent,
  SourceEntity,
  SourceLocalizedContent,
  TopicEntity,
  TopicLocalizedContent,
  WorkEntity,
  WorkLocalizedContent,
} from "@/lib/content/types";

/**
 * Legacy kind union currently used by existing UI labels and cards.
 */
export type EntityKind = "ARTICLE" | "PERSON" | "BOOK" | "EVENT" | "CATEGORY";

/**
 * Legacy localized summary currently used by listing/detail routes.
 */
export type LocalizedEntitySummary = {
  id: string;
  canonicalSlug: string;
  kind: EntityKind;
  featuredYear?: number;
  updatedAt: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyParagraphs: string[];
};

type LocalizedContentForEntity<E extends ContentEntity> = E extends PersonEntity
  ? PersonLocalizedContent
  : E extends WorkEntity
    ? WorkLocalizedContent
    : E extends TopicEntity
      ? TopicLocalizedContent
      : E extends EventEntity
        ? EventLocalizedContent
        : E extends PlaceEntity
          ? PlaceLocalizedContent
          : E extends SourceEntity
            ? SourceLocalizedContent
            : LocalizedContentBase;

type LocalizedEntityResult<E extends ContentEntity> = E & {
  localization: LocalizedContentForEntity<E>;
};

type DerivableEntityType = "person" | "work" | "topic" | "event" | "place";

const entitiesByType = {
  person: people,
  work: works,
  topic: topics,
  event: [] as EventEntity[],
  place: [] as PlaceEntity[],
  source: [] as SourceEntity[],
} as const;

const allEntities: ContentEntity[] = [
  ...entitiesByType.person,
  ...entitiesByType.work,
  ...entitiesByType.topic,
  ...entitiesByType.event,
  ...entitiesByType.place,
  ...entitiesByType.source,
];

/**
 * Returns entities for a single content type.
 */
export function getEntitiesByType<T extends ContentEntityType>(entityType: T) {
  return entitiesByType[entityType];
}

/**
 * Resolves an entity by id across all in-memory collections.
 */
export function getEntityById(id: string) {
  return allEntities.find((entity) => entity.id === id);
}

function getEntityLocalization<E extends ContentEntity>(
  entity: E,
  locale: Locale,
): LocalizedContentForEntity<E> | null {
  const localized =
    entity.localizations[locale] ?? entity.localizations[defaultLocale] ?? null;

  return localized as LocalizedContentForEntity<E> | null;
}

/**
 * Returns an entity decorated with locale-specific content and English fallback.
 */
export function getLocalizedEntity<E extends ContentEntity>(
  entity: E,
  locale: Locale,
): LocalizedEntityResult<E> | null {
  const localization = getEntityLocalization(entity, locale);

  if (!localization) {
    return null;
  }

  return {
    ...entity,
    localization,
  };
}

function entityMatchesSlug(entity: ContentEntity, locale: Locale, slug: string) {
  const localizedSlug = entity.localizations[locale]?.slug;
  const fallbackSlug = entity.localizations[defaultLocale]?.slug;

  return localizedSlug === slug || fallbackSlug === slug;
}

/**
 * Resolves a person by localized slug with English slug fallback.
 */
export function getPersonBySlug(locale: Locale, slug: string) {
  return people.find((person) => entityMatchesSlug(person, locale, slug));
}

/**
 * Resolves a work by localized slug with English slug fallback.
 */
export function getWorkBySlug(locale: Locale, slug: string) {
  return works.find((work) => entityMatchesSlug(work, locale, slug));
}

/**
 * Resolves a topic by localized slug with default-locale slug fallback.
 */
export function getTopicBySlug(locale: Locale, slug: string) {
  return topics.find((topic) => entityMatchesSlug(topic, locale, slug));
}

/**
 * Resolves any entity by localized slug with default-locale fallback.
 */
export function getEntityBySlug(locale: Locale, slug: string) {
  return allEntities.find((entity) => entityMatchesSlug(entity, locale, slug));
}

/**
 * Returns all direct relationship edges for a given entity id.
 */
function getRelationshipsForEntity(entityId: string): EntityRelationship[] {
  return relationships.filter(
    (relationship) =>
      relationship.from.entityId === entityId ||
      relationship.to.entityId === entityId,
  );
}

/**
 * Resolves directly connected entities using relationship edges.
 */
export function getRelatedEntities(entityId: string) {
  const relatedScores = new Map<string, number>();

  for (const relationship of getRelationshipsForEntity(entityId)) {
    if (relationship.from.entityId !== entityId) {
      const previousScore = relatedScores.get(relationship.from.entityId) ?? 0;
      relatedScores.set(
        relationship.from.entityId,
        Math.max(previousScore, relationship.importanceScore),
      );
    }

    if (relationship.to.entityId !== entityId) {
      const previousScore = relatedScores.get(relationship.to.entityId) ?? 0;
      relatedScores.set(
        relationship.to.entityId,
        Math.max(previousScore, relationship.importanceScore),
      );
    }
  }

  return Array.from(relatedScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => getEntityById(id))
    .filter((entity): entity is ContentEntity => Boolean(entity));
}

function createEmptyDerivedGroup(): DerivedConnectionGroup {
  return {
    relatedPeople: [],
    relatedWorks: [],
    relatedTopics: [],
    relatedEvents: [],
    relatedPlaces: [],
  };
}

function appendDerivedReference(
  group: DerivedConnectionGroup,
  reference: EntityReference,
) {
  switch (reference.entityType) {
    case "person":
      group.relatedPeople.push({
        entityType: "person",
        entityId: reference.entityId,
      });
      return;
    case "work":
      group.relatedWorks.push({
        entityType: "work",
        entityId: reference.entityId,
      });
      return;
    case "topic":
      group.relatedTopics.push({
        entityType: "topic",
        entityId: reference.entityId,
      });
      return;
    case "event":
      group.relatedEvents.push({
        entityType: "event",
        entityId: reference.entityId,
      });
      return;
    case "place":
      group.relatedPlaces.push({
        entityType: "place",
        entityId: reference.entityId,
      });
      return;
    default:
      return;
  }
}

function isDerivableEntityType(
  entityType: ContentEntityType,
): entityType is DerivableEntityType {
  return (
    entityType === "person" ||
    entityType === "work" ||
    entityType === "topic" ||
    entityType === "event" ||
    entityType === "place"
  );
}

/**
 * Groups direct relationship edges into typed connection buckets for UI usage.
 */
export function getDerivedConnections(entityId: string): DerivedConnections {
  const primaryScores: Record<DerivableEntityType, Map<string, number>> = {
    person: new Map<string, number>(),
    work: new Map<string, number>(),
    topic: new Map<string, number>(),
    event: new Map<string, number>(),
    place: new Map<string, number>(),
  };

  for (const relationship of getRelationshipsForEntity(entityId)) {
    const relatedReference =
      relationship.from.entityId === entityId
        ? relationship.to
        : relationship.to.entityId === entityId
          ? relationship.from
          : null;

    if (!relatedReference) {
      continue;
    }

    if (!isDerivableEntityType(relatedReference.entityType)) {
      continue;
    }

    const bucket = primaryScores[relatedReference.entityType];
    const previousScore = bucket.get(relatedReference.entityId) ?? 0;

    bucket.set(
      relatedReference.entityId,
      Math.max(previousScore, relationship.importanceScore),
    );
  }

  const primaryConnections = createEmptyDerivedGroup();
  const secondaryConnections = createEmptyDerivedGroup();

  (Object.keys(primaryScores) as Array<keyof typeof primaryScores>).forEach(
    (entityType) => {
      const scoredEntries = Array.from(primaryScores[entityType].entries()).sort(
        (a, b) => b[1] - a[1],
      );

      for (const [entityIdOfType] of scoredEntries) {
        appendDerivedReference(primaryConnections, {
          entityType,
          entityId: entityIdOfType,
        });
      }
    },
  );

  return {
    primaryConnections,
    secondaryConnections,
  };
}

function mapEntityTypeToKind(entityType: ContentEntityType): EntityKind {
  switch (entityType) {
    case "person":
      return "PERSON";
    case "work":
      return "BOOK";
    case "event":
      return "EVENT";
    case "topic":
    case "place":
      return "CATEGORY";
    case "source":
      return "ARTICLE";
    default:
      return "ARTICLE";
  }
}

function mapEntityToLegacySummary(
  entity: ContentEntity,
  locale: Locale,
): LocalizedEntitySummary | null {
  const localized = getLocalizedEntity(entity, locale);

  if (!localized) {
    return null;
  }

  const bodyParagraphs =
    localized.localization.sections
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((section) => section.content) ?? [];

  const featuredYear =
    entity.entityType === "person"
      ? entity.birthYear
      : entity.entityType === "work"
        ? entity.compositionYear
        : undefined;

  return {
    id: entity.id,
    canonicalSlug: entity.canonicalSlug,
    kind: mapEntityTypeToKind(entity.entityType),
    featuredYear,
    updatedAt: entity.updatedAt,
    slug: localized.localization.slug,
    title: localized.localization.title,
    excerpt: localized.localization.excerpt,
    bodyParagraphs:
      bodyParagraphs.length > 0 ? bodyParagraphs : [localized.localization.summary],
  };
}

/**
 * Legacy helper used by current entity index and sitemap routes.
 */
export function getLocalizedEntities(locale: Locale): LocalizedEntitySummary[] {
  return allEntities
    .map((entity) => mapEntityToLegacySummary(entity, locale))
    .filter((entity): entity is LocalizedEntitySummary => Boolean(entity))
    .sort((a, b) => (b.featuredYear ?? 0) - (a.featuredYear ?? 0));
}

/**
 * Legacy helper used by current entity detail route.
 */
export function getLocalizedEntityBySlug(
  locale: Locale,
  slug: string,
): LocalizedEntitySummary | null {
  const entity = allEntities.find((candidate) =>
    entityMatchesSlug(candidate, locale, slug),
  );

  return entity ? mapEntityToLegacySummary(entity, locale) : null;
}

/**
 * Legacy helper used by current entity detail related-content sidebar.
 */
export function getRelatedLocalizedEntities(
  locale: Locale,
  entityId: string,
): LocalizedEntitySummary[] {
  return getRelatedEntities(entityId)
    .map((entity) => mapEntityToLegacySummary(entity, locale))
    .filter((entity): entity is LocalizedEntitySummary => Boolean(entity));
}

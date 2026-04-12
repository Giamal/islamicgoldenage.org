/**
 * Content domain types
 *
 * Implementation-facing type system for the multilingual content model.
 * Keeps entity identity, localized content, SEO fields, and relationships explicit.
 */
import type { Locale } from "@/lib/types/i18n";

/** Supported core content entities. */
export type ContentEntityType =
  | "person"
  | "work"
  | "topic"
  | "event"
  | "place"
  | "source";

/** Publication lifecycle status shared by all entities. */
export type ContentStatus = "draft" | "published" | "archived";

/** Historical date string (exact, year-only, range-like, or normalized persisted value). */
export type HistoricalDateString = string;

/** Editorial ranking signal on a 0-100 scale. */
export type ImportanceScore = number;

/** Reusable media reference for hero images and galleries. */
export type MediaReference = {
  url: string;
  alt?: string;
  credit?: string;
};

/** Locale-level SEO fields used by metadata generation. */
export type LocalizedSeoFields = {
  seoTitle: string;
  seoDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
};

/** Structured content section used by major entity pages. */
export type ContentSection<SectionKey extends string = string> = {
  sectionKey: SectionKey;
  heading: string;
  content: string;
  order: number;
};

/** Shared canonical fields used by all entities. */
export type ContentEntityBase = {
  id: string;
  entityType: ContentEntityType;
  canonicalSlug: string;
  status: ContentStatus;
  importanceScore: ImportanceScore;
  createdAt: HistoricalDateString;
  updatedAt: HistoricalDateString;
};

/** Shared localized fields used by all entities. */
export type LocalizedContentBase<SectionKey extends string = string> = {
  locale: Locale;
  slug: string;
  title: string;
  summary: string;
  excerpt: string;
  seo: LocalizedSeoFields;
  sections: ContentSection<SectionKey>[];
};

/** Shared relation target pointer. */
export type EntityReference<T extends ContentEntityType = ContentEntityType> = {
  entityType: T;
  entityId: string;
};

/** Section keys for structured person pages. */
export type PersonSectionKey =
  | "introduction"
  | "biography"
  | "contributions"
  | "influence"
  | "legacy";

/** Section keys for structured work pages. */
export type WorkSectionKey =
  | "introduction"
  | "context"
  | "structure"
  | "themes"
  | "transmission"
  | "impact";

/** Section keys for structured topic pages. */
export type TopicSectionKey =
  | "definition"
  | "historical-context"
  | "major-figures"
  | "major-works"
  | "legacy";

/** Localized content shape for person pages. */
export type PersonLocalizedContent = LocalizedContentBase<PersonSectionKey>;

/** Localized content shape for work pages. */
export type WorkLocalizedContent = LocalizedContentBase<WorkSectionKey>;

/** Localized content shape for topic pages. */
export type TopicLocalizedContent = LocalizedContentBase<TopicSectionKey>;

/** Localized content shape for event pages. */
export type EventLocalizedContent = LocalizedContentBase;

/** Localized content shape for place pages. */
export type PlaceLocalizedContent = LocalizedContentBase;

/** Localized content shape for source pages. */
export type SourceLocalizedContent = LocalizedContentBase;

/** Shared role for optional external identifiers. */
export type ExternalIdentifier = {
  system: string;
  value: string;
};

/** Person-specific canonical fields. */
export type PersonRole =
  | "prophet"
  | "scholar"
  | "physician"
  | "philosopher"
  | "astronomer"
  | "mathematician"
  | "translator"
  | "chemist"
  | "jurist"
  | "theologian"
  | "patron"
  | "ruler";

/** Person-specific canonical fields. */
export type PersonEntity = ContentEntityBase & {
  entityType: "person";
  namePrimary: string;
  nameVariants: string[];
  birthYear?: number;
  deathYear?: number;
  roles: PersonRole[];
  domains?: string[];
  associatedPlaceIds: string[];
  eraLabel?: string;
  gender?: string;
  externalIds?: ExternalIdentifier[];
  heroImage?: MediaReference;
  gallery?: MediaReference[];
  localizations: Partial<Record<Locale, PersonLocalizedContent>>;
};

/** Work kinds represented by the content model. */
export type WorkType =
  | "book"
  | "treatise"
  | "manuscript"
  | "commentary"
  | "translation";

/** Contributor roles used for works with non-author participants. */
export type WorkContributorRole =
  | "author"
  | "translator"
  | "commentator"
  | "editor"
  | "compiler";

/** Person contribution record for a work. */
export type WorkContributor = {
  personId: string;
  role: WorkContributorRole;
};

/** Work-specific canonical fields. */
export type WorkEntity = ContentEntityBase & {
  entityType: "work";
  titlePrimary: string;
  workType: WorkType;
  compositionYear?: number;
  languageOriginal?: string;
  contributors: WorkContributor[];
  alternateTitles?: string[];
  incipit?: string;
  manuscriptPlaceIds?: string[];
  heroImage?: MediaReference;
  gallery?: MediaReference[];
  localizations: Partial<Record<Locale, WorkLocalizedContent>>;
};

/** Topic classification used for browsing and SEO aggregation. */
export type TopicType = "discipline" | "concept" | "method" | "institution";

/** Topic-specific canonical fields. */
export type TopicEntity = ContentEntityBase & {
  entityType: "topic";
  labelPrimary: string;
  topicType: TopicType;
  parentTopicId?: string;
  synonymLabels?: string[];
  relatedTopicIds?: string[];
  heroImage?: MediaReference;
  gallery?: MediaReference[];
  localizations: Partial<Record<Locale, TopicLocalizedContent>>;
};

/** Precision marker for historical dates. */
export type DatePrecision = "exact" | "year" | "range" | "approximate";

/** Event categories used by chronology pages. */
export type EventType =
  | "birth"
  | "death"
  | "publication"
  | "founding"
  | "translation-movement"
  | "battle"
  | "other";

/** Event-specific canonical fields. */
export type EventEntity = ContentEntityBase & {
  entityType: "event";
  eventType: EventType;
  startDate: HistoricalDateString;
  endDate?: HistoricalDateString;
  datePrecision?: DatePrecision;
  placeId?: string;
  participantPersonIds?: string[];
  heroImage?: MediaReference;
  gallery?: MediaReference[];
  localizations: Partial<Record<Locale, EventLocalizedContent>>;
};

/** Place categories used for geographic context. */
export type PlaceType = "city" | "region" | "institution" | "empire";

/** Basic geographic coordinate pair. */
export type GeoPoint = {
  lat: number;
  lng: number;
};

/** Place-specific canonical fields. */
export type PlaceEntity = ContentEntityBase & {
  entityType: "place";
  namePrimary: string;
  placeType: PlaceType;
  geo?: GeoPoint;
  modernCountry?: string;
  historicalNames?: string[];
  heroImage?: MediaReference;
  gallery?: MediaReference[];
  localizations: Partial<Record<Locale, PlaceLocalizedContent>>;
};

/** Source categories for bibliography and evidence. */
export type SourceType =
  | "primary"
  | "secondary"
  | "encyclopedia"
  | "manuscript-catalog";

/** Source-specific canonical fields. */
export type SourceEntity = ContentEntityBase & {
  entityType: "source";
  sourceType: SourceType;
  citationShort: string;
  citationFull: string;
  publicationYear?: number;
  author?: string;
  publisher?: string;
  isbnOrIdentifier?: string;
  url?: string;
  heroImage?: MediaReference;
  gallery?: MediaReference[];
  localizations: Partial<Record<Locale, SourceLocalizedContent>>;
};

/** Union type for all top-level entities. */
export type ContentEntity =
  | PersonEntity
  | WorkEntity
  | TopicEntity
  | EventEntity
  | PlaceEntity
  | SourceEntity;

/** Supported relation semantics across entities. */
export type RelationType =
  | "authored"
  | "commented_on"
  | "translated"
  | "influenced"
  | "about"
  | "related_to"
  | "associated_with"
  | "born_in"
  | "died_in"
  | "located_in"
  | "occurred_in"
  | "participated_in"
  | "documented_by";

/** Explicit graph edge used for queryable relationships. */
export type EntityRelationship = {
  id: string;
  from: EntityReference;
  to: EntityReference;
  relationType: RelationType;
  importanceScore: ImportanceScore;
  sourceIds: string[];
};

/** Grouped related entities shown on detail pages. */
export type DerivedConnectionGroup = {
  relatedPeople: EntityReference<"person">[];
  relatedWorks: EntityReference<"work">[];
  relatedTopics: EntityReference<"topic">[];
  relatedEvents: EntityReference<"event">[];
  relatedPlaces: EntityReference<"place">[];
};

/** Computed connection tiers used by "related content" UI blocks. */
export type DerivedConnections = {
  primaryConnections: DerivedConnectionGroup;
  secondaryConnections: DerivedConnectionGroup;
};

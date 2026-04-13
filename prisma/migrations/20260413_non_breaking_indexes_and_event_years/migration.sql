-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LocaleCode" AS ENUM ('en', 'it', 'ar');

-- CreateEnum
CREATE TYPE "ContentEntityType" AS ENUM ('person', 'work', 'topic', 'event', 'place', 'source');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "PersonRole" AS ENUM ('prophet', 'scholar', 'physician', 'philosopher', 'astronomer', 'mathematician', 'translator', 'chemist', 'jurist', 'theologian', 'patron', 'ruler');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('book', 'treatise', 'manuscript', 'commentary', 'translation');

-- CreateEnum
CREATE TYPE "WorkContributorRole" AS ENUM ('author', 'translator', 'commentator', 'editor', 'compiler');

-- CreateEnum
CREATE TYPE "TopicType" AS ENUM ('discipline', 'concept', 'method', 'institution');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('birth', 'death', 'publication', 'founding', 'translation_movement', 'battle', 'other');

-- CreateEnum
CREATE TYPE "DatePrecision" AS ENUM ('exact', 'year', 'range', 'approximate');

-- CreateEnum
CREATE TYPE "PlaceType" AS ENUM ('city', 'region', 'institution', 'empire');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('primary', 'secondary', 'encyclopedia', 'manuscript_catalog');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('authored', 'commented_on', 'translated', 'influenced', 'about', 'related_to', 'associated_with', 'born_in', 'died_in', 'located_in', 'occurred_in', 'participated_in', 'documented_by');

-- CreateTable
CREATE TABLE "ContentEntity" (
    "id" TEXT NOT NULL,
    "entityType" "ContentEntityType" NOT NULL,
    "canonicalSlug" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "importanceScore" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "heroImageUrl" TEXT,
    "heroImageAlt" TEXT,
    "heroImageCredit" TEXT,

    CONSTRAINT "ContentEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentEntityLocalization" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "locale" "LocaleCode" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentEntityLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentSection" (
    "id" TEXT NOT NULL,
    "localizationId" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "ContentSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonProfile" (
    "entityId" TEXT NOT NULL,
    "namePrimary" TEXT NOT NULL,
    "nameVariants" TEXT[],
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "roles" "PersonRole"[],
    "domains" TEXT[],
    "associatedPlaces" TEXT[],
    "eraLabel" TEXT,
    "gender" TEXT,

    CONSTRAINT "PersonProfile_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "WorkProfile" (
    "entityId" TEXT NOT NULL,
    "titlePrimary" TEXT NOT NULL,
    "workType" "WorkType" NOT NULL,
    "compositionYear" INTEGER,
    "languageOriginal" TEXT,
    "alternateTitles" TEXT[],
    "incipit" TEXT,
    "manuscriptPlaces" TEXT[],

    CONSTRAINT "WorkProfile_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "WorkContributor" (
    "id" TEXT NOT NULL,
    "workEntityId" TEXT NOT NULL,
    "personEntityId" TEXT NOT NULL,
    "role" "WorkContributorRole" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WorkContributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicProfile" (
    "entityId" TEXT NOT NULL,
    "labelPrimary" TEXT NOT NULL,
    "topicType" "TopicType" NOT NULL,
    "parentTopicCanonicalSlug" TEXT,
    "synonymLabels" TEXT[],
    "relatedTopicCanonicalSlugs" TEXT[],

    CONSTRAINT "TopicProfile_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "EventProfile" (
    "entityId" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "startYear" INTEGER,
    "endYear" INTEGER,
    "datePrecision" "DatePrecision",

    CONSTRAINT "EventProfile_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "PlaceProfile" (
    "entityId" TEXT NOT NULL,
    "namePrimary" TEXT NOT NULL,
    "placeType" "PlaceType" NOT NULL,
    "geoLat" DOUBLE PRECISION,
    "geoLng" DOUBLE PRECISION,
    "modernCountry" TEXT,
    "historicalNames" TEXT[],

    CONSTRAINT "PlaceProfile_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "SourceProfile" (
    "entityId" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "citationShort" TEXT NOT NULL,
    "citationFull" TEXT NOT NULL,
    "publicationYear" INTEGER,
    "author" TEXT,
    "publisher" TEXT,
    "isbnOrIdentifier" TEXT,
    "url" TEXT,

    CONSTRAINT "SourceProfile_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "ContentRelationship" (
    "id" TEXT NOT NULL,
    "fromEntityId" TEXT NOT NULL,
    "toEntityId" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "importanceScore" INTEGER NOT NULL DEFAULT 50,
    "sourceEntityIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntity_canonicalSlug_key" ON "ContentEntity"("canonicalSlug");

-- CreateIndex
CREATE INDEX "ContentEntity_entityType_status_idx" ON "ContentEntity"("entityType", "status");

-- CreateIndex
CREATE INDEX "ContentEntity_status_importanceScore_idx" ON "ContentEntity"("status", "importanceScore");

-- CreateIndex
CREATE INDEX "ContentEntity_entityType_importanceScore_idx" ON "ContentEntity"("entityType", "importanceScore");

-- CreateIndex
CREATE INDEX "ContentEntityLocalization_locale_title_idx" ON "ContentEntityLocalization"("locale", "title");

-- CreateIndex
CREATE INDEX "ContentEntityLocalization_locale_noIndex_idx" ON "ContentEntityLocalization"("locale", "noIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntityLocalization_entityId_locale_key" ON "ContentEntityLocalization"("entityId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntityLocalization_locale_slug_key" ON "ContentEntityLocalization"("locale", "slug");

-- CreateIndex
CREATE INDEX "ContentSection_localizationId_sortOrder_idx" ON "ContentSection"("localizationId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ContentSection_localizationId_sectionKey_key" ON "ContentSection"("localizationId", "sectionKey");

-- CreateIndex
CREATE INDEX "WorkContributor_workEntityId_sortOrder_idx" ON "WorkContributor"("workEntityId", "sortOrder");

-- CreateIndex
CREATE INDEX "WorkContributor_personEntityId_idx" ON "WorkContributor"("personEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkContributor_workEntityId_personEntityId_role_key" ON "WorkContributor"("workEntityId", "personEntityId", "role");

-- CreateIndex
CREATE INDEX "EventProfile_eventType_startYear_idx" ON "EventProfile"("eventType", "startYear");

-- CreateIndex
CREATE INDEX "EventProfile_startYear_endYear_idx" ON "EventProfile"("startYear", "endYear");

-- CreateIndex
CREATE INDEX "SourceProfile_sourceType_publicationYear_idx" ON "SourceProfile"("sourceType", "publicationYear");

-- CreateIndex
CREATE INDEX "ContentRelationship_fromEntityId_relationType_idx" ON "ContentRelationship"("fromEntityId", "relationType");

-- CreateIndex
CREATE INDEX "ContentRelationship_toEntityId_relationType_idx" ON "ContentRelationship"("toEntityId", "relationType");

-- CreateIndex
CREATE INDEX "ContentRelationship_relationType_importanceScore_idx" ON "ContentRelationship"("relationType", "importanceScore");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRelationship_fromEntityId_toEntityId_relationType_key" ON "ContentRelationship"("fromEntityId", "toEntityId", "relationType");

-- AddForeignKey
ALTER TABLE "ContentEntityLocalization" ADD CONSTRAINT "ContentEntityLocalization_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSection" ADD CONSTRAINT "ContentSection_localizationId_fkey" FOREIGN KEY ("localizationId") REFERENCES "ContentEntityLocalization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonProfile" ADD CONSTRAINT "PersonProfile_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkProfile" ADD CONSTRAINT "WorkProfile_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkContributor" ADD CONSTRAINT "WorkContributor_workEntityId_fkey" FOREIGN KEY ("workEntityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkContributor" ADD CONSTRAINT "WorkContributor_personEntityId_fkey" FOREIGN KEY ("personEntityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicProfile" ADD CONSTRAINT "TopicProfile_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProfile" ADD CONSTRAINT "EventProfile_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceProfile" ADD CONSTRAINT "PlaceProfile_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceProfile" ADD CONSTRAINT "SourceProfile_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRelationship" ADD CONSTRAINT "ContentRelationship_fromEntityId_fkey" FOREIGN KEY ("fromEntityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRelationship" ADD CONSTRAINT "ContentRelationship_toEntityId_fkey" FOREIGN KEY ("toEntityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;


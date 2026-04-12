<!--
Content model foundation for IslamicGoldenAge.org.
This document defines an MVP domain model that is minimal today and extensible over time.
-->

# Content Model Foundation

## Why this model
This project needs a stable reference architecture for multilingual, SEO-friendly educational content.
The model below uses six core entities only: `Person`, `Work`, `Topic`, `Event`, `Place`, `Source`.

This keeps MVP scope small while still supporting:
- Rich internal linking
- Localized pages (`en`, `it`, `ar`)
- Future timeline, map, bibliography, and relationship-driven navigation

## Modeling principles
- Use `Person` as the base entity (not `Scholar`).
- Represent specialization through fields like `roles` and `domains`.
- Keep canonical identity separate from localized content.
- Treat relationships as first-class data, not just inline text.
- Prefer reusable SEO fields across all entity types.

## Shared base shape (all entities)
Each entity type should include these common fields:

- `id` (stable internal identifier)
- `entityType` (`person | work | topic | event | place | source`)
- `canonicalSlug` (language-agnostic identity key)
- `status` (`draft | published | archived`)
- `importanceScore` (`0-100`, editorial ranking signal)
- `createdAt`
- `updatedAt`

Localized content (per locale) should include:

- `locale` (`en | it | ar`)
- `slug` (localized route segment)
- `title`
- `summary` (neutral descriptive overview, educational tone)
- `excerpt` (short preview text for cards, search snippets, and metadata)
- `sections[]` (structured content blocks instead of one generic body)

Reusable SEO fields (per locale):

- `seoTitle`
- `seoDescription`
- `ogTitle`
- `ogDescription`
- `ogImage`
- `noIndex` (optional boolean)

Basic media support (MVP):

- `heroImage` (single primary image/media reference)
- `gallery[]` (optional small list for future expansion)

### Structured content sections (conceptual)
For content-heavy entities (`Person`, `Work`, `Topic`), model the main narrative as reusable `sections[]`:

- `sectionKey` (stable identifier)
- `heading`
- `content` (rich text/markdown later)
- `order`

Example section keys:
- Person: `introduction`, `biography`, `contributions`, `influence`, `legacy`
- Work: `introduction`, `context`, `structure`, `themes`, `transmission`, `impact`
- Topic: `definition`, `historical-context`, `major-figures`, `major-works`, `legacy`

This keeps presentation flexible while preserving a predictable editorial structure.

## Entity definitions

### 1) Person
Purpose:
- Represent historical individuals (scholars, physicians, translators, patrons, rulers, etc.).

Core fields:
- `namePrimary`
- `nameVariants[]`
- `birthYear` (approx allowed)
- `deathYear` (approx allowed)
- `roles[]` (example: `physician`, `philosopher`, `astronomer`)
- `primaryRegions[]` (references to `Place`)
- `heroImage` (optional in early entries, recommended for published pages)
- `sections[]` (`introduction`, `biography`, `contributions`, `influence`, `legacy`)

Optional fields:
- `eraLabel`
- `gender` (optional, if known/relevant)
- `externalIds` (Wikidata, VIAF, etc.)

SEO-relevant fields:
- `slug` / `canonicalSlug`
- `seoTitle` (example: `"Ibn Sina | Person | Islamic Golden Age"`)
- `seoDescription`
- `excerpt`

Future page usage:
- Person detail page
- Person timeline contributions
- Person connected works/topics/events

### 2) Work
Purpose:
- Represent intellectual outputs: books, treatises, manuscripts, commentaries, translations.

Core fields:
- `titlePrimary`
- `workType` (`book | treatise | manuscript | commentary | translation`)
- `compositionYear` (or range)
- `languageOriginal`
- `authors[]` (references to `Person`)
- `heroImage`
- `sections[]` (`introduction`, `context`, `structure`, `themes`, `transmission`, `impact`)

Optional fields:
- `alternateTitles[]`
- `incipit`
- `manuscriptLocations[]` (references to `Place`)

SEO-relevant fields:
- `slug` / `canonicalSlug`
- `seoTitle` (example: `"Canon of Medicine | Work"`)
- `seoDescription`
- `excerpt`

Future page usage:
- Work detail page
- Author-to-work graph
- Topic pages showing related works

### 3) Topic
Purpose:
- Represent themes/subjects for discovery and educational navigation.
- Serve as the primary SEO aggregation layer for the site.

Core fields:
- `labelPrimary`
- `topicType` (`discipline | concept | method | institution`)
- `parentTopicId` (optional hierarchy)
- `heroImage`
- `sections[]` (`definition`, `historical-context`, `major-figures`, `major-works`, `legacy`)

Optional fields:
- `synonyms[]`
- `relatedTopicIds[]`

SEO-relevant fields:
- `slug` / `canonicalSlug`
- `seoTitle` (example: `"Medicine in the Islamic Golden Age | Topic"`)
- `seoDescription`
- `excerpt`

Future page usage:
- Topic landing pages
- Cluster pages for related people/works/events

Why Topic is central:
- Topic pages cluster `Person + Work + Event + Place` into a single discoverable hub.
- They are the strongest long-tail SEO entry points.
- They improve internal linking density and user discovery paths.

### 4) Event
Purpose:
- Represent dated happenings: births/deaths, publication milestones, institutional events, political shifts.

Core fields:
- `eventType` (`birth | death | publication | founding | translation-movement | battle | other`)
- `startDate` (year precision allowed)
- `endDate` (optional)
- `placeId` (reference to `Place`)
- `heroImage`

Optional fields:
- `datePrecision` (`exact | year | range | approximate`)
- `participants[]` (references to `Person`)

SEO-relevant fields:
- `slug` / `canonicalSlug`
- `seoTitle`
- `seoDescription`
- `excerpt`

Future page usage:
- Timeline pages
- Person chronology
- Place event history

### 5) Place
Purpose:
- Represent geographic locations used by people, works, and events.

Core fields:
- `namePrimary`
- `placeType` (`city | region | institution | empire`)
- `geo` (`lat`, `lng`) optional in MVP, recommended later
- `heroImage`

Optional fields:
- `modernCountry`
- `historicalNames[]`

SEO-relevant fields:
- `slug` / `canonicalSlug`
- `seoTitle`
- `seoDescription`
- `excerpt`

Future page usage:
- Place detail pages
- Map-based browsing
- Event and person geographic context

### 6) Source
Purpose:
- Track references and citations supporting factual claims in all major entities.

Core fields:
- `sourceType` (`primary | secondary | encyclopedia | manuscript-catalog`)
- `citationShort`
- `citationFull`
- `publicationYear` (optional)
- `heroImage` (optional, for manuscript scans/covers)

Optional fields:
- `author`
- `publisher`
- `isbnOrIdentifier`
- `url`

SEO-relevant fields:
- `slug` / `canonicalSlug` (if public source page exists)
- `seoTitle`
- `seoDescription`
- `excerpt`

Future page usage:
- Source detail pages
- Citation sections on entity pages
- Bibliography index

## Relationship model
Use explicit relationship tables/collections so links are queryable and multilingual-safe.

Key relationships:
- `Person <-> Work`: authorship, commentary, translation, influence
- `Person <-> Topic`: expertise, contribution, association
- `Work <-> Topic`: subject classification, method, influence
- `Event <-> Place`: location of event
- `Event <-> Person`: participants, affected individuals
- `Source <-> Person/Work/Topic/Event/Place`: evidence and references

Recommended relation shape:
- `id`
- `fromEntityType`
- `fromEntityId`
- `toEntityType`
- `toEntityId`
- `relationType` (example: `authored`, `influenced`, `occurred_in`, `documented_by`)
- `importanceScore` (`0-100`, strength/relevance signal)
- `sourceIds[]` (which `Source` entries support this link)

## Derived connections on pages
Each entity page should expose computed relationship groups derived from explicit relationship edges:

- `relatedPeople[]`
- `relatedWorks[]`
- `relatedTopics[]`
- `relatedEvents[]`

Connection tiers:
- Primary connections: direct relationship edges from the current entity.
- Secondary connections: one-hop expansion through primary connections.

Use cases:
- Populate "Related content" blocks consistently.
- Improve internal linking and crawl paths.
- Support recommendation widgets without hardcoding links in content.

## URL structure (localized)
Use localized route prefixes with locale-agnostic canonical identity in data.

Examples:
- `/en/people/ibn-sina`
- `/it/people/ibn-sina`
- `/ar/people/ibn-sina`
- `/en/works/canon-of-medicine`
- `/en/topics/medicine`
- `/en/events/translation-movement-baghdad`
- `/en/places/baghdad`
- `/en/sources/ibn-sina-canon-edition-1593`

Rules:
- Locale always appears once at the start of the path.
- Slug in URL is localized slug from that locale record.
- Canonical identity is stored as `canonicalSlug` internally.
- Localized slugs should remain stable across locales when possible.
- Avoid aggressive locale-specific slug divergence in MVP unless clarity requires it.

## Timeline strategy
- `Event` is the primary timeline data source.
- `Person` chronology (`birthYear`, `deathYear`) complements event timelines.
- Timeline pages are derived from `Event + Person` data, not separate timeline entities.
- This keeps chronology features lightweight while still historically expressive.

## Ranking and prioritization strategy
Use `importanceScore (0-100)` across entities and relationships as the default ranking signal.

Primary uses:
- Homepage and landing-page prioritization
- Ordering derived related-content blocks
- Editorial SEO strategy (which entities/topics get stronger prominence)

## MVP implementation guidance
- Start with the six entities only.
- Add `Role` as a field (`roles[]`) under `Person`, not a new entity.
- Add taxonomy depth gradually through `Topic.parentTopicId`.
- Keep relationships explicit even in early seed data.
- Keep source linking mandatory for high-value factual claims.

## Why this scales
- Supports multilingual growth without duplicating core identity.
- Supports SEO-friendly, stable URLs with localized slugs.
- Supports graph-like educational exploration from the same core model.
- Supports structured, section-based authoring without schema bloat.
- Keeps today's implementation simple while preserving future data richness.

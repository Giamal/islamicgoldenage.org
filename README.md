# islamicgoldenage.org

Educational, multilingual, production-oriented reference platform about the Islamic Golden Age.

## Purpose

This repository is the lean foundation for a public educational website that can grow into a well-linked reference platform for:

- scholars
- books
- events
- discoveries
- topics
- future editorial articles and timelines

The first iteration is intentionally small. It focuses on architecture, multilingual routing, SEO, and data modeling instead of shipping a full content system too early.

## Tech Stack

- Next.js 16 App Router with TypeScript
- Tailwind CSS v4
- PostgreSQL on Supabase
- Prisma ORM
- Vercel-ready deployment model

## Current Architecture

- Monolith-first Next.js application
- Locale-prefixed routing with `/{locale}/...`
- Supported locales: `en`, `it`, `ar`
- English is the default locale and fallback language
- RTL-ready document direction for Arabic
- Server-first rendering with small, explicit modules
- Prisma schema designed around canonical entities plus translations

## Folder Structure

```text
.
|-- prisma/
|   `-- schema.prisma
|-- src/
|   |-- app/
|   |   |-- [locale]/
|   |   |   |-- entities/
|   |   |   `-- layout.tsx
|   |   |-- globals.css
|   |   |-- robots.ts
|   |   `-- sitemap.ts
|   |-- proxy.ts
|   |-- components/
|   |   |-- content/
|   |   |-- layout/
|   |   `-- navigation/
|   |-- i18n/
|   |   `-- config.ts
|   `-- lib/
|       |-- content/
|       |-- prisma.ts
|       |-- seo.ts
|       |-- site-config.ts
|       `-- ui-copy.ts
|-- .env.example
|-- eslint.config.mjs
|-- next.config.ts
|-- package.json
|-- postcss.config.mjs
`-- tsconfig.json
```

## Key Architecture Decisions

### 1. Canonical Core + Typed Profiles

The database model uses a shared `ContentEntity` table plus typed profile tables:

- `PersonProfile`
- `WorkProfile`
- `TopicProfile`
- `EventProfile`
- `PlaceProfile`
- `SourceProfile`

Why:

- one stable canonical identity for all content (`canonicalSlug`, status, ranking)
- clear type-specific fields without forcing everything into a single generic payload
- easy migration path from in-memory repository to Prisma queries

### 2. Localization as First-Class Data

All translated fields live in `ContentEntityLocalization` with:

- locale-specific slugs
- title, summary, excerpt
- SEO fields
- structured `ContentSection` blocks

Why:

- multilingual behavior is explicit at the data layer
- routes and SEO can stay locale-aware without duplicating canonical records
- section-based rendering maps directly to current entity pages

### 3. Internal Linking Is Explicit

`ContentRelationship` models graph edges between entities with typed semantics and importance score.

Why:

- keeps related-content blocks queryable and deterministic
- supports future recommendation/timeline/map features
- avoids hardcoded inline links in editorial content

### 4. Localized Routing Uses URL Segments

The app uses paths like:

- `/en/...`
- `/it/...`
- `/ar/...`

Why:

- URL structure is explicit and SEO-friendly
- locale-aware metadata and future `hreflang` support stay straightforward
- Arabic can evolve with dedicated content and RTL behavior without changing the route contract

### 5. Placeholder Content Lives Behind a Repository Boundary

The current pages use a small in-memory repository instead of Prisma queries.

Why:

- the UI can be built now without forcing seed data or admin tooling too early
- swapping to Prisma later should mostly affect the repository layer, not the route structure

## Multilingual Strategy

- English is the primary locale
- all public pages are locale-prefixed
- unprefixed requests are redirected to `/en/...` via `src/proxy.ts`
- locale metadata is generated centrally
- page metadata is prepared for canonical URLs and `hreflang` alternates
- Arabic already sets `dir="rtl"` at the document level

## SEO Strategy

Version `0.1` already includes:

- route-level metadata helpers
- locale-aware canonical URLs
- language alternates for future `hreflang`
- `robots.ts`
- `sitemap.ts`
- stable locale-prefixed URLs

This keeps the project ready for future structured data, richer sitemaps, and content-specific SEO fields.

## Environment Variables

Create a local `.env` file based on `.env.example`.

Required variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SITE_URL`

Example:

```bash
cp .env.example .env
```

## Connecting Supabase Postgres

1. Create a Supabase project.
2. Open the project database settings.
3. Copy the standard Postgres connection string into `DATABASE_URL`.
4. Copy the direct connection string into `DIRECT_URL`.
5. Keep `?schema=public` in the URL unless you intentionally move Prisma to another schema.

Notes:

- `DATABASE_URL` is the main Prisma connection.
- `DIRECT_URL` is helpful for workflows that should bypass pooled connections.
- In production on Vercel, set the same variables in the project environment settings.

## Local Setup

1. Install dependencies.
2. Copy `.env.example` to `.env`.
3. Fill in the Supabase connection values.
4. Generate Prisma Client.
5. Run the dev server.

```bash
npm install
npm run prisma:generate
npm run dev
```

When you are ready to create the first database migration:

```bash
npm run prisma:migrate:dev -- --name init
```

## Development Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run format
npm run prisma:generate
npm run prisma:studio
```

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Set:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy.

No custom Vercel infrastructure is required for version `0.1`. The repository is designed to work with Vercel's default Next.js deployment flow.

## Ambiguities Resolved

These decisions were made intentionally to keep the foundation lean:

- the public detail route is currently unified at `/[locale]/entities/[slug]`
- entity-specific semantics (`person/work/topic/event/place/source`) are modeled in the domain and in Prisma
- placeholder content remains file-backed for now, while Prisma is aligned and ready for the database transition
- sections and relationships are first-class model concepts, not UI-only conventions

## Suggested Commit Plan

1. `chore: scaffold next.js app foundation with tooling and configs`
2. `feat: add locale-aware routing and seo foundations`
3. `feat: add initial placeholder pages and content repository`
4. `feat: add prisma schema and environment setup`
5. `docs: document architecture, setup, and deployment`

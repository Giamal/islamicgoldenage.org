# islamicgoldenage.org

Educational, multilingual, production-oriented reference platform about the Islamic Golden Age.

## Purpose

This repository is the lean foundation for a public educational website that can grow into a well-linked reference platform for:

- scholars
- books
- events
- discoveries
- categories
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
|   |   |-- proxy.ts
|   |   |-- robots.ts
|   |   `-- sitemap.ts
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

### 1. Canonical Entity Model First

The initial database model uses one canonical `Entity` table plus `EntityTranslation`.

Why:

- it keeps the schema small for a solo developer
- it avoids premature specialization for people, books, events, and categories
- it makes multilingual support a first-class part of the data model
- it keeps future ingestion pipelines simpler because every content object shares a stable canonical identity

The `kind` field differentiates whether an entity is an article, person, book, event, or category.

### 2. Categories Are Also Entities

Instead of adding separate category tables and join tables immediately, categories are modeled as `Entity` rows with `kind = CATEGORY`.

Why:

- fewer tables to maintain in version `0.1`
- categories still get translations, SEO fields, and internal links
- future navigation and thematic hubs remain flexible

### 3. Internal Linking Is Explicit

`EntityLink` models relationships between canonical entities.

Why:

- strong internal linking is important for a reference platform
- the site can grow toward a lightweight knowledge graph without adding a graph database
- relationships like `BELONGS_TO`, `RELATED`, or `AUTHORED` stay queryable

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
- unprefixed requests are redirected to `/en/...` via `src/app/proxy.ts`
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

- A generic `Entity` model is used instead of separate `Person`, `Book`, and `Event` tables.
- Categories are represented as entities instead of a dedicated taxonomy subsystem.
- Placeholder content is file-backed for now, while Prisma is configured and ready for database-backed content next.
- The first public listing route is `/[locale]/entities` because it matches the canonical model and keeps future specialization optional.

## Suggested Commit Plan

1. `chore: scaffold next.js app foundation with tooling and configs`
2. `feat: add locale-aware routing and seo foundations`
3. `feat: add initial placeholder pages and content repository`
4. `feat: add prisma schema and environment setup`
5. `docs: document architecture, setup, and deployment`

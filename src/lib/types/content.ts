/**
 * Core content types
 *
 * Defines the canonical content entities for the Islamic Golden Age knowledge base.
 * These interfaces intentionally exclude localized fields so canonical records stay stable across languages and storage layers.
 */
export interface Person {
  id: string;
  slug: string;
  birthYear: number | null;
  deathYear: number | null;
  region: string;
  tags: string[];
  relatedBookIds: string[];
  relatedEventIds: string[];
}

export interface Book {
  id: string;
  slug: string;
  authorId: string;
  year: number | null;
  category: string;
}

export interface Event {
  id: string;
  slug: string;
  year: number | null;
  region: string;
  relatedPeopleIds: string[];
}

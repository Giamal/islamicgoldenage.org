/**
 * Person domain model
 *
 * Defines the canonical shape for historical people in the knowledge base.
 * This file keeps person-specific fields close to the domain where they belong instead of grouping unrelated entities together.
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

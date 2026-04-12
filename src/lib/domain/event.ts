/**
 * Event domain model
 *
 * Defines the canonical shape for events in the knowledge base.
 * This keeps event-specific relationships explicit and ready for future database persistence.
 */
export interface Event {
  id: string;
  slug: string;
  year: number | null;
  region: string;
  relatedPeopleIds: string[];
}

/**
 * Internationalization types
 *
 * Defines the shared locale and translation contracts used by the domain model.
 * Keeping these types separate from canonical entities makes multilingual content easier to evolve toward database-backed storage.
 */
export type Locale = import("@/i18n/config").Locale;

export type EntityType = "person" | "book" | "event";

export interface Translation {
  entityId: string;
  entityType: EntityType;
  locale: Locale;
  title: string;
  description: string;
  content: string;
}

/**
 * Book domain model
 *
 * Defines the canonical shape for books in the knowledge base.
 * Keeping the interface in its own file makes the domain easier to navigate as the content model grows.
 */
export interface Book {
  id: string;
  slug: string;
  authorId: string;
  year: number | null;
  category: string;
}

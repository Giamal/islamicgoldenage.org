/**
 * In-memory relationship edges used by the content repository.
 */
import type { EntityRelationship } from "@/lib/content/types";

export const relationships: EntityRelationship[] = [
  {
    id: "rel-muhammad-prophetic-biography",
    from: { entityType: "person", entityId: "person-muhammad" },
    to: { entityType: "topic", entityId: "topic-prophetic-biography" },
    relationType: "associated_with",
    importanceScore: 97,
    sourceIds: [],
  },
  {
    id: "rel-sirah-about-prophetic-biography",
    from: { entityType: "work", entityId: "work-sirah-ibn-hisham" },
    to: { entityType: "topic", entityId: "topic-prophetic-biography" },
    relationType: "about",
    importanceScore: 92,
    sourceIds: [],
  },
  {
    id: "rel-muhammad-sirah-associated",
    from: { entityType: "person", entityId: "person-muhammad" },
    to: { entityType: "work", entityId: "work-sirah-ibn-hisham" },
    relationType: "associated_with",
    importanceScore: 90,
    sourceIds: [],
  },
  {
    id: "rel-ibn-sina-authored-canon",
    from: { entityType: "person", entityId: "person-ibn-sina" },
    to: { entityType: "work", entityId: "work-canon-of-medicine" },
    relationType: "authored",
    importanceScore: 95,
    sourceIds: [],
  },
  {
    id: "rel-khwarizmi-authored-jabr",
    from: { entityType: "person", entityId: "person-al-khwarizmi" },
    to: { entityType: "work", entityId: "work-al-jabr" },
    relationType: "authored",
    importanceScore: 95,
    sourceIds: [],
  },
  {
    id: "rel-ibn-sina-medicine",
    from: { entityType: "person", entityId: "person-ibn-sina" },
    to: { entityType: "topic", entityId: "topic-medicine" },
    relationType: "associated_with",
    importanceScore: 92,
    sourceIds: [],
  },
  {
    id: "rel-ibn-sina-philosophy",
    from: { entityType: "person", entityId: "person-ibn-sina" },
    to: { entityType: "topic", entityId: "topic-philosophy" },
    relationType: "associated_with",
    importanceScore: 88,
    sourceIds: [],
  },
  {
    id: "rel-khwarizmi-mathematics",
    from: { entityType: "person", entityId: "person-al-khwarizmi" },
    to: { entityType: "topic", entityId: "topic-mathematics" },
    relationType: "associated_with",
    importanceScore: 91,
    sourceIds: [],
  },
  {
    id: "rel-canon-about-medicine",
    from: { entityType: "work", entityId: "work-canon-of-medicine" },
    to: { entityType: "topic", entityId: "topic-medicine" },
    relationType: "about",
    importanceScore: 96,
    sourceIds: [],
  },
  {
    id: "rel-jabr-about-math",
    from: { entityType: "work", entityId: "work-al-jabr" },
    to: { entityType: "topic", entityId: "topic-mathematics" },
    relationType: "about",
    importanceScore: 96,
    sourceIds: [],
  },
];

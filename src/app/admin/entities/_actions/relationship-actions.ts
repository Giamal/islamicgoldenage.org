/**
 * Admin relationship server actions
 *
 * Handles add/remove operations for entity relationships in the private CMS.
 */
"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";

import {
  addAdminRelationshipInDb,
  removeAdminRelationshipInDb,
} from "@/lib/db/admin-entity-write";
import type { RelationType } from "@prisma/client";

const allowedRelationTypes = [
  "authored",
  "commented_on",
  "translated",
  "influenced",
  "about",
  "related_to",
  "associated_with",
  "born_in",
  "died_in",
  "located_in",
  "occurred_in",
  "participated_in",
  "documented_by",
] as const;

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function addRelationshipAction(entityId: string, formData: FormData) {
  const direction = getStringField(formData, "direction");
  const relationType = getStringField(formData, "relationType");
  const otherEntityInput = getStringField(formData, "otherEntityInput");
  const otherEntityId = otherEntityInput.split("|")[0]?.trim() ?? "";

  if (direction !== "outgoing" && direction !== "incoming") {
    throw new Error("Unsupported relationship direction.");
  }

  if (!allowedRelationTypes.includes(relationType as RelationType)) {
    throw new Error("Unsupported relationship type.");
  }

  if (!otherEntityId) {
    throw new Error("Target entity is required.");
  }

  await addAdminRelationshipInDb({
    currentEntityId: entityId,
    direction,
    relationType: relationType as RelationType,
    otherEntityId,
  });

  redirect(`/admin/entities/${entityId}/edit?relationships=1` as Route);
}

export async function removeRelationshipAction(
  entityId: string,
  formData: FormData,
) {
  const relationshipId = getStringField(formData, "relationshipId");
  if (!relationshipId) {
    throw new Error("Relationship ID is required.");
  }

  await removeAdminRelationshipInDb(entityId, relationshipId);
  redirect(`/admin/entities/${entityId}/edit?relationships=1` as Route);
}

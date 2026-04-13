/**
 * Admin entity server actions
 *
 * Handles create/update submissions for the private editorial interface.
 */
"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";

import { locales, type Locale } from "@/i18n/config";
import {
  createAdminEntityInDb,
  updateAdminEntityInDb,
  type AdminEntityUpsertInput,
} from "@/lib/db/admin-entity-write";
import type { ContentEntityType, ContentStatus } from "@prisma/client";

const editableEntityTypes = ["person", "work", "topic"];
const editableStatuses = [
  "draft",
  "ready_for_review",
  "published",
  "archived",
];

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseEntityUpsertInput(formData: FormData): AdminEntityUpsertInput {
  const rawEntityType = getStringField(formData, "entityType");
  const rawStatus = getStringField(formData, "status");

  if (!editableEntityTypes.includes(rawEntityType as ContentEntityType)) {
    throw new Error("Unsupported entity type.");
  }

  if (!editableStatuses.includes(rawStatus as ContentStatus)) {
    throw new Error("Unsupported publication status.");
  }

  const localizations = locales.map((locale) => ({
    locale,
    title: getStringField(formData, `${locale}_title`),
    slug: getStringField(formData, `${locale}_slug`),
    summary: getStringField(formData, `${locale}_summary`),
    bodyMarkdown: getStringField(formData, `${locale}_body`),
    imageAlt: getStringField(formData, `${locale}_image_alt`),
    imageCaption: getStringField(formData, `${locale}_image_caption`),
    videoUrl: getStringField(formData, `${locale}_video_url`),
    audioUrl: getStringField(formData, `${locale}_audio_url`),
  })) as Array<{
    locale: Locale;
    title: string;
    slug: string;
    summary: string;
    bodyMarkdown: string;
    imageAlt: string;
    imageCaption: string;
    videoUrl: string;
    audioUrl: string;
  }>;

  return {
    entityType: rawEntityType as ContentEntityType,
    status: rawStatus as ContentStatus,
    heroImageUrl: getStringField(formData, "heroImageUrl"),
    heroImageCredit: getStringField(formData, "heroImageCredit"),
    localizations,
  };
}

export async function createEntityAction(formData: FormData) {
  const input = parseEntityUpsertInput(formData);
  const entityId = await createAdminEntityInDb(input);
  redirect(`/admin/entities/${entityId}/edit?saved=1` as Route);
}

export async function updateEntityAction(entityId: string, formData: FormData) {
  const input = parseEntityUpsertInput(formData);
  await updateAdminEntityInDb(entityId, input);
  redirect(`/admin/entities/${entityId}/edit?saved=1` as Route);
}

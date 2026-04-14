/**
 * Admin entity server actions
 *
 * Handles create/update submissions for the private editorial interface.
 */
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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

function collectLocalizedSlugs(input: AdminEntityUpsertInput) {
  return input.localizations
    .map((item) => ({
      locale: item.locale,
      slug: item.slug.trim(),
    }))
    .filter((item) => item.slug.length > 0);
}

function revalidateContentCaches(localizedSlugs: Array<{ locale: Locale; slug: string }>) {
  revalidateTag("content-entities-list", "max");
  revalidateTag("content-entity-detail", "max");
  revalidateTag("content-entities-sitemap-localization-groups", "max");

  revalidatePath("/admin/entities");
  revalidatePath("/sitemap.xml");

  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/entities`);
  }

  for (const localization of localizedSlugs) {
    revalidatePath(
      `/${localization.locale}/entities/${encodeURIComponent(localization.slug)}`,
    );
  }
}

export async function createEntityAction(formData: FormData) {
  const input = parseEntityUpsertInput(formData);
  const localizedSlugs = collectLocalizedSlugs(input);
  const entityId = await createAdminEntityInDb(input);
  revalidateContentCaches(localizedSlugs);
  redirect(`/admin/entities/${entityId}/edit?status=created` as Route);
}

export async function updateEntityAction(entityId: string, formData: FormData) {
  const input = parseEntityUpsertInput(formData);
  const localizedSlugs = collectLocalizedSlugs(input);
  await updateAdminEntityInDb(entityId, input);
  revalidateContentCaches(localizedSlugs);
  redirect(`/admin/entities/${entityId}/edit?status=updated` as Route);
}

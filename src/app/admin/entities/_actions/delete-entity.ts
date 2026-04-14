/**
 * Admin entity delete server action
 *
 * Handles safe deletion requests from the admin entities list with clear feedback.
 */
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { locales } from "@/i18n/config";
import { deleteAdminEntityInDb } from "@/lib/db/admin-entity-write";

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

const statusFilters = ["all", "draft", "published", "archived"] as const;
type StatusFilter = (typeof statusFilters)[number];

function resolveStatusFilter(value: string): StatusFilter {
  if (statusFilters.includes(value as StatusFilter)) {
    return value as StatusFilter;
  }
  return "all";
}

function buildAdminEntitiesRedirect(status: StatusFilter, result: "success" | "error") {
  const params = new URLSearchParams();

  if (status !== "all") {
    params.set("status", status);
  }
  params.set("delete", result);

  return `/admin/entities${params.toString() ? `?${params.toString()}` : ""}`;
}

function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag, "max");
  } catch (error) {
    console.error(`[admin-delete] Failed to revalidate tag "${tag}"`, error);
  }
}

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch (error) {
    console.error(`[admin-delete] Failed to revalidate path "${path}"`, error);
  }
}

export async function deleteEntityAction(
  formData: FormData,
): Promise<void> {
  try {
    const entityId = getStringField(formData, "entityId").trim();
    const status = resolveStatusFilter(getStringField(formData, "currentStatus"));

    const deletionResult = await deleteAdminEntityInDb(entityId);

    if (!deletionResult.ok) {
      redirect(buildAdminEntitiesRedirect(status, "error") as Route);
    }

    safeRevalidateTag("content-entities-list");
    safeRevalidateTag("content-entity-detail");
    safeRevalidateTag("content-entities-sitemap-localization-groups");

    safeRevalidatePath("/admin/entities");

    for (const locale of locales) {
      safeRevalidatePath(`/${locale}`);
      safeRevalidatePath(`/${locale}/entities`);
    }

    for (const localization of deletionResult.localizations) {
      safeRevalidatePath(
        `/${localization.locale}/entities/${encodeURIComponent(localization.slug)}`,
      );
    }

    redirect(buildAdminEntitiesRedirect(status, "success") as Route);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("[admin-delete] Unexpected delete action error", error);
    const status = resolveStatusFilter(getStringField(formData, "currentStatus"));
    redirect(buildAdminEntitiesRedirect(status, "error") as Route);
  }
}

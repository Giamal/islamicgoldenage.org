/**
 * Admin entity delete server action
 *
 * Handles safe deletion requests from the admin entities list with clear feedback.
 */
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { locales } from "@/i18n/config";
import { deleteAdminEntityInDb } from "@/lib/db/admin-entity-write";

export type DeleteEntityActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialDeleteEntityActionState: DeleteEntityActionState = {
  status: "idle",
  message: "",
};

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
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
  _previousState: DeleteEntityActionState,
  formData: FormData,
): Promise<DeleteEntityActionState> {
  try {
    const entityId = getStringField(formData, "entityId").trim();
    const entityLabel = getStringField(formData, "entityLabel").trim();

    const deletionResult = await deleteAdminEntityInDb(entityId);

    if (!deletionResult.ok) {
      return {
        status: "error",
        message: deletionResult.message,
      };
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

    const targetLabel = entityLabel || deletionResult.entityId;

    return {
      status: "success",
      message: `Deleted "${targetLabel}".`,
    };
  } catch (error) {
    console.error("[admin-delete] Unexpected delete action error", error);
    return {
      status: "error",
      message: "Delete failed due to a server error. Please retry.",
    };
  }
}

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

export async function deleteEntityAction(
  _previousState: DeleteEntityActionState,
  formData: FormData,
): Promise<DeleteEntityActionState> {
  const entityId = getStringField(formData, "entityId").trim();
  const entityLabel = getStringField(formData, "entityLabel").trim();

  const deletionResult = await deleteAdminEntityInDb(entityId);

  if (!deletionResult.ok) {
    return {
      status: "error",
      message: deletionResult.message,
    };
  }

  revalidateTag("content-entities-list", "max");
  revalidateTag("content-entity-detail", "max");
  revalidateTag("content-entities-sitemap-localization-groups", "max");

  revalidatePath("/admin/entities");
  revalidatePath("/sitemap.xml");

  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/entities`);
  }

  for (const localization of deletionResult.localizations) {
    revalidatePath(
      `/${localization.locale}/entities/${encodeURIComponent(localization.slug)}`,
    );
  }

  const targetLabel = entityLabel || deletionResult.entityId;

  return {
    status: "success",
    message: `Deleted "${targetLabel}".`,
  };
}

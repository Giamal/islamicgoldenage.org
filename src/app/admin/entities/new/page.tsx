/**
 * Admin entity create page
 *
 * Hosts the minimal phase-1 form for creating multilingual entities.
 */
import { locales } from "@/i18n/config";
import { EntityForm } from "@/app/admin/entities/_components/entity-form";
import { createEntityAction } from "@/app/admin/entities/_actions/save-entity";

export default function AdminNewEntityPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Create entity</h1>
        <p className="text-sm text-[var(--muted)]">
          Fill one or more locales now and expand translations later.
        </p>
      </header>

      <EntityForm
        mode="create"
        action={createEntityAction}
        defaultData={{
          entityType: "person",
          status: "draft",
          localizations: locales.map((locale) => ({
            locale,
            title: "",
            slug: "",
            summary: "",
            bodyMarkdown: "",
          })),
        }}
      />
    </div>
  );
}

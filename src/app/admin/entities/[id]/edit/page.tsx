/**
 * Admin entity edit page
 *
 * Loads one entity and renders the phase-1 multilingual editorial form.
 */
import { notFound } from "next/navigation";

import { CompletenessPanel } from "@/app/admin/entities/_components/completeness-panel";
import { EntityForm } from "@/app/admin/entities/_components/entity-form";
import { RelationshipEditor } from "@/app/admin/entities/_components/relationship-editor";
import { buildEditorialCompletenessReport } from "@/lib/admin/editorial-completeness";
import { updateEntityAction } from "@/app/admin/entities/_actions/save-entity";
import { getAdminEntityByIdFromDb } from "@/lib/db/admin-entity-read";

export const dynamic = "force-dynamic";

type AdminEditEntityPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ status?: string }>;
};

const statusMessages = {
  created: {
    tone: "success",
    text: "Entity created successfully.",
  },
  updated: {
    tone: "success",
    text: "Changes saved successfully.",
  },
  relationship_added: {
    tone: "success",
    text: "Relationship added successfully.",
  },
  relationship_removed: {
    tone: "success",
    text: "Relationship removed successfully.",
  },
} as const;

export default async function AdminEditEntityPage({
  params,
  searchParams,
}: AdminEditEntityPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const statusKey = resolvedSearchParams?.status;
  const statusFeedback =
    statusKey && statusKey in statusMessages
      ? statusMessages[statusKey as keyof typeof statusMessages]
      : null;
  const entity = await getAdminEntityByIdFromDb(id);

  if (!entity) {
    notFound();
  }

  const saveAction = updateEntityAction.bind(null, entity.id);
  const completenessReport = buildEditorialCompletenessReport(entity);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Edit entity</h1>
        <p className="text-sm text-[var(--muted)]">Entity ID: {entity.id}</p>
      </header>

      {statusFeedback ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            statusFeedback.tone === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
          }`}
        >
          {statusFeedback.text}
        </div>
      ) : null}

      <EntityForm
        mode="edit"
        action={saveAction}
        defaultData={{
          entityType: entity.entityType,
          status: entity.status,
          heroImageUrl: entity.heroImageUrl,
          heroImageCredit: entity.heroImageCredit,
          localizations: entity.localizations,
        }}
      />

      <CompletenessPanel report={completenessReport} />

      <RelationshipEditor
        entityId={entity.id}
        outgoingRelationships={entity.outgoingRelationships}
        incomingRelationships={entity.incomingRelationships}
        candidates={entity.relationshipCandidates}
      />
    </div>
  );
}

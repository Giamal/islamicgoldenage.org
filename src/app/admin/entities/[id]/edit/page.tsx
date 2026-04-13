/**
 * Admin entity edit page
 *
 * Loads one entity and renders the phase-1 multilingual editorial form.
 */
import { notFound } from "next/navigation";

import { EntityForm } from "@/app/admin/entities/_components/entity-form";
import { RelationshipEditor } from "@/app/admin/entities/_components/relationship-editor";
import { updateEntityAction } from "@/app/admin/entities/_actions/save-entity";
import { getAdminEntityByIdFromDb } from "@/lib/db/admin-entity-read";

type AdminEditEntityPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditEntityPage({
  params,
}: AdminEditEntityPageProps) {
  const { id } = await params;
  const entity = await getAdminEntityByIdFromDb(id);

  if (!entity) {
    notFound();
  }

  const saveAction = updateEntityAction.bind(null, entity.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Edit entity</h1>
        <p className="text-sm text-[var(--muted)]">Entity ID: {entity.id}</p>
      </header>

      <EntityForm
        mode="edit"
        action={saveAction}
        defaultData={{
          entityType: entity.entityType,
          status: entity.status,
          localizations: entity.localizations,
        }}
      />

      <RelationshipEditor
        entityId={entity.id}
        outgoingRelationships={entity.outgoingRelationships}
        incomingRelationships={entity.incomingRelationships}
        candidates={entity.relationshipCandidates}
      />
    </div>
  );
}

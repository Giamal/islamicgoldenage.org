/**
 * Admin relationship editor
 *
 * Provides a minimal UI to review, add, and remove entity relationships.
 */
import { addRelationshipAction, removeRelationshipAction } from "@/app/admin/entities/_actions/relationship-actions";
import { SubmitButton } from "@/app/admin/entities/_components/submit-button";
import type {
  AdminEntityRelationshipRow,
  AdminRelationshipCandidate,
} from "@/lib/db/admin-entity-read";

type RelationshipEditorProps = {
  entityId: string;
  outgoingRelationships: AdminEntityRelationshipRow[];
  incomingRelationships: AdminEntityRelationshipRow[];
  candidates: AdminRelationshipCandidate[];
};

const relationTypes = [
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

function RelationshipList({
  title,
  rows,
  entityId,
}: {
  title: string;
  rows: AdminEntityRelationshipRow[];
  entityId: string;
}) {
  const removeAction = removeRelationshipAction.bind(null, entityId);

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No relationships yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            >
              <span>
                <strong>{row.relationType}</strong> → {row.entity.label} (
                {row.entity.entityType})
              </span>
              <form action={removeAction}>
                <input type="hidden" name="relationshipId" value={row.id} />
                <SubmitButton
                  idleLabel="Remove"
                  pendingLabel="Removing..."
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70"
                />
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function RelationshipEditor({
  entityId,
  outgoingRelationships,
  incomingRelationships,
  candidates,
}: RelationshipEditorProps) {
  const addAction = addRelationshipAction.bind(null, entityId);
  const sortedCandidates = [...candidates].sort((a, b) =>
    a.label.localeCompare(b.label),
  );
  const pickerId = `relationship-target-${entityId}`;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <h2 className="text-lg font-semibold">Add relationship</h2>
        <form action={addAction} className="grid gap-4 md:grid-cols-4">
          <label className="space-y-2 text-sm">
            <span className="font-medium">Direction</span>
            <select
              name="direction"
              defaultValue="outgoing"
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
            >
              <option value="outgoing">Current entity → target</option>
              <option value="incoming">Target → current entity</option>
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Relation type</span>
            <select
              name="relationType"
              defaultValue="related_to"
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
            >
              {relationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm md:col-span-2">
            <span className="font-medium">Target entity</span>
            <input
              name="otherEntityInput"
              list={pickerId}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
              placeholder="Search by title, then pick an entity"
              required
            />
            <datalist id={pickerId}>
              {sortedCandidates.map((candidate) => (
                <option
                  key={candidate.id}
                  value={`${candidate.id} | ${candidate.label} (${candidate.entityType})`}
                />
              ))}
            </datalist>
          </label>

          <div className="md:col-span-4">
            <SubmitButton
              idleLabel="Add relationship"
              pendingLabel="Adding..."
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
        </form>
      </section>

      <RelationshipList
        title="Outgoing relationships"
        rows={outgoingRelationships}
        entityId={entityId}
      />
      <RelationshipList
        title="Incoming relationships"
        rows={incomingRelationships}
        entityId={entityId}
      />
    </div>
  );
}

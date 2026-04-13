/**
 * Admin entities list page
 *
 * Displays the current entity catalog for quick editorial navigation.
 */
import Link from "next/link";
import type { Route } from "next";

import { getAdminEntityListFromDb } from "@/lib/db/admin-entity-read";

function formatLocaleLabels(
  localizations: Array<{ locale: string; title: string; slug: string }>,
) {
  return localizations
    .map((item) => `${item.locale.toUpperCase()}: ${item.title || item.slug}`)
    .join(" · ");
}

export default async function AdminEntitiesPage() {
  const entities = await getAdminEntityListFromDb();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Entities</h1>
          <p className="text-sm text-[var(--muted)]">
            Manage multilingual people, works, and topics.
          </p>
        </div>
        <Link
          href="/admin/entities/new"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          New entity
        </Link>
      </header>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Localizations</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity) => (
              <tr key={entity.id} className="border-b border-[var(--border)]">
                <td className="px-4 py-3">{entity.entityType}</td>
                <td className="px-4 py-3">{entity.status}</td>
                <td className="px-4 py-3">
                  {formatLocaleLabels(entity.localizations) || "No localizations yet"}
                </td>
                <td className="px-4 py-3">{entity.updatedAt.toISOString()}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/entities/${entity.id}/edit` as Route}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {entities.length === 0 ? (
              <tr>
                <td className="px-4 py-5 text-[var(--muted)]" colSpan={5}>
                  No entities found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

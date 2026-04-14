/**
 * Admin entities list page
 *
 * Displays the current entity catalog for quick editorial navigation.
 */
import Link from "next/link";
import type { Route } from "next";

import { DeleteEntityAction } from "@/app/admin/entities/_components/delete-entity-action";
import { getAdminEntityListByStatusFromDb } from "@/lib/db/admin-entity-read";
import type { ContentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const statusFilters = ["all", "draft", "published", "archived"] as const;
type StatusFilter = (typeof statusFilters)[number];

function formatLocaleLabels(
  localizations: Array<{ locale: string; title: string; slug: string }>,
) {
  return localizations
    .map((item) => `${item.locale.toUpperCase()}: ${item.title || item.slug}`)
    .join(" | ");
}

function getPrimaryEntityLabel(
  localizations: Array<{ locale: string; title: string; slug: string }>,
) {
  const preferred = localizations.find((item) => item.locale === "en");
  const fallback = preferred ?? localizations[0];
  return fallback?.title || fallback?.slug || "Untitled entity";
}

function getStatusBadgeClass(status: ContentStatus) {
  if (status === "published") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "archived") {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

type AdminEntitiesPageProps = {
  searchParams?: Promise<{ status?: string }>;
};

export default async function AdminEntitiesPage({
  searchParams,
}: AdminEntitiesPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const selectedStatus: StatusFilter = statusFilters.includes(
    params?.status as StatusFilter,
  )
    ? (params?.status as StatusFilter)
    : "all";

  const entities = await getAdminEntityListByStatusFromDb(selectedStatus);

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

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-[var(--muted)]">Filter:</span>
          {statusFilters.map((status) => (
            <Link
              key={status}
              href={
                status === "all"
                  ? ("/admin/entities" as Route)
                  : (`/admin/entities?status=${status}` as Route)
              }
              className={`rounded-full px-3 py-1.5 font-semibold ${
                selectedStatus === status
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]"
              }`}
            >
              {status}
            </Link>
          ))}
        </div>
      </section>

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
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(
                      entity.status,
                    )}`}
                  >
                    {entity.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {formatLocaleLabels(entity.localizations) || "No localizations yet"}
                </td>
                <td className="px-4 py-3">{entity.updatedAt.toISOString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-start gap-4">
                    <Link
                      href={`/admin/entities/${entity.id}/edit` as Route}
                      className="font-medium text-[var(--accent)] hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteEntityAction
                      entityId={entity.id}
                      entityLabel={getPrimaryEntityLabel(entity.localizations)}
                    />
                  </div>
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

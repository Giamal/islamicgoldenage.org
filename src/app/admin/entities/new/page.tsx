/**
 * Admin entity create page
 *
 * Hosts template-driven creation for multilingual entities in the editorial CMS.
 */
import Link from "next/link";
import type { Route } from "next";

import { locales } from "@/i18n/config";
import { EntityForm } from "@/app/admin/entities/_components/entity-form";
import { createEntityAction } from "@/app/admin/entities/_actions/save-entity";
import {
  getEntityTemplate,
  isEntityTemplateKey,
  mapTemplateKeyToEntityType,
  type EntityTemplateKey,
} from "@/lib/admin/entity-templates";

type AdminNewEntityPageProps = {
  searchParams?: Promise<{ template?: string }>;
};

const templateKeys: EntityTemplateKey[] = ["person", "work", "topic"];

export default async function AdminNewEntityPage({
  searchParams,
}: AdminNewEntityPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const selectedTemplateKey = isEntityTemplateKey(params?.template)
    ? params?.template
    : "person";
  const template = getEntityTemplate(selectedTemplateKey);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Create entity</h1>
        <p className="text-sm text-[var(--muted)]">
          Start from a template, then adapt details and relationships as needed.
        </p>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
        <h2 className="text-lg font-semibold">Template</h2>
        <div className="flex flex-wrap gap-2">
          {templateKeys.map((key) => (
            <Link
              key={key}
              href={`/admin/entities/new?template=${key}` as Route}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                key === selectedTemplateKey
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              {key}
            </Link>
          ))}
        </div>
        <p className="text-sm text-[var(--muted)]">{template.description}</p>
        <p className="text-sm">
          Suggested relationships:{" "}
          <span className="font-medium">
            {template.suggestedRelationships.join(", ")}
          </span>
        </p>
      </section>

      <EntityForm
        mode="create"
        action={createEntityAction}
        defaultData={{
          entityType: mapTemplateKeyToEntityType(selectedTemplateKey),
          status: "draft",
          heroImageUrl: "",
          heroImageCredit: "",
          localizations: locales.map((locale) => ({
            locale,
            title: "",
            slug: "",
            summary: "",
            bodyMarkdown: template.bodyTemplateByLocale[locale],
            imageAlt: "",
            imageCaption: "",
            videoUrl: "",
            audioUrl: "",
          })),
        }}
      />
    </div>
  );
}

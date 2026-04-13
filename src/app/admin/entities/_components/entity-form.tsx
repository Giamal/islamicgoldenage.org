/**
 * Admin entity form
 *
 * Reusable form for creating and editing multilingual content entities.
 */
import { locales, type Locale } from "@/i18n/config";
import type { ContentEntityType, ContentStatus } from "@prisma/client";

type LocalizationInput = {
  locale: Locale;
  title: string;
  slug: string;
  summary: string;
  bodyMarkdown: string;
};

type EntityFormData = {
  entityType: ContentEntityType;
  status: ContentStatus;
  localizations: LocalizationInput[];
};

type EntityFormProps = {
  mode: "create" | "edit";
  defaultData: EntityFormData;
  action: (formData: FormData) => void | Promise<void>;
};

const allowedEntityTypes: ContentEntityType[] = ["person", "work", "topic"];
const allowedStatuses: ContentStatus[] = ["draft", "published", "archived"];

function getLocalizationValue(
  localizations: LocalizationInput[],
  locale: Locale,
): LocalizationInput {
  return (
    localizations.find((item) => item.locale === locale) ?? {
      locale,
      title: "",
      slug: "",
      summary: "",
      bodyMarkdown: "",
    }
  );
}

export function EntityForm({ mode, defaultData, action }: EntityFormProps) {
  return (
    <form action={action} className="space-y-8">
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <h2 className="text-lg font-semibold">Entity basics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium">Entity type</span>
            <select
              name="entityType"
              defaultValue={defaultData.entityType}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
            >
              {allowedEntityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Publication status</span>
            <select
              name="status"
              defaultValue={defaultData.status}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
            >
              {allowedStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {locales.map((locale) => {
        const values = getLocalizationValue(defaultData.localizations, locale);

        return (
          <section
            key={locale}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4"
          >
            <h2 className="text-lg font-semibold uppercase tracking-wide">{locale}</h2>

            <label className="block space-y-2 text-sm">
              <span className="font-medium">Title / name</span>
              <input
                name={`${locale}_title`}
                defaultValue={values.title}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium">Slug</span>
              <input
                name={`${locale}_slug`}
                defaultValue={values.slug}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium">Summary</span>
              <textarea
                name={`${locale}_summary`}
                defaultValue={values.summary}
                rows={4}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium">Body (Markdown)</span>
              <textarea
                name={`${locale}_body`}
                defaultValue={values.bodyMarkdown}
                rows={12}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 font-mono"
              />
            </label>
          </section>
        );
      })}

      <button
        type="submit"
        className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        {mode === "create" ? "Create entity" : "Save changes"}
      </button>
    </form>
  );
}

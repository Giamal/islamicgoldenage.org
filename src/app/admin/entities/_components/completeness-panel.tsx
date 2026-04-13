/**
 * Editorial completeness panel
 *
 * Shows lightweight readiness checks to guide drafting and review workflow.
 */
import type { CompletenessReport } from "@/lib/admin/editorial-completeness";

type CompletenessPanelProps = {
  report: CompletenessReport;
};

export function CompletenessPanel({ report }: CompletenessPanelProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Editorial completeness</h2>
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">
          Score: {report.scorePercent}%
        </span>
      </div>

      <ul className="space-y-2 text-sm">
        {report.items.map((item) => (
          <li
            key={item.key}
            className={`rounded-lg border px-3 py-2 ${
              item.severity === "ok"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-amber-300 bg-amber-50 text-amber-800"
            }`}
          >
            {item.message}
          </li>
        ))}
      </ul>
    </section>
  );
}

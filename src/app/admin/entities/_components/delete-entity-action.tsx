/**
 * Admin delete entity action UI
 *
 * Renders a destructive confirmation flow for deleting one entity from the admin list.
 */
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import {
  deleteEntityAction,
  initialDeleteEntityActionState,
} from "@/app/admin/entities/_actions/delete-entity";

type DeleteEntityActionProps = {
  entityId: string;
  entityLabel: string;
};

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="inline-flex items-center gap-2">
        {pending ? (
          <span
            className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
        ) : null}
        {pending ? "Deleting..." : "Delete permanently"}
      </span>
    </button>
  );
}

export function DeleteEntityAction({
  entityId,
  entityLabel,
}: DeleteEntityActionProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(
    deleteEntityAction,
    initialDeleteEntityActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      setIsOpen(false);
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="font-medium text-red-700 hover:underline"
      >
        Delete
      </button>

      {isOpen ? (
        <form
          action={formAction}
          className="w-[22rem] rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900 shadow-sm"
        >
          <input type="hidden" name="entityId" value={entityId} />
          <input type="hidden" name="entityLabel" value={entityLabel} />

          <p className="font-semibold">Delete this entry permanently?</p>
          <p className="mt-1">
            This action is destructive and cannot be undone.
            <br />
            Target: <span className="font-medium">{entityLabel}</span>
          </p>

          <div className="mt-3 flex items-center gap-2">
            <DeleteSubmitButton />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]"
            >
              Cancel
            </button>
          </div>

          {state.status === "error" ? (
            <p className="mt-2 text-red-700">{state.message}</p>
          ) : null}
          {state.status === "success" ? (
            <p className="mt-2 text-green-700">{state.message}</p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}

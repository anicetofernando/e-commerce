"use client";

import { useTransition } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { approveReview, rejectReview, deleteReview } from "@/actions/admin-reviews";

export function ReviewRowActions({ id, isApproved }: { id: string; isApproved: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1">
      {!isApproved && (
        <button
          type="button"
          title="Aprovar"
          disabled={isPending}
          onClick={() => startTransition(() => approveReview(id))}
          className="flex h-8 w-8 items-center justify-center rounded-md text-green-600 hover:bg-green-50 disabled:opacity-50"
        >
          <Check size={16} />
        </button>
      )}
      {isApproved && (
        <button
          type="button"
          title="Rejeitar"
          disabled={isPending}
          onClick={() => startTransition(() => rejectReview(id))}
          className="flex h-8 w-8 items-center justify-center rounded-md text-amber-600 hover:bg-amber-50 disabled:opacity-50"
        >
          <X size={16} />
        </button>
      )}
      <button
        type="button"
        title="Eliminar"
        disabled={isPending}
        onClick={() => {
          if (confirm("Eliminar esta avaliação definitivamente?")) {
            startTransition(() => deleteReview(id));
          }
        }}
        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

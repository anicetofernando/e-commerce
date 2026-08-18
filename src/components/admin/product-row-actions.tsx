"use client";

import { useTransition } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { deleteProduct, toggleProductActive } from "@/actions/admin-products";

export function ProductRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title={isActive ? "Desativar" : "Ativar"}
        disabled={isPending}
        onClick={() => startTransition(() => toggleProductActive(id, !isActive))}
        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-50"
      >
        {isActive ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button
        type="button"
        title="Eliminar"
        disabled={isPending}
        onClick={() => {
          if (confirm("Eliminar este produto definitivamente? Esta ação não pode ser desfeita.")) {
            startTransition(() => deleteProduct(id));
          }
        }}
        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

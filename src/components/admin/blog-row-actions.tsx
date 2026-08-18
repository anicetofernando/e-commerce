"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteBlogPost } from "@/actions/admin-blog";

export function BlogRowActions({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      title="Eliminar"
      onClick={() => {
        if (confirm(`Eliminar o artigo "${title}"?`)) {
          startTransition(() => deleteBlogPost(id));
        }
      }}
      className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  );
}

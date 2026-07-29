"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toggleWishlist } from "@/actions/wishlist";

export function RemoveFavoriteButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          toggleWishlist(productId, "/conta/favoritos");
        })
      }
      className="flex h-9 items-center gap-1.5 rounded-md border border-ink-200 px-2.5 text-xs font-medium text-ink-500 hover:border-red-300 hover:text-red-600 disabled:opacity-60"
    >
      <Trash2 size={13} />
      Remover
    </button>
  );
}

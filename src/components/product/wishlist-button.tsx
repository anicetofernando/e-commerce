"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/actions/wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  initialWishlisted = false,
  variant = "icon",
}: {
  productId: string;
  initialWishlisted?: boolean;
  variant?: "icon" | "full";
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleWishlist(productId, pathname);
      if (!result.success && result.requiresAuth) {
        router.push("/entrar");
        return;
      }
      if (result.success) setWishlisted(result.wishlisted);
    });
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="flex h-11 items-center justify-center gap-2 rounded-md border border-ink-200 px-4 text-sm font-semibold text-ink-700 hover:border-brand-500 hover:text-brand-600 disabled:opacity-60"
      >
        <Heart size={17} className={cn(wishlisted && "fill-brand-600 text-brand-600")} />
        {wishlisted ? "Nos Favoritos" : "Adicionar aos Favoritos"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Adicionar aos favoritos"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 hover:border-brand-500 hover:text-brand-600 disabled:opacity-60"
    >
      <Heart size={17} className={cn(wishlisted && "fill-brand-600 text-brand-600")} />
    </button>
  );
}

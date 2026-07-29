"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore, useCartTotals } from "@/lib/cart-store";

export function CartButton() {
  const open = useCartStore((s) => s.open);
  const { totalQuantity } = useCartTotals();

  return (
    <button
      type="button"
      onClick={open}
      className="relative flex h-10 w-10 items-center justify-center rounded-md text-ink-700 hover:bg-ink-100"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart size={22} />
      {totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
          {totalQuantity}
        </span>
      )}
    </button>
  );
}

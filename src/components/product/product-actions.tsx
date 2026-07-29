"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { WishlistButton } from "@/components/product/wishlist-button";

export function ProductActions({
  product,
  initialWishlisted,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    image: string;
    stockQuantity: number;
  };
  initialWishlisted: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stockQuantity <= 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {!outOfStock && (
        <div className="flex items-center rounded-md border border-ink-200">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-10 items-center justify-center text-ink-600 hover:text-brand-600"
            aria-label="Diminuir quantidade"
          >
            <Minus size={15} />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
            className="flex h-11 w-10 items-center justify-center text-ink-600 hover:text-brand-600"
            aria-label="Aumentar quantidade"
          >
            <Plus size={15} />
          </button>
        </div>
      )}

      <AddToCartButton product={product} quantity={quantity} size="lg" />
      <WishlistButton productId={product.id} initialWishlisted={initialWishlisted} variant="full" />
    </div>
  );
}

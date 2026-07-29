"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  size = "md",
  fullLabel = true,
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
  quantity?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullLabel?: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stockQuantity <= 0;

  function handleClick() {
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        price: product.price,
        image: product.image,
        stockQuantity: product.stockQuantity,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Button
      type="button"
      size={size}
      disabled={outOfStock}
      onClick={handleClick}
      className={cn(className)}
      variant={outOfStock ? "outline" : "primary"}
    >
      {added ? <Check size={17} /> : <ShoppingCart size={17} />}
      {fullLabel && (outOfStock ? "Sem Stock" : added ? "Adicionado" : "Adicionar")}
    </Button>
  );
}

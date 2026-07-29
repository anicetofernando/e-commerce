import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/lib/types";

export function ProductGrid({ products, columns = 4 }: { products: ProductCardData[]; columns?: 3 | 4 }) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-ink-200 py-16 text-center text-sm text-ink-500">
        Nenhum produto encontrado.
      </div>
    );
  }

  return (
    <div
      className={
        columns === 3
          ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-5"
          : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5"
      }
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

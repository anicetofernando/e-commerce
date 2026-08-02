import Image from "next/image";
import Link from "next/link";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { formatCurrency, cn } from "@/lib/utils";
import { BRAND_LOGOS } from "@/lib/brand-logos";
import type { ProductCardData } from "@/lib/types";

export function ProductCard({ product, className }: { product: ProductCardData; className?: string }) {
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;
  const outOfStock = product.stockQuantity <= 0;
  const lowStock = !outOfStock && product.stockQuantity <= 5;
  const brandLogos = product.brands
    .map((b) => ({ ...b, logo: BRAND_LOGOS[b.slug] }))
    .filter((b) => b.logo)
    .slice(0, 2);

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-ink-100 bg-white transition-shadow hover:shadow-lg hover:shadow-ink-900/5",
        className,
      )}
    >
      <Link href={`/produto/${product.slug}`} className="relative block aspect-square overflow-hidden bg-ink-50">
        {product.image && (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discount && <Badge tone="brand">-{discount}%</Badge>}
          {product.condition !== "NOVO" && (
            <Badge tone="ink">{product.condition === "RECONDICIONADO" ? "Recondicionado" : "Usado"}</Badge>
          )}
        </div>
        {brandLogos.length > 0 && (
          <div className="absolute top-2.5 right-2.5 flex gap-1">
            {brandLogos.map((b) => (
              <span
                key={b.slug}
                title={b.name}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-1 ring-ink-100"
              >
                <Image src={b.logo} alt={b.name} width={40} height={40} className="h-full w-full object-contain" />
              </span>
            ))}
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Badge tone="red">Sem Stock</Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/loja?categoria=${product.categorySlug}`} className="text-[11px] font-bold tracking-wide text-brand-600 uppercase">
          {product.categoryName}
        </Link>
        <Link href={`/produto/${product.slug}`} className="mt-1 line-clamp-2 text-sm font-semibold text-ink-900 hover:text-brand-600">
          {product.name}
        </Link>

        <p className="mt-1 text-xs text-ink-400">SKU: {product.sku}</p>

        {product.reviewCount > 0 ? (
          <Rating value={product.averageRating} count={product.reviewCount} size={13} className="mt-1.5" />
        ) : (
          <div className="mt-1.5 h-[18px]" />
        )}

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-lg font-bold text-ink-900">{formatCurrency(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-ink-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
          )}
        </div>
        {lowStock && <p className="mt-1 text-xs font-medium text-amber-600">Últimas {product.stockQuantity} unidades</p>}

        <div className="mt-auto pt-3">
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              sku: product.sku,
              price: product.price,
              image: product.image?.url ?? "",
              stockQuantity: product.stockQuantity,
            }}
            className="w-full"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

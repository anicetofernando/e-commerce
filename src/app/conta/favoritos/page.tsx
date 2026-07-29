import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { RemoveFavoriteButton } from "@/components/account/remove-favorite-button";

export const metadata: Metadata = { title: "Os Meus Favoritos" };
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await requireUser();
  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { product: { include: { images: { take: 1, orderBy: { position: "asc" } } } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink-900">Os Meus Favoritos</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-ink-200 p-10 text-center">
          <Heart size={32} className="text-ink-300" />
          <p className="text-sm text-ink-500">Ainda não guardou nenhuma peça nos favoritos.</p>
          <Link href="/loja" className="text-sm font-semibold text-brand-600 hover:underline">
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ product }) => {
            const image = product.images[0];
            return (
              <div key={product.id} className="flex gap-3 rounded-lg border border-ink-100 bg-white p-3">
                <Link href={`/produto/${product.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-ink-50">
                  {image && <Image src={image.url} alt={image.alt} fill sizes="80px" className="object-contain p-2" />}
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link href={`/produto/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-ink-900 hover:text-brand-600">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm font-bold text-ink-900">{formatCurrency(Number(product.price))}</p>
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        sku: product.sku,
                        price: Number(product.price),
                        image: image?.url ?? "",
                        stockQuantity: product.stockQuantity,
                      }}
                      size="sm"
                      fullLabel={false}
                    />
                    <RemoveFavoriteButton productId={product.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

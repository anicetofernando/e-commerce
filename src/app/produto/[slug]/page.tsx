import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, RotateCcw, Wrench } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ReviewForm } from "@/components/product/review-form";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, user] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 4),
    getCurrentUser(),
  ]);

  let initialWishlisted = false;
  if (user) {
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId: product.id } },
    });
    initialWishlisted = Boolean(existing);
  }

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;
  const outOfStock = product.stockQuantity <= 0;

  const compatibilityByBrand = new Map<string, { model: string; type: string }[]>();
  for (const c of product.compatibility) {
    const brandName = c.machineModel.brand.name;
    const list = compatibilityByBrand.get(brandName) ?? [];
    list.push({ model: c.machineModel.name, type: c.machineModel.type });
    compatibilityByBrand.set(brandName, list);
  }

  return (
    <Container className="py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-ink-400">
        <Link href="/" className="hover:text-brand-600">Início</Link>
        <span>/</span>
        <Link href="/loja" className="hover:text-brand-600">Loja</Link>
        <span>/</span>
        <Link href={`/loja?categoria=${product.category.slug}`} className="hover:text-brand-600">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-ink-600">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <Link href={`/loja?categoria=${product.category.slug}`} className="text-xs font-bold tracking-wide text-brand-600 uppercase">
            {product.category.name}
          </Link>
          <h1 className="mt-1.5 text-2xl font-bold text-ink-900 sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {product.reviewCount > 0 && <Rating value={product.averageRating} count={product.reviewCount} />}
            <span className="text-sm text-ink-400">SKU: {product.sku}</span>
            {product.oemNumber && <span className="text-sm text-ink-400">· OEM: {product.oemNumber}</span>}
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-black text-ink-900">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-ink-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
                <Badge tone="brand">-{discount}%</Badge>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone={outOfStock ? "red" : "green"}>{outOfStock ? "Sem Stock" : `Em Stock (${product.stockQuantity} un.)`}</Badge>
            {product.condition !== "NOVO" && (
              <Badge tone="ink">{product.condition === "RECONDICIONADO" ? "Recondicionado" : "Usado"}</Badge>
            )}
            {product.warrantyMonths > 0 && <Badge tone="amber">{product.warrantyMonths} meses de garantia</Badge>}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink-600">{product.shortDescription}</p>

          <div className="mt-6">
            <ProductActions
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                price: product.price,
                image: product.images[0]?.url ?? "",
                stockQuantity: product.stockQuantity,
              }}
              initialWishlisted={initialWishlisted}
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-ink-100 pt-6 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-1.5 text-center text-xs text-ink-500">
              <Truck size={20} className="text-brand-600" />
              Entrega Nacional
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center text-xs text-ink-500">
              <ShieldCheck size={20} className="text-brand-600" />
              Peça Garantida
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center text-xs text-ink-500">
              <RotateCcw size={20} className="text-brand-600" />
              Troca em 7 Dias
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center text-xs text-ink-500">
              <Wrench size={20} className="text-brand-600" />
              Suporte Técnico
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section id="descricao">
            <h2 className="mb-3 text-lg font-bold text-ink-900">Descrição</h2>
            <p className="text-sm leading-relaxed text-ink-600">{product.description}</p>
          </section>

          {product.specs.length > 0 && (
            <section id="especificacoes">
              <h2 className="mb-3 text-lg font-bold text-ink-900">Especificações Técnicas</h2>
              <dl className="divide-y divide-ink-100 rounded-lg border border-ink-100">
                {product.specs.map((spec) => (
                  <div key={spec.id} className="flex justify-between gap-4 px-4 py-2.5 text-sm odd:bg-ink-50/60">
                    <dt className="text-ink-500">{spec.label}</dt>
                    <dd className="font-medium text-ink-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {product.crossReferenceNumbers.length > 0 && (
            <section id="referencias">
              <h2 className="mb-3 text-lg font-bold text-ink-900">Referências Cruzadas (Cross-Reference)</h2>
              <div className="flex flex-wrap gap-2">
                {product.crossReferenceNumbers.map((ref) => (
                  <span key={ref} className="rounded-md border border-ink-200 bg-ink-50 px-3 py-1.5 font-mono text-xs text-ink-700">
                    {ref}
                  </span>
                ))}
              </div>
            </section>
          )}

          {compatibilityByBrand.size > 0 && (
            <section id="compatibilidade">
              <h2 className="mb-3 text-lg font-bold text-ink-900">Compatibilidade</h2>
              <div className="space-y-4">
                {[...compatibilityByBrand.entries()].map(([brand, models]) => (
                  <div key={brand}>
                    <p className="mb-2 text-sm font-bold text-ink-800">{brand}</p>
                    <div className="flex flex-wrap gap-2">
                      {models.map((m) => (
                        <span key={m.model} className="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-600">
                          {m.model} <span className="text-ink-400">· {EQUIPMENT_TYPE_LABELS[m.type as keyof typeof EQUIPMENT_TYPE_LABELS]}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section id="avaliacoes">
            <h2 className="mb-3 text-lg font-bold text-ink-900">
              Avaliações {product.reviewCount > 0 && `(${product.reviewCount})`}
            </h2>

            {product.reviews.length > 0 && (
              <div className="mb-6 space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-ink-100 p-4">
                    <div className="flex items-center justify-between">
                      <Rating value={review.rating} size={14} />
                      <span className="text-xs text-ink-400">{formatDate(review.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-ink-900">{review.title}</p>
                    <p className="mt-1 text-sm text-ink-600">{review.comment}</p>
                    <p className="mt-2 text-xs text-ink-400">{review.user.name}</p>
                  </div>
                ))}
              </div>
            )}

            {user ? (
              <ReviewForm productId={product.id} />
            ) : (
              <p className="rounded-lg border border-dashed border-ink-200 p-4 text-sm text-ink-500">
                <Link href="/entrar" className="font-semibold text-brand-600 hover:underline">Inicie sessão</Link> para deixar a sua avaliação.
              </p>
            )}
          </section>
        </div>

        <aside className="rounded-lg border border-ink-100 bg-ink-50/60 p-5 lg:col-span-1">
          <h3 className="mb-3 text-sm font-bold text-ink-900">Precisa de ajuda com esta peça?</h3>
          <p className="mb-4 text-sm text-ink-600">
            A nossa equipa técnica confirma a compatibilidade antes do envio. Contacte-nos com o número de
            série da sua máquina.
          </p>
          <Link href="/contacto" className="text-sm font-semibold text-brand-600 hover:underline">
            Falar com um técnico →
          </Link>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading title="Peças Relacionadas" />
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </Container>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { X, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Pagination } from "@/components/ui/pagination";
import { ProductGrid } from "@/components/product/product-grid";
import { FiltersSidebar, type CatalogSearchParams } from "@/components/catalog/filters-sidebar";
import { searchProducts, getCategories, getBrandsWithModels, type ProductFilters } from "@/lib/data";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/constants";

export const metadata: Metadata = { title: "Loja" };
export const dynamic = "force-dynamic";

function buildHref(current: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  const merged = { ...current, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/loja?${qs}` : "/loja";
}

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams & { pagina?: string }>;
}) {
  const sp = await searchParams;

  const filters: ProductFilters = {
    q: sp.q,
    category: sp.categoria,
    brand: sp.marca,
    machineModelId: sp.modelo,
    minPrice: sp.preco_min ? Number(sp.preco_min) : undefined,
    maxPrice: sp.preco_max ? Number(sp.preco_max) : undefined,
    condition: sp.condicao,
    sort: sp.ordenar as ProductFilters["sort"],
    page: sp.pagina ? Number(sp.pagina) : 1,
  };

  const [result, categories, brands] = await Promise.all([
    searchProducts(filters),
    getCategories(),
    getBrandsWithModels(),
  ]);

  const activeCategory = categories.find((c) => c.slug === sp.categoria);
  const activeBrand = brands.find((b) => b.slug === sp.marca);
  const activeModel = activeBrand?.machineModels.find((m) => m.id === sp.modelo);

  const currentParams: Record<string, string | undefined> = {
    q: sp.q,
    categoria: sp.categoria,
    marca: sp.marca,
    modelo: sp.modelo,
    preco_min: sp.preco_min,
    preco_max: sp.preco_max,
    condicao: sp.condicao,
    ordenar: sp.ordenar,
  };

  const chips: { label: string; href: string }[] = [];
  if (sp.q) chips.push({ label: `Pesquisa: "${sp.q}"`, href: buildHref(currentParams, { q: undefined }) });
  if (activeCategory) chips.push({ label: activeCategory.name, href: buildHref(currentParams, { categoria: undefined }) });
  if (activeBrand) chips.push({ label: activeBrand.name, href: buildHref(currentParams, { marca: undefined, modelo: undefined }) });
  if (activeModel)
    chips.push({
      label: `${activeModel.name} (${EQUIPMENT_TYPE_LABELS[activeModel.type as keyof typeof EQUIPMENT_TYPE_LABELS]})`,
      href: buildHref(currentParams, { modelo: undefined }),
    });
  if (sp.condicao) chips.push({ label: sp.condicao, href: buildHref(currentParams, { condicao: undefined }) });

  const title = activeCategory
    ? activeCategory.name
    : sp.q
      ? `Resultados para "${sp.q}"`
      : "Catálogo de Peças";

  return (
    <Container className="py-8">
      <nav className="mb-4 text-xs text-ink-400">
        <Link href="/" className="hover:text-brand-600">Início</Link> / <span className="text-ink-600">Loja</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
          <p className="mt-1 text-sm text-ink-500">{result.total} peça(s) encontrada(s)</p>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-200"
            >
              {chip.label}
              <X size={12} />
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <FiltersSidebar categories={categories} brands={brands} current={sp} />
        </aside>

        <details className="mb-2 rounded-lg border border-ink-100 lg:hidden">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-semibold text-ink-800">
            <SlidersHorizontal size={16} /> Filtros e Ordenação
          </summary>
          <div className="border-t border-ink-100 p-4">
            <FiltersSidebar categories={categories} brands={brands} current={sp} />
          </div>
        </details>

        <div>
          <ProductGrid products={result.products} />
          <div className="mt-10">
            <Pagination page={result.page} totalPages={result.totalPages} buildHref={(p) => buildHref(currentParams, { pagina: String(p) })} />
          </div>
        </div>
      </div>
    </Container>
  );
}

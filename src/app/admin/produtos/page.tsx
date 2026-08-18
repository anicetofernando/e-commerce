import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { getAdminProducts } from "@/lib/admin-data";
import { getCategories } from "@/lib/data";
import { formatCurrency, cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ProductRowActions } from "@/components/admin/product-row-actions";

export const metadata: Metadata = { title: "Produtos — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; pagina?: string }>;
}) {
  const params = await searchParams;
  const [{ products, total, page, totalPages }, categories] = await Promise.all([
    getAdminProducts({ q: params.q, category: params.categoria, page: params.pagina ? Number(params.pagina) : 1 }),
    getCategories(),
  ]);

  function buildHref(p: number) {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.categoria) sp.set("categoria", params.categoria);
    sp.set("pagina", String(p));
    return `/admin/produtos?${sp.toString()}`;
  }

  return (
    <div>
      <AdminPageHeader
        title="Produtos"
        description={`${total} produto${total === 1 ? "" : "s"} no catálogo.`}
        action={
          <Button href="/admin/produtos/novo">
            <Plus size={16} /> Novo Produto
          </Button>
        }
      />

      <form className="mb-5 flex flex-wrap gap-3 rounded-xl border border-ink-100 bg-white p-4">
        <div className="relative flex-1 min-w-48">
          <input
            type="text"
            name="q"
            defaultValue={params.q}
            placeholder="Pesquisar por nome ou SKU..."
            className="w-full rounded-md border border-ink-200 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-500"
          />
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-400" />
        </div>
        <select
          name="categoria"
          defaultValue={params.categoria ?? ""}
          className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Filtrar
        </Button>
      </form>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        {products.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-500">Nenhum produto encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50/60">
                <tr className="text-xs text-ink-500 uppercase">
                  <th className="px-4 py-3 font-semibold">Produto</th>
                  <th className="px-4 py-3 font-semibold">SKU</th>
                  <th className="px-4 py-3 font-semibold">Categoria</th>
                  <th className="px-4 py-3 font-semibold">Preço</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-ink-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/produtos/${p.id}`} className="flex items-center gap-3">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-ink-50">
                          {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="40px" className="object-contain p-1" />}
                        </span>
                        <span className="font-medium text-ink-900 hover:text-brand-600">{p.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-500">{p.sku}</td>
                    <td className="px-4 py-3 text-ink-600">{p.category.name}</td>
                    <td className="px-4 py-3 font-medium text-ink-900">{formatCurrency(p.price)}</td>
                    <td className={cn("px-4 py-3 font-medium", p.stockQuantity <= 5 ? "text-red-600" : "text-ink-700")}>
                      {p.stockQuantity}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          p.isActive ? "bg-green-50 text-green-700" : "bg-ink-100 text-ink-500",
                        )}
                      >
                        {p.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ProductRowActions id={p.id} isActive={p.isActive} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
      </div>
    </div>
  );
}

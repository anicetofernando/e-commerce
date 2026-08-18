import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getAdminCustomers } from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = { title: "Clientes — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; pagina?: string }>;
}) {
  const params = await searchParams;
  const { customers, total, page, totalPages } = await getAdminCustomers({
    q: params.q,
    page: params.pagina ? Number(params.pagina) : 1,
  });

  function buildHref(p: number) {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    sp.set("pagina", String(p));
    return `/admin/clientes?${sp.toString()}`;
  }

  return (
    <div>
      <AdminPageHeader title="Clientes" description={`${total} cliente${total === 1 ? "" : "s"} registado${total === 1 ? "" : "s"}.`} />

      <form className="mb-5 flex gap-3 rounded-xl border border-ink-100 bg-white p-4">
        <div className="relative flex-1">
          <input
            type="text"
            name="q"
            defaultValue={params.q}
            placeholder="Pesquisar por nome ou email..."
            className="w-full rounded-md border border-ink-200 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-500"
          />
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-400" />
        </div>
        <Button type="submit" variant="outline">
          Pesquisar
        </Button>
      </form>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        {customers.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-500">Nenhum cliente encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50/60">
                <tr className="text-xs text-ink-500 uppercase">
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Empresa</th>
                  <th className="px-4 py-3 font-semibold">Registado em</th>
                  <th className="px-4 py-3 text-right font-semibold">Encomendas</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-ink-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/clientes/${c.id}`} className="font-medium text-ink-900 hover:text-brand-600">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{c.email}</td>
                    <td className="px-4 py-3 text-ink-600">{c.company ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-500">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-900">{c._count.orders}</td>
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

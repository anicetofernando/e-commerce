import type { Metadata } from "next";
import Link from "next/link";
import { getAdminOrders } from "@/lib/admin-data";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = { title: "Encomendas — Admin" };
export const dynamic = "force-dynamic";

const STATUSES = Object.keys(ORDER_STATUS_LABELS) as (keyof typeof ORDER_STATUS_LABELS)[];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; pagina?: string }>;
}) {
  const params = await searchParams;
  const { orders, total, page, totalPages } = await getAdminOrders({
    status: params.status,
    page: params.pagina ? Number(params.pagina) : 1,
  });

  function buildHref(p: number) {
    const sp = new URLSearchParams();
    if (params.status) sp.set("status", params.status);
    sp.set("pagina", String(p));
    return `/admin/encomendas?${sp.toString()}`;
  }

  return (
    <div>
      <AdminPageHeader title="Encomendas" description={`${total} encomenda${total === 1 ? "" : "s"} no total.`} />

      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          href="/admin/encomendas"
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium",
            !params.status ? "bg-ink-900 text-white" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:ring-ink-300",
          )}
        >
          Todas
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/encomendas?status=${s}`}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium",
              params.status === s ? "bg-ink-900 text-white" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:ring-ink-300",
            )}
          >
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        {orders.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-500">Nenhuma encomenda encontrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50/60">
                <tr className="text-xs text-ink-500 uppercase">
                  <th className="px-4 py-3 font-semibold">Nº Encomenda</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Data</th>
                  <th className="px-4 py-3 font-semibold">Pagamento</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-ink-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/encomendas/${order.id}`} className="font-semibold text-brand-600 hover:text-brand-700">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-ink-900">{order.customerName}</p>
                      <p className="text-xs text-ink-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-500">{formatDateTime(order.createdAt)}</td>
                    <td className="px-4 py-3 text-ink-600">{order.paymentStatus}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", ORDER_STATUS_STYLES[order.status])}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-900">{formatCurrency(order.total)}</td>
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

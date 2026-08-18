import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCustomerById } from "@/lib/admin-data";
import { formatCurrency, formatDate, formatDateTime, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES, PROVINCE_LABELS } from "@/lib/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const metadata: Metadata = { title: "Detalhe do Cliente — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getAdminCustomerById(id);
  if (!customer) notFound();

  return (
    <div>
      <AdminPageHeader title={customer.name} description={`Cliente desde ${formatDate(customer.createdAt)}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-ink-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-ink-900 uppercase">Encomendas ({customer.orders.length})</h2>
            {customer.orders.length === 0 ? (
              <p className="text-sm text-ink-500">Este cliente ainda não fez nenhuma encomenda.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-xs text-ink-400 uppercase">
                    <th className="pb-2 font-semibold">Nº</th>
                    <th className="pb-2 font-semibold">Data</th>
                    <th className="pb-2 font-semibold">Estado</th>
                    <th className="pb-2 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((order) => (
                    <tr key={order.id} className="border-b border-ink-50 last:border-0">
                      <td className="py-2.5">
                        <Link href={`/admin/encomendas/${order.id}`} className="font-semibold text-brand-600 hover:text-brand-700">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-2.5 text-ink-500">{formatDateTime(order.createdAt)}</td>
                      <td className="py-2.5">
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", ORDER_STATUS_STYLES[order.status])}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-semibold text-ink-900">{formatCurrency(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="rounded-xl border border-ink-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-ink-900 uppercase">Endereços ({customer.addresses.length})</h2>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-ink-500">Nenhum endereço registado.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {customer.addresses.map((addr) => (
                  <div key={addr.id} className="rounded-lg border border-ink-100 p-3 text-sm">
                    <p className="font-semibold text-ink-900">
                      {addr.label} {addr.isDefault && <span className="ml-1 text-xs font-normal text-brand-600">(Principal)</span>}
                    </p>
                    <p className="mt-1 text-ink-600">{addr.recipientName}</p>
                    <p className="text-ink-500">
                      {addr.street}, {addr.neighborhood}, {addr.city}, {PROVINCE_LABELS[addr.province]}
                    </p>
                    <p className="text-ink-500">{addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-ink-100 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-ink-900 uppercase">Dados de Contacto</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-ink-400">Email</dt>
              <dd className="text-ink-900">{customer.email}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Telefone</dt>
              <dd className="text-ink-900">{customer.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Empresa</dt>
              <dd className="text-ink-900">{customer.company ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-ink-400">NUIT</dt>
              <dd className="text-ink-900">{customer.taxId ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminOrderById } from "@/lib/admin-data";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_STYLES, PROVINCE_LABELS } from "@/lib/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrderStatusForm } from "@/components/admin/order-status-form";

export const metadata: Metadata = { title: "Detalhe da Encomenda — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  return (
    <div>
      <AdminPageHeader
        title={order.orderNumber}
        description={`Criada em ${formatDateTime(order.createdAt)}`}
        action={
          <div className="flex gap-2">
            <span className={cn("rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset", ORDER_STATUS_STYLES[order.status])}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
            <span className={cn("rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset", PAYMENT_STATUS_STYLES[order.paymentStatus])}>
              {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </span>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-ink-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-ink-900 uppercase">Artigos</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs text-ink-400 uppercase">
                  <th className="pb-2 font-semibold">Produto</th>
                  <th className="pb-2 font-semibold">SKU</th>
                  <th className="pb-2 text-right font-semibold">Qtd.</th>
                  <th className="pb-2 text-right font-semibold">Preço Unit.</th>
                  <th className="pb-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-ink-50 last:border-0">
                    <td className="py-2.5">
                      {item.productId ? (
                        <Link href={`/admin/produtos/${item.productId}`} className="text-brand-600 hover:text-brand-700">
                          {item.productName}
                        </Link>
                      ) : (
                        item.productName
                      )}
                    </td>
                    <td className="py-2.5 text-ink-500">{item.productSku}</td>
                    <td className="py-2.5 text-right text-ink-700">{item.quantity}</td>
                    <td className="py-2.5 text-right text-ink-700">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2.5 text-right font-semibold text-ink-900">{formatCurrency(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 space-y-1.5 border-t border-ink-100 pt-4 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Desconto{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-600">
                <span>Envio</span>
                <span>{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-ink-900">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-ink-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-ink-900 uppercase">Entrega</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Morada</dt>
                <dd className="text-right text-ink-900">
                  {order.street}, {order.neighborhood}, {order.city}, {PROVINCE_LABELS[order.province]}
                </dd>
              </div>
              {order.reference && (
                <div className="flex justify-between">
                  <dt className="text-ink-500">Referência</dt>
                  <dd className="text-ink-900">{order.reference}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-500">Método de Pagamento</dt>
                <dd className="text-ink-900">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</dd>
              </div>
              {order.notes && (
                <div className="flex justify-between">
                  <dt className="text-ink-500">Notas</dt>
                  <dd className="text-right text-ink-900">{order.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-ink-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-ink-900 uppercase">Cliente</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-ink-400">Nome</dt>
                <dd className="text-ink-900">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Email</dt>
                <dd className="text-ink-900">{order.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Telefone</dt>
                <dd className="text-ink-900">{order.customerPhone}</dd>
              </div>
              {order.user && (
                <div>
                  <Link href={`/admin/clientes/${order.user.id}`} className="font-semibold text-brand-600 hover:text-brand-700">
                    Ver perfil do cliente →
                  </Link>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-ink-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-ink-900 uppercase">Atualizar Estado</h2>
            <OrderStatusForm
              orderId={order.id}
              status={order.status}
              paymentStatus={order.paymentStatus}
              trackingNumber={order.trackingNumber}
              carrier={order.carrier}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

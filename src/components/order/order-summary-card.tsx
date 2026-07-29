import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS, PROVINCE_LABELS, ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import type { Order, OrderItem, Province, OrderStatus, PaymentMethod } from "@/generated/prisma/client";

type OrderWithItems = Omit<Order, "subtotal" | "shippingCost" | "total" | "province" | "status" | "paymentMethod"> & {
  subtotal: number;
  shippingCost: number;
  total: number;
  province: Province;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: (Omit<OrderItem, "unitPrice" | "lineTotal"> & { unitPrice: number; lineTotal: number })[];
};

export function OrderSummaryCard({ order }: { order: OrderWithItems }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
        <div>
          <p className="text-xs text-ink-400">Nº da Encomenda</p>
          <p className="text-lg font-bold text-ink-900">{order.orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-400">Data</p>
          <p className="text-sm font-medium text-ink-700">{formatDateTime(order.createdAt)}</p>
        </div>
        <Badge className={cn(ORDER_STATUS_STYLES[order.status])}>{ORDER_STATUS_LABELS[order.status]}</Badge>
      </div>

      <ul className="divide-y divide-ink-100 py-2">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="font-medium text-ink-900">{item.productName}</p>
              <p className="text-xs text-ink-400">SKU: {item.productSku} · Qtd: {item.quantity}</p>
            </div>
            <span className="font-semibold text-ink-900">{formatCurrency(item.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-1.5 border-t border-ink-100 pt-4 text-sm">
        <div className="flex justify-between text-ink-600">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-600">
          <span>Envio</span>
          <span>{order.shippingCost === 0 ? "Grátis" : formatCurrency(order.shippingCost)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-ink-900">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-ink-100 pt-5 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-ink-400 uppercase">Entrega</p>
          <p className="text-sm text-ink-700">
            {order.street}, {order.neighborhood}
            <br />
            {order.city}, {PROVINCE_LABELS[order.province]}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-ink-400 uppercase">Pagamento</p>
          <p className="text-sm text-ink-700">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
        </div>
      </div>
    </div>
  );
}

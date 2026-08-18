import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getUserOrders } from "@/lib/data";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Os Meus Pedidos" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await getUserOrders(user.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink-900">Os Meus Pedidos</h1>

      {orders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">
          Ainda não fez nenhuma encomenda.
        </p>
      ) : (
        <div className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/conta/pedidos/${order.orderNumber}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-ink-50 sm:p-5"
            >
              <div>
                <p className="text-sm font-semibold text-ink-900">{order.orderNumber}</p>
                <p className="text-xs text-ink-400">
                  {formatDate(order.createdAt)} · {order.items.length} item(ns)
                </p>
              </div>
              <Badge className={cn(ORDER_STATUS_STYLES[order.status])}>{ORDER_STATUS_LABELS[order.status]}</Badge>
              <span className="hidden text-sm font-bold text-ink-900 sm:block">{formatCurrency(order.total)}</span>
              <ChevronRight size={16} className="text-ink-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

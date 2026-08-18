import type { Metadata } from "next";
import Link from "next/link";
import { Package, MapPin, Heart, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserOrders } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "A Minha Conta" };
export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
  const user = await requireUser();

  const [orders, addressCount, wishlistCount] = await Promise.all([
    getUserOrders(user.id),
    prisma.address.count({ where: { userId: user.id } }),
    prisma.wishlistItem.count({ where: { userId: user.id } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Olá, {user.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-ink-500">Bem-vindo(a) de volta à sua área de cliente Albimaq.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-ink-100 bg-white p-4">
          <Package className="text-brand-600" size={22} />
          <div>
            <p className="text-lg font-bold text-ink-900">{orders.length}</p>
            <p className="text-xs text-ink-500">Encomendas</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-ink-100 bg-white p-4">
          <MapPin className="text-brand-600" size={22} />
          <div>
            <p className="text-lg font-bold text-ink-900">{addressCount}</p>
            <p className="text-xs text-ink-500">Endereços</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-ink-100 bg-white p-4">
          <Heart className="text-brand-600" size={22} />
          <div>
            <p className="text-lg font-bold text-ink-900">{wishlistCount}</p>
            <p className="text-xs text-ink-500">Favoritos</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">Encomendas Recentes</h2>
          <Link href="/conta/pedidos" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
            Ainda não fez nenhuma encomenda.
          </p>
        ) : (
          <div className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
            {orders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                href={`/conta/pedidos/${order.orderNumber}`}
                className="flex items-center justify-between gap-4 p-4 hover:bg-ink-50"
              >
                <div>
                  <p className="text-sm font-semibold text-ink-900">{order.orderNumber}</p>
                  <p className="text-xs text-ink-400">{formatDate(order.createdAt)}</p>
                </div>
                <Badge className={cn(ORDER_STATUS_STYLES[order.status])}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                <span className="text-sm font-bold text-ink-900">{formatCurrency(order.total)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

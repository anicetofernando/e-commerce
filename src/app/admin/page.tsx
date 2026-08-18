import type { Metadata } from "next";
import Link from "next/link";
import { Package, ShoppingCart, Users, AlertTriangle, Mail, Star, Wallet, Clock } from "lucide-react";
import { getDashboardStats } from "@/lib/admin-data";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const metadata: Metadata = { title: "Painel Admin" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Receita Total", value: formatCurrency(stats.revenue), icon: Wallet, href: "/admin/encomendas" },
    { label: "Encomendas", value: stats.orderCount, icon: ShoppingCart, href: "/admin/encomendas" },
    { label: "Encomendas Pendentes", value: stats.pendingOrderCount, icon: Clock, href: "/admin/encomendas?status=PENDENTE" },
    { label: "Produtos Ativos", value: stats.productCount, icon: Package, href: "/admin/produtos" },
    { label: "Stock Baixo", value: stats.lowStockCount, icon: AlertTriangle, href: "/admin/produtos", warn: stats.lowStockCount > 0 },
    { label: "Clientes", value: stats.customerCount, icon: Users, href: "/admin/clientes" },
    { label: "Mensagens por Ler", value: stats.unreadMessageCount, icon: Mail, href: "/admin/mensagens", warn: stats.unreadMessageCount > 0 },
    { label: "Avaliações Pendentes", value: stats.pendingReviewCount, icon: Star, href: "/admin/avaliacoes", warn: stats.pendingReviewCount > 0 },
  ];

  return (
    <div>
      <AdminPageHeader title="Painel" description="Visão geral da loja e da atividade recente." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-ink-100 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  c.warn ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600",
                )}
              >
                <c.icon size={19} />
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-ink-900">{c.value}</p>
            <p className="mt-0.5 text-sm text-ink-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-ink-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink-900">Encomendas Recentes</h2>
          <Link href="/admin/encomendas" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Ver todas
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-500">Ainda não há encomendas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs text-ink-400 uppercase">
                  <th className="pb-2 font-semibold">Nº Encomenda</th>
                  <th className="pb-2 font-semibold">Cliente</th>
                  <th className="pb-2 font-semibold">Data</th>
                  <th className="pb-2 font-semibold">Estado</th>
                  <th className="pb-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-ink-50 last:border-0">
                    <td className="py-3">
                      <Link href={`/admin/encomendas/${order.id}`} className="font-semibold text-brand-600 hover:text-brand-700">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-ink-700">{order.customerName}</td>
                    <td className="py-3 text-ink-500">{formatDateTime(order.createdAt)}</td>
                    <td className="py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", ORDER_STATUS_STYLES[order.status])}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-ink-900">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

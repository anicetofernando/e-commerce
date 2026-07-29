import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getOrderByNumber } from "@/lib/data";
import { OrderSummaryCard } from "@/components/order/order-summary-card";

export const metadata: Metadata = { title: "Detalhe do Pedido" };
export const dynamic = "force-dynamic";

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ numero: string }> }) {
  const user = await requireUser();
  const { numero } = await params;
  const order = await getOrderByNumber(numero);

  if (!order || order.userId !== user.id) notFound();

  return (
    <div>
      <Link href="/conta/pedidos" className="mb-4 flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600">
        <ChevronLeft size={16} /> Voltar aos pedidos
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-ink-900">Pedido {order.orderNumber}</h1>
      <OrderSummaryCard order={order} />
    </div>
  );
}

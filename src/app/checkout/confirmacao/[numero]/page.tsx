import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { OrderSummaryCard } from "@/components/order/order-summary-card";
import { getOrderByNumber } from "@/lib/data";

export const metadata: Metadata = { title: "Encomenda Confirmada" };
export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const order = await getOrderByNumber(numero);
  if (!order) notFound();

  return (
    <Container className="max-w-3xl py-12">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 size={56} className="text-green-600" />
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Encomenda Recebida com Sucesso!</h1>
        <p className="mt-2 max-w-lg text-sm text-ink-600">
          Obrigado, {order.customerName}. A sua encomenda <strong>{order.orderNumber}</strong> foi registada.
          A nossa equipa entrará em contacto em breve para confirmar o pagamento e a entrega.
        </p>
      </div>

      <div className="mt-10">
        <OrderSummaryCard order={order} />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/loja">Continuar a Comprar</Button>
        <Button href="/conta/pedidos" variant="outline">Ver as Minhas Encomendas</Button>
      </div>
    </Container>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore, useCartTotals } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_COST } from "@/lib/constants";

export function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { subtotal } = useCartTotals();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : DEFAULT_SHIPPING_COST;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShoppingBag size={48} className="text-ink-300" />
        <h1 className="text-xl font-bold text-ink-900">O seu carrinho está vazio</h1>
        <p className="max-w-sm text-sm text-ink-500">
          Explore o nosso catálogo e adicione peças compatíveis com o seu equipamento.
        </p>
        <Button href="/loja">Ver Catálogo</Button>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink-900">O Seu Carrinho</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 p-4 sm:p-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-ink-100 bg-ink-50">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-3" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/produto/${item.slug}`} className="font-semibold text-ink-900 hover:text-brand-600">
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-400">SKU: {item.sku}</p>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-ink-300 hover:text-red-600" aria-label="Remover">
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="flex items-center rounded-md border border-ink-200">
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-ink-600 hover:text-brand-600"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center text-ink-600 hover:text-brand-600"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-400">{formatCurrency(item.price)} / un.</p>
                    <p className="text-base font-bold text-ink-900">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-lg border border-ink-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-ink-900">Resumo</h2>
          <div className="space-y-2 text-sm text-ink-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-ink-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envio</span>
              <span className="font-medium text-ink-900">{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-ink-400">
                Envio grátis para compras acima de {formatCurrency(FREE_SHIPPING_THRESHOLD)}.
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-between border-t border-ink-100 pt-4 text-base font-bold text-ink-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Button href="/checkout" size="lg" className="mt-5 w-full justify-center">
            Finalizar Compra <ArrowRight size={17} />
          </Button>
          <Button href="/loja" variant="ghost" size="sm" className="mt-2 w-full justify-center">
            Continuar a Comprar
          </Button>
        </aside>
      </div>
    </Container>
  );
}

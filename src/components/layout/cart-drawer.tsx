"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore, useCartTotals } from "@/lib/cart-store";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { subtotal } = useCartTotals();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-[visibility] duration-300",
        isOpen ? "visible" : "invisible delay-300",
      )}
      aria-hidden={!isOpen}
    >
      <div
        onClick={close}
        className={cn(
          "absolute inset-0 bg-ink-950/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        className={cn(
          "absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h2 className="text-lg font-bold text-ink-900">O seu carrinho</h2>
          <button
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100"
            aria-label="Fechar carrinho"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag size={40} className="text-ink-300" />
            <p className="font-medium text-ink-700">O seu carrinho está vazio</p>
            <Button href="/loja" size="sm" onClick={close}>
              Ver Catálogo
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-ink-100 px-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-ink-100 bg-ink-50">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/produto/${item.slug}`}
                      onClick={close}
                      className="line-clamp-2 text-sm font-semibold text-ink-900 hover:text-brand-600"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-500">SKU: {item.sku}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-ink-200">
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-ink-600 hover:text-brand-600"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-ink-600 hover:text-brand-600"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-ink-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="h-fit text-ink-300 hover:text-red-600"
                    aria-label="Remover item"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink-100 px-5 py-4">
              <div className="mb-4 flex items-center justify-between text-base font-bold text-ink-900">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="grid gap-2">
                <Button href="/checkout" onClick={close} size="lg">
                  Finalizar Compra
                </Button>
                <Button href="/carrinho" onClick={close} variant="outline" size="md">
                  Ver Carrinho
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

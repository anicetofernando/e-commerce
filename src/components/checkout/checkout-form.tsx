"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import { useCartStore, useCartTotals } from "@/lib/cart-store";
import { placeOrder } from "@/actions/checkout";
import { formatCurrency, cn } from "@/lib/utils";
import { Input, Label, Select, Textarea, FormAlert } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PROVINCE_OPTIONS, PAYMENT_METHOD_LABELS, FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_COST } from "@/lib/constants";
import type { Province } from "@/generated/prisma/client";

type SavedAddress = {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  province: Province;
  city: string;
  neighborhood: string;
  street: string;
  reference: string | null;
};

export function CheckoutForm({
  defaultName,
  defaultEmail,
  defaultPhone,
  addresses,
}: {
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  addresses: SavedAddress[];
}) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const { subtotal } = useCartTotals();

  const defaultAddress = addresses.find((a) => a) ?? null;
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id ?? "");
  const [paymentMethod, setPaymentMethod] = useState("TRANSFERENCIA_BANCARIA");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const selected = addresses.find((a) => a.id === selectedAddressId);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_COST;
  const total = subtotal + shipping;

  const paymentOptions = useMemo(() => Object.entries(PAYMENT_METHOD_LABELS), []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(undefined);

    if (items.length === 0) {
      setErrorMessage("O seu carrinho está vazio.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    setIsSubmitting(true);

    const result = await placeOrder({
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      customerPhone: String(formData.get("customerPhone") ?? ""),
      province: String(formData.get("province") ?? ""),
      city: String(formData.get("city") ?? ""),
      neighborhood: String(formData.get("neighborhood") ?? ""),
      street: String(formData.get("street") ?? ""),
      reference: String(formData.get("reference") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      paymentMethod,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    clearCart();
    router.push(`/checkout/confirmacao/${result.orderNumber}`);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {addresses.length > 0 && (
          <div className="rounded-lg border border-ink-100 bg-white p-5">
            <h2 className="mb-3 text-base font-bold text-ink-900">Endereços Guardados</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {addresses.map((addr) => (
                <button
                  type="button"
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={cn(
                    "rounded-md border p-3 text-left text-xs",
                    selectedAddressId === addr.id ? "border-brand-500 ring-2 ring-brand-500/20" : "border-ink-200",
                  )}
                >
                  <p className="font-semibold text-ink-900">{addr.label}</p>
                  <p className="text-ink-500">{addr.street}, {addr.neighborhood}, {addr.city}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg border border-ink-100 bg-white p-5">
          <h2 className="mb-4 text-base font-bold text-ink-900">Dados de Contacto e Entrega</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerName">Nome Completo</Label>
              <Input id="customerName" name="customerName" defaultValue={selected?.recipientName ?? defaultName} required />
            </div>
            <div>
              <Label htmlFor="customerPhone">Telefone</Label>
              <Input id="customerPhone" name="customerPhone" defaultValue={selected?.phone ?? defaultPhone} required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input id="customerEmail" name="customerEmail" type="email" defaultValue={defaultEmail} required />
            </div>
            <div>
              <Label htmlFor="province">Província</Label>
              <Select id="province" name="province" defaultValue={selected?.province ?? ""} required>
                <option value="" disabled>Selecione</option>
                {PROVINCE_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="city">Cidade / Distrito</Label>
              <Input id="city" name="city" defaultValue={selected?.city} required />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" name="neighborhood" defaultValue={selected?.neighborhood} required />
            </div>
            <div>
              <Label htmlFor="street">Rua / Avenida e Número</Label>
              <Input id="street" name="street" defaultValue={selected?.street} required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="reference">Ponto de Referência (opcional)</Label>
              <Input id="reference" name="reference" defaultValue={selected?.reference ?? ""} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes">Notas para a Entrega (opcional)</Label>
              <Textarea id="notes" name="notes" placeholder="Ex: entregar na receção, ligar antes de chegar..." />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-ink-100 bg-white p-5">
          <h2 className="mb-4 text-base font-bold text-ink-900">Método de Pagamento</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {paymentOptions.map(([value, label]) => (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-md border p-3 text-sm",
                  paymentMethod === value ? "border-brand-500 ring-2 ring-brand-500/20" : "border-ink-200",
                )}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                  className="accent-brand-600"
                />
                {label}
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-500">
            Após a confirmação, a nossa equipa entrará em contacto com os detalhes de pagamento para
            transferência bancária, M-Pesa ou e-Mola.
          </p>
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-ink-100 bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-ink-900">Resumo da Encomenda</h2>
        <ul className="max-h-64 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-ink-100 bg-ink-50">
                <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-900">{item.name}</p>
                <p className="text-xs text-ink-400">Qtd: {item.quantity}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-ink-900">{formatCurrency(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm text-ink-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-ink-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envio</span>
            <span className="font-medium text-ink-900">{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4">
            <FormAlert message={errorMessage} tone="error" />
          </div>
        )}

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-5 w-full justify-center">
          {isSubmitting && <Loader2 size={17} className="animate-spin" />}
          {isSubmitting ? "A processar..." : "Confirmar Encomenda"}
        </Button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-400">
          <ShieldCheck size={14} /> Os seus dados estão protegidos
        </p>
        <p className="mt-2 text-center text-xs text-ink-400">
          Ao confirmar, aceita os nossos{" "}
          <Link href="/termos-condicoes" className="underline hover:text-brand-600">Termos e Condições</Link>.
        </p>
      </aside>
    </form>
  );
}

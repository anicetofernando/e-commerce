"use client";

import { useActionState, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X, Ticket } from "lucide-react";
import { Input, Select, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { createCoupon, deleteCoupon, updateCoupon, toggleCouponActive } from "@/actions/admin-coupons";
import { DISCOUNT_TYPE_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { AuthFormState } from "@/actions/auth";
import type { DiscountType } from "@/generated/prisma/client";

type Coupon = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minOrderValue: number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
};

function toDateInputValue(date: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function CouponFields({ state, coupon }: { state: AuthFormState; coupon?: Coupon }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label>Código</Label>
        <Input name="code" defaultValue={coupon?.code} placeholder="ex: BEMVINDO10" required className="uppercase" />
        <FieldError messages={state?.errors?.code} />
      </div>
      <div>
        <Label>Tipo</Label>
        <Select name="type" defaultValue={coupon?.type ?? "PERCENTAGEM"}>
          {Object.entries(DISCOUNT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Valor</Label>
        <Input name="value" type="number" min="0" step="0.01" defaultValue={coupon?.value} required />
        <FieldError messages={state?.errors?.value} />
      </div>
      <div>
        <Label>Compra Mínima (opcional)</Label>
        <Input name="minOrderValue" type="number" min="0" step="0.01" defaultValue={coupon?.minOrderValue ?? ""} />
      </div>
      <div>
        <Label>Limite de Utilizações (opcional)</Label>
        <Input name="maxUses" type="number" min="1" step="1" defaultValue={coupon?.maxUses ?? ""} />
      </div>
      <div>
        <Label>Expira em (opcional)</Label>
        <Input name="expiresAt" type="date" defaultValue={toDateInputValue(coupon?.expiresAt ?? null)} />
      </div>
      <div className="flex items-center pt-6">
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" name="isActive" defaultChecked={coupon?.isActive ?? true} className="h-4 w-4 accent-brand-600" />
          Ativo
        </label>
      </div>
    </div>
  );
}

function NewCouponForm({ onDone }: { onDone: () => void }) {
  const [state, formAction] = useActionState(createCoupon, undefined);
  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-brand-200 bg-brand-50/40 p-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <CouponFields state={state} />
      <div className="flex gap-2">
        <SubmitButton size="sm">Criar Cupão</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function EditCouponForm({ coupon, onDone }: { coupon: Coupon; onDone: () => void }) {
  const boundUpdate = updateCoupon.bind(null, coupon.id);
  const [state, formAction] = useActionState(boundUpdate, undefined);
  return (
    <form action={formAction} className="space-y-3 border-t border-ink-100 bg-ink-50/40 p-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <CouponFields state={state} coupon={coupon} />
      <div className="flex gap-2">
        <SubmitButton size="sm">Guardar</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Fechar
        </button>
      </div>
    </form>
  );
}

export function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      {creating ? (
        <NewCouponForm onDone={() => setCreating(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 py-4 text-sm font-semibold text-ink-600 hover:border-brand-500 hover:text-brand-600"
        >
          <Plus size={16} /> Novo Cupão
        </button>
      )}

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        {coupons.map((c) => (
          <div key={c.id}>
            <div className="flex items-center justify-between gap-3 border-t border-ink-50 px-5 py-3.5 first:border-t-0">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                  <Ticket size={18} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-mono font-semibold text-ink-900">{c.code}</p>
                  <p className="text-xs text-ink-400">
                    {c.type === "PERCENTAGEM" ? `${c.value}%` : formatCurrency(c.value)}
                    {c.minOrderValue ? ` · mín. ${formatCurrency(c.minOrderValue)}` : ""}
                    {" · "}
                    {c.usedCount}
                    {c.maxUses ? `/${c.maxUses}` : ""} usos
                    {c.expiresAt ? ` · expira ${formatDate(c.expiresAt)}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => toggleCouponActive(c.id, !c.isActive))}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    c.isActive ? "bg-green-50 text-green-700" : "bg-ink-100 text-ink-500"
                  }`}
                >
                  {c.isActive ? "Ativo" : "Inativo"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(editingId === c.id ? null : c.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                >
                  {editingId === c.id ? <X size={16} /> : <Pencil size={16} />}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (confirm("Eliminar este cupão?")) startTransition(() => deleteCoupon(c.id));
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {editingId === c.id && <EditCouponForm coupon={c} onDone={() => setEditingId(null)} />}
          </div>
        ))}
        {coupons.length === 0 && <p className="py-10 text-center text-sm text-ink-500">Nenhum cupão criado ainda.</p>}
      </div>
    </div>
  );
}

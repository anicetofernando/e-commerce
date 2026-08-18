"use client";

import { useActionState, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Input, Textarea, Select, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { createPromoBanner, deletePromoBanner, updatePromoBanner } from "@/actions/admin-content";
import { PROMO_ICON_KEYS, PROMO_ICONS, PROMO_GRADIENT_LABELS } from "@/lib/promo-presets";
import type { AuthFormState } from "@/actions/auth";

type PromoBanner = {
  id: string;
  title: string;
  badge: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  position: number;
  isActive: boolean;
};

function BannerFields({ state, banner }: { state: AuthFormState; banner?: PromoBanner }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label>Título</Label>
        <Input name="title" defaultValue={banner?.title} required />
        <FieldError messages={state?.errors?.title} />
      </div>
      <div>
        <Label>Selo</Label>
        <Input name="badge" defaultValue={banner?.badge} required />
        <FieldError messages={state?.errors?.badge} />
      </div>
      <div className="sm:col-span-2">
        <Label>Descrição</Label>
        <Textarea name="description" defaultValue={banner?.description} required className="min-h-16" />
        <FieldError messages={state?.errors?.description} />
      </div>
      <div>
        <Label>Destino</Label>
        <Input name="href" defaultValue={banner?.href} placeholder="/loja?categoria=..." required />
        <FieldError messages={state?.errors?.href} />
      </div>
      <div>
        <Label>Posição (ordem)</Label>
        <Input name="position" type="number" min="0" defaultValue={banner?.position ?? 0} />
      </div>
      <div>
        <Label>Ícone</Label>
        <Select name="icon" defaultValue={banner?.icon ?? PROMO_ICON_KEYS[0]}>
          {PROMO_ICON_KEYS.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Cor</Label>
        <Select name="gradient" defaultValue={banner?.gradient ?? "laranja"}>
          {Object.entries(PROMO_GRADIENT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex items-center pt-6">
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" name="isActive" defaultChecked={banner?.isActive ?? true} className="h-4 w-4 accent-brand-600" />
          Ativo
        </label>
      </div>
    </div>
  );
}

function NewBannerForm({ onDone }: { onDone: () => void }) {
  const [state, formAction] = useActionState(createPromoBanner, undefined);
  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-brand-200 bg-brand-50/40 p-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <BannerFields state={state} />
      <div className="flex gap-2">
        <SubmitButton size="sm">Criar Banner</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function EditBannerForm({ banner, onDone }: { banner: PromoBanner; onDone: () => void }) {
  const boundUpdate = updatePromoBanner.bind(null, banner.id);
  const [state, formAction] = useActionState(boundUpdate, undefined);
  return (
    <form action={formAction} className="space-y-3 border-t border-ink-100 bg-ink-50/40 p-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <BannerFields state={state} banner={banner} />
      <div className="flex gap-2">
        <SubmitButton size="sm">Guardar</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Fechar
        </button>
      </div>
    </form>
  );
}

export function PromoBannerManager({ banners }: { banners: PromoBanner[] }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      {creating ? (
        <NewBannerForm onDone={() => setCreating(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 py-4 text-sm font-semibold text-ink-600 hover:border-brand-500 hover:text-brand-600"
        >
          <Plus size={16} /> Novo Banner
        </button>
      )}

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        {banners.map((b) => {
          const Icon = PROMO_ICONS[b.icon] ?? PROMO_ICONS.Package;
          return (
            <div key={b.id}>
              <div className="flex items-center justify-between gap-3 border-t border-ink-50 px-5 py-3.5 first:border-t-0">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">{b.title}</p>
                    <p className="text-xs text-ink-400">
                      {b.isActive ? "Ativo" : "Inativo"} · posição {b.position}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingId(editingId === b.id ? null : b.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                  >
                    {editingId === b.id ? <X size={16} /> : <Pencil size={16} />}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      if (confirm("Eliminar este banner?")) startTransition(() => deletePromoBanner(b.id));
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {editingId === b.id && <EditBannerForm banner={b} onDone={() => setEditingId(null)} />}
            </div>
          );
        })}
        {banners.length === 0 && <p className="py-10 text-center text-sm text-ink-500">Nenhum banner criado ainda.</p>}
      </div>
    </div>
  );
}

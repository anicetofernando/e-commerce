"use client";

import { useActionState, useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Input, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createPartnerLogo, deletePartnerLogo, updatePartnerLogo } from "@/actions/admin-content";
import type { AuthFormState } from "@/actions/auth";

type PartnerLogo = {
  id: string;
  name: string;
  imageUrl: string;
  position: number;
  isActive: boolean;
};

function LogoFields({ state, partner }: { state: AuthFormState; partner?: PartnerLogo }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label>Nome do Parceiro</Label>
        <Input name="name" defaultValue={partner?.name} required />
        <FieldError messages={state?.errors?.name} />
      </div>
      <div>
        <Label>Logótipo</Label>
        <ImageUploadField name="imageUrl" folder="parceiros" defaultValue={partner?.imageUrl} required />
        <FieldError messages={state?.errors?.imageUrl} />
      </div>
      <div>
        <Label>Posição (ordem)</Label>
        <Input name="position" type="number" min="0" defaultValue={partner?.position ?? 0} />
      </div>
      <div className="flex items-center pt-6">
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" name="isActive" defaultChecked={partner?.isActive ?? true} className="h-4 w-4 accent-brand-600" />
          Ativo
        </label>
      </div>
    </div>
  );
}

function NewLogoForm({ onDone }: { onDone: () => void }) {
  const [state, formAction] = useActionState(createPartnerLogo, undefined);
  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-brand-200 bg-brand-50/40 p-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <LogoFields state={state} />
      <div className="flex gap-2">
        <SubmitButton size="sm">Adicionar Parceiro</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function EditLogoForm({ partner, onDone }: { partner: PartnerLogo; onDone: () => void }) {
  const boundUpdate = updatePartnerLogo.bind(null, partner.id);
  const [state, formAction] = useActionState(boundUpdate, undefined);
  return (
    <form action={formAction} className="space-y-3 border-t border-ink-100 bg-ink-50/40 p-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <LogoFields state={state} partner={partner} />
      <div className="flex gap-2">
        <SubmitButton size="sm">Guardar</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Fechar
        </button>
      </div>
    </form>
  );
}

export function PartnerLogoManager({ partners }: { partners: PartnerLogo[] }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      {creating ? (
        <NewLogoForm onDone={() => setCreating(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 py-4 text-sm font-semibold text-ink-600 hover:border-brand-500 hover:text-brand-600"
        >
          <Plus size={16} /> Novo Parceiro
        </button>
      )}

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        {partners.map((p) => (
          <div key={p.id}>
            <div className="flex items-center justify-between gap-3 border-t border-ink-50 px-5 py-3.5 first:border-t-0">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink-50">
                  <Image src={p.imageUrl} alt="" fill sizes="64px" className="object-contain p-1" unoptimized={p.imageUrl.endsWith(".gif")} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-900">{p.name}</p>
                  <p className="text-xs text-ink-400">
                    {p.isActive ? "Ativo" : "Inativo"} · posição {p.position}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditingId(editingId === p.id ? null : p.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                >
                  {editingId === p.id ? <X size={16} /> : <Pencil size={16} />}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (confirm(`Remover "${p.name}" dos parceiros?`)) startTransition(() => deletePartnerLogo(p.id));
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {editingId === p.id && <EditLogoForm partner={p} onDone={() => setEditingId(null)} />}
          </div>
        ))}
        {partners.length === 0 && <p className="py-10 text-center text-sm text-ink-500">Nenhum parceiro adicionado ainda.</p>}
      </div>
    </div>
  );
}

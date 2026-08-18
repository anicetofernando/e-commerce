"use client";

import { useActionState, useState, useTransition } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Input, Select, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { createBrand, createMachineModel, deleteBrand, deleteMachineModel } from "@/actions/admin-catalog";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/constants";
import { slugify } from "@/lib/utils";

type MachineModel = { id: string; name: string; type: string; yearFrom: number | null; yearTo: number | null };
type Brand = { id: string; name: string; slug: string; origin: string | null; machineModels: MachineModel[] };

function NewBrandForm({ onDone }: { onDone: () => void }) {
  const [state, formAction] = useActionState(createBrand, undefined);
  const [slug, setSlug] = useState("");

  return (
    <form action={formAction} className="grid gap-3 rounded-xl border border-brand-200 bg-brand-50/40 p-5 sm:grid-cols-3">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <div>
        <Label>Nome</Label>
        <Input name="name" required onChange={(e) => setSlug(slugify(e.target.value))} />
        <FieldError messages={state?.errors?.name} />
      </div>
      <div>
        <Label>Slug</Label>
        <Input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>
      <div>
        <Label>Origem (opcional)</Label>
        <Input name="origin" placeholder="Ex: EUA, Japão, Suécia..." />
      </div>
      <div className="flex gap-2 sm:col-span-3">
        <SubmitButton size="sm">Criar Marca</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function NewModelForm({ brandId, onDone }: { brandId: string; onDone: () => void }) {
  const [state, formAction] = useActionState(createMachineModel, undefined);

  return (
    <form action={formAction} className="grid gap-3 border-t border-ink-100 bg-ink-50/50 p-4 sm:grid-cols-4">
      <input type="hidden" name="brandId" value={brandId} />
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <div>
        <Label>Modelo</Label>
        <Input name="name" required />
        <FieldError messages={state?.errors?.name} />
      </div>
      <div>
        <Label>Tipo</Label>
        <Select name="type" required>
          {Object.entries(EQUIPMENT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Ano Desde</Label>
        <Input name="yearFrom" type="number" />
      </div>
      <div>
        <Label>Ano Até</Label>
        <Input name="yearTo" type="number" />
      </div>
      <div className="flex gap-2 sm:col-span-4">
        <SubmitButton size="sm">Adicionar Modelo</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Fechar
        </button>
      </div>
    </form>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  const [expanded, setExpanded] = useState(false);
  const [addingModel, setAddingModel] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <button type="button" onClick={() => setExpanded((v) => !v)} className="flex flex-1 items-center gap-3 text-left">
          {expanded ? <ChevronUp size={16} className="text-ink-400" /> : <ChevronDown size={16} className="text-ink-400" />}
          <div>
            <p className="font-semibold text-ink-900">{brand.name}</p>
            <p className="text-xs text-ink-400">
              {brand.origin ? `${brand.origin} · ` : ""}
              {brand.machineModels.length} modelo{brand.machineModels.length === 1 ? "" : "s"}
            </p>
          </div>
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm(`Eliminar a marca "${brand.name}" e todos os seus modelos?`)) {
              startTransition(() => deleteBrand(brand.id));
            }
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-ink-100">
          {brand.machineModels.length > 0 && (
            <ul className="divide-y divide-ink-50">
              {brand.machineModels.map((m) => (
                <li key={m.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                  <span className="text-ink-700">
                    {m.name} <span className="text-ink-400">({EQUIPMENT_TYPE_LABELS[m.type as keyof typeof EQUIPMENT_TYPE_LABELS]})</span>
                    {(m.yearFrom || m.yearTo) && (
                      <span className="text-ink-400">
                        {" "}
                        · {m.yearFrom ?? ""}–{m.yearTo ?? ""}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Eliminar o modelo "${m.name}"?`)) {
                        startTransition(() => deleteMachineModel(m.id));
                      }
                    }}
                    className="text-ink-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {addingModel ? (
            <NewModelForm brandId={brand.id} onDone={() => setAddingModel(false)} />
          ) : (
            <button
              type="button"
              onClick={() => setAddingModel(true)}
              className="flex w-full items-center justify-center gap-1.5 border-t border-ink-50 py-3 text-sm font-semibold text-brand-600 hover:bg-brand-50/40"
            >
              <Plus size={14} /> Adicionar Modelo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function BrandManager({ brands }: { brands: Brand[] }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      {creating ? (
        <NewBrandForm onDone={() => setCreating(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 py-4 text-sm font-semibold text-ink-600 hover:border-brand-500 hover:text-brand-600"
        >
          <Plus size={16} /> Nova Marca
        </button>
      )}

      <div className="space-y-3">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
}

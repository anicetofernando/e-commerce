"use client";

import { useActionState, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Input, Textarea, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createCategory, deleteCategory, updateCategory } from "@/actions/admin-catalog";
import { slugify } from "@/lib/utils";
import type { AuthFormState } from "@/actions/auth";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  position: number;
  _count: { products: number };
};

function CategoryFields({
  state,
  defaults,
}: {
  state: AuthFormState;
  defaults?: { name: string; slug: string; description: string; imageUrl: string; position: number };
}) {
  const [slug, setSlug] = useState(defaults?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!defaults);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label>Nome</Label>
        <Input
          name="name"
          defaultValue={defaults?.name}
          required
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
        <FieldError messages={state?.errors?.name} />
      </div>
      <div>
        <Label>Slug</Label>
        <Input
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          required
        />
        <FieldError messages={state?.errors?.slug} />
      </div>
      <div>
        <Label>Imagem (opcional)</Label>
        <ImageUploadField name="imageUrl" folder="categorias" defaultValue={defaults?.imageUrl} />
      </div>
      <div>
        <Label>Posição</Label>
        <Input name="position" type="number" min="0" defaultValue={defaults?.position ?? 0} />
      </div>
      <div className="sm:col-span-2">
        <Label>Descrição (opcional)</Label>
        <Textarea name="description" defaultValue={defaults?.description} className="min-h-20" />
      </div>
    </div>
  );
}

function NewCategoryForm({ onDone }: { onDone: () => void }) {
  const [state, formAction] = useActionState(createCategory, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-brand-200 bg-brand-50/40 p-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <CategoryFields state={state} />
      <div className="flex gap-2">
        <SubmitButton size="sm">Criar Categoria</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function EditCategoryRow({ category, onDone }: { category: Category; onDone: () => void }) {
  const boundUpdate = updateCategory.bind(null, category.id);
  const [state, formAction] = useActionState(boundUpdate, undefined);

  return (
    <form action={formAction} className="space-y-3 border-t border-ink-100 bg-ink-50/40 p-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <CategoryFields
        state={state}
        defaults={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          imageUrl: category.imageUrl ?? "",
          position: category.position,
        }}
      />
      <div className="flex gap-2">
        <SubmitButton size="sm">Guardar</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Fechar
        </button>
      </div>
    </form>
  );
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      {creating ? (
        <NewCategoryForm onDone={() => setCreating(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 py-4 text-sm font-semibold text-ink-600 hover:border-brand-500 hover:text-brand-600"
        >
          <Plus size={16} /> Nova Categoria
        </button>
      )}

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        {categories.map((c) => (
          <div key={c.id}>
            <div className="flex items-center justify-between gap-3 border-t border-ink-50 px-5 py-3.5 first:border-t-0">
              <div>
                <p className="font-medium text-ink-900">{c.name}</p>
                <p className="text-xs text-ink-400">
                  /{c.slug} · {c._count.products} produto{c._count.products === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditingId(editingId === c.id ? null : c.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                >
                  {editingId === c.id ? <X size={16} /> : <Pencil size={16} />}
                </button>
                <button
                  type="button"
                  disabled={isPending || c._count.products > 0}
                  title={c._count.products > 0 ? "Remova os produtos desta categoria primeiro" : "Eliminar"}
                  onClick={() => {
                    if (confirm(`Eliminar a categoria "${c.name}"?`)) {
                      startTransition(() => deleteCategory(c.id));
                    }
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {editingId === c.id && <EditCategoryRow category={c} onDone={() => setEditingId(null)} />}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input, Textarea, Select, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { PRODUCT_CONDITION_LABELS, EQUIPMENT_TYPE_LABELS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { AuthFormState } from "@/actions/auth";

type CategoryOption = { id: string; name: string };
type BrandWithModels = {
  id: string;
  name: string;
  machineModels: { id: string; name: string; type: string }[];
};

type ProductFormData = {
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: number;
  compareAtPrice: number | null;
  condition: string;
  oemNumber: string | null;
  crossReferenceNumbers: string[];
  stockQuantity: number;
  weightKg: number | null;
  warrantyMonths: number;
  isFeatured: boolean;
  isActive: boolean;
  images: { url: string; alt: string }[];
  specs: { label: string; value: string }[];
  compatibility: { machineModelId: string }[];
};

export function ProductForm({
  action,
  categories,
  brands,
  product,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  categories: CategoryOption[];
  brands: BrandWithModels[];
  product?: ProductFormData;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [images, setImages] = useState(product?.images ?? [{ url: "", alt: "" }]);
  const [specs, setSpecs] = useState(product?.specs ?? [{ label: "", value: "" }]);
  const [selectedModels, setSelectedModels] = useState<Set<string>>(
    new Set(product?.compatibility.map((c) => c.machineModelId) ?? []),
  );

  function toggleModel(id: string) {
    setSelectedModels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />

      <div className="grid gap-5 rounded-xl border border-ink-100 bg-white p-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="sku">Referência (SKU)</Label>
          <Input id="sku" name="sku" defaultValue={product?.sku} required />
          <FieldError messages={state?.errors?.sku} />
        </div>
        <div>
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            name="name"
            defaultValue={product?.name}
            required
            onChange={(e) => {
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
          <FieldError messages={state?.errors?.name} />
        </div>
        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
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
          <Label htmlFor="categoryId">Categoria</Label>
          <Select id="categoryId" name="categoryId" defaultValue={product?.categoryId} required>
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <FieldError messages={state?.errors?.categoryId} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="shortDescription">Descrição Curta</Label>
          <Input id="shortDescription" name="shortDescription" defaultValue={product?.shortDescription} required />
          <FieldError messages={state?.errors?.shortDescription} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Descrição Completa</Label>
          <Textarea id="description" name="description" defaultValue={product?.description} required className="min-h-36" />
          <FieldError messages={state?.errors?.description} />
        </div>
      </div>

      <div className="grid gap-5 rounded-xl border border-ink-100 bg-white p-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="price">Preço (MTn)</Label>
          <Input id="price" name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required />
          <FieldError messages={state?.errors?.price} />
        </div>
        <div>
          <Label htmlFor="compareAtPrice">Preço Anterior (opcional)</Label>
          <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" min="0" defaultValue={product?.compareAtPrice ?? ""} />
          <FieldError messages={state?.errors?.compareAtPrice} />
        </div>
        <div>
          <Label htmlFor="stockQuantity">Stock</Label>
          <Input id="stockQuantity" name="stockQuantity" type="number" min="0" defaultValue={product?.stockQuantity ?? 0} required />
          <FieldError messages={state?.errors?.stockQuantity} />
        </div>
        <div>
          <Label htmlFor="condition">Condição</Label>
          <Select id="condition" name="condition" defaultValue={product?.condition ?? "NOVO"}>
            {Object.entries(PRODUCT_CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="weightKg">Peso (kg, opcional)</Label>
          <Input id="weightKg" name="weightKg" type="number" step="0.01" min="0" defaultValue={product?.weightKg ?? ""} />
        </div>
        <div>
          <Label htmlFor="warrantyMonths">Garantia (meses)</Label>
          <Input id="warrantyMonths" name="warrantyMonths" type="number" min="0" defaultValue={product?.warrantyMonths ?? 0} />
        </div>
        <div>
          <Label htmlFor="oemNumber">Referência OEM (opcional)</Label>
          <Input id="oemNumber" name="oemNumber" defaultValue={product?.oemNumber ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="crossReferenceNumbers">Referências Cruzadas (separadas por vírgula)</Label>
          <Input
            id="crossReferenceNumbers"
            name="crossReferenceNumbers"
            defaultValue={product?.crossReferenceNumbers.join(", ") ?? ""}
          />
        </div>

        <div className="flex items-center gap-2">
          <input id="isActive" name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} className="h-4 w-4 accent-brand-600" />
          <Label htmlFor="isActive" className="mb-0">
            Produto ativo (visível na loja)
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <input id="isFeatured" name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured ?? false} className="h-4 w-4 accent-brand-600" />
          <Label htmlFor="isFeatured" className="mb-0">
            Produto em destaque
          </Label>
        </div>
      </div>

      <div className="rounded-xl border border-ink-100 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink-900">Imagens</h3>
          <button
            type="button"
            onClick={() => setImages((prev) => [...prev, { url: "", alt: "" }])}
            className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <Plus size={14} /> Adicionar imagem
          </button>
        </div>
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <ImageUploadField name="imageUrl[]" folder="produtos" defaultValue={img.url} className="flex-1" />
              <Input name="imageAlt[]" defaultValue={img.alt} placeholder="Texto alternativo" className="flex-1" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-ink-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-ink-100 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink-900">Especificações Técnicas</h3>
          <button
            type="button"
            onClick={() => setSpecs((prev) => [...prev, { label: "", value: "" }])}
            className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <Plus size={14} /> Adicionar especificação
          </button>
        </div>
        <div className="space-y-3">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <Input name="specLabel[]" defaultValue={s.label} placeholder="Ex: Diâmetro" className="flex-1" />
              <Input name="specValue[]" defaultValue={s.value} placeholder="Ex: 45mm" className="flex-1" />
              <button
                type="button"
                onClick={() => setSpecs((prev) => prev.filter((_, idx) => idx !== i))}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-ink-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-ink-100 bg-white p-5">
        <h3 className="mb-3 text-sm font-bold text-ink-900">Compatibilidade com Máquinas</h3>
        {brands.length === 0 ? (
          <p className="text-sm text-ink-500">Nenhuma marca cadastrada.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <div key={brand.id}>
                <p className="mb-1.5 text-xs font-bold tracking-wide text-ink-500 uppercase">{brand.name}</p>
                <div className="space-y-1">
                  {brand.machineModels.map((model) => (
                    <label key={model.id} className="flex items-center gap-2 text-sm text-ink-700">
                      <input
                        type="checkbox"
                        name="machineModelIds[]"
                        value={model.id}
                        checked={selectedModels.has(model.id)}
                        onChange={() => toggleModel(model.id)}
                        className="h-4 w-4 accent-brand-600"
                      />
                      {model.name}{" "}
                      <span className="text-ink-400">({EQUIPMENT_TYPE_LABELS[model.type as keyof typeof EQUIPMENT_TYPE_LABELS]})</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>{product ? "Guardar Alterações" : "Criar Produto"}</SubmitButton>
        <Button href="/admin/produtos" variant="outline">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

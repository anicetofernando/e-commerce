"use client";

import { useActionState, useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Input, Textarea, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createHeroSlide, deleteHeroSlide, updateHeroSlide } from "@/actions/admin-content";
import type { AuthFormState } from "@/actions/auth";

type HeroSlide = {
  id: string;
  headlineMain: string;
  headlineHighlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  photoUrl: string;
  photoAlt: string;
  photoCompact: boolean;
  position: number;
  isActive: boolean;
};

function SlideFields({ state, slide }: { state: AuthFormState; slide?: HeroSlide }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label>Título Principal</Label>
        <Input name="headlineMain" defaultValue={slide?.headlineMain} required />
        <FieldError messages={state?.errors?.headlineMain} />
      </div>
      <div>
        <Label>Título em Destaque (laranja)</Label>
        <Input name="headlineHighlight" defaultValue={slide?.headlineHighlight} required />
        <FieldError messages={state?.errors?.headlineHighlight} />
      </div>
      <div className="sm:col-span-2">
        <Label>Descrição</Label>
        <Textarea name="description" defaultValue={slide?.description} required className="min-h-20" />
        <FieldError messages={state?.errors?.description} />
      </div>
      <div>
        <Label>Texto do Botão</Label>
        <Input name="ctaLabel" defaultValue={slide?.ctaLabel} required />
        <FieldError messages={state?.errors?.ctaLabel} />
      </div>
      <div>
        <Label>Destino do Botão</Label>
        <Input name="ctaHref" defaultValue={slide?.ctaHref} placeholder="/loja ou /contacto" required />
        <FieldError messages={state?.errors?.ctaHref} />
      </div>
      <div>
        <Label>Imagem (PNG transparente recomendado)</Label>
        <ImageUploadField name="photoUrl" folder="hero" defaultValue={slide?.photoUrl} required />
        <FieldError messages={state?.errors?.photoUrl} />
      </div>
      <div>
        <Label>Texto Alternativo da Imagem</Label>
        <Input name="photoAlt" defaultValue={slide?.photoAlt} required />
        <FieldError messages={state?.errors?.photoAlt} />
      </div>
      <div>
        <Label>Posição (ordem)</Label>
        <Input name="position" type="number" min="0" defaultValue={slide?.position ?? 0} />
      </div>
      <div className="flex items-center gap-4 pt-6">
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" name="photoCompact" defaultChecked={slide?.photoCompact} className="h-4 w-4 accent-brand-600" />
          Imagem mais pequena
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" name="isActive" defaultChecked={slide?.isActive ?? true} className="h-4 w-4 accent-brand-600" />
          Ativo
        </label>
      </div>
    </div>
  );
}

function NewSlideForm({ onDone }: { onDone: () => void }) {
  const [state, formAction] = useActionState(createHeroSlide, undefined);
  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-brand-200 bg-brand-50/40 p-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <SlideFields state={state} />
      <div className="flex gap-2">
        <SubmitButton size="sm">Criar Slide</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function EditSlideForm({ slide, onDone }: { slide: HeroSlide; onDone: () => void }) {
  const boundUpdate = updateHeroSlide.bind(null, slide.id);
  const [state, formAction] = useActionState(boundUpdate, undefined);
  return (
    <form action={formAction} className="space-y-3 border-t border-ink-100 bg-ink-50/40 p-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <SlideFields state={state} slide={slide} />
      <div className="flex gap-2">
        <SubmitButton size="sm">Guardar</SubmitButton>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm font-medium text-ink-500 hover:text-ink-800">
          Fechar
        </button>
      </div>
    </form>
  );
}

export function HeroSlideManager({ slides }: { slides: HeroSlide[] }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      {creating ? (
        <NewSlideForm onDone={() => setCreating(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 py-4 text-sm font-semibold text-ink-600 hover:border-brand-500 hover:text-brand-600"
        >
          <Plus size={16} /> Novo Slide
        </button>
      )}

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        {slides.map((s) => (
          <div key={s.id}>
            <div className="flex items-center justify-between gap-3 border-t border-ink-50 px-5 py-3.5 first:border-t-0">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-ink-50">
                  <Image src={s.photoUrl} alt="" fill sizes="64px" className="object-contain p-1" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-900">
                    {s.headlineMain} <span className="text-brand-600">{s.headlineHighlight}</span>
                  </p>
                  <p className="text-xs text-ink-400">
                    {s.isActive ? "Ativo" : "Inativo"} · posição {s.position}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                >
                  {editingId === s.id ? <X size={16} /> : <Pencil size={16} />}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (confirm("Eliminar este slide?")) startTransition(() => deleteHeroSlide(s.id));
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {editingId === s.id && <EditSlideForm slide={s} onDone={() => setEditingId(null)} />}
          </div>
        ))}
        {slides.length === 0 && <p className="py-10 text-center text-sm text-ink-500">Nenhum slide criado ainda.</p>}
      </div>
    </div>
  );
}

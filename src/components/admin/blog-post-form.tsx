"use client";

import { useActionState, useState } from "react";
import { Input, Textarea, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { slugify } from "@/lib/utils";
import type { AuthFormState } from "@/actions/auth";

type BlogPostData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  author: string;
};

export function BlogPostForm({
  action,
  post,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  post?: BlogPostData;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);

  return (
    <form action={formAction} className="space-y-5">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />

      <div className="grid gap-4 rounded-xl border border-ink-100 bg-white p-5 sm:grid-cols-2">
        <div>
          <Label>Título</Label>
          <Input
            name="title"
            defaultValue={post?.title}
            required
            onChange={(e) => {
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
          <FieldError messages={state?.errors?.title} />
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
          <Label>Autor</Label>
          <Input name="author" defaultValue={post?.author} required />
          <FieldError messages={state?.errors?.author} />
        </div>
        <div>
          <Label>Imagem de Capa</Label>
          <ImageUploadField name="coverImageUrl" folder="blog" defaultValue={post?.coverImageUrl} required />
          <FieldError messages={state?.errors?.coverImageUrl} />
        </div>
        <div className="sm:col-span-2">
          <Label>Resumo</Label>
          <Textarea name="excerpt" defaultValue={post?.excerpt} required className="min-h-20" />
          <FieldError messages={state?.errors?.excerpt} />
        </div>
        <div className="sm:col-span-2">
          <Label>Conteúdo</Label>
          <Textarea name="content" defaultValue={post?.content} required className="min-h-64" />
          <FieldError messages={state?.errors?.content} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>{post ? "Guardar Alterações" : "Publicar Artigo"}</SubmitButton>
        <Button href="/admin/blog" variant="outline">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

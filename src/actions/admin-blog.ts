"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { adminBlogPostSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import type { AuthFormState } from "@/actions/auth";

export async function createBlogPost(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = adminBlogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || slugify(String(formData.get("title") ?? "")),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImageUrl: formData.get("coverImageUrl"),
    author: formData.get("author"),
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: validated.data.slug } });
  if (existing) {
    return { errors: { slug: ["Já existe um artigo com este slug."] } };
  }

  const post = await prisma.blogPost.create({ data: validated.data });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(`/admin/blog/${post.id}`);
}

export async function updateBlogPost(id: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = adminBlogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImageUrl: formData.get("coverImageUrl"),
    author: formData.get("author"),
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const existing = await prisma.blogPost.findFirst({ where: { slug: validated.data.slug, id: { not: id } } });
  if (existing) {
    return { errors: { slug: ["Já existe um artigo com este slug."] } };
  }

  await prisma.blogPost.update({ where: { id }, data: validated.data });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${validated.data.slug}`);
  return { message: "Artigo atualizado com sucesso." };
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

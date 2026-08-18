"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { adminBrandSchema, adminCategorySchema, adminMachineModelSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import type { AuthFormState } from "@/actions/auth";

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function createCategory(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = adminCategorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    description: formData.get("description") || "",
    imageUrl: formData.get("imageUrl") || "",
    position: formData.get("position") || "",
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const existing = await prisma.category.findUnique({ where: { slug: validated.data.slug } });
  if (existing) {
    return { errors: { slug: ["Já existe uma categoria com este slug."] } };
  }

  const data = validated.data;
  await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      position: data.position ? Number(data.position) : 0,
    },
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  return { message: "Categoria criada com sucesso." };
}

export async function updateCategory(id: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = adminCategorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || "",
    imageUrl: formData.get("imageUrl") || "",
    position: formData.get("position") || "",
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const existing = await prisma.category.findFirst({ where: { slug: validated.data.slug, id: { not: id } } });
  if (existing) {
    return { errors: { slug: ["Já existe uma categoria com este slug."] } };
  }

  const data = validated.data;
  await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      position: data.position ? Number(data.position) : 0,
    },
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  return { message: "Categoria atualizada com sucesso." };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error("Não é possível remover uma categoria com produtos associados.");
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export async function createBrand(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = adminBrandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    origin: formData.get("origin") || "",
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const existing = await prisma.brand.findFirst({
    where: { OR: [{ slug: validated.data.slug }, { name: validated.data.name }] },
  });
  if (existing) {
    return { errors: { name: ["Já existe uma marca com este nome ou slug."] } };
  }

  const data = validated.data;
  await prisma.brand.create({ data: { name: data.name, slug: data.slug, origin: data.origin || null } });

  revalidatePath("/admin/marcas");
  revalidatePath("/marcas");
  return { message: "Marca criada com sucesso." };
}

export async function updateBrand(id: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = adminBrandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    origin: formData.get("origin") || "",
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;
  await prisma.brand.update({ where: { id }, data: { name: data.name, slug: data.slug, origin: data.origin || null } });

  revalidatePath("/admin/marcas");
  revalidatePath("/marcas");
  return { message: "Marca atualizada com sucesso." };
}

export async function deleteBrand(id: string) {
  await requireAdmin();
  await prisma.brand.delete({ where: { id } });
  revalidatePath("/admin/marcas");
  revalidatePath("/marcas");
}

// ---------------------------------------------------------------------------
// Machine models
// ---------------------------------------------------------------------------

export async function createMachineModel(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = adminMachineModelSchema.safeParse({
    brandId: formData.get("brandId"),
    name: formData.get("name"),
    type: formData.get("type"),
    yearFrom: formData.get("yearFrom") || "",
    yearTo: formData.get("yearTo") || "",
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;
  await prisma.machineModel.create({
    data: {
      brandId: data.brandId,
      name: data.name,
      type: data.type,
      yearFrom: data.yearFrom ? Number(data.yearFrom) : null,
      yearTo: data.yearTo ? Number(data.yearTo) : null,
    },
  });

  revalidatePath("/admin/marcas");
  revalidatePath("/marcas");
  return { message: "Modelo criado com sucesso." };
}

export async function deleteMachineModel(id: string) {
  await requireAdmin();
  await prisma.machineModel.delete({ where: { id } });
  revalidatePath("/admin/marcas");
  revalidatePath("/marcas");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { adminProductSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import type { AuthFormState } from "@/actions/auth";

function parseProductFormData(formData: FormData) {
  return adminProductSchema.safeParse({
    sku: formData.get("sku"),
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || "",
    condition: formData.get("condition"),
    oemNumber: formData.get("oemNumber") || "",
    crossReferenceNumbers: formData.get("crossReferenceNumbers") || "",
    stockQuantity: formData.get("stockQuantity"),
    weightKg: formData.get("weightKg") || "",
    warrantyMonths: formData.get("warrantyMonths") || "",
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on",
  });
}

function parseArrayFields(formData: FormData) {
  const imageUrls = formData.getAll("imageUrl[]").map(String);
  const imageAlts = formData.getAll("imageAlt[]").map(String);
  const images = imageUrls
    .map((url, i) => ({ url: url.trim(), alt: (imageAlts[i] ?? "").trim() }))
    .filter((img) => img.url);

  const specLabels = formData.getAll("specLabel[]").map(String);
  const specValues = formData.getAll("specValue[]").map(String);
  const specs = specLabels
    .map((label, i) => ({ label: label.trim(), value: (specValues[i] ?? "").trim() }))
    .filter((s) => s.label && s.value);

  const machineModelIds = formData.getAll("machineModelIds[]").map(String).filter(Boolean);

  return { images, specs, machineModelIds };
}

export async function createProduct(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = parseProductFormData(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const existingSku = await prisma.product.findUnique({ where: { sku: validated.data.sku } });
  if (existingSku) {
    return { errors: { sku: ["Já existe um produto com esta referência."] } };
  }
  const existingSlug = await prisma.product.findUnique({ where: { slug: validated.data.slug } });
  if (existingSlug) {
    return { errors: { slug: ["Já existe um produto com este slug."] } };
  }

  const { images, specs, machineModelIds } = parseArrayFields(formData);
  const data = validated.data;

  const product = await prisma.product.create({
    data: {
      sku: data.sku,
      name: data.name,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      categoryId: data.categoryId,
      price: data.price,
      compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
      condition: data.condition,
      oemNumber: data.oemNumber || null,
      crossReferenceNumbers: data.crossReferenceNumbers
        ? data.crossReferenceNumbers.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      stockQuantity: data.stockQuantity,
      weightKg: data.weightKg ? Number(data.weightKg) : null,
      warrantyMonths: data.warrantyMonths ? Number(data.warrantyMonths) : 0,
      isFeatured: data.isFeatured ?? false,
      isActive: data.isActive ?? true,
      images: { create: images.map((img, i) => ({ ...img, position: i })) },
      specs: { create: specs.map((s, i) => ({ ...s, position: i })) },
      compatibility: { create: machineModelIds.map((machineModelId) => ({ machineModelId })) },
    },
  });

  revalidatePath("/admin/produtos");
  redirect(`/admin/produtos/${product.id}`);
}

export async function updateProduct(id: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();

  const validated = parseProductFormData(formData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const existingSku = await prisma.product.findFirst({ where: { sku: validated.data.sku, id: { not: id } } });
  if (existingSku) {
    return { errors: { sku: ["Já existe um produto com esta referência."] } };
  }
  const existingSlug = await prisma.product.findFirst({ where: { slug: validated.data.slug, id: { not: id } } });
  if (existingSlug) {
    return { errors: { slug: ["Já existe um produto com este slug."] } };
  }

  const { images, specs, machineModelIds } = parseArrayFields(formData);
  const data = validated.data;

  await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: {
        sku: data.sku,
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price,
        compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
        condition: data.condition,
        oemNumber: data.oemNumber || null,
        crossReferenceNumbers: data.crossReferenceNumbers
          ? data.crossReferenceNumbers.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        stockQuantity: data.stockQuantity,
        weightKg: data.weightKg ? Number(data.weightKg) : null,
        warrantyMonths: data.warrantyMonths ? Number(data.warrantyMonths) : 0,
        isFeatured: data.isFeatured ?? false,
        isActive: data.isActive ?? true,
      },
    }),
    prisma.productImage.deleteMany({ where: { productId: id } }),
    prisma.productSpec.deleteMany({ where: { productId: id } }),
    prisma.productCompatibility.deleteMany({ where: { productId: id } }),
  ]);

  await prisma.$transaction([
    ...images.map((img, i) => prisma.productImage.create({ data: { ...img, position: i, productId: id } })),
    ...specs.map((s, i) => prisma.productSpec.create({ data: { ...s, position: i, productId: id } })),
    ...machineModelIds.map((machineModelId) => prisma.productCompatibility.create({ data: { productId: id, machineModelId } })),
  ]);

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);
  revalidatePath(`/produto/${data.slug}`);
  return { message: "Produto atualizado com sucesso." };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/produtos");
}

export async function toggleProductActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/produtos");
}

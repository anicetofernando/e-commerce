"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { adminHeroSlideSchema, adminPromoBannerSchema, adminPartnerLogoSchema } from "@/lib/validation";
import type { AuthFormState } from "@/actions/auth";

// ---------------------------------------------------------------------------
// Hero slides
// ---------------------------------------------------------------------------

function parseHeroSlideForm(formData: FormData) {
  return adminHeroSlideSchema.safeParse({
    headlineMain: formData.get("headlineMain"),
    headlineHighlight: formData.get("headlineHighlight"),
    description: formData.get("description"),
    ctaLabel: formData.get("ctaLabel"),
    ctaHref: formData.get("ctaHref"),
    photoUrl: formData.get("photoUrl"),
    photoAlt: formData.get("photoAlt"),
    photoCompact: formData.get("photoCompact") === "on",
    position: formData.get("position") || "",
    isActive: formData.get("isActive") === "on",
  });
}

export async function createHeroSlide(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();
  const validated = parseHeroSlideForm(formData);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const data = validated.data;
  await prisma.heroSlide.create({
    data: {
      ...data,
      position: data.position ? Number(data.position) : 0,
      photoCompact: data.photoCompact ?? false,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/");
  return { message: "Slide criado com sucesso." };
}

export async function updateHeroSlide(id: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();
  const validated = parseHeroSlideForm(formData);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const data = validated.data;
  await prisma.heroSlide.update({
    where: { id },
    data: {
      ...data,
      position: data.position ? Number(data.position) : 0,
      photoCompact: data.photoCompact ?? false,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/");
  return { message: "Slide atualizado com sucesso." };
}

export async function deleteHeroSlide(id: string) {
  await requireAdmin();
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/admin/hero");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Promo banners
// ---------------------------------------------------------------------------

function parsePromoBannerForm(formData: FormData) {
  return adminPromoBannerSchema.safeParse({
    title: formData.get("title"),
    badge: formData.get("badge"),
    description: formData.get("description"),
    href: formData.get("href"),
    icon: formData.get("icon"),
    gradient: formData.get("gradient"),
    position: formData.get("position") || "",
    isActive: formData.get("isActive") === "on",
  });
}

export async function createPromoBanner(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();
  const validated = parsePromoBannerForm(formData);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const data = validated.data;
  await prisma.promoBanner.create({
    data: { ...data, position: data.position ? Number(data.position) : 0, isActive: data.isActive ?? true },
  });

  revalidatePath("/admin/promocoes");
  revalidatePath("/");
  return { message: "Banner criado com sucesso." };
}

export async function updatePromoBanner(id: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();
  const validated = parsePromoBannerForm(formData);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const data = validated.data;
  await prisma.promoBanner.update({
    where: { id },
    data: { ...data, position: data.position ? Number(data.position) : 0, isActive: data.isActive ?? true },
  });

  revalidatePath("/admin/promocoes");
  revalidatePath("/");
  return { message: "Banner atualizado com sucesso." };
}

export async function deletePromoBanner(id: string) {
  await requireAdmin();
  await prisma.promoBanner.delete({ where: { id } });
  revalidatePath("/admin/promocoes");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Partner logos
// ---------------------------------------------------------------------------

function parsePartnerLogoForm(formData: FormData) {
  return adminPartnerLogoSchema.safeParse({
    name: formData.get("name"),
    imageUrl: formData.get("imageUrl"),
    position: formData.get("position") || "",
    isActive: formData.get("isActive") === "on",
  });
}

export async function createPartnerLogo(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();
  const validated = parsePartnerLogoForm(formData);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const data = validated.data;
  await prisma.partnerLogo.create({
    data: { ...data, position: data.position ? Number(data.position) : 0, isActive: data.isActive ?? true },
  });

  revalidatePath("/admin/parceiros");
  revalidatePath("/");
  return { message: "Parceiro criado com sucesso." };
}

export async function updatePartnerLogo(id: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();
  const validated = parsePartnerLogoForm(formData);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const data = validated.data;
  await prisma.partnerLogo.update({
    where: { id },
    data: { ...data, position: data.position ? Number(data.position) : 0, isActive: data.isActive ?? true },
  });

  revalidatePath("/admin/parceiros");
  revalidatePath("/");
  return { message: "Parceiro atualizado com sucesso." };
}

export async function deletePartnerLogo(id: string) {
  await requireAdmin();
  await prisma.partnerLogo.delete({ where: { id } });
  revalidatePath("/admin/parceiros");
  revalidatePath("/");
}

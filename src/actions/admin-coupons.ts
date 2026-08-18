"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { adminCouponSchema } from "@/lib/validation";
import type { AuthFormState } from "@/actions/auth";

function parseCouponForm(formData: FormData) {
  return adminCouponSchema.safeParse({
    code: formData.get("code"),
    type: formData.get("type"),
    value: formData.get("value"),
    minOrderValue: formData.get("minOrderValue") || "",
    maxUses: formData.get("maxUses") || "",
    expiresAt: formData.get("expiresAt") || "",
    isActive: formData.get("isActive") === "on",
  });
}

export async function createCoupon(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();
  const validated = parseCouponForm(formData);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const data = validated.data;
  const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
  if (existing) {
    return { errors: { code: ["Já existe um cupão com este código."] } };
  }

  await prisma.coupon.create({
    data: {
      code: data.code,
      type: data.type,
      value: data.value,
      minOrderValue: data.minOrderValue ? data.minOrderValue : null,
      maxUses: data.maxUses ? data.maxUses : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/admin/cupoes");
  return { message: "Cupão criado com sucesso." };
}

export async function updateCoupon(id: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  await requireAdmin();
  const validated = parseCouponForm(formData);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  const data = validated.data;
  const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
  if (existing && existing.id !== id) {
    return { errors: { code: ["Já existe um cupão com este código."] } };
  }

  await prisma.coupon.update({
    where: { id },
    data: {
      code: data.code,
      type: data.type,
      value: data.value,
      minOrderValue: data.minOrderValue ? data.minOrderValue : null,
      maxUses: data.maxUses ? data.maxUses : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/admin/cupoes");
  return { message: "Cupão atualizado com sucesso." };
}

export async function deleteCoupon(id: string) {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/cupoes");
}

export async function toggleCouponActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.coupon.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/cupoes");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { addressSchema } from "@/lib/validation";
import type { AuthFormState } from "@/actions/auth";

export async function updateProfile(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const taxId = String(formData.get("taxId") ?? "").trim();

  if (name.length < 2) {
    return { errors: { name: ["Introduza um nome válido."] } };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, phone: phone || null, company: company || null, taxId: taxId || null },
  });

  revalidatePath("/conta/perfil");
  return { message: "Perfil atualizado com sucesso." };
}

export async function addAddress(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const validated = addressSchema.safeParse({
    label: formData.get("label"),
    recipientName: formData.get("recipientName"),
    phone: formData.get("phone"),
    province: formData.get("province"),
    city: formData.get("city"),
    neighborhood: formData.get("neighborhood"),
    street: formData.get("street"),
    reference: formData.get("reference"),
    isDefault: formData.get("isDefault") === "on",
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;

  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
  }

  await prisma.address.create({
    data: {
      userId: user.id,
      label: data.label,
      recipientName: data.recipientName,
      phone: data.phone,
      province: data.province,
      city: data.city,
      neighborhood: data.neighborhood,
      street: data.street,
      reference: data.reference || null,
      isDefault: data.isDefault ?? false,
    },
  });

  revalidatePath("/conta/enderecos");
  return { message: "Endereço adicionado com sucesso." };
}

export async function removeAddress(addressId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  await prisma.address.deleteMany({ where: { id: addressId, userId: user.id } });
  revalidatePath("/conta/enderecos");
}

export async function setDefaultAddress(addressId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } }),
    prisma.address.updateMany({ where: { id: addressId, userId: user.id }, data: { isDefault: true } }),
  ]);

  revalidatePath("/conta/enderecos");
}

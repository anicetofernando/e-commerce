"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { loginSchema, signupSchema } from "@/lib/validation";

export type AuthFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

export async function signup(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, phone, company, password } = validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ["Já existe uma conta registada com este email."] } };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phone: phone || null,
      company: company || null,
    },
  });

  await createSession(user.id);
  redirect("/conta");
}

export async function login(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: "Email ou palavra-passe incorretos." };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return { message: "Email ou palavra-passe incorretos." };
  }

  await createSession(user.id);
  redirect("/conta");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { loginSchema, signupSchema, requestPasswordResetSchema, resetPasswordSchema } from "@/lib/validation";
import { sendEmail, getSiteUrl } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

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
  redirect(user.role === "ADMIN" ? "/admin" : "/conta");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

const GENERIC_RESET_MESSAGE = "Se existir uma conta com este email, enviámos um link de recuperação.";

export async function requestPasswordReset(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = requestPasswordResetSchema.safeParse({ email: formData.get("email") });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({ where: { email: validated.data.email } });

  // Always respond the same way whether the account exists or not, so the
  // form can't be used to enumerate registered emails.
  if (!user) {
    return { message: GENERIC_RESET_MESSAGE };
  }

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
  });

  const resetUrl = `${getSiteUrl()}/recuperar-senha/${token}`;
  await sendEmail({ to: user.email, subject: "Recuperação de Palavra-passe", html: passwordResetEmail(resetUrl) });

  return { message: GENERIC_RESET_MESSAGE };
}

export async function resetPassword(token: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = resetPasswordSchema.safeParse({ password: formData.get("password") });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({ where: { resetToken: token } });
  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt.getTime() < Date.now()) {
    return { message: "Este link é inválido ou já expirou. Solicite um novo link de recuperação." };
  }

  const passwordHash = await bcrypt.hash(validated.data.password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiresAt: null },
  });

  await createSession(user.id);
  redirect(user.role === "ADMIN" ? "/admin" : "/conta");
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Recuperar Palavra-passe" };

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/conta");

  return (
    <AuthShell title="Recuperar Palavra-passe" subtitle="Indique o seu email e enviaremos um link para repor a password.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}

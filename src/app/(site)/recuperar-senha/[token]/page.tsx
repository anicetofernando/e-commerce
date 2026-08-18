import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Repor Palavra-passe" };

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/conta");

  const { token } = await params;

  return (
    <AuthShell title="Repor Palavra-passe" subtitle="Escolha uma nova palavra-passe para a sua conta.">
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/conta");

  return (
    <AuthShell title="Aceder à Conta" subtitle="Entre para consultar as suas encomendas e endereços.">
      <LoginForm />
    </AuthShell>
  );
}

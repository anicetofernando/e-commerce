import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Criar Conta" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/conta");

  return (
    <AuthShell title="Criar Conta" subtitle="Registe-se para acompanhar as suas encomendas e favoritos.">
      <SignupForm />
    </AuthShell>
  );
}

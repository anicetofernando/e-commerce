"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/actions/auth";
import { Input, Label, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm() {
  const [state, action] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-4">
      {state?.message && <FormAlert message={state.message} tone="error" />}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="o.seu@email.com" required autoFocus />
      </div>

      <div>
        <Label htmlFor="password">Palavra-passe</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
      </div>

      <SubmitButton className="w-full justify-center" size="lg">
        Entrar
      </SubmitButton>

      <p className="text-center text-sm text-ink-500">
        Ainda não tem conta?{" "}
        <Link href="/registar" className="font-semibold text-brand-600 hover:underline">
          Criar Conta
        </Link>
      </p>
    </form>
  );
}

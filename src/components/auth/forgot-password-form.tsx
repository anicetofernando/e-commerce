"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth";
import { Input, Label, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, undefined);

  if (state?.message && !state.errors) {
    return <FormAlert message={state.message} tone="success" />;
  }

  return (
    <form action={action} className="space-y-4">
      {state?.message && <FormAlert message={state.message} tone="error" />}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="o.seu@email.com" required autoFocus />
      </div>

      <SubmitButton className="w-full justify-center" size="lg">
        Enviar Link de Recuperação
      </SubmitButton>

      <p className="text-center text-sm text-ink-500">
        Lembrou-se da password?{" "}
        <Link href="/entrar" className="font-semibold text-brand-600 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/actions/auth";
import { Input, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function SignupForm() {
  const [state, action] = useActionState(signup, undefined);

  return (
    <form action={action} className="space-y-4">
      {state?.message && <FormAlert message={state.message} tone="error" />}

      <div>
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" name="name" placeholder="O seu nome" required autoFocus />
        <FieldError messages={state?.errors?.name} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="o.seu@email.com" required />
        <FieldError messages={state?.errors?.email} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" name="phone" placeholder="+258 8..." />
          <FieldError messages={state?.errors?.phone} />
        </div>
        <div>
          <Label htmlFor="company">Empresa (opcional)</Label>
          <Input id="company" name="company" placeholder="Nome da empresa" />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Palavra-passe</Label>
        <Input id="password" name="password" type="password" placeholder="Mínimo 8 caracteres" required />
        <FieldError messages={state?.errors?.password} />
      </div>

      <SubmitButton className="w-full justify-center" size="lg">
        Criar Conta
      </SubmitButton>

      <p className="text-center text-sm text-ink-500">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-brand-600 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}

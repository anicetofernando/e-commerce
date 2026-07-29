"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/account";
import { Input, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function ProfileForm({
  name,
  email,
  phone,
  company,
  taxId,
}: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  taxId?: string | null;
}) {
  const [state, action] = useActionState(updateProfile, undefined);

  return (
    <form action={action} className="grid gap-4 rounded-lg border border-ink-100 bg-white p-5 sm:grid-cols-2">
      {state?.message && (
        <div className="sm:col-span-2">
          <FormAlert message={state.message} tone="success" />
        </div>
      )}

      <div>
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" name="name" defaultValue={name} required />
        <FieldError messages={state?.errors?.name} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue={email} disabled />
      </div>
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" name="phone" defaultValue={phone ?? ""} />
      </div>
      <div>
        <Label htmlFor="company">Empresa</Label>
        <Input id="company" name="company" defaultValue={company ?? ""} />
      </div>
      <div>
        <Label htmlFor="taxId">NUIT</Label>
        <Input id="taxId" name="taxId" defaultValue={taxId ?? ""} />
      </div>

      <div className="sm:col-span-2">
        <SubmitButton>Guardar Alterações</SubmitButton>
      </div>
    </form>
  );
}

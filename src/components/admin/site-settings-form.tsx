"use client";

import { useActionState } from "react";
import { Input, Textarea, Label, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateSiteSettings } from "@/actions/admin-settings";

type Settings = {
  companyName: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
};

export function SiteSettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction] = useActionState(updateSiteSettings, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-5 rounded-xl border border-ink-100 bg-white p-6">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />

      <div>
        <Label>Nome da Empresa</Label>
        <Input name="companyName" defaultValue={settings.companyName} required />
        <FieldError messages={state?.errors?.companyName} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Telefone Principal</Label>
          <Input name="phonePrimary" defaultValue={settings.phonePrimary} required />
          <FieldError messages={state?.errors?.phonePrimary} />
        </div>
        <div>
          <Label>Telefone Secundário</Label>
          <Input name="phoneSecondary" defaultValue={settings.phoneSecondary} />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input name="whatsapp" defaultValue={settings.whatsapp} placeholder={settings.phonePrimary} />
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" type="email" defaultValue={settings.email} required />
          <FieldError messages={state?.errors?.email} />
        </div>
      </div>

      <div>
        <Label>Morada</Label>
        <Textarea name="address" defaultValue={settings.address} required className="min-h-20" />
        <FieldError messages={state?.errors?.address} />
      </div>

      <div>
        <Label>Horário de Funcionamento</Label>
        <Input name="hours" defaultValue={settings.hours} required />
        <FieldError messages={state?.errors?.hours} />
      </div>

      <SubmitButton>Guardar Definições</SubmitButton>
    </form>
  );
}

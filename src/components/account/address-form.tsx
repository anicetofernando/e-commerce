"use client";

import { useActionState, useRef, useEffect } from "react";
import { addAddress } from "@/actions/account";
import { Input, Label, Select, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { PROVINCE_OPTIONS } from "@/lib/constants";

export function AddressForm() {
  const [state, action] = useActionState(addAddress, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="grid gap-4 rounded-lg border border-ink-100 bg-white p-5 sm:grid-cols-2">
      {state?.message && (
        <div className="sm:col-span-2">
          <FormAlert message={state.message} tone="success" />
        </div>
      )}

      <div>
        <Label htmlFor="label">Nome do Endereço</Label>
        <Input id="label" name="label" placeholder="Ex: Escritório, Armazém..." required />
        <FieldError messages={state?.errors?.label} />
      </div>
      <div>
        <Label htmlFor="recipientName">Nome do Destinatário</Label>
        <Input id="recipientName" name="recipientName" required />
        <FieldError messages={state?.errors?.recipientName} />
      </div>
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" name="phone" required />
        <FieldError messages={state?.errors?.phone} />
      </div>
      <div>
        <Label htmlFor="province">Província</Label>
        <Select id="province" name="province" required defaultValue="">
          <option value="" disabled>Selecione</option>
          {PROVINCE_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </Select>
        <FieldError messages={state?.errors?.province} />
      </div>
      <div>
        <Label htmlFor="city">Cidade / Distrito</Label>
        <Input id="city" name="city" required />
        <FieldError messages={state?.errors?.city} />
      </div>
      <div>
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input id="neighborhood" name="neighborhood" required />
        <FieldError messages={state?.errors?.neighborhood} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="street">Rua / Avenida e Número</Label>
        <Input id="street" name="street" required />
        <FieldError messages={state?.errors?.street} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="reference">Ponto de Referência (opcional)</Label>
        <Input id="reference" name="reference" />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-600 sm:col-span-2">
        <input type="checkbox" name="isDefault" className="accent-brand-600" />
        Definir como endereço principal
      </label>

      <div className="sm:col-span-2">
        <SubmitButton>Guardar Endereço</SubmitButton>
      </div>
    </form>
  );
}

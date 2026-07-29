"use client";

import { useActionState, useRef, useEffect } from "react";
import { submitContactForm } from "@/actions/contact";
import { Input, Label, Textarea, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function ContactForm() {
  const [state, action] = useActionState(submitContactForm, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      {state?.message && <FormAlert message={state.message} tone="success" />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" required />
          <FieldError messages={state?.errors?.name} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
          <FieldError messages={state?.errors?.email} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input id="phone" name="phone" />
        </div>
        <div>
          <Label htmlFor="subject">Assunto</Label>
          <Input id="subject" name="subject" placeholder="Ex: Peça para Komatsu PC200-8" required />
          <FieldError messages={state?.errors?.subject} />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Mensagem</Label>
        <Textarea id="message" name="message" rows={5} placeholder="Descreva a peça ou dúvida, incluindo marca e modelo da máquina, se aplicável." required />
        <FieldError messages={state?.errors?.message} />
      </div>

      <SubmitButton size="lg">Enviar Mensagem</SubmitButton>
    </form>
  );
}

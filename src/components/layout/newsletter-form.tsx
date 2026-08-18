"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { subscribeNewsletter } from "@/actions/newsletter";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletter, undefined);

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold tracking-wide text-ink-900 uppercase">Newsletter</h3>
      <p className="mb-3 text-sm text-ink-500">Receba novidades e promoções por email.</p>
      <form action={formAction} className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="O seu email"
          className="w-full min-w-0 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <SubmitButton size="sm" className="shrink-0 px-3">
          <Send size={15} />
        </SubmitButton>
      </form>
      {state?.message && <p className="mt-2 text-xs text-green-600">{state.message}</p>}
      {state?.errors?.email && <p className="mt-2 text-xs text-red-600">{state.errors.email[0]}</p>}
    </div>
  );
}

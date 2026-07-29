"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { subscribeNewsletter } from "@/actions/contact";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewsletterForm() {
  const [state, action] = useActionState(subscribeNewsletter, undefined);

  return (
    <form action={action} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="O seu email"
          className="w-full rounded-md border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-ink-300 outline-none focus:border-brand-500"
        />
        <SubmitButton size="md" className="shrink-0 px-3.5">
          <Send size={16} />
        </SubmitButton>
      </div>
      {state?.message && <p className="text-xs text-brand-400">{state.message}</p>}
      {state?.errors?.email && <p className="text-xs text-red-400">{state.errors.email[0]}</p>}
    </form>
  );
}

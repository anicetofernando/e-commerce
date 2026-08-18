"use client";

import { useState, useTransition } from "react";
import { MailWarning } from "lucide-react";
import { resendVerificationEmail } from "@/actions/auth";

export function EmailVerifyBanner() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | undefined>();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <span className="flex items-center gap-2">
        <MailWarning size={16} className="shrink-0" />
        {message ?? "O seu email ainda não foi confirmado."}
      </span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await resendVerificationEmail();
            setMessage(result.message);
          });
        }}
        className="shrink-0 font-semibold text-amber-900 underline hover:no-underline disabled:opacity-50"
      >
        {isPending ? "A enviar..." : "Reenviar email de confirmação"}
      </button>
    </div>
  );
}

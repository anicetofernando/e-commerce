"use client";

import { useActionState } from "react";
import { resetPassword } from "@/actions/auth";
import { Input, Label, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function ResetPasswordForm({ token }: { token: string }) {
  const boundReset = resetPassword.bind(null, token);
  const [state, action] = useActionState(boundReset, undefined);

  return (
    <form action={action} className="space-y-4">
      {state?.message && <FormAlert message={state.message} tone="error" />}

      <div>
        <Label htmlFor="password">Nova Palavra-passe</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required autoFocus />
        {state?.errors?.password && <p className="mt-1.5 text-sm text-red-600">{state.errors.password[0]}</p>}
      </div>

      <SubmitButton className="w-full justify-center" size="lg">
        Repor Palavra-passe
      </SubmitButton>
    </form>
  );
}

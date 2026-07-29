"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  pendingLabel,
  className,
  variant,
  size,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={cn(className)} variant={variant} size={size}>
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending ? (pendingLabel ?? "A processar...") : children}
    </Button>
  );
}

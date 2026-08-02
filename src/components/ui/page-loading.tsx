import { Loader2 } from "lucide-react";

export function PageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 size={28} className="animate-spin text-brand-600" />
    </div>
  );
}

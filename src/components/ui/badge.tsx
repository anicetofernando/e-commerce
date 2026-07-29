import { cn } from "@/lib/utils";

type BadgeTone = "brand" | "ink" | "green" | "amber" | "red" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-600/20",
  ink: "bg-ink-100 text-ink-800 ring-ink-500/20",
  green: "bg-green-50 text-green-700 ring-green-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  neutral: "bg-gray-100 text-gray-700 ring-gray-500/20",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-md border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-28 resize-y", className)} {...props} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldBase, "appearance-none bg-no-repeat pr-9", className)} {...props} />;
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-ink-800", className)} {...props} />;
}

export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1.5 text-sm text-red-600">
      {messages[0]}
    </p>
  );
}

export function FormAlert({ message, tone = "info" }: { message?: string; tone?: "info" | "error" | "success" }) {
  if (!message) return null;
  const styles = {
    info: "bg-blue-50 text-blue-700 border-blue-200",
    error: "bg-red-50 text-red-700 border-red-200",
    success: "bg-green-50 text-green-700 border-green-200",
  } as const;
  return <div className={cn("rounded-md border px-4 py-3 text-sm", styles[tone])}>{message}</div>;
}

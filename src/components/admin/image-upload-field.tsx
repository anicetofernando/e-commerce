"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { uploadAdminImage } from "@/actions/admin-upload";

export function ImageUploadField({
  name,
  folder,
  defaultValue,
  placeholder,
  className,
  required,
}: {
  name: string;
  folder: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadAdminImage(folder, formData);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      setValue(result.url);
    }
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className={className}>
      <div className="flex gap-2">
        <Input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? "URL da imagem, ou envie um ficheiro"}
          className="flex-1"
          required={required}
        />
        <label
          className={cn(
            "flex h-[42px] w-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-ink-200 text-ink-500 hover:border-brand-500 hover:text-brand-600",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryNavData } from "@/lib/types";

export function CategoriesMenu({ categories }: { categories: CategoryNavData[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0 self-stretch">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-full items-center gap-2 bg-white px-4 text-ink-900 hover:bg-ink-50"
      >
        <LayoutGrid size={14} />
        Categorias
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      <div
        className={cn(
          "absolute top-full left-0 z-50 mt-1 w-[520px] origin-top-left rounded-lg border border-ink-100 bg-white p-3 text-sm font-normal shadow-xl transition-all duration-150",
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
        )}
      >
        <div className="grid grid-cols-2 gap-1">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/loja?categoria=${c.slug}`}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

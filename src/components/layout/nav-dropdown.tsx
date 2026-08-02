"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavDropdown({
  label,
  icon,
  buttonClassName,
  panelClassName,
  children,
}: {
  label: string;
  icon: ReactNode;
  buttonClassName?: string;
  panelClassName?: string;
  children: ReactNode;
}) {
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
        className={cn(
          "flex h-full items-center gap-1.5 rounded-md px-3 text-white/90 hover:bg-white/10 hover:text-white",
          buttonClassName,
        )}
      >
        {icon}
        {label}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      <div
        onClick={() => setOpen(false)}
        className={cn(
          "absolute top-full left-0 z-50 mt-1 origin-top-left rounded-lg border border-ink-100 bg-white p-3 text-sm font-normal text-ink-700 shadow-xl transition-all duration-150",
          panelClassName,
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

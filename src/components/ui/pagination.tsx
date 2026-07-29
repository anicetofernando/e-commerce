import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const items: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Paginação">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-ink-200 text-ink-600 hover:border-brand-500 hover:text-brand-600",
          page === 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      {items.map((item, idx) =>
        item === "ellipsis" ? (
          <span key={`e-${idx}`} className="px-2 text-ink-400">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref(item)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium",
              item === page
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-ink-200 text-ink-700 hover:border-brand-500 hover:text-brand-600",
            )}
          >
            {item}
          </Link>
        ),
      )}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-ink-200 text-ink-600 hover:border-brand-500 hover:text-brand-600",
          page === totalPages && "pointer-events-none opacity-40",
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}

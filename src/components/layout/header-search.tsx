"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

function SearchFormShell({ variant, q }: { variant: "desktop" | "mobile"; q: string }) {
  if (variant === "mobile") {
    return (
      <form action="/loja" method="GET" className="border-t border-ink-100 px-4 py-3 lg:hidden">
        <div className="relative">
          <input
            type="text"
            name="q"
            defaultValue={q}
            key={q}
            placeholder="Pesquisar peça ou referência..."
            className="w-full rounded-md border border-ink-200 bg-ink-50 py-2.5 pr-4 pl-11 text-sm outline-none focus:border-brand-500 focus:bg-white"
          />
          <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-400" />
        </div>
      </form>
    );
  }

  return (
    <form action="/loja" method="GET" className="hidden flex-1 lg:flex">
      <div className="relative flex-1">
        <input
          type="text"
          name="q"
          defaultValue={q}
          key={q}
          placeholder="Pesquisar por peça, referência OEM ou nº de série..."
          className="h-11 w-full rounded-l-md border border-r-0 border-ink-200 bg-white py-2.5 pr-4 pl-11 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-400" />
      </div>
      <button
        type="submit"
        className="h-11 shrink-0 rounded-r-md bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Pesquisar
      </button>
    </form>
  );
}

function HeaderSearchInner({ variant }: { variant: "desktop" | "mobile" }) {
  const searchParams = useSearchParams();
  return <SearchFormShell variant={variant} q={searchParams.get("q") ?? ""} />;
}

export function HeaderSearch({ variant }: { variant: "desktop" | "mobile" }) {
  return (
    <Suspense fallback={<SearchFormShell variant={variant} q="" />}>
      <HeaderSearchInner variant={variant} />
    </Suspense>
  );
}

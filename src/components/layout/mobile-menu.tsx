"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Wrench, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_INFO } from "@/lib/constants";
import type { CategoryNavData } from "@/lib/types";

export function MobileMenu({ categories }: { categories: CategoryNavData[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-ink-700 hover:bg-ink-100 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "visible" : "invisible delay-300",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink-950/50 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute top-0 left-0 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <span className="text-lg font-bold text-ink-900">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-2">
            <Link
              href="/marcas"
              onClick={() => setOpen(false)}
              className="mx-3 my-2 flex items-center gap-2 rounded-md bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700"
            >
              <Wrench size={16} />
              Encontrar Peças por Máquina
            </Link>

            <p className="px-5 pt-3 pb-1 text-xs font-bold tracking-wide text-ink-400 uppercase">Categorias</p>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/loja?categoria=${c.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-2.5 text-sm text-ink-700 hover:bg-ink-50 hover:text-brand-600"
              >
                {c.name}
                <ChevronRight size={15} className="text-ink-300" />
              </Link>
            ))}

            <div className="mt-3 border-t border-ink-100 px-5 pt-3">
              <Link href="/sobre" onClick={() => setOpen(false)} className="block py-2 text-sm text-ink-700 hover:text-brand-600">
                Sobre Nós
              </Link>
              <Link href="/contacto" onClick={() => setOpen(false)} className="block py-2 text-sm text-ink-700 hover:text-brand-600">
                Contacto
              </Link>
              <Link href="/blog" onClick={() => setOpen(false)} className="block py-2 text-sm text-ink-700 hover:text-brand-600">
                Blog Técnico
              </Link>
              <Link href="/faq" onClick={() => setOpen(false)} className="block py-2 text-sm text-ink-700 hover:text-brand-600">
                Perguntas Frequentes
              </Link>
            </div>
          </nav>

          <div className="border-t border-ink-100 px-5 py-4">
            <a href={`tel:${CONTACT_INFO.phonePrimary}`} className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Phone size={16} className="text-brand-600" />
              {CONTACT_INFO.phonePrimary}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}

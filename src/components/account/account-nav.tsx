"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, MapPin, Heart, UserCircle, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/conta", label: "Visão Geral", icon: LayoutGrid },
  { href: "/conta/pedidos", label: "Os Meus Pedidos", icon: Package },
  { href: "/conta/enderecos", label: "Endereços", icon: MapPin },
  { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/conta/perfil", label: "Perfil", icon: UserCircle },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 rounded-lg border border-ink-100 bg-white p-3">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium",
              active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50",
            )}
          >
            <Icon size={17} />
            {link.label}
          </Link>
        );
      })}
      <form action={logout}>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={17} />
          Terminar Sessão
        </button>
      </form>
    </nav>
  );
}

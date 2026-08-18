"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  LayoutGrid,
  Wrench,
  ShoppingCart,
  Users,
  Newspaper,
  Star,
  Mail,
  Settings,
  ExternalLink,
  GalleryHorizontal,
  Megaphone,
  Handshake,
  ClipboardList,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: null,
    items: [{ href: "/admin", label: "Painel", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/produtos", label: "Produtos", icon: Package },
      { href: "/admin/categorias", label: "Categorias", icon: LayoutGrid },
      { href: "/admin/marcas", label: "Marcas e Modelos", icon: Wrench },
      { href: "/admin/precos", label: "Tabela de Preços", icon: Calculator },
    ],
  },
  {
    label: "Vendas",
    items: [
      { href: "/admin/encomendas", label: "Encomendas", icon: ShoppingCart },
      { href: "/admin/clientes", label: "Clientes", icon: Users },
      { href: "/admin/avaliacoes", label: "Avaliações", icon: Star, countKey: "reviews" as const },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      { href: "/admin/hero", label: "Hero (Início)", icon: GalleryHorizontal },
      { href: "/admin/promocoes", label: "Promoções", icon: Megaphone },
      { href: "/admin/parceiros", label: "Parceiros", icon: Handshake },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/admin/questionario", label: "Consulta ao Cliente", icon: ClipboardList },
      { href: "/admin/mensagens", label: "Mensagens", icon: Mail, countKey: "messages" as const },
      { href: "/admin/definicoes", label: "Definições", icon: Settings },
    ],
  },
];

export function AdminSidebar({ counts }: { counts: { messages: number; reviews: number } }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-ink-100 bg-white">
      <div className="flex h-16 items-center border-b border-ink-100 px-5">
        <Link href="/admin" className="text-lg font-black tracking-tight text-ink-900">
          Albimaq <span className="text-brand-600">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="mb-1 px-3 text-[11px] font-bold tracking-wide text-ink-400 uppercase">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = "exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const badge = "countKey" in item && item.countKey ? counts[item.countKey] : 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon size={17} />
                      {item.label}
                    </span>
                    {badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-ink-100 p-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50 hover:text-ink-900"
        >
          <ExternalLink size={17} />
          Voltar ao Site
        </Link>
      </div>
    </aside>
  );
}

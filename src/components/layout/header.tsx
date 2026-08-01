import Link from "next/link";
import { Search, User, Heart, Phone, Mail, Wrench, BookOpen } from "lucide-react";
import { getCategories } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { CONTACT_INFO } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { CartButton } from "@/components/layout/cart-button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { CategoriesMenu } from "@/components/layout/categories-menu";
import { Logo } from "@/components/layout/logo";

export async function Header() {
  const [categories, user] = await Promise.all([getCategories(), getCurrentUser()]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="hidden border-b border-ink-100 bg-white text-ink-600 lg:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href={`tel:${CONTACT_INFO.phonePrimary}`} className="flex items-center gap-1.5 hover:text-brand-700">
              <Phone size={13} /> {CONTACT_INFO.phonePrimary}
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-1.5 hover:text-brand-700">
              <Mail size={13} /> {CONTACT_INFO.email}
            </a>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/sobre" className="hover:text-brand-700">Sobre Nós</Link>
            <Link href="/contacto" className="hover:text-brand-700">Contacto</Link>
            <Link href="/blog" className="hover:text-brand-700">Blog Técnico</Link>
            <Link href="/conta/pedidos" className="hover:text-brand-700">Rastrear Encomenda</Link>
          </div>
        </Container>
      </div>

      <Container className="flex h-20 items-center gap-4 lg:gap-8">
        <MobileMenu categories={categories} />

        <Logo />

        <form action="/loja" method="GET" className="hidden flex-1 lg:flex">
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
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

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link
            href={user ? "/conta" : "/entrar"}
            className="hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink-700 hover:bg-ink-100 sm:flex"
          >
            <User size={20} />
            {user ? `Olá, ${user.name.split(" ")[0]}` : "Entrar"}
          </Link>
          <Link
            href={user ? "/conta" : "/entrar"}
            className="flex h-10 w-10 items-center justify-center rounded-md text-ink-700 hover:bg-ink-100 sm:hidden"
            aria-label="Conta"
          >
            <User size={22} />
          </Link>
          <Link
            href="/conta/favoritos"
            className="hidden h-10 w-10 items-center justify-center rounded-md text-ink-700 hover:bg-ink-100 sm:flex"
            aria-label="Favoritos"
          >
            <Heart size={22} />
          </Link>
          <CartButton />
        </div>
      </Container>

      <form action="/loja" method="GET" className="border-t border-ink-100 px-4 py-3 lg:hidden">
        <div className="relative">
          <input
            type="text"
            name="q"
            placeholder="Pesquisar peça ou referência..."
            className="w-full rounded-md border border-ink-200 bg-ink-50 py-2.5 pr-4 pl-11 text-sm outline-none focus:border-brand-500 focus:bg-white"
          />
          <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-400" />
        </div>
      </form>

      <div className="hidden bg-brand-600 lg:block">
        <Container>
          <nav className="flex items-stretch gap-2 text-sm font-semibold text-white">
            <CategoriesMenu categories={categories} />

            <Link
              href="/marcas"
              className="flex shrink-0 items-center gap-1.5 self-center rounded-md bg-graphite-500 px-3 py-2 text-white hover:bg-graphite-600"
            >
              <Wrench size={14} />
              Encontrar por Máquina
            </Link>

            <Link href="/loja" className="flex shrink-0 items-center rounded-md px-3 py-2 text-white/90 hover:text-white">
              Todas as Peças
            </Link>

            <span className="my-2.5 h-4 w-px shrink-0 self-center bg-white/20" aria-hidden="true" />

            <Link
              href="/blog"
              className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-white/90 hover:text-white"
            >
              <BookOpen size={14} />
              Blog Técnico
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  );
}

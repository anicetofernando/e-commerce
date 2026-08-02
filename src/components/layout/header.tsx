import Link from "next/link";
import Image from "next/image";
import { Search, User, Heart, Phone, Mail, Wrench, LayoutGrid } from "lucide-react";
import { getCategories } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { CONTACT_INFO } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { CartButton } from "@/components/layout/cart-button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavDropdown } from "@/components/layout/nav-dropdown";
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
            <NavDropdown
              label="Categorias"
              icon={<LayoutGrid size={14} />}
              buttonClassName="rounded-none bg-white px-4 text-ink-900 hover:bg-ink-50"
              panelClassName="w-[520px]"
            >
              <div className="grid grid-cols-2 gap-1">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/loja?categoria=${c.slug}`}
                    className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-ink-50">
                      {c.imageUrl && <Image src={c.imageUrl} alt="" fill sizes="24px" className="object-cover" />}
                    </span>
                    {c.name}
                  </Link>
                ))}
              </div>
            </NavDropdown>

            <Link href="/" className="flex shrink-0 items-center rounded-md px-3 py-3 text-white/90 hover:text-white">
              Início
            </Link>

            <Link href="/loja" className="flex shrink-0 items-center rounded-md px-3 py-3 text-white/90 hover:text-white">
              Peças
            </Link>

            <NavDropdown label="Serviços" icon={<Wrench size={14} />} panelClassName="w-64">
              <div className="flex flex-col gap-1">
                <Link href="/servicos#aluguer" className="rounded-md px-3 py-2 font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700">
                  Aluguer de Máquinas
                </Link>
                <Link href="/servicos#transporte" className="rounded-md px-3 py-2 font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700">
                  Transporte de Máquinas
                </Link>
                <Link href="/servicos#manutencao" className="rounded-md px-3 py-2 font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700">
                  Manutenção e Reparação
                </Link>
              </div>
            </NavDropdown>
          </nav>
        </Container>
      </div>
    </header>
  );
}

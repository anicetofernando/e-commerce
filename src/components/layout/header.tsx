import Link from "next/link";
import Image from "next/image";
import { User, Heart, Phone, Mail, Wrench, LayoutGrid } from "lucide-react";
import { getCategories, getSiteSettings } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { CartButton } from "@/components/layout/cart-button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavDropdown } from "@/components/layout/nav-dropdown";
import { HeaderSearch } from "@/components/layout/header-search";
import { Logo } from "@/components/layout/logo";

export async function Header() {
  const [categories, user, settings] = await Promise.all([getCategories(), getCurrentUser(), getSiteSettings()]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="hidden border-b border-ink-100 bg-white text-ink-600 lg:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href={`tel:${settings.phonePrimary}`} className="flex items-center gap-1.5 hover:text-brand-700">
              <Phone size={13} /> {settings.phonePrimary}
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-brand-700">
              <Mail size={13} /> {settings.email}
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
        <MobileMenu categories={categories} phonePrimary={settings.phonePrimary} />

        <Logo />

        <HeaderSearch variant="desktop" />

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

      <HeaderSearch variant="mobile" />

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

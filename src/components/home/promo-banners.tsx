import Link from "next/link";
import { ArrowRight, Droplets, Filter } from "lucide-react";
import { Container } from "@/components/ui/container";

const PROMOS = [
  {
    title: "Sistema Hidráulico",
    badge: "Stock Permanente",
    description: "Bombas, cilindros e mangueiras de alta pressão prontos a enviar.",
    href: "/loja?categoria=hidraulica",
    icon: Droplets,
    gradient: "from-brand-500 to-brand-800",
  },
  {
    title: "Filtros Originais",
    badge: "Todas as Marcas",
    description: "Óleo, ar, combustível e hidráulicos com compatibilidade garantida.",
    href: "/loja?categoria=filtros",
    icon: Filter,
    gradient: "from-ink-800 to-ink-950",
  },
];

export function PromoBanners() {
  return (
    <section className="pb-14 sm:pb-16">
      <Container>
        <div className="grid gap-5 sm:grid-cols-2">
          {PROMOS.map((promo) => (
            <Link
              key={promo.title}
              href={promo.href}
              className={`group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-8 ${promo.gradient}`}
            >
              <promo.icon
                size={160}
                strokeWidth={1}
                className="pointer-events-none absolute -top-6 -right-6 text-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
              />

              <div className="relative">
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase backdrop-blur-sm">
                  {promo.badge}
                </span>
                <h3 className="mt-3 text-2xl font-black text-white">{promo.title}</h3>
                <p className="mt-1.5 max-w-xs text-sm text-white/80">{promo.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink-900 shadow-lg transition-transform group-hover:translate-x-1">
                  Ver produtos <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

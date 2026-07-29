import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

const PROMOS = [
  {
    title: "Sistema Hidráulico",
    description: "Bombas, cilindros e mangueiras com stock permanente.",
    href: "/loja?categoria=hidraulica",
    image: "/images/hero/promo-hidraulica.svg",
    light: true,
  },
  {
    title: "Filtros Originais",
    description: "Óleo, ar, combustível e hidráulicos para todas as marcas.",
    href: "/loja?categoria=filtros",
    image: "/images/hero/promo-filtros.svg",
    light: false,
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
              className="group relative flex min-h-48 flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center p-7"
              style={{ backgroundImage: `url('${promo.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
              <div className="relative">
                <h3 className="text-xl font-bold text-white">{promo.title}</h3>
                <p className="mt-1 max-w-xs text-sm text-ink-200">{promo.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 group-hover:text-brand-300">
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

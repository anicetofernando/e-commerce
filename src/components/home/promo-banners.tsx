import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getPromoBanners } from "@/lib/data";
import { PROMO_ICONS, PROMO_GRADIENTS } from "@/lib/promo-presets";

export async function PromoBanners() {
  const banners = await getPromoBanners();
  if (banners.length === 0) return null;

  return (
    <section className="pb-14 sm:pb-16">
      <Container>
        <div className="grid gap-5 sm:grid-cols-2">
          {banners.map((promo) => {
            const Icon = PROMO_ICONS[promo.icon] ?? PROMO_ICONS.Package;
            const gradient = PROMO_GRADIENTS[promo.gradient] ?? PROMO_GRADIENTS.laranja;

            return (
              <Link
                key={promo.id}
                href={promo.href}
                className={`group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-8 ${gradient}`}
              >
                <Icon
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
            );
          })}
        </div>
      </Container>
    </section>
  );
}

import Image from "next/image";
import { Container } from "@/components/ui/container";
import { BRAND_LOGOS } from "@/lib/brand-logos";

export function BrandsStrip({ brands }: { brands: { id: string; name: string; slug: string }[] }) {
  return (
    <section className="bg-ink-900 py-14 sm:py-16">
      <Container>
        <p className="mb-2 text-center text-xs font-bold tracking-widest text-brand-400 uppercase">
          Compatibilidade Garantida
        </p>
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Marcas com que Trabalhamos</h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((b) => {
            const logo = BRAND_LOGOS[b.slug];
            return (
              <div
                key={b.id}
                className="flex h-28 items-center justify-center rounded-xl bg-white px-6 shadow-lg shadow-ink-950/20 transition-transform hover:-translate-y-1 sm:h-32"
              >
                {logo ? (
                  <Image
                    src={logo}
                    alt={b.name}
                    width={200}
                    height={100}
                    className="h-auto max-h-16 w-auto max-w-full object-contain sm:max-h-20"
                  />
                ) : (
                  <span className="text-lg font-black tracking-tight text-ink-700">{b.name}</span>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

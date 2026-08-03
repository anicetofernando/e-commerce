import Image from "next/image";
import { Container } from "@/components/ui/container";
import { BRAND_LOGOS } from "@/lib/brand-logos";

export function BrandsStrip({ brands }: { brands: { id: string; name: string; slug: string }[] }) {
  return (
    <section className="bg-ink-50/60 py-14 sm:py-16">
      <Container>
        <h2 className="text-center text-2xl font-bold text-ink-900 sm:text-3xl">Marcas</h2>

        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((b) => {
            const logo = BRAND_LOGOS[b.slug];
            return (
              <div
                key={b.id}
                className="flex h-24 items-center justify-center bg-white px-6 transition-colors hover:bg-ink-50 sm:h-28"
              >
                {logo ? (
                  <Image
                    src={logo}
                    alt={b.name}
                    width={160}
                    height={80}
                    className="h-auto max-h-12 w-auto max-w-full object-contain sm:max-h-14"
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

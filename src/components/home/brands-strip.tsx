import Image from "next/image";
import { Container } from "@/components/ui/container";

const BRAND_LOGOS: Record<string, string> = {
  bobcat: "/images/brands/bobcat.png",
  "case-ce": "/images/brands/case-ce.png",
  caterpillar: "/images/brands/caterpillar.png",
  doosan: "/images/brands/doosan.png",
  hitachi: "/images/brands/hitachi.png",
  "hyundai-ce": "/images/brands/hyundai-ce.png",
  jcb: "/images/brands/jcb.png",
  "john-deere": "/images/brands/john-deere.png",
  komatsu: "/images/brands/komatsu.png",
  liebherr: "/images/brands/liebherr.png",
  "new-holland-ce": "/images/brands/new-holland-ce.png",
  "volvo-ce": "/images/brands/volvo-ce.png",
};

export function BrandsStrip({ brands }: { brands: { id: string; name: string; slug: string }[] }) {
  return (
    <section className="bg-ink-50/60 py-14 sm:py-16">
      <Container>
        <p className="mb-8 text-center text-xs font-bold tracking-widest text-ink-500 uppercase">
          Peças compatíveis com as principais marcas do mercado
        </p>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 sm:grid-cols-3 lg:grid-cols-6">
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

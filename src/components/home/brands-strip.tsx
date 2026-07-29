import { Container } from "@/components/ui/container";

export function BrandsStrip({ brands }: { brands: { id: string; name: string }[] }) {
  return (
    <section className="border-y border-ink-100 bg-ink-50/60 py-10">
      <Container>
        <p className="mb-6 text-center text-xs font-bold tracking-widest text-ink-500 uppercase">
          Peças compatíveis com as principais marcas do mercado
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {brands.map((b) => (
            <span key={b.id} className="text-lg font-black tracking-tight text-ink-400 grayscale transition hover:text-ink-700 hover:grayscale-0">
              {b.name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}

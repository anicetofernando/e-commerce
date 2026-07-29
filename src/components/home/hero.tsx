import { Container } from "@/components/ui/container";
import { MachineFinder } from "@/components/home/machine-finder";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { getBrandsWithModels } from "@/lib/data";

export async function Hero() {
  const brands = await getBrandsWithModels();

  return (
    <section className="relative">
      <HeroCarousel />

      <Container className="relative -mt-14">
        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-xl shadow-ink-900/10 sm:p-6">
          <p className="mb-3 text-sm font-bold text-ink-900">Encontre peças compatíveis com a sua máquina</p>
          <MachineFinder brands={brands} />
        </div>
      </Container>
    </section>
  );
}

import { HeroCarousel } from "@/components/home/hero-carousel";
import { getHeroSlides } from "@/lib/data";

export async function Hero() {
  const slides = await getHeroSlides();

  return (
    <section className="relative">
      <HeroCarousel slides={slides} />
    </section>
  );
}

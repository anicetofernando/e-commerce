"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroSlideData = {
  id: string;
  headlineMain: string;
  headlineHighlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  photoUrl: string;
  photoAlt: string;
  photoCompact: boolean;
};

const INTERVAL_MS = 6500;

function HeroPhotoStack({ slides, active }: { slides: HeroSlideData[]; active: number }) {
  return (
    <div className="pointer-events-none relative flex h-[380px] w-[520px] shrink-0 items-center justify-center">
      {slides.map((s, i) => (
        <Image
          key={s.id}
          src={s.photoUrl}
          alt={s.photoAlt}
          fill
          sizes="520px"
          className={cn(
            "object-contain transition-opacity duration-700",
            s.photoCompact && "scale-90",
            i === active ? "opacity-100" : "opacity-0",
          )}
          priority={i === 0}
        />
      ))}
    </div>
  );
}

function SlideDots({
  slides,
  active,
  setActive,
  className,
}: {
  slides: HeroSlideData[];
  active: number;
  setActive: (updater: (i: number) => number) => void;
  className?: string;
}) {
  if (slides.length <= 1) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {slides.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setActive(() => i)}
          aria-label={`Ir para o slide ${i + 1}`}
          className={cn(
            "h-2 rounded-full transition-all",
            i === active ? "w-7 bg-brand-600" : "w-2 bg-ink-200 hover:bg-ink-300",
          )}
        />
      ))}
    </div>
  );
}

function HeroArrowNav({ slideCount, setActive }: { slideCount: number; setActive: (updater: (i: number) => number) => void }) {
  if (slideCount <= 1) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setActive((i) => (i - 1 + slideCount) % slideCount)}
        aria-label="Slide anterior"
        className="absolute top-1/2 left-2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 shadow-sm hover:border-brand-500 hover:text-brand-600 lg:flex"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => setActive((i) => (i + 1) % slideCount)}
        aria-label="Próximo slide"
        className="absolute top-1/2 right-2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 shadow-sm hover:border-brand-500 hover:text-brand-600 lg:flex"
      >
        <ChevronRight size={18} />
      </button>
    </>
  );
}

export function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[active];

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-b from-white to-ink-50 pt-8 pb-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <HeroArrowNav slideCount={slides.length} setActive={setActive} />

      <div className="container-page relative flex items-start justify-between gap-8">
        <div key={slide.id} className="max-w-xl animate-[fade-in-up_0.5s_ease]">
          <h1 className="text-2xl leading-tight font-black text-ink-900 sm:text-3xl lg:text-4xl">
            {slide.headlineMain} <span className="text-brand-600">{slide.headlineHighlight}</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-ink-600">{slide.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={slide.ctaHref} size="lg">
              {slide.ctaLabel}
            </Button>
            <Button href="/marcas" size="lg" variant="outline">
              Encontrar por Máquina
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-ink-600">
            <span className="flex items-center gap-2">
              <Truck size={17} className="text-brand-600" /> Entrega nacional
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-brand-600" /> Peças garantidas
            </span>
            <span className="flex items-center gap-2">
              <Headset size={17} className="text-brand-600" /> Suporte técnico
            </span>
          </div>

          <SlideDots slides={slides} active={active} setActive={setActive} className="mt-10 lg:hidden" />
        </div>

        <div className="hidden shrink-0 flex-col items-center lg:flex">
          <HeroPhotoStack slides={slides} active={active} />
          <SlideDots slides={slides} active={active} setActive={setActive} className="mt-2" />
        </div>
      </div>
    </div>
  );
}

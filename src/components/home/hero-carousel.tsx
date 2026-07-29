"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    eyebrow: "Motores e Componentes",
    headlineMain: "A peça certa, para a máquina certa,",
    headlineHighlight: "sem paragens de obra.",
    description:
      "Catálogo completo de peças de motor originais e alternativas para escavadoras, retroescavadoras e pás carregadoras. Compatibilidade garantida, entrega em todo Moçambique.",
    ctaLabel: "Ver Peças de Motor",
    ctaHref: "/loja?categoria=motor",
    photo: "/images/hero-photos/motor.jpg",
    photoAlt: "Motor diesel real de equipamento pesado, com bomba injetora e ventoinha visíveis",
  },
  {
    eyebrow: "Sistema Hidráulico",
    headlineMain: "Potência hidráulica",
    headlineHighlight: "sem fugas nem paragens.",
    description:
      "Cilindros, bombas e mangueiras de alta pressão testados para aguentar o trabalho mais exigente. Stock permanente e compatibilidade garantida.",
    ctaLabel: "Ver Peças Hidráulicas",
    ctaHref: "/loja?categoria=hidraulica",
    photo: "/images/hero-photos/hidraulica.jpg",
    photoAlt: "Cilindro hidráulico real do braço de uma escavadora",
  },
  {
    eyebrow: "Sistema de Travagem",
    headlineMain: "Segurança em primeiro lugar,",
    headlineHighlight: "sempre.",
    description:
      "Discos, pastilhas e cilindros de travão com qualidade certificada, para a sua máquina parar quando mais precisa.",
    ctaLabel: "Ver Peças de Travão",
    ctaHref: "/loja?categoria=travoes",
    photo: "/images/hero-photos/travoes.jpg",
    photoAlt: "Disco de travão real, ventilado e furado",
  },
  {
    eyebrow: "Trem de Rolamento",
    headlineMain: "Rodagem resistente",
    headlineHighlight: "para terrenos difíceis.",
    description:
      "Correntes, roletes e rodas motrizes fabricados para suportar as condições mais abrasivas de Moçambique.",
    ctaLabel: "Ver Peças de Rodagem",
    ctaHref: "/loja?categoria=rodagem",
    photo: "/images/hero-photos/rodagem.jpg",
    photoAlt: "Trem de rolamento real de uma escavadora de esteiras",
  },
];

const INTERVAL_MS = 6500;

function HeroPhotoStack({ active }: { active: number }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] items-center justify-center sm:flex">
      <div className="absolute h-[70%] w-[70%] rounded-full bg-brand-100 opacity-40 blur-3xl" aria-hidden />
      <div className="relative h-[76%] w-[90%] overflow-hidden rounded-2xl shadow-2xl shadow-ink-900/25 ring-1 ring-ink-900/5">
        {SLIDES.map((s, i) => (
          <Image
            key={s.photo}
            src={s.photo}
            alt={s.photoAlt}
            fill
            sizes="(max-width: 1024px) 45vw, 640px"
            className={cn("object-cover transition-opacity duration-700", i === active ? "opacity-100" : "opacity-0")}
            priority={i === 0}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/30 via-transparent to-transparent" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
      </div>
    </div>
  );
}

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  const slide = SLIDES[active];

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-b from-white to-ink-50 pt-16 pb-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <HeroPhotoStack active={active} />

      <div className="container-page relative">
        <div key={active} className="max-w-xl animate-[fade-in-up_0.5s_ease]">
          <p className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold tracking-widest text-brand-700 uppercase ring-1 ring-brand-100">
            {slide.eyebrow}
          </p>
          <h1 className="min-h-[112px] text-3xl leading-tight font-black text-ink-900 sm:min-h-[136px] sm:text-4xl lg:min-h-[180px] lg:text-5xl">
            {slide.headlineMain} <span className="text-brand-600">{slide.headlineHighlight}</span>
          </h1>
          <p className="mt-5 min-h-[78px] max-w-md text-base text-ink-600">{slide.description}</p>
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
        </div>
      </div>

      <div className="container-page relative mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Slide anterior"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 hover:border-brand-500 hover:text-brand-600"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.eyebrow}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ir para o slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                i === active ? "w-7 bg-brand-600" : "w-2 bg-ink-200 hover:bg-ink-300",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActive((i) => (i + 1) % SLIDES.length)}
          aria-label="Próximo slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 hover:border-brand-500 hover:text-brand-600"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

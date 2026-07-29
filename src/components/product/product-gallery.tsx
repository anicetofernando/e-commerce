"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: { url: string; alt: string }[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? { url: "/images/categories/motor.svg", alt: name };

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-ink-100 bg-ink-50">
        <Image src={current.url} alt={current.alt} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-contain p-10" priority />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-ink-50",
                i === active ? "border-brand-500 ring-2 ring-brand-500/30" : "border-ink-100",
              )}
            >
              <Image src={img.url} alt={img.alt} fill sizes="64px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import { getPartnerLogos } from "@/lib/data";

export async function ClientsMarquee() {
  const partners = await getPartnerLogos();
  if (partners.length === 0) return null;

  const loop = [...partners, ...partners];

  return (
    <section className="overflow-hidden border-y border-ink-100 bg-white py-10">
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-32" />

        <div className="animate-marquee flex w-max items-center gap-14 group-hover:[animation-play-state:paused]">
          {loop.map((partner, i) => (
            <div key={`${partner.id}-${i}`} className="flex h-16 w-36 shrink-0 items-center justify-center">
              <Image
                src={partner.imageUrl}
                alt={partner.name}
                width={200}
                height={100}
                unoptimized={partner.imageUrl.endsWith(".gif")}
                className="h-auto max-h-16 w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

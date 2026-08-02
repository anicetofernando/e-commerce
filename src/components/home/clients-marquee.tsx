import Image from "next/image";

const CLIENTS = [
  { name: "Acess", file: "acess.png" },
  { name: "Cornelder", file: "cornelder.png" },
  { name: "Barcelona Técnica", file: "barceltecnica.png" },
  { name: "Fertilizer", file: "fertilizer.png" },
  { name: "Sunnline", file: "sunnline.png" },
  { name: "CCIS", file: "ccis.png" },
  { name: "Trentyre", file: "trentyre.png" },
  { name: "Explosivo", file: "explosivo.png" },
  { name: "Steinweg", file: "steinweg.png" },
  { name: "Sousa", file: "sousa.png" },
  { name: "Revimo", file: "revimo.png" },
  { name: "MSC", file: "msc.png" },
  { name: "NBC", file: "nbc.png" },
  { name: "ETG", file: "etg.png" },
  { name: "Elevação", file: "elevacao.png" },
  { name: "Capital", file: "capital.gif" },
  { name: "Bolloré", file: "bolore.png" },
];

export function ClientsMarquee() {
  return (
    <section className="overflow-hidden border-y border-ink-100 bg-white py-10">
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-32" />

        <div className="animate-marquee flex w-max items-center gap-14 group-hover:[animation-play-state:paused]">
          {[...CLIENTS, ...CLIENTS].map((client, i) => (
            <div key={`${client.file}-${i}`} className="flex h-16 w-36 shrink-0 items-center justify-center">
              <Image
                src={`/images/clients/${client.file}`}
                alt={client.name}
                width={200}
                height={100}
                unoptimized={client.file.endsWith(".gif")}
                className="h-auto max-h-16 w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { Truck, Wrench, ClipboardCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Serviços" };

const SERVICES = [
  {
    id: "aluguer",
    icon: Truck,
    title: "Aluguer de Máquinas",
    description:
      "Empilhadores, mini-carregadoras, pás carregadoras e manipuladores telescópicos disponíveis para aluguer de curta ou longa duração, com apoio técnico incluído.",
    photo: "/servicos/aluguer.png",
    photoAlt: "Frota de máquinas disponíveis para aluguer: empilhador, mini-carregadora, pá carregadora e manipulador telescópico",
  },
  {
    id: "transporte",
    icon: Wrench,
    title: "Transporte de Máquinas",
    description:
      "Movimentação de empilhadores, pás carregadoras e outro equipamento pesado em veículo articulado próprio, com todas as condições de segurança até à obra.",
    photo: "/servicos/transporte.png",
    photoAlt: "Empilhador transportado num semirreboque de plataforma baixa",
  },
  {
    id: "manutencao",
    icon: ClipboardCheck,
    title: "Manutenção e Reparação",
    description:
      "Diagnóstico, manutenção preventiva e reparação de sistemas hidráulicos, motores e transmissões, feita por técnicos experientes.",
    photo: "/servicos/manutencao.png",
    photoAlt: "Técnicos a fazer manutenção ao motor de uma pá carregadora, com ferramentas e peças no chão",
  },
];

export default function ServicosPage() {
  return (
    <div>
      <div className="bg-ink-900 py-14">
        <Container>
          <p className="mb-2 text-xs font-bold tracking-widest text-brand-400 uppercase">Para Além das Peças</p>
          <h1 className="max-w-2xl text-3xl font-black text-white sm:text-4xl">Os Nossos Serviços</h1>
          <p className="mt-3 max-w-xl text-sm text-ink-300">
            Apoio completo ao seu equipamento pesado — do aluguer à manutenção, passando pelo transporte
            seguro entre obras.
          </p>
        </Container>
      </div>

      {SERVICES.map((service, i) => (
        <section
          key={service.id}
          id={service.id}
          className={cn("scroll-mt-24 py-14 sm:py-16", i % 2 === 1 && "bg-ink-50/60")}
        >
          <Container
            className={cn(
              "grid items-center gap-10 lg:grid-cols-2",
              i % 2 === 1 && "lg:[&>*:first-child]:order-2",
            )}
          >
            <div>
              <service.icon className="mb-4 text-brand-600" size={32} />
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">{service.title}</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-600">{service.description}</p>
              <div className="mt-6">
                <Button href="/contacto">Pedir Orçamento</Button>
              </div>
            </div>
            <div className="relative h-64 sm:h-80">
              <Image src={service.photo} alt={service.photoAlt} fill sizes="(max-width: 1024px) 90vw, 480px" className="object-contain" />
            </div>
          </Container>
        </section>
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import { Wrench, Truck, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Sobre Nós" };

const STATS = [
  { value: "15+", label: "Anos de Experiência" },
  { value: "2.000+", label: "Peças em Catálogo" },
  { value: "300+", label: "Empresas Servidas" },
  { value: "11", label: "Províncias com Entrega" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Qualidade Garantida",
    description: "Trabalhamos apenas com peças originais e alternativas certificadas, testadas antes do envio.",
  },
  {
    icon: Truck,
    title: "Logística Nacional",
    description: "Rede de distribuição que cobre todas as províncias de Moçambique, com prazos claros.",
  },
  {
    icon: Wrench,
    title: "Conhecimento Técnico",
    description: "Equipa com experiência prática em manutenção de equipamento pesado, não apenas em vendas.",
  },
  {
    icon: Users,
    title: "Relação de Longo Prazo",
    description: "Acompanhamos as necessidades de manutenção da sua frota, não apenas uma venda pontual.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="bg-ink-900 py-16">
        <Container>
          <p className="mb-2 text-xs font-bold tracking-widest text-brand-400 uppercase">Sobre a Albimaq</p>
          <h1 className="max-w-2xl text-3xl font-black text-white sm:text-4xl">
            Mais de uma década a manter o equipamento pesado de Moçambique a trabalhar.
          </h1>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-ink-900">A Nossa História</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              A Albimaq nasceu do aluguer e manutenção de máquinas de construção e transporte, um setor onde
              rapidamente percebemos um problema recorrente das empresas moçambicanas: a dificuldade em
              encontrar peças de substituição fiáveis e entregues a tempo.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              Com base nesse conhecimento prático de oficina, criámos a Albimaq Peças — um catálogo dedicado
              a peças originais e alternativas para escavadoras, retroescavadoras, pás carregadoras, tratores
              e outro equipamento pesado, com o mesmo rigor técnico que aplicamos na manutenção da nossa
              própria frota.
            </p>
            <div className="mt-6">
              <Button href="/loja">Ver Catálogo de Peças</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-ink-100 bg-ink-50/60 p-6 text-center">
                <p className="text-3xl font-black text-brand-600">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="bg-ink-50/60 py-14">
        <Container>
          <h2 className="mb-8 text-center text-2xl font-bold text-ink-900">Porque Trabalhar Connosco</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-lg border border-ink-100 bg-white p-6 text-center">
                <v.icon className="mx-auto mb-3 text-brand-600" size={28} />
                <h3 className="font-bold text-ink-900">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}

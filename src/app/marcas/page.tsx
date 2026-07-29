import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MachineFinder } from "@/components/home/machine-finder";
import { getBrandsWithModels } from "@/lib/data";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/constants";

export const metadata: Metadata = { title: "Encontrar Peças por Máquina" };
export const dynamic = "force-dynamic";

export default async function MarcasPage() {
  const brands = await getBrandsWithModels();

  return (
    <div className="bg-ink-50/40">
      <div className="bg-ink-900 py-14">
        <Container>
          <p className="mb-2 text-xs font-bold tracking-widest text-brand-400 uppercase">Localizador de Peças</p>
          <h1 className="max-w-2xl text-3xl font-black text-white sm:text-4xl">
            Encontre Peças Compatíveis com a Sua Máquina
          </h1>
          <p className="mt-3 max-w-xl text-sm text-ink-300">
            Selecione a marca e o modelo do seu equipamento para ver todas as peças compatíveis disponíveis
            no nosso catálogo.
          </p>
          <div className="mt-8 rounded-xl bg-white p-5 shadow-xl sm:p-6">
            <MachineFinder brands={brands} />
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <h2 className="mb-6 text-xl font-bold text-ink-900">Todas as Marcas e Modelos</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div key={brand.id} className="rounded-lg border border-ink-100 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-ink-900">{brand.name}</h3>
                <span className="text-xs text-ink-400">{brand.origin}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {brand.machineModels.map((model) => (
                  <Link
                    key={model.id}
                    href={`/loja?marca=${brand.slug}&modelo=${model.id}`}
                    className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-brand-500 hover:text-brand-600"
                  >
                    {model.name}
                    <span className="text-ink-400"> · {EQUIPMENT_TYPE_LABELS[model.type]}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

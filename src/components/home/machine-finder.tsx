"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/constants";

type Brand = {
  id: string;
  name: string;
  slug: string;
  machineModels: { id: string; name: string; type: string }[];
};

export function MachineFinder({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [brandSlug, setBrandSlug] = useState("");
  const [modelId, setModelId] = useState("");

  const selectedBrand = useMemo(() => brands.find((b) => b.slug === brandSlug), [brands, brandSlug]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brandSlug) params.set("marca", brandSlug);
    if (modelId) params.set("modelo", modelId);
    router.push(`/loja?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <div>
        <Select
          value={brandSlug}
          onChange={(e) => {
            setBrandSlug(e.target.value);
            setModelId("");
          }}
          aria-label="Marca do equipamento"
        >
          <option value="">Marca do Equipamento</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Select
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          disabled={!selectedBrand}
          aria-label="Modelo do equipamento"
        >
          <option value="">{selectedBrand ? "Modelo" : "Selecione a marca primeiro"}</option>
          {selectedBrand?.machineModels.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} · {EQUIPMENT_TYPE_LABELS[m.type as keyof typeof EQUIPMENT_TYPE_LABELS]}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" size="lg" className="justify-center">
        <Search size={17} />
        Procurar Peças
      </Button>
    </form>
  );
}

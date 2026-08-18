"use client";

import { useRef } from "react";
import { Input, Label, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type { CategoryNavData } from "@/lib/types";

export type CatalogSearchParams = {
  q?: string;
  categoria?: string;
  marca?: string;
  modelo?: string;
  preco_min?: string;
  preco_max?: string;
  condicao?: string;
  ordenar?: string;
};

export function FiltersSidebar({
  categories,
  brands,
  current,
}: {
  categories: CategoryNavData[];
  brands: { id: string; name: string; slug: string }[];
  current: CatalogSearchParams;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const submitNow = () => formRef.current?.requestSubmit();

  return (
    <form
      ref={formRef}
      action="/loja"
      method="GET"
      className="space-y-6 rounded-lg border border-ink-100 bg-white p-5"
    >
      {current.q && <input type="hidden" name="q" value={current.q} />}
      {current.modelo && <input type="hidden" name="modelo" value={current.modelo} />}

      <div>
        <h3 className="mb-3 text-sm font-bold text-ink-900">Categoria</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input
              type="radio"
              name="categoria"
              value=""
              defaultChecked={!current.categoria}
              onChange={submitNow}
              className="accent-brand-600"
            />
            Todas as categorias
          </label>
          {categories.map((c) => (
            <label key={c.id} className="flex items-center justify-between gap-2 text-sm text-ink-600">
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="categoria"
                  value={c.slug}
                  defaultChecked={current.categoria === c.slug}
                  onChange={submitNow}
                  className="accent-brand-600"
                />
                {c.name}
              </span>
              <span className="text-xs text-ink-400">{c.productCount}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-ink-100 pt-5">
        <h3 className="mb-3 text-sm font-bold text-ink-900">Marca do Equipamento</h3>
        <Select name="marca" defaultValue={current.marca ?? ""} onChange={submitNow}>
          <option value="">Todas as marcas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="border-t border-ink-100 pt-5">
        <h3 className="mb-3 text-sm font-bold text-ink-900">Preço (MZN)</h3>
        <div className="flex items-center gap-2">
          <Input type="number" name="preco_min" placeholder="Mín." defaultValue={current.preco_min} min={0} onBlur={submitNow} />
          <span className="text-ink-400">—</span>
          <Input type="number" name="preco_max" placeholder="Máx." defaultValue={current.preco_max} min={0} onBlur={submitNow} />
        </div>
      </div>

      <div className="border-t border-ink-100 pt-5">
        <h3 className="mb-3 text-sm font-bold text-ink-900">Condição</h3>
        <Select name="condicao" defaultValue={current.condicao ?? ""} onChange={submitNow}>
          <option value="">Qualquer condição</option>
          <option value="NOVO">Novo</option>
          <option value="RECONDICIONADO">Recondicionado</option>
          <option value="USADO">Usado</option>
        </Select>
      </div>

      <div className="border-t border-ink-100 pt-5">
        <Label htmlFor="ordenar">Ordenar por</Label>
        <Select id="ordenar" name="ordenar" defaultValue={current.ordenar ?? "relevancia"} onChange={submitNow}>
          <option value="relevancia">Relevância</option>
          <option value="recentes">Mais Recentes</option>
          <option value="preco-asc">Preço: Menor para Maior</option>
          <option value="preco-desc">Preço: Maior para Menor</option>
          <option value="avaliacao">Melhor Avaliação</option>
        </Select>
      </div>

      <div className="pt-2">
        <Button href="/loja" variant="ghost" size="sm" className="w-full justify-center">
          Limpar Filtros
        </Button>
      </div>
    </form>
  );
}

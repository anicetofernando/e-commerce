"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "@/lib/types";

export function ProductTabs({
  tabs,
}: {
  tabs: { key: string; label: string; products: ProductCardData[] }[];
}) {
  const [active, setActive] = useState(tabs[0]?.key);
  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-ink-100">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-semibold transition-colors",
              tab.key === activeTab?.key ? "text-brand-600" : "text-ink-500 hover:text-ink-800",
            )}
          >
            {tab.label}
            {tab.key === activeTab?.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-600" />
            )}
          </button>
        ))}
      </div>
      {activeTab && <ProductGrid products={activeTab.products} />}
    </div>
  );
}

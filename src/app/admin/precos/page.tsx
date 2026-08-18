import type { Metadata } from "next";
import { getPricingTableOverrides } from "@/lib/admin-data";
import { EQUIPMENT_TABLES, LABOR_TABLES } from "@/lib/pricing-data";
import { renderEquipmentTable, renderLaborTable } from "@/lib/pricing-render";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PricingTableEditor, type PricingSection } from "@/components/admin/pricing-table-editor";
import "./pricing.css";

export const metadata: Metadata = { title: "Tabela de Preços — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const overrides = await getPricingTableOverrides();

  const sections: PricingSection[] = [
    ...EQUIPMENT_TABLES.map((config) => ({
      id: config.prefix,
      navLabel: config.title,
      html: renderEquipmentTable(config, overrides),
    })),
    ...LABOR_TABLES.map((config) => ({
      id: config.prefix,
      navLabel: config.title,
      html: renderLaborTable(config, overrides),
    })),
  ];

  return (
    <div>
      <AdminPageHeader
        title="Tabela de Preços"
        description="Aluguer de equipamentos e serviços de mão-de-obra. Clique em qualquer texto ou número para editar — os totais recalculam sozinhos."
      />
      <PricingTableEditor sections={sections} />
    </div>
  );
}

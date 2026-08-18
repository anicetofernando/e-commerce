import type { Metadata } from "next";
import { getPricingTableOverrides } from "@/lib/admin-data";
import { EQUIPMENT_TABLES, LABOR_TABLES } from "@/lib/pricing-data";
import { renderEquipmentTable, renderLaborTable } from "@/lib/pricing-render";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PricingTableEditor, type PricingSection } from "@/components/admin/pricing-table-editor";
import "./pricing.css";

export const metadata: Metadata = { title: "Tabela de Preços — Admin" };
export const dynamic = "force-dynamic";

const SHARED_DIESEL_ORIG = "30";

export default async function AdminPricingPage() {
  const overrides = await getPricingTableOverrides();
  const sharedDiesel = overrides["shared-diesel"] ?? SHARED_DIESEL_ORIG;
  const sharedFx = overrides["shared-fx"] ?? "";

  const sections: PricingSection[] = [
    ...EQUIPMENT_TABLES.map((config) => ({
      id: config.prefix,
      navLabel: config.title,
      html: renderEquipmentTable(config, overrides, sharedDiesel, SHARED_DIESEL_ORIG),
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
      <PricingTableEditor
        sections={sections}
        sharedDiesel={sharedDiesel}
        sharedDieselOrig={SHARED_DIESEL_ORIG}
        sharedFx={sharedFx}
      />
    </div>
  );
}

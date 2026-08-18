import type { Metadata } from "next";
import { getAdminBrands } from "@/lib/admin-data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BrandManager } from "@/components/admin/brand-manager";

export const metadata: Metadata = { title: "Marcas e Modelos — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <div>
      <AdminPageHeader title="Marcas e Modelos" description="Gerir as marcas e modelos de máquinas suportados." />
      <BrandManager brands={brands} />
    </div>
  );
}

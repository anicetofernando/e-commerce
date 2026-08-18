import type { Metadata } from "next";
import { getAdminPartnerLogos } from "@/lib/admin-data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PartnerLogoManager } from "@/components/admin/partner-logo-manager";

export const metadata: Metadata = { title: "Parceiros — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await getAdminPartnerLogos();

  return (
    <div>
      <AdminPageHeader title="Parceiros" description="Logótipos de empresas parceiras no carrossel da página inicial." />
      <PartnerLogoManager partners={partners} />
    </div>
  );
}

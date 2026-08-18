import type { Metadata } from "next";
import { getAdminPromoBanners } from "@/lib/admin-data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PromoBannerManager } from "@/components/admin/promo-banner-manager";

export const metadata: Metadata = { title: "Promoções — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPromosPage() {
  const banners = await getAdminPromoBanners();

  return (
    <div>
      <AdminPageHeader title="Promoções" description="Banners promocionais mostrados na página inicial." />
      <PromoBannerManager banners={banners} />
    </div>
  );
}

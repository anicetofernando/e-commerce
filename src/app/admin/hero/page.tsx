import type { Metadata } from "next";
import { getAdminHeroSlides } from "@/lib/admin-data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HeroSlideManager } from "@/components/admin/hero-slide-manager";

export const metadata: Metadata = { title: "Hero (Início) — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const slides = await getAdminHeroSlides();

  return (
    <div>
      <AdminPageHeader title="Hero (Início)" description="Slides em destaque no topo da página inicial." />
      <HeroSlideManager slides={slides} />
    </div>
  );
}

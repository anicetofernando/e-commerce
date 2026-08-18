import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export const metadata: Metadata = { title: "Definições — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader title="Definições do Site" description="Dados de contacto usados em todo o site (cabeçalho, rodapé e páginas)." />
      <SiteSettingsForm settings={settings} />
    </div>
  );
}

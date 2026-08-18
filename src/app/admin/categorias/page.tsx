import type { Metadata } from "next";
import { getAdminCategories } from "@/lib/admin-data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryManager } from "@/components/admin/category-manager";

export const metadata: Metadata = { title: "Categorias — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <AdminPageHeader title="Categorias" description="Organize o catálogo de peças por categoria." />
      <CategoryManager categories={categories} />
    </div>
  );
}
